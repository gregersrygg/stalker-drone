var Navigation = function(width, height) {
  this.width = width;
  this.height = height;
  this.reset();
};

Navigation.prototype.getOptions = function(rectangles) {
  var centerX, centerY, rect;
  if (!rectangles || rectangles.length !== 1) {
    this.reset();
  } else {
    rect = rectangles[0];
    centerX = rect.x + rect.width/2;
    centerY = rect.y + rect.height/2;
    
    this.up = ((this.height/2) - centerY) / -(this.height/2);
    this.clockwise = ((this.width/2) - centerX) / -(this.width/2);
  }
  
  return this.json();
};

Navigation.prototype.reset = function () {
  this.front = 0;
  this.right = 0;
  this.up = 0;
  this.clockwise = 0;
};

Navigation.prototype.json = function () {
  return {
    front: this.front,
    right: this.right,
    up: this.up,
    clockwise: this.clockwise
  };
};

module.exports = Navigation;
//exports.Navigation = Navigation;

/*
front
back: Fly towards or away from front camera direction.
left
right: Fly towards the left or right of the front camera.
up
down: Gain or reduce altitude.
clockwise
*/