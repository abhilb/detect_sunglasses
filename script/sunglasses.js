
let model;
let sunglass_model;
let ctx;
let video;
let videoHeight;
let videoWidth;
let canvas;
let top_tag;
let left_tag;
let face_width_tag;
let face_height_tag;
let streaming = false;
let face_canvas;
let face_ctx;
let cur_frame_canvas;
let cur_frame_ctx;

const renderPrediction = async () => {

  const returnTensors = false;
  const flipHorizontal = false;
  const annotateBoxes = true;
  const predictions = await model.estimateFaces(
    video, returnTensors, flipHorizontal, annotateBoxes);

  if (predictions.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < predictions.length; i++) {
      if (returnTensors) {
        predictions[i].topLeft = predictions[i].topLeft.arraySync();
        predictions[i].bottomRight = predictions[i].bottomRight.arraySync();
        if (annotateBoxes) {
          predictions[i].landmarks = predictions[i].landmarks.arraySync();
        }
      }

      const start = predictions[i].topLeft;
      const end = predictions[i].bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];
      
      top_tag.innerHTML = start[0];
      left_tag.innerHTML = start[1];
      face_width_tag.innerHTML = size[0];
      face_height_tag.innerHTML = size[1];

      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(start[0], start[1], size[0], size[1]);

      face_ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    }
  }
  else
  {
    console.log("No faces found");
  }

  requestAnimationFrame(renderPrediction);
};

async function main() {
  // Load the model.
  model = await blazeface.load();
  //sunglass_model = await tf.loadLayersModel('tfjs/model.json');
  renderPrediction();
}
  

const startup = () => {
    
    video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
          
      videoWidth = video.videoWidth;
      videoHeight = video.videoHeight;
    
      console.log(videoWidth);
      console.log(videoHeight);
      
      face_canvas = document.getElementById("face");
      face_canvas.width = 320;
      face_canvas.height = 240;
      face_ctx = face_canvas.getContext('2d');
      
      cur_frame_canvas = document.getElementById("current_frame");
      cur_frame_canvas.width = videoWidth;
      cur_frame_canvas.height = videoHeight;
      cur_frame_ctx = cur_frame_canvas.getContext('2d');
    
      canvas = document.getElementById('output');
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      canvas.style.top = video.style.top;
      canvas.style.left = video.style.left;
      ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

      console.log("canvas width is " + canvas.width);
      console.log("canvas height is " + canvas.height);

      top_tag = document.getElementById("top");
      left_tag = document.getElementById("left");
      face_width_tag = document.getElementById("face_width");
      face_height_tag = document.getElementById("face_height");

      console.log("Now load the model");
      main();
    })
    .catch(function(err) {      
        console.log(err);
    });
  
    video.addEventListener('canplay', function(ev){
      console.log("streaming value: " + streaming);
      if (!streaming) {
        console.log(video.videoHeight);
        console.log(video.videoWidth);
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        cur_frame_canvas.width = video.videoWidth;
        cur_frame_canvas.height = video.videoHeight;
        streaming = true;
      }
    }, false);
  }

  
  // add event listener to the window load event
  window.onload = startup();
  