
var http = require('http');
var cv = require('opencv');
var fs      = require('fs');
var arDrone = require('ar-drone');
var Navigation = require('./cv-navigation.js');
var control = arDrone.createUdpControl();
var log = console.log;
var face_cascade = new cv.CascadeClassifier('./data/haarcascade_frontalface_alt2.xml');

log('Connecting png stream ...');


var COLOR = [0, 255, 0]; //default red
var thickness = 2; // default 1
var lastPngBuffer;
var mimeTypes = {
  'html':    'text/html',
  'js':      'text/javascript'
};
var nav = new Navigation(640, 360);


var pngStream = arDrone.createPngStream();

var lastPng;
pngStream
  .on('error', log)
  .on('data', function(pngBuffer) {
    lastPngBuffer = pngBuffer;
});

var ref  = {};
var pcmd = {};

/*
console.log('Recovering from emergency mode if there was one ...');
ref.emergency = true;
setTimeout(function() {
  console.log('Takeoff ...');

  ref.emergency = false;
  ref.fly       = true;

}, 1000);

setTimeout(function() {
  console.log('Landing ...');

  ref.fly = false;
  pcmd = {};
}, 8000);

setInterval(function() {
  control.ref(ref);
  control.pcmd(pcmd);
  control.flush();
}, 30);*/

var detectFace = function(){
  cv.readImage(lastPngBuffer, function(err, im){
     //log("Size: " + im.width() + "x" + im.height());
     //im.resize(im.width() / 2, im.height() / 2);
     //log("Resize: " + im.width() + "x" + im.height());

     face_cascade.detectMultiScale(im, function(err, faces) {

       for(var k = 0; k < faces.length; k++) {

         face = faces[k];
         im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], COLOR, 2);
       }
       
       pcmd = nav.getOptions(faces);
       console.log(pcmd);
       
       lastPng = im.toBuffer();
     });
   });
};

var faceDetectLoop = function(){
  
  if(lastPngBuffer){
    log('Detecting Face.');
    detectFace();
  };
  setTimeout(faceDetectLoop, 500);
};
faceDetectLoop();

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
      if (err) { log(err); }
      res.writeHead(200, {'Content-Type': mimeTypes[fileType]});
      res.end(content);
    });
    
  }
  
});

server.listen(8080, function() {
  log('Serving latest png on port 8080 ...');
});

