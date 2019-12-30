process.env.NODE_ENV = 'test';

const memory = require('../api/memory');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-json'));
describe('Memory', () => {
  /*
   * Test the /GET route
   */
  describe('/GET readMemory', () => {
    it('it should GET the stored number in a json response', (done) => {
      chai.request(server)
        .get('/readMemory')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('memory')
          done();
        });
    });
  });
  /*
   * Test the /POST route
   */
  describe('/POST writeMemory', () => {
    it('it should POST a number', (done) => {
      const num = {
        "num": 77
      }

      chai.request(server)
        .post('/writeMemory')
        .send(num)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('success');
          done();
        });
    });
  });
  /*
   * Test the /PUT route
   */
  describe('/PUT writeMemory', () => {
    it('it should reset the memory to 0)', (done) => {
      chai.request(server)
        .put('/writeMemory')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
});