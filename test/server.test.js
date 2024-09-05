const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed
const { serve } = require('swagger-ui-express');
const { sendChaiGet, sendChaiPost } = require("../utility/chaiHelpers");

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

  describe("/GET brands/{id}/products", () => {
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

  describe('GET products/', () => { 
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

describe('Cart', () => {
  const userCredentials = {
    "username" : "yellowleopard753",
    "password" : "jonjon"
  };

  describe("GET /me/cart", () => {
    it("It should return cart after logging in", (done) => {
      sendChaiPost(server, "/api/login", userCredentials, done, 
        (err, res, done) => {
          
          const accessToken = res.body;
          sendChaiGet(server, "/api/me/cart", done, 
            (err, res, done) => {
              res.should.have.status(200);
              done();
            }
          )
        })
    })
  })
  



});
