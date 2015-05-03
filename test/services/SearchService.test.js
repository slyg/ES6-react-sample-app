var expect = require('chai').expect,
    rewire = require('rewire');

describe('SearchService', () => {

  var SearchService;

  var requestMock = {
    get : () => {}
  };

  var SearchActionsMock = {
    receiveResults : () => {},
    receiveError : () => {}
  };

  beforeEach('Mock dependencies', () => {

    SearchService = rewire('../../src/js/services/SearchService');
    SearchService.__set__('request', requestMock);

    // because of deferred resolution, can't use rewire
    require('../../src/js/actions/SearchActions');
    require.cache[require.resolve('../../src/js/actions/SearchActions')].exports = SearchActionsMock;

  });

  after(() => {
    delete require.cache[require.resolve('../../src/js/actions/SearchActions')];
  });

  it('should expose a reposQuery method', () => {
    expect(SearchService)
      .to.have.property('reposQuery')
      .that.is.a('function');
  });

  describe('reposQuery() method', () => {

    it('triggers a query with passed parameter', (done) => {

      requestMock.get = (url) => {
        expect(url).to.eql('https://api.github.com/users/stuff/repos');
        return done();
      };

      SearchService.reposQuery('stuff');

    });

    context('when ajax request returns an error', () => {

      it('triggers an error action', (done) => {

        requestMock.get = (url, cb) => {
          cb({status: 500});
        };

        SearchActionsMock.receiveError = () => done();

        SearchService.reposQuery('stuff');

      });

    });

    context('when ajax request returns a 404 error', () => {

      it('triggers an empty results action', (done) => {

        requestMock.get = (url, cb) => {
          cb({status: 404});
        };

        SearchActionsMock.receiveResults = (results) => {
          expect(results).to.eql([]);
          done();
        };

        SearchService.reposQuery('stuff');

      });

    });

    context('when ajax request returns response', () => {

      it('triggers an empty results action', (done) => {

        requestMock.get = (url, cb) => {
          cb(null, {
            body : [{name : 'hello-jsx'}]
          });
        };

        SearchActionsMock.receiveResults = (results) => {
          expect(results).to.eql([{name : 'hello-jsx'}]);
          done();
        };

        SearchService.reposQuery('stuff');

      });

    });

  });


});
