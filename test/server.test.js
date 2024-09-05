const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed
const { serve } = require('swagger-ui-express');
const { sendChaiGet, sendChaiGetWithHeader, sendChaiPost, sendChaiPostWithHeader, sendChaiDelete } = require("../utility/chaiHelpers");
const { randId, testProduct, testProduct2 } = require("../utility/helper");

const should = chai.should();
chai.use(chaiHttp);

// TODO: Write tests for the server

describe('Brands', () => {
  describe("/GET brands/", () => {
    it("should GET all brands", (done) => {
      sendChaiGet(server, "/api/brands", done, (err, res, done) => {
        res.should.have.status(200)
        res.body.should.be.an("array")
        done();
      });
    });

  });

  describe("/GET /brands/{id}/products", () => {
    it("It should GET Array of products with specified brand id", (done) => {
      sendChaiGet(server, "/api/brands/1/products", done, 
        (err, res, done) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.should.have.lengthOf(3);
          res.body[0].should.have.property("id");
          res.body[0].should.have.property("categoryId", "1");
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("description");
          res.body[0].should.have.property("price");
          res.body[0].should.have.property("imageUrls");
          done();
        });
    });

    it("It should return error if invalid id", (done) => {
      sendChaiGet(server, "/api/brands/99/products", done,
        (err, res, done) => {
          res.should.have.status(404);
          done();
        });
    });
    
  });

  describe('GET /products/', () => { 
    it("It should return an array of all products", (done) => {
      chai
        .request(server)
        .get("/api/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.should.have.lengthOf(11);
          res.body[0].should.have.property("id");
          res.body[0].should.have.property("categoryId");
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("description");
          res.body[0].should.have.property("price");
          res.body[0].should.have.property("imageUrls");
          done();
        });
    });
   });

});

describe('Login', () => {

  it("It Should return access token upon success", (done) => {
    const userCredentials = {
          "username" : "yellowleopard753",
          "password" : "jonjon"
        };

    sendChaiPost(server, "/api/login", userCredentials, done, 
      (err, res, done) => {
        res.should.have.status(200);
        res.body.should.be.an("object");
        res.body.should.have.property("username");
        res.body.should.have.property("token");
        res.body.should.have.property("timestamp");
        done();
      });  
  });

  it("It should return an error if invalid credentials", (done) => {
    const userCredentials = {
          "username": "wrong",
          "password" : "wrongAgain!"
        };

    sendChaiPost(server, "/api/login", userCredentials, done, 
      (err, res, done) => {
        res.should.have.status(401);
        done();
      });
  });

  it("It should return an error if no credential provided", (done) => {
    sendChaiPost(server, "/api/login", {}, done, 
      (err, res, done) => {
        res.should.have.status(401);
        done();
      });
  });

  it("It should return an error if only password provided", (done) => {
    sendChaiPost(server, "/api/login", {"password": "wrong"}, done, 
      (err, res, done) => {
        res.should.have.status(401);
        done();
      });
  });

  it("It should return an error if only username provided", (done) => {
    sendChaiPost(server, "/api/login", {"username" : "wrong"}, done, 
      (err, res, done) => {
        res.should.have.status(401);
        done();
      });
  });

});

describe('cart', () => {
  const userCredentials = {
    "username" : "yellowleopard753",
    "password" : "jonjon"
  };

  let idToDelete;

  describe("GET /me/cart", () => {
    it("It should return cart after logging in", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              res.should.have.status(200);
              res.body.should.be.an("array");
              done();
            });
        });
    });

    it("It should return 403 if invalid token", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          accessToken.token = randId();
          const header = { token : accessToken.token };
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              res.should.have.status(403);
              done();
            });
        });
    });

    it("It should return 401 if request sent without token", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const header = {};
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              res.should.have.status(401);
              done();
            });
        });
    });
  });
  
  describe("POST /me/cart", () => { 
    it("It should add item to cart", (done) => {
      const userCredentials = {
        "username" : "yellowleopard753",
        "password" : "jonjon"
      };

      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          const product = testProduct;
          
          sendChaiPostWithHeader(server, "/api/me/cart", product, header, done, (err, res, done) => {
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body[0].should.have.property("id");
            res.body[0].should.have.property("name");
            res.body[0].name.should.equal(product.name);
            res.body[0].should.have.property("description");
            res.body[0].description.should.equal(product.description);
            res.body[0].should.have.property("price");
            res.body[0].price.should.equal(product.price);
            res.body[0].imageUrls.should.be.an("array");
            done();
          });
        });
    });

    it("It should push new item to card", (done) => {
      const userCredentials = {
        "username" : "yellowleopard753",
        "password" : "jonjon"
      };

      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          const product2 = testProduct2;
          
          sendChaiPostWithHeader(server, "/api/me/cart", product2, header, done, (err, res, done) => {
            // Assign idToDelete for later testing
            idToDelete = res.body[1].id;
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.should.have.lengthOf(2);
            res.body[1].should.have.property("id");
            res.body[1].should.have.property("name");
            res.body[1].name.should.equal(product2.name);
            res.body[1].should.have.property("description");
            res.body[1].description.should.equal(product2.description);
            res.body[1].should.have.property("price");
            res.body[1].price.should.equal(product2.price);
            res.body[1].imageUrls.should.be.an("array");
            done();
          });
        });
    });

    it("It should return 403 if invalid token", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          accessToken.token = randId();
          const header = { token : accessToken.token };
          const product = testProduct;
          
          sendChaiPostWithHeader(server, "/api/me/cart", product, header, done, (err, res, done) => {
            res.should.have.status(403);
            done();
          });
        });
    });

    it("It should return 400 error if product is empty", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          
          sendChaiPostWithHeader(server, "/api/me/cart", {}, header, done, (err, res, done) => {
            res.should.have.status(400);
            done();
          });
        });
    });

    it("It should return 400 error if product is empty", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          
          sendChaiPostWithHeader(server, "/api/me/cart", {}, header, done, (err, res, done) => {
            res.should.have.status(400);
            done();
          });
        });
    });
   });

   describe("DELETE /me/cart/:id", () => {
    it("It should delete item from cart", (done) => {
      const userCredentials = {
        "username" : "yellowleopard753",
        "password" : "jonjon"
      };

      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          sendChaiDelete(server, `/api/me/cart/${idToDelete}`, header, done,  
            (err, res, done) => {
              res.should.have.status(200);
              res.body.should.be.an("array");
              res.body.should.have.lengthOf(1);
              done();
            }
          )
            
        });
    });

    it("It should return 403 if invalid token", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          accessToken.token = randId();
          const header = { token : accessToken.token };
          
          sendChaiDelete(server, `/api/me/cart/${idToDelete}`, header, done, 
            (err, res, done) => {
            res.should.have.status(403);
            done();
          });
        });
    });

    it("It should return an 404 if invalid ID", (done) => {
    const userCredentials = {
      "username" : "yellowleopard753",
      "password" : "jonjon"
    };

    sendChaiPost(server, "/api/login", userCredentials, done, 
      (err, res, done) => {
        const accessToken = res.body;
        const header = { token : accessToken.token };
        sendChaiDelete(server, `/api/me/cart/999`, header, done,  
          (err, res, done) => {
            res.should.have.status(404);
            done();
          }
        )
          
      });
    });

  });
  
});
