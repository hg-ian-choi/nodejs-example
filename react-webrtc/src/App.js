import { useState } from 'react';

export default function App() {
  const [ifCamOpen, setIfCamOpen] = useState(false);
  const [camType, setCamType] = useState(true);
  const [openPreview, setOpenPreview] = useState(false);
  const [captureButtonDisabled, setCaptureButtonDisabled] = useState(true);
  const [showCapture, setShowCapture] = useState(false);
  const [recordButtonDisabled, setRecordButtonDisabled] = useState(true);
  const [recordButtonContext, setRecordButtonContext] =
    useState('Start Recording');
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [ifRecording, setIfRecording] = useState(false);

  const openCam = async () => {
    let video = document.querySelector('video#preview');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { facingMode: camType ? 'user' : 'enviroment' },
        })
        .then((_stream) => {
          if ('srcObject' in video) {
            setCamType(true);
            setIfCamOpen(true);
            setOpenPreview(true);
            setCaptureButtonDisabled(false);
            setRecordButtonDisabled(false);
            setStream(_stream);
            video.srcObject = _stream;
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

  const startRecord = () => {
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });
    mediaRecorder.ondataavailable = function (_event) {
      window.bobals = new Blob([_event.data], { type: _event.data.type });
    };
    mediaRecorder.onstop = (_event) => {
      console.log('Stop Recording', _event);
    };
    setRecorder(mediaRecorder);
    mediaRecorder.start();
    setRecordButtonContext('Stop Recording');
    setIfRecording(true);
  };

  const stopRecord = () => {
    recorder.stop();
    setRecordButtonContext('Start Recording');
    setIfRecording(false);
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
        disabled={captureButtonDisabled}
      >
        Capture
      </button>
      <button
        onClick={() => {
          ifRecording ? stopRecord() : startRecord();
        }}
        disabled={recordButtonDisabled}
      >
        {recordButtonContext}
      </button>
    </div>
  );
}
