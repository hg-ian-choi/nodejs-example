import { useState } from 'react';

export default function App() {
  const [ifCamOpen, setIfCamOpen] = useState(false);
  const [camType, setCamType] = useState(true);
  const [openPreview, setOpenPreview] = useState(false);

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
        style={{ display: `${openPreview ? 'block' : 'none'}` }}
      ></video>
      <button
        onClick={() => {
          openCam();
        }}
      >
        Open Cam
      </button>
    </div>
  );
}
