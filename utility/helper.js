const testProduct = {
  categoryId: "1",
  name: "testGlasses",
  description: "Awesome glasses for testing",
  price: 999,
  imageUrls: ["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
};

// Validate that product is in list of products
const validateProduct = (product, products) => {
  return products.find((productInList) => productInList.id === product.id)
};

// Return an random id
const randId = () => JSON.stringify(Date.now() * Math.random() * 100);

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

// 

module.exports = {AccessToken, updateTimestamp, isStillValid, validateProduct, randId, testProduct}