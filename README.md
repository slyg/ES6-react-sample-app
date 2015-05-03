# Github repos search sample app

[![Circle CI](https://circleci.com/gh/slyg/ES6-react-sample-app.svg?style=svg)](https://circleci.com/gh/slyg/ES6-react-sample-app)

## Abstract

This application is a test at using the following languages and technologies :

- ES6
- React/JSX
- Flux architecture

## Demo

See live sample at http://slyg.github.io/ES6-react-sample-app/.

## Installation steps

Install dependencies

`$ npm install && bower install`

Then start development watcher

`$ npm run watch`

Open `index.html` file in your browser.

## Tests

`$ npm test`

Notes :
- js-only files are unit tested, jsx are not (components and main layout),
- linting is done _via_ ES6 transpilation

## Flux Architecture

<img src="https://raw.githubusercontent.com/facebook/flux/master/docs/img/flux-diagram-white-background.png" style="width: 100%;" />

I've been using Flux architecture as showcased by [Facebook's Flux documentation](http://facebook.github.io/flux/).

For the sake of code simplicity, the web api utilities and action creators modules have cross-dependencies, something I'm not well-comfortable with (see [`SearchService`](./app/js/services/SearchService.js) and [`SearchActions`](./app/js/actions/SearchActions.js) modules).

Flux architecture can be considered slightly overkill for this demo but it is a good start at understanding it. This app could evolve quite nicely from these first steps I think.
