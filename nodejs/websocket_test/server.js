const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 8080;

app.get('/', (req_, res_) => {
  res_.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const socket = new WebSocket.Server({
  port: 8081,
});

socket.on('connection', (ws_, req_) => {
  ws_.on('message', (msg_) => {
    console.log('Message: ' + msg_);
    ws_.send('World');
  });
});
