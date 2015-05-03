var expect = require('chai').expect,
    rewire = require('rewire');

describe('SearchActions', () => {

  var SearchActions;

  var SearchConstantsMock = {
    SEARCH_BEGIN : 'SEARCH_BEGIN',
    SEARCH_SUCCESS : 'SEARCH_SUCCESS',
    SEARCH_FAILURE : 'SEARCH_FAILURE'
  };

  var AppDispatcherMock = {};
  var SearchServiceMock = {
    reposQuery : () => {}
  };

  beforeEach('Mock dependencies', () => {

    SearchActions = rewire('../../src/js/actions/SearchActions');
    SearchActions.__set__('SearchConstants', SearchConstantsMock);
    SearchActions.__set__('AppDispatcher', AppDispatcherMock);

  });

  after(function(){
    delete require.cache[require.resolve('../../src/js/services/SearchService')];
  });

  describe('query action', () => {

    it('should dispatch a SEARCH_BEGIN action', (done) => {

      AppDispatcherMock.dispatch = (action) => {
        expect(action.actionType).to.eql(SearchConstantsMock.SEARCH_BEGIN);
        return done();
      };

      SearchActions.query('stuff');
    });

    it('should trigger a service query once per 500 ms', (done) => {

      AppDispatcherMock.dispatch = () => {};

      SearchServiceMock.reposQuery = (searchString) => {
        expect(searchString).to.eql('stuff');
        return done();
      };

      // because of sync resolution, can't use rewire
      require('../../src/js/services/SearchService');
      require.cache[require.resolve('../../src/js/services/SearchService')].exports = SearchServiceMock;

      SearchActions = rewire('../../src/js/actions/SearchActions');

      SearchActions.query('s');
      SearchActions.query('st');
      SearchActions.query('stu');
      SearchActions.query('stuf');
      SearchActions.query('stuff');
    });

  });

  describe('receiveResults action', () => {

    it('should dispatch a SEARCH_SUCCESS action', (done) => {

      AppDispatcherMock.dispatch = (action) => {
        expect(action.actionType).to.eql(SearchConstantsMock.SEARCH_SUCCESS);
        expect(action.results).to.eql('stuff');
        return done();
      };

      SearchActions.receiveResults('stuff');
    });

  });

  describe('receiveError action', () => {

    it('should dispatch a SEARCH_FAILURE action', (done) => {

      AppDispatcherMock.dispatch = (action) => {
        expect(action.actionType).to.eql(SearchConstantsMock.SEARCH_FAILURE);
        expect(action.error).to.eql('oups');
        return done();
      };

      SearchActions.receiveError('oups');
    });

  });

});
