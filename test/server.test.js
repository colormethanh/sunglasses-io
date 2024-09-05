const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed
const { serve } = require('swagger-ui-express');
const { sendChaiGet, sendChaiGetWithHeader, sendChaiPost, sendChaiPostWithHeader, sendChaiDelete } = require("../utility/chaiHelpers");
const { randId, testProduct} = require("../utility/helper");

const should = chai.should();
chai.use(chaiHttp);

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

  describe("GET /me/cart", () => {
    it("It should return cart", (done) => {
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

          sendChaiGet(server, "/api/products", done, 
            (err, res, done) => {
              const products = res.body;
              const product = products[0];

              sendChaiPostWithHeader(server, "/api/me/cart", product, header, done, (err, res, done) => {

                sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
                  (err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    // Checking cart item
                    res.body[0].should.have.property("id");
        
                    // Checking if cart item has quantity value
                    res.body[0].should.have.property("quantity");
                    res.body[0].quantity.should.equal(1);
        
                    // Checking product inside of cart item
                    res.body[0].product.should.have.property("id");
                    res.body[0].product.should.have.property("name");
                    res.body[0].product.name.should.equal(product.name);
                    res.body[0].product.should.have.property("description");
                    res.body[0].product.description.should.equal(product.description);
                    res.body[0].product.should.have.property("price");
                    res.body[0].product.price.should.equal(product.price);
                    res.body[0].product.imageUrls.should.be.an("array");
                    done();
                  });
              });
          }); 
          
        });
    });

    it("It should push second item to cart", (done) => {
      const userCredentials = {
        "username" : "yellowleopard753",
        "password" : "jonjon"
      };

      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          
          sendChaiGet(server, "/api/products", done, 
            (err, res, done) => {
              const products = res.body;
              const product = products[3];
             
                sendChaiPostWithHeader(server, "/api/me/cart", product, header, done, (err, res, done) => {
                  
                  sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
                    (err, res, done) => {
                      res.should.have.status(200);
                      res.body.should.be.an("array");
                      res.body.should.have.lengthOf(2);
                      // Checking cart item
                      res.body[1].should.have.property("id");
          
                      // Checking if cart item has quantity value
                      res.body[1].should.have.property("quantity");
                      res.body[1].quantity.should.equal(1);
          
                      // Checking product inside of cart item
                      res.body[1].product.should.have.property("id");
                      res.body[1].product.should.have.property("name");
                      res.body[1].product.name.should.equal(product.name);
                      res.body[1].product.should.have.property("description");
                      res.body[1].product.description.should.equal(product.description);
                      res.body[1].product.should.have.property("price");
                      res.body[1].product.price.should.equal(product.price);
                      res.body[1].product.imageUrls.should.be.an("array");
                      done();
                    })
                });
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

    it("It should return 404 error if product is empty", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          
          sendChaiPostWithHeader(server, "/api/me/cart", {}, header, done, (err, res, done) => {
            res.should.have.status(404);
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

          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              res.should.have.status(200);
              res.body.should.be.an("array");
              const idToDelete = res.body[0].id;

              sendChaiDelete(server, `/api/me/cart/${idToDelete}`, header, done,  
                (err, res, done) => {
                  res.should.have.status(200);
                  res.body.should.be.an("array");
                  res.body.should.have.lengthOf(1);
                  done();
                });
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
              const idToDelete = res.body[0];
              sendChaiDelete(server, `/api/me/cart/${idToDelete}`, header, done, 
                (err, res, done) => {
                res.should.have.status(403);
                done();
              });
            });
          
        });
    });

    it("It should return an 404 if invalid Id", (done) => {

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
            })
      });
    });

  });

  describe("POST /me/cart/:id", () => {
    it("It should update item count in cart", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              const {id, quantity} = res.body[0];
              const updatedQuantity = quantity + 1;

              sendChaiPostWithHeader(server, `/api/me/cart/${id}`, {quantity : updatedQuantity}, header, done,
                (err, res, done) => {

                  sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
                    (err, res, done) => {
                      res.should.have.status(200);
                      res.body[0].quantity.should.equal(updatedQuantity);
                      done();
                    });
                });
            });
        });
    });

    it("It should return 400 if updating to 0", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              const {id, quantity} = res.body[0];
              const updatedQuantity = 0;

              sendChaiPostWithHeader(server, `/api/me/cart/${id}`, {quantity : updatedQuantity}, header, done,
                (err, res, done) => {
                  res.should.have.status(400);
                  done();
                });
            });
        });
    });

    it("It should return 403 if invalid token", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              const {id, quantity} = res.body[0];
              const updatedQuantity = quantity + 1;

              sendChaiPostWithHeader(server, `/api/me/cart/${id}`, {quantity : updatedQuantity}, {token : 99999 }, done,
                (err, res, done) => {
                  res.should.have.status(403);
                  done();
                });
            });
        });
    });

    it("It should return 404 error if invalid id", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          const accessToken = res.body;
          const header = { token : accessToken.token };
          sendChaiGetWithHeader(server, "/api/me/cart", header, done, 
            (err, res, done) => {
              const {id, quantity} = res.body[0];
              const updatedQuantity = quantity + 1;

              sendChaiPostWithHeader(server, "/api/me/cart/999", {quantity : updatedQuantity}, header, done,
                (err, res, done) => {
                  res.should.have.status(404);
                  done();
                });
            });
        });
    });

  });

  
});
