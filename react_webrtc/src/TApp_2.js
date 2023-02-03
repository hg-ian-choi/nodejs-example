import { useEffect, useState } from 'react';
import './App.css';

function App2() {
  const [recordButtonDisabled, setRecordButtonDisabled] = useState(true);
  const [recordButtonText, setRecordButtonText] = useState('Start Recording');
  const [previewDisplay, setPreviewDisplay] = useState('none');
  const [playRecordDisplay, setPlayRecordDisplay] = useState('none');
  const [playRecordButtonDisabled, setPlayRecordButtonDisabled] =
    useState(true);
  const [downloadButtonDisabled, setDownloadButtonDisabled] = useState(true);
  const [ifRecord, setIfRecord] = useState(false);
  const [blobs, setBlobs] = useState([]);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => { }, []);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user' },
      });
      setRecordButtonDisabled(false);
      const preview = document.querySelector('video#preview');
      window.stream = stream;
      preview.srcObject = stream;
      setPreviewDisplay('block');
    } catch (e) {
      console.error('navigator.getUserMedia error: ', e);
    }
  };

  const startRecord = () => {
    const blobs = [];
    let mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm;codecs=vp8,opus' });

    setIfRecord(true);
    setRecordButtonText('Stop Recording');
    setPlayRecordButtonDisabled(false);
    setDownloadButtonDisabled(false);
    mediaRecorder.onstop = () => {
      console.log('Recorder Blobs', blobs);
    };
    mediaRecorder.ondataavailable = (event) => {
      console.log("!!!");
      blobs.push(event.data);
      setBlobs(blobs);
    };
    setRecorder(mediaRecorder);
    mediaRecorder.start();
  };

  const stopRecord = () => {
    recorder.stop();
  };

  const playRecord = () => {
    setPlayRecordDisplay('block');
    const buffer = new Blob(blobs);
    const playRecord = document.querySelector('video#playRecord');
    playRecord.src = null;
    playRecord.srcObject = null;
    playRecord.src = window.URL.createObjectURL(buffer);
    playRecord.play();
  };

  const download = () => {
    const blob = new Blob(blobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const aEle = document.createElement('a');
    aEle.style.display = 'none';
    aEle.href = url;
    aEle.download = 'test.webm';
    document.body.appendChild(aEle);
    aEle.click();
    setTimeout(() => {
      document.body.removeChild(aEle);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div>
      <h1>Hello, World!</h1>
      <video
        id="preview"
        style={{ width: 500, height: 500, display: `${previewDisplay}` }}
        playsInline
        autoPlay
        muted
      ></video>
      <video
        id="playRecord"
        style={{ width: 500, height: 500, display: `${playRecordDisplay}` }}
        playsInline
        controls
      ></video>
      <br />
      <button
        onClick={() => {
          openCamera();
        }}
      >
        Open Camera
      </button>
      <button
        disabled={recordButtonDisabled}
        onClick={() => {
          if (ifRecord) {
            stopRecord();
          } else {
            startRecord();
          }
        }}
      >
        {recordButtonText}
      </button>
      <button
        disabled={playRecordButtonDisabled}
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

export default App;
