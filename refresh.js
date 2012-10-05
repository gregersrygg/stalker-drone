function refreshCam() {
  var old = document.getElementById("cam");
  if (!old) setTimeout(refreshCam, 150);
  var img = document.createElement("img");
  
  img.onload = function () {
    old.parentNode.removeChild(old);
    document.body.appendChild(img);
    setTimeout(refreshCam, 150);
  };
  
  img.onerror = function () {
    setTimeout(refreshCam, 150);
  };
  
  img.id = old.id;
  img.src = old.src;
}
window.onload = function () {
  refreshCam();
};