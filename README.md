# Detect sunglasses

A simple model to check if a person is wearing a sunglass or not?

- Blazeface model from google media pipe is used to detect the face in the input video stream. 
- Detected face is used as input to the model for sunglass detection
- Sunglass detection model is trained using transfer learning. 
- Base model for it is MobileV2.
- **Tensorflow2** framework was used for training this model. 
- Model is then converted using tensorflow.js so that the inference could be done on the browser itself.

---

[Demo](https://abhilashbabuj.com/detect_sunglasses/)
