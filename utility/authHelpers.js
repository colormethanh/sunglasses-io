const { errorMessages } = require("./errors");
const {randId} = require("./helper")

// User
const getUserFromToken = (accessToken, userStore) => {
  const user = userStore.find((user) => user.login.username === accessToken.username);

  if(!user) return {userFound: false, err: 500, message: errorMessages[500]};

  return {userFound: true, user: user};
}

const getUserCart = (username, userStore) => {
  // check if user exist in userStore
  const user = userStore.find((user) => user.login.username === username);
  if (!user || !user.cart) return {isFound: false, err: 500, message: errorMessages[500]}

  return {isFound: true, cart: user.cart};
};

const loginUser = (username, password, userStore) => {

  const user = userStore.find((user) => user.login.username === username && user.login.password === password);
  
  if (!user || !username || !password) return {loginSuccess: false, err: 401, message: errorMessages[401]}

  return {loginSuccess: true, user: user};
};


// Token and Token validation
const validateToken = (token, tokenStore) => {
  // token was not present
  if(!token) return {isValid: false, err: 401, message: errorMessages[401]};

  // Access token is not in db
  const accessToken = getAccessToken(token, tokenStore);
  if (!accessToken) return {isValid: false, err: 403, message: errorMessages[403]};

  // check if timestamp still valid
  const tokenIsStillValid = isStillValid(accessToken);
  if(!tokenIsStillValid) return {isValid: false, err: 403, message: "Token has expired"};

  return {isValid: true, accessToken: accessToken};
};

// Get access token from token;
const getAccessToken = (token, tokenStore) => tokenStore.find((accessToken) => token === accessToken.token); 


// Get access token with username;
const getAccessTokenFromUsername = (username, tokens) => tokens.find((token) => token.username === username);


const TOKEN_VALIDITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// Check if 15 has passed since token Timestamp
const isStillValid = (token) => ((new Date) - token.timestamp) < TOKEN_VALIDITY_TIMEOUT;

// Update a token's timestamp
const updateTimestamp = (token) => token.timestamp = Date.now();

// Access Token
const AccessToken = (username) => {
  return {
    username : username,
    token: randId(),
    timestamp: Date.now()
  }
};


module.exports = {getUserFromToken, getUserCart, loginUser, validateToken, getAccessTokenFromUsername, isStillValid, updateTimestamp, AccessToken};