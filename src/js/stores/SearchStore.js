var AppDispatcher   = require('../dispatcher/AppDispatcher'),
    SearchConstants = require('../constants/SearchConstants'),
    {EventEmitter}  = require('events'),
    Immutable       = require('immutable'),
    _               = require('lodash');

class Store extends EventEmitter {

  constructor (...args) {
    super(...args);
    this.results = Immutable.OrderedMap();
  }

  createResult (item) {
    let id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    this.results = this.results.set(id, item);
  }

  createResults (list) {
    this.reset();
    _.each(list, (item) => {
      this.createResult(item);
    });
    return this;
  }

  getResults () {
    return this.results.toObject();
  }

  reset () {
    for (var id in this.results.toObject()) {
      this.results = this.results.delete(id);
    }
    return this;
  }

  emitChange () {
    this.emit('change');
  }

  addChangeListener (callback) {
    this.on('change', callback);
  }

  removeChangeListener (callback) {
    this.removeListener('change', callback);
  }

}

var SearchStore = new Store();

AppDispatcher.register((action) => {

  let text;

  switch (action.actionType) {

    case SearchConstants.SEARCH_SUCCESS:
      SearchStore.createResults(action.results).emitChange();
      break;

    case SearchConstants.SEARCH_FAILURE:
      SearchStore.reset().emitChange();
      break;

  }

});

module.exports = SearchStore;
