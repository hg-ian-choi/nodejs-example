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
  const [playRecordDisplay, setPlayRecordDisplay] = useState(false);
  const [blobs, setBlobs] = useState(null);
  const [playRecordDisabled, setPlayRecordDisabled] = useState(true);
  const [downloadButtonDisabled, setDownloadButtonDisabled] = useState(true);

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

  const changeCamType = () => {
    setCamType(!camType);
    setRecordButtonDisabled(true);
    setPlayRecordDisabled(true);
    setDownloadButtonDisabled(true);
    setShowCapture(false);
    setPlayRecordDisplay(false);
    var video = document.querySelector('viode#preview');
    if (!video.srcObject) return;
    let stream = video.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
      openCam();
    });
  };

  const capture = () => {
    const video = document.querySelector('video#preview');
    const canvas = document.querySelector('canvas#capture');
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    setShowCapture(true);
  };

  const startRecord = () => {
    setPlayRecordDisabled(true);
    setDownloadButtonDisabled(true);
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });
    mediaRecorder.ondataavailable = function (_event) {
      const tempBlobs = new Blob([_event.data], { type: _event.data.type });
      setBlobs(tempBlobs);
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
    setPlayRecordDisabled(false);
    setDownloadButtonDisabled(false);
  };

  const playRecord = () => {
    setPlayRecordDisplay(true);
    const playRecord = document.querySelector('video#playRecord');
    playRecord.src = null;
    playRecord.srcObject = null;
    playRecord.src = window.URL.createObjectURL(blobs);
    playRecord.play();
  };

  const download = () => {
    const blob = new Blob([blobs], { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const aEle = document.createElement('a');
    aEle.style.display = 'none';
    aEle.href = url;
    aEle.download = `${new Date()}.webm`;
    document.body.appendChild(aEle);
    aEle.click();
    setTimeout(() => {
      document.body.removeChild(aEle);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div style={{ margin: '0 10px 50px' }}>
      <h1>Hello, World</h1>
      <br />
      <div style={{ display: `${ifCamOpen ? 'block' : 'none'}` }}>
        Now Opened {camType ? 'Front-end' : 'Back-end'} Camera
      </div>
      <br />
      <video
        id="preview"
        style={{
          display: `${openPreview ? 'block' : 'none'}`,
        }}
        playsInline
        muted
      ></video>
      <canvas
        id="capture"
        width={640}
        height={480}
        style={{
          display: `${showCapture ? 'block' : 'none'}`,
        }}
      ></canvas>
      <video
        id="playRecord"
        style={{
          display: `${playRecordDisplay ? 'block' : 'none'}`,
        }}
        playsInline
        controls
      ></video>
      <br />
      <button
        onClick={() => {
          openCam();
        }}
      >
        Open Cam
      </button>
      <button
        disabled={!ifCamOpen}
        onClick={() => {
          changeCamType();
        }}
      >
        Change Cam Type
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
      <button
        disabled={playRecordDisabled}
        onClick={() => {
          playRecord();
        }}
      >
        Play Record
      </button>
      <button
        disabled={downloadButtonDisabled}
        onClick={() => {
          download();
        }}
      >
        Download
      </button>
    </div>
  );
}
