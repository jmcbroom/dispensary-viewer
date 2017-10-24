# iet-template

Project skeleton

## Development

Behind the scenes, we use Babel to compile, Browserify and Watchify to bundle, and Uglify to minify our code.

### Prereqs

You should be running Node and NPM.

This project assumes you have three global dependencies: Browserify, Watchify and Uglify

If you don't, install them:
```
npm install -g browserify watchify uglify-js
```

### Install

Clone this project:
```
git clone https://github.com/CityOfDetroit/iet-template.git
cd iet-template
npm install
```

### Build

Run `npm run watch` and open `public/index.html` in your browser.

This is listening for changes in `src/main.js` and will automatically rebuild, so you just need to refresh your browser to see changes.

### Deploy

Run `npm run deploy`. This pipes `src/main.js` through Uglify to minify it, writes to `public/bundle.js`, and then publishes to gh-pages.

### Tests

Run `npm test`. This runs `mocha test` plus a Babel compiler and looks for test files in the `test/` dir.

Check out [Mocha.js](https://mochajs.org) docs for how to write tests. Mocha is set up here to work with Node.js' built-in [assert](https://nodejs.org/api/assert.html) module and [should.js](https://github.com/shouldjs/should.js).
