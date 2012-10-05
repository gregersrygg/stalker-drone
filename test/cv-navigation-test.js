var buster = require("buster");
var Navigation = require('../cv-navigation.js');
var assert = buster.assertions.assert;

buster.testCase("Test CV Navigation", {
  setUp: function () {
    this.nav = new Navigation(640, 320);
  },
  "test should start with hover navigation data": function () {
    var opts = this.nav.getOptions();
    assert.equals(opts, {
      front: 0,
      right: 0,
      up: 0,
      clockwise: 0
    });
  },
  
  "test should hover when rectangle in center": function () {
    var opts = this.nav.getOptions([{
      x:      300,
      width:  40,
      y:      140,
      height: 40
    }]);
    assert.equals(opts, {
      front: 0,
      right: 0,
      up: 0,
      clockwise: 0
    });
  },
  
  "test should move up when rectangle above center": function () {
    var opts = this.nav.getOptions([{
      x:      300,
      width:  40,
      y:      160,
      height: 40
    }]);
    assert.equals(opts, {
      front: 0,
      right: 0,
      up: 0.125,
      clockwise: 0
    });
  },
  
  "test should move down when rectangle below center": function () {
    var opts = this.nav.getOptions([{
      x:      300,
      width:  40,
      y:      100,
      height: 40
    }]);
    assert.equals(opts, {
      front: 0,
      right: 0,
      up: -0.25,
      clockwise: 0
    });
  },
  
  "test should rotate clockwise when rectangle right of center": function () {
    var opts = this.nav.getOptions([{
      x:      360,
      width:  40,
      y:      140,
      height: 40
    }]);
    assert.equals(opts, {
      front: 0,
      right: 0,
      up: 0,
      clockwise: 0.1875
    });
  },
  
  "test should rotate counter-clockwise when rectangle left of center": function () {
    var opts = this.nav.getOptions([{
      x:      240,
      width:  40,
      y:      140,
      height: 40
    }]);
    assert.equals(opts, {
      front: 0,
      right: 0,
      up: 0,
      clockwise: -0.1875
    });
  }
});