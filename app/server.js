const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./sunglasses-swagger.yaml');
const { errorMessages } = require('../utility/errors');
const { AccessToken, isStillValid, updateTimestamp } = require('../utility/helper');
const app = express();

const BASE_URL = "/api"

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

const ACCESS_TOKENS = [];

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Gets a list of brands
app.get(BASE_URL + "/brands", (req, res) => {
  try {
    // Check if brands were retrieved successfully
    if (!brands) return res.status(500).send(errorMessages[500]);
    res.send(brands);
  } catch(err){
    next(err);
  };
});

// Get a list of products with brand of provided id
app.get(BASE_URL + "/brands/:id/products", (req, res) => {
  try {
    // Check if id parameter is present
    const { id } = req.params;
    if (!id) return res.status(400).send(errorMessages[400]);

    // Create a list of brandIds and check if the id is included in it
    const brandIds = brands.map((brand) => brand.id);
    if (!brandIds.includes(id)) return res.status(404).send(errorMessages[404]);

    // Filter products according to brandId
    const filteredProduct = products.filter((product) => product.categoryId === id);
    res.send(filteredProduct);
  } catch(err) {
    next(err);
  };
});

// Get a list of all products
app.get(BASE_URL + "/products", (req, res) => {
  try{
    // Check is products were retrieved successfully
    if(!products) return res.status(500).send(errorMessages[500]);
    res.send(products);
  } catch(err) {
    next(err);
  };
});

// Login
app.post(BASE_URL + "/login", (req,res) => {
  try {
    // Check is username and password is present in body
    const {username, password} = req.body;
    if (!username || !password) return res.status(401).send(errorMessages[401]);

    // Check if user exists
    const user = users.find((user) => user.login.username === username && user.login.password === password);
    if (!user) return res.status(401).send(errorMessages[401]);

    // Check if user already has access token
    let userAccessToken = ACCESS_TOKENS.find((token) => token.username === user.username);

    // If user did not already have accessToken make one for them
    if (!userAccessToken) {
      userAccessToken = AccessToken(username);
      ACCESS_TOKENS.push(userAccessToken);
    };

    // Check if token is expired and if so update it
    const tokenStillValid = isStillValid(userAccessToken);
    if(!tokenStillValid) updateTimestamp(token);
    
    res.send(userAccessToken);
  } catch (err) {
    next(err);
  }
});

app.get(BASE_URL + "/me/cart", (req, res) => {
  try {
    // Check for token in header
    const token = req.header("token");
    if (!token) return res.status(401).send(errorMessages[401]);

    // Check if access token is in "database"
    const accessToken = ACCESS_TOKENS.find((accessToken) => token == accessToken.token);
    if (!accessToken) return res.status(403).send(errorMessages[403]);

    // Check if the retrieved token is still valid
    const tokenIsStillValid = isStillValid(accessToken);
    if(!tokenIsStillValid) return res.status(403).send("Token has expired");
    
    // Find corresponding user
    const user = users.find((user) => user.login.username === accessToken.username);
    if (!user) return res.status(404).send(errorMessages[404]);

    // Get the user's cart
    const userCart = user.cart;
    if (!userCart) return res.status(404).send(errorMessages[404]);

    res.send(userCart);
  } catch(err) {
    console.log(err)
    next(err);
  }
})


// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send(errorMessages[500]);
});

module.exports = app;
