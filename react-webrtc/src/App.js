import { useState } from 'react';

export default function App() {
  const [ifCamOpen, setIfCamOpen] = useState(false);
  const [camType, setCamType] = useState(true);
  const [openPreview, setOpenPreview] = useState(false);
  const [showCapture, setShowCapture] = useState(false);

  const openCam = async () => {
    let video = document.querySelector('video#preview');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { facingMode: camType ? 'user' : 'enviroment' },
        })
        .then((stream) => {
          if ('srcObject' in video) {
            setCamType(true);
            setIfCamOpen(true);
            setOpenPreview(true);
            video.srcObject = stream;
            video.play();
          } else {
            video.src =
              (window.URL && window.URL.createObjectURL(stream)) || stream;
          }
        });
    } else if (navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
    }
  };

  const capture = () => {
    const video = document.querySelector('video#preview');
    const canvas = document.querySelector('canvas#capture');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    setShowCapture(true);
  };

  return (
    <div>
      <h1>Hello, World</h1>
      <br />
      <div style={{ display: `${ifCamOpen ? 'block' : 'none'}` }}>
        Now Opened {camType ? 'Front-end' : 'Back-end'} Camera
      </div>
      <br />
      <video
        id="preview"
        style={{
          width: 720,
          height: 720,
          display: `${openPreview ? 'block' : 'none'}`,
        }}
      ></video>
      <canvas
        id="capture"
        width={720}
        height={720}
        style={{
          width: 702,
          height: 702,
          display: `${showCapture ? 'block' : 'none'}`,
        }}
      ></canvas>
      <button
        onClick={() => {
          openCam();
        }}
      >
        Open Cam
      </button>
      <button
        onClick={() => {
          capture();
        }}
      >
        Capture
      </button>
    </div>
  );
}
