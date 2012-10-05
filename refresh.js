function refreshCam() {
  var old = document.getElementById("cam");
  if (!old) setTimeout(refreshCam, 250);
  var img = document.createElement("img");
  
  img.onload = function () {
    old.parentNode.removeChild(old);
    document.body.appendChild(img);
    setTimeout(refreshCam, 250);
  };
  
  img.id = old.id;
  img.src = old.src;
}
window.onload = function () {
  refreshCam();
};