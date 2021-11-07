const startup = () => {
    var width = 320;
    var height = 0;
    var streaming = false;
    var video = null;
  
    video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
      $("#local-video-error").html("No error");
    })
    .catch(function(err) {      
        $("#local-video-error").html("Got an error : " + err);
    });
  
    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);      
        if (isNaN(height)) {
          height = width / (4/3);
        }      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        streaming = true;
      }
    }, false);
  }
  
  // add event listener to the window load event
  window.onload = startup();
  