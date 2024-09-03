const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

// TODO: Write tests for the server

describe('Brands', () => {
  describe("/GET brands", () => {
    it("should GET all brands", (done) => {
      chai
        .request(server)
        .get("/api/brands")
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.an("array");
          done();
        })
    })
  })


});

describe('Login', () => {});

describe('Cart', () => {});
