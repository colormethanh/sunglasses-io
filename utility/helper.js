
const randId = () => Date.now() * Math.random() * 100;

const TOKEN_VALIDITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const upDateTimestamp = (token) => token.timestamp = Date.now()

const isStillValid = (token) => ((new Date) - token.timestamp) < TOKEN_VALIDITY_TIMEOUT;

const AccessToken = (username) => {
  return {
    username : username,
    token: randId(),
    timestamp: Date.now()
  }
} 

module.exports = {AccessToken, upDateTimestamp, isStillValid, randId}