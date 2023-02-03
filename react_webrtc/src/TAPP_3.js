import { useState } from 'react';

export default function App3() {
  // const [mediaStream, setmediaStream] = useState(null);
  const [Stream, setStream] = useState(false);
  // const [videoBlob, setvideoBlob] = useState(null);
  const [mediaRecorder, SetmediaRecorder] = useState(null);
  const [Type, setType] = useState(false);

  const getUserMediaStream = (constraints, cb) => {
    let video = document.querySelector('#viodes');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: { facingMode: Type ? 'user' : 'environment' },
        })
        .then((stream) => {
          if ('srcObject' in video) {
            video.srcObject = stream;

            video.play();

            // onluzhis(stream)

            setStream(stream);
          } else {
            video.src =
              (window.URL && window.URL.createObjectURL(stream)) || stream;

            console.log('第二种');
          }
        });
    } else if (navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
      // webkit内核浏览器

      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      console.log('我是webkit内核');
    }
  };

  const onClickzp = () => {
    const viodes = document.getElementById('viodes');

    const canvas = document.getElementById('canvas'); // canvas元素

    const context = canvas.getContext('2d');

    context.drawImage(viodes, 0, 0); // 将video在canvas上绘制出来

    canvas.toBlob((blob) => {
      // 将canvas转换为blob

      console.log(blob);
    });
  };

  const updateVideo = (ctx, video, rate) => {
    ctx.drawImage(video, 0, 0, 600, 600 * rate); // 使用视频帧(当前帧)绘制canvas

    video.requestVideoFrameCallback(updateVideo);
  };

  const onluzhis = () => {
    let options = {
      audioBitsPerSecond: 128000,

      videoBitsPerSecond: 2500000,

      mimeType: 'video/webm;codecs=vp8,opus', //webm类型一定要加codecs=vp8,opus，否则会导致录制时候时而可以用时而不能用
    };

    let recorder = new MediaRecorder(Stream, options);

    SetmediaRecorder(recorder);

    recorder.ondataavailable = function (evt) {
      window.bobals = new Blob([evt.data], { type: evt.data.type });

      // setvideoBlob(bobal)
    };

    recorder.start();

    console.log('开始录制');
  };

  const endsTartOnload = () => {
    mediaRecorder.stop();

    setTimeout(function () {
      console.log('录像上传', window.bobals);

      let blob = new Blob([window.bobals]);

      let downloadElement = document.createElement('a');

      let href = window.URL.createObjectURL(blob); //创建下载的链接

      downloadElement.href = href;

      downloadElement.download = formatDateTime(new Date()) + '.webm'; //下载后文件名

      document.body.appendChild(downloadElement);

      downloadElement.click(); //点击下载

      document.body.removeChild(downloadElement); //下载完成移除元素

      window.URL.revokeObjectURL(href); //释放掉blob对象
    }, 1000);
  };

  let formatDateTime = function (date) {
    var y = date.getFullYear();

    var m = date.getMonth() + 1; //注意这个“+1”

    m = m < 10 ? '0' + m : m;

    var d = date.getDate();

    d = d < 10 ? '0' + d : d;

    var h = date.getHours();

    h = h < 10 ? '0' + h : h;

    var minute = date.getMinutes();

    minute = minute < 10 ? '0' + minute : minute;

    var second = date.getSeconds();

    second = second < 10 ? '0' + second : second;

    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  };

  const qiehuan = () => {
    setType(!Type);

    stopCapture();
  };

  const stopCapture = () => {
    var video = document.getElementById('viodes');

    if (!video.srcObject) return;

    let stream = video.srcObject;

    let tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();

      getUserMediaStream();
    });
  };

  return (
    <div className="webrtc">
      <div className="tops">
        <video id="viodes"></video>

        <canvas id="canvas"></canvas>
      </div>

      <div>当前摄像头：{Type ? '前置' : '后置'}</div>

      <div className="buttons">
        <button onClick={getUserMediaStream}>获取摄像头</button>

        <button onClick={onClickzp}>点击抓拍</button>

        <button onClick={onluzhis}>点击录制</button>

        <button onClick={endsTartOnload}>结束录制并且下载视频</button>

        <button onClick={qiehuan}>切换摄像头</button>
      </div>
    </div>
  );
}
