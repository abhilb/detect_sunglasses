
let model;
let sunglass_model;

let ctx;
let video;
let height;
let width = 320;
let canvas;
let streaming = false;
let has_sunglass;

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
      const top = start[0] / video.videoHeight * height;
      const left = start[1] / video.videoWidth * width;
      const bot = end[0] / video.videoHeight * height;
      const right = end[1] / video.videoWidth * width;
      const size = [bot - top, right - left];
      
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(top, left, size[0], size[1]);
    }
  }
  else
  {
    console.log("No faces found");
  }

  const vid_frame = tf.browser.fromPixels(video).resizeBilinear([224, 224]).reshape([1, 224, 224, 3]);  
  const sg_pred = sunglass_model.predict(vid_frame);
  const v = sg_pred.argMax().dataSync()[0];
  if(v === 0)
  {
    has_sunglass.innerHTML = "YES";
  }
  else
  {
    has_sunglass.innerHTML = "NO";
  }

  requestAnimationFrame(renderPrediction);
};

async function main() {
  // Load the model.
  model = await blazeface.load();
  sunglass_model = await tf.loadGraphModel('tfjs/model.json');
  renderPrediction();
}
  

const startup = () => {
    
    video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();

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

        height = video.videoHeight / (video.videoWidth/width);
        video.setAttribute('width', width);
        video.setAttribute('height', height);

        has_sunglass = document.getElementById('has_sunglass');
                  
        canvas = document.getElementById('output');      
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = video.style.top;
        canvas.style.left = video.style.left;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

        console.log("canvas width is " + canvas.width);
        console.log("canvas height is " + canvas.height);
        console.log("Now load the model");
        streaming = true;
      }
    }, false);
  }

  
  // add event listener to the window load event
  window.onload = startup();
  