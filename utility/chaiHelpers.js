const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const sendChaiGet = (server, route, done, onEnd) => {
  return chai
            .request(server)
            .get(route)
            .end((err, res) => {
              onEnd(err, res, done);
            })
};

const sendChaiGetWithHeader = (server, route, header, done, onEnd) => {
  return chai
            .request(server)
            .get(route)
            .set(header)
            .end((err, res) => {
              onEnd(err, res, done);
            })
};

const sendChaiPost = (server, route, data, done, onEnd) => {
  return chai
            .request(server)
            .post(route)
            .send(data)
            .end((err, res) => {
              onEnd(err, res, done);
            })
};

const sendChaiPostWithHeader = (server, route, data, header, done, onEnd) => {
  return chai
            .request(server)
            .post(route)
            .set(header)
            .send(data)
            .end((err, res) => {
              onEnd(err, res, done);
            })
}

const sendChaiDelete = (server, route, header, done, onEnd) => {
  return chai
            .request(server)
            .del(route)
            .set(header)
            .end((err, res) => {
              onEnd(err, res, done);
            })
            

};

module.exports = {sendChaiGet, sendChaiGetWithHeader,sendChaiPost, sendChaiPostWithHeader, sendChaiDelete};