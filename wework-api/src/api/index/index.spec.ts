import chai from 'chai';
import http from 'chai-http';
import { tools } from '../../tests/tools';

// Configure Chai
chai.use(http);
chai.should();

// Tests
describe('Index', () => {

  describe('GET /', () => {
    it('should be status code 200', (done) => {
      chai.request(tools.apiRoot)
        .get('/')
        .end((err: any, res: any) => {
          res.should.have.status(200);
          done();
        });
      });

    it('should text property exist', (done) => {
      chai.request(tools.apiRoot)
        .get('/')
        .end((err: any, res: any) => {
          res.should.have.property('text');
          done();
        });
      });
    });

});
