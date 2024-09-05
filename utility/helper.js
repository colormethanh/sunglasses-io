
const testProduct = {
  categoryId: "1",
  name: "testGlasses",
  description: "Awesome glasses for testing",
  price: 999,
  imageUrls: ["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
};

const testProduct2 = {
  categoryId: "2",
  name: "testGlasses2",
  description: "Awesome glasses for testing a second time",
  price: 999,
  imageUrls: ["https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg","https://image.shutterstock.com/z/stock-photo-yellow-sunglasses-white-backgound-600820286.jpg"]
}

const validateProduct = (product) => {
  if (!product.name) return false;
  if (!product.description) return false;
  if (!product.price) return false;
  if (!product.imageUrls) return false;
  return true;
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

module.exports = {AccessToken, updateTimestamp, isStillValid, validateProduct, randId, testProduct, testProduct2}