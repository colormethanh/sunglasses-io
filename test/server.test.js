const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed
const { serve } = require('swagger-ui-express');
const {AccessToken} = require('../utility/helper');

const should = chai.should();
chai.use(chaiHttp);

// TODO: Write tests for the server

describe('Brands', () => {
  describe("/GET brands", () => {
    it("should GET all brands", (done) => {
      chai
        .request(server)
        .get("/api/brands")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });

  describe("/GET brands/{id}/products", () => {
    it("It should GET Array of products with specified brand id", (done) =>{
      chai
        .request(server)
        .get("/api/brands/1/products")
        .end((err, res) => {
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
      chai
        .request(server)
        .get("/api/brands/99/products")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /products', () => { 
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
  it("Should return access token upon success", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        "username" : "yellowleopard753",
        "password" : "jonjon"
      })
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.be.an("object");
        res.body.should.have.property("username");
        res.body.should.have.property("token");
        res.body.should.have.property("timestamp");
        done();
      })
  })
  // todo : add test for invalid credentials
  // todo : add test for blank credentials
  // todo : add test for 

});

describe('Cart', () => {});
