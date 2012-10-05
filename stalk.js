var cv = require('../lib/opencv');
var http    = require('http');
var fs      = require('fs');

var camera = new cv.VideoCapture(0);
var COLOR = [0, 255, 0]; //default red
var thickness = 2; // default 1
var lastPng;
var mimeTypes = {
  'html':    'text/html',
  'js':      'text/javascript'
};

var server = http.createServer(function(req, res) {
  
  if (req.url === '/cam.png') {
    if (!lastPng) {
      res.writeHead(503);
      res.end('Did not receive any png data yet.');
      return;
    }

    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(lastPng);
    
  } else {
    
    var file = req.url.replace(/^\/$/, 'index.html').replace(/\.\./, '').replace(/^\//, './');
    var fileType = file.replace(/\.\w+$/) || "html";
    
    fs.readFile(file, function (err, content) {
      if (err) { throw err; }
      res.writeHead(200, {'Content-Type': mimeTypes[fileType]});
      res.end(content);
    });
    /*fs.exists(file, function (exists) {
      if (!exists) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
    });*/
    
  }
  
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});

setInterval(function() {
  var start = new Date().getTime();
	camera.read(function(im) {
	  console.log("Size: " + im.width() + "x" + im.height());
	  im.resize(im.width() / 2, im.height() / 2);
	  console.log("Resize: " + im.width() + "x" + im.height());
    
		im.detectObject('../data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {

    		for(var k = 0; k < faces.length; k++) {

    			face = faces[k];
    			im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], COLOR, 2);
    		}

            /*var methods = []
            for(var j in im) {
                if(typeof im[j] === "function") methods.push(j);
            }
            console.log(methods.sort().join("\n"));*/
    		lastPng = im.toBuffer();
    		var end = new Date().getTime();
    		console.log("Time: " + (end - start));

    	});
	});

}, 250);