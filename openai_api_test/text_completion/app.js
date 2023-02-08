require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {Configuration, OpenAIApi} = require('openai');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 8088;

app.get('/', (request_, response_) => {
  response_.sendFile(__dirname + '/index.html');
});

app.post('/completion', async (request_, response_) => {
  const {words} = request_.body;
  console.log(words);
  try {
    const _response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: words,
      temperature: 0.4,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!_response.data.choices[0].text) {
      console.log('_response.data.choices', _response.data.choices);
      // throw new Error('Failed to complete');
    }
    console.log(_response.data.choices);
    response_.status(200).send(_response.data.choices[0].text);
  } catch (e) {
    // console.log('error: => ', e);
    console.log('error!!!');
  }
});

app.post('/edit', async (request_, response_) => {
  console.log('request_.body', request_.body);
  const response = await openai.createEdit()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// async function completion() {
//   const _response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: "I am 30 years old",
//     temperature: 0.4,
//     max_tokens: 64,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//   });
//   console.log(_response.data.choices.length)
//   for (const _choice of _response.data.choices) {
//     console.log('_choice => ');
//     console.log(_choice);
//   }
// }
//
// completion();
