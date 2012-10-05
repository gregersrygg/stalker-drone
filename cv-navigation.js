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
    
    this.z = ((this.height/2) - centerY) / (this.height/2);
    this.jaw = ((this.width/2) - centerX) / -(this.width/2);
  }
  
  return this.json();
};

Navigation.prototype.reset = function () {
  this.pitch = 0;
  this.z = 0;
  this.jaw = 0;
};

Navigation.prototype.json = function () {
  var data = {}, damping = 3;
  
  if (this.z > 0) {
    data.up = this.z / damping;
  } else if (this.z < 0) {
    data.down = -this.z / damping;
  }
  
  if (this.jaw > 0) {
    data.clockwise = this.jaw / damping;
  } else if (this.jaw < 0) {
    data.counterClockwise = -this.jaw / damping;
  }
  
  return data;
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