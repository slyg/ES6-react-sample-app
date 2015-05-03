var request = require('superagent'),
    SearchActions;

const USER_URL = (user) => `https://api.github.com/users/${user}/repos`;

module.exports = {

  reposQuery: (text) => {

    SearchActions = require('../actions/SearchActions');

    request.get(USER_URL(text), (err, response) => {

      if (err) {

        if (err.status === 404) {
          return SearchActions.receiveResults([]);
        }

        return SearchActions.receiveError(err);

      }

      SearchActions.receiveResults(response.body);

    });

  }

};
