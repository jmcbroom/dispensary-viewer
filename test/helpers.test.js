var assert = require('assert');
var should = require('should');

import Helpers from '../src/helpers';

describe("Helpers", function() {
  
  describe("example", function() {
    it("should add 1 to any number", function() {
      assert.equal(5, Helpers.example(4));
      assert.equal(-6.78, Helpers.example(-7.78))
    });
  });

});