var Navigation = function(width, height, damping) {
  this.width = width;
  this.height = height;
  this.damping = damping || 1;
  this.last;
  this.reset();
};

function getCenter (rect) {
  console.log("GET CENTER: ", rect);
  if (!rect) return null;
  return {
    x: (rect.x + rect.width/2),
    y: (rect.y + rect.height/2)
  };
}

function getDistance (a, b) {
  var x = b.x - a.x, y = b.y - a.y;
  return Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );
}

Navigation.prototype.getOptions = function(rectangles) {
  var center, rect = this.selectRectangle(rectangles);
  if (!rect) {
    this.reset();
  } else {
    center = getCenter(rect);
    
    this.z = ((this.height/2) - center.y) / (this.height/2);
    this.jaw = ((this.width/2) - center.x) / -(this.width/2);
  }
  
  return this.json();
};

Navigation.prototype.selectRectangle = function (rectangles) {
  var last = this.last;
  if (!this.last && rectangles.length != 1) {
  } else if (!this.last && rectangles.length === 1) {
    last = rectangles[0];
  } else if (last) {
    rectangles = rectangles.sort(function (a, b) {
      var aXY = getCenter(a);
      var bXY = getCenter(b);
      var lastXY = getCenter(last);
      var aDist = getDistance(aXY, lastXY);
      var bDist = getDistance(bXY, lastXY);
      return aDist - bDist;
    });
    last = rectangles[0];
  }
  
  this.last = last;
  return last;
};

Navigation.prototype.reset = function () {
  this.pitch = 0;
  this.z = 0;
  this.jaw = 0;
};

Navigation.prototype.json = function () {
  var data = {};
  
  if (this.z > 0) {
    data.up = this.z / this.damping;
  } else if (this.z < 0) {
    data.down = -this.z / this.damping;
  }
  
  if (this.jaw > 0) {
    data.clockwise = this.jaw / this.damping;
  } else if (this.jaw < 0) {
    data.counterClockwise = -this.jaw / this.damping;
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