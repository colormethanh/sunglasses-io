
const isStringInt = (string) => {
  return /^\d+$/.test(string);
};

const randId = () => Date.now() * Math.random() * 100;

const TOKEN_VALIDITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
// class AccessToken{
//   constructor(username, token){
//     this.username = username
//     this.token = token
//     this.timestamp = Date.now()
//   }


//   upDateTimestamp() {
  //     this.timestamp = Date.now();
  //   }
  // };
  
const upDateTimestamp = (token) => {
  return token.timestamp = Date.now();
}

const isStillValid = (token) => {
  return ((new Date) - token.timestamp) < TOKEN_VALIDITY_TIMEOUT;
}

const AccessToken = (username) => {
  return {
    username : username,
    token: randId(),
    timestamp: Date.now()
  }
} 

module.exports = {isStringInt, AccessToken, upDateTimestamp, isStillValid}