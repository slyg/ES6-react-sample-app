var expect = require('chai').expect,
    rewire = require('rewire');

describe('SearchStore', () => {

  var SearchStore;

  var AppDispatcherMock = {
    register : () => {}
  };

  var SearchConstantsMock = {
    SEARCH_BEGIN : 'SEARCH_BEGIN',
    SEARCH_SUCCESS : 'SEARCH_SUCCESS',
    SEARCH_FAILURE : 'SEARCH_FAILURE'
  };

  beforeEach('Mock dependencies', () => {
    // because of sync resolutions, can't use rewire
    require('../../src/js/dispatcher/AppDispatcher');
    require('../../src/js/constants/SearchConstants');
    require.cache[require.resolve('../../src/js/dispatcher/AppDispatcher')].exports = AppDispatcherMock;
    require.cache[require.resolve('../../src/js/constants/SearchConstants')].exports = SearchConstantsMock;
  });

  after(() => {
    delete require.cache[require.resolve('../../src/js/dispatcher/AppDispatcher')];
    delete require.cache[require.resolve('../../src/js/constants/SearchConstants')];
  });

  describe('public method', () => {

    beforeEach(() => {
      SearchStore = rewire('../../src/js/stores/SearchStore');
    });

    it('#createResult() stores a single items', () => {

      SearchStore.createResult('hello');

      var results = SearchStore.getResults();

      expect(
        results[Object.keys(results)[0]]
      ).to.eql('hello');

    });

    it('#createResults() batch stores items', () => {

      SearchStore.createResults(['hello', 'world']);

      var results = SearchStore.getResults();

      expect(
        Object.keys(results).length
      ).to.eql(2);

    });

    it('#reset() resets created items', () => {

      SearchStore.createResult('hello');
      SearchStore.reset();

      expect(SearchStore.getResults()).to.eql({});

    });

    it('#addChangeListener() is a change subscribe method', (done) => {
      SearchStore.addChangeListener(() => { done(); });
      SearchStore.emitChange();
    });

    it('#removeChangeListener() is a change unsubscribe method', () => {
      expect(SearchStore.removeChangeListener).to.be.a('function');
    });


  });

  describe('on instanciation', () => {

    it('registers an actions handler onto dispatcher', (done) => {

      AppDispatcherMock.register = () => done();

      rewire('../../src/js/stores/SearchStore');

    });

  });

  describe('actions handler', () => {

    var actionsHandler;

    beforeEach(() => {
      AppDispatcherMock.register = (handler) => {
        actionsHandler = handler;
      };
      SearchStore = rewire('../../src/js/stores/SearchStore');
    });

    it('should be a function', () => {
      expect(actionsHandler).to.be.a('function');
    });

    it('sets new results in the store on SEARCH_SUCCESS action', (done) => {
      SearchStore.addChangeListener(() => {
        expect(
          Object.keys(SearchStore.getResults()).length
        ).to.eql(2);
        return done();
      });
      actionsHandler({
        actionType : SearchConstantsMock.SEARCH_SUCCESS,
        results : ['hello', 'world']
      });
    });

    it('resets all results on SEARCH_FAILURE action', (done) => {
      actionsHandler({
        actionType : SearchConstantsMock.SEARCH_SUCCESS,
        results : ['hello', 'world']
      });
      SearchStore.addChangeListener(() => {
        expect(SearchStore.getResults()).to.eql({});
        return done();
      });
      actionsHandler({
        actionType : SearchConstantsMock.SEARCH_FAILURE
      });
    });

  });


});
