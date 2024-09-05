
const testProduct = {
  categoryId: "1",
  name: "testGlasses",
  description: "Awesome glasses for testing",
  price: 999,
  imageUrls: ["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
};

const validateProduct = (product, products) => {
  return products.find((productInList) => productInList.id === product.id)
}

const randId = () => JSON.stringify(Date.now() * Math.random() * 100);

const TOKEN_VALIDITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const updateTimestamp = (token) => token.timestamp = Date.now()

const isStillValid = (token) => ((new Date) - token.timestamp) < TOKEN_VALIDITY_TIMEOUT;

const AccessToken = (username) => {
  return {
    username : username,
    token: randId(),
    timestamp: Date.now()
  }
};

module.exports = {AccessToken, updateTimestamp, isStillValid, validateProduct, randId, testProduct}