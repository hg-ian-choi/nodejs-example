require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {TranslationServiceClient} = require('@google-cloud/translate');
// Instantiates a client
const translationClient = new TranslationServiceClient({
  keyFile: __dirname + '/key.json',
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
const port = 8089;

app.get('/', (request_, response_) => {
  response_.sendfile(__dirname + '/index.html');
});

app.post('/detect', async (request_, response_) => {
  const { words } = request_.body;

  const request = {
    parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
    content: words,
  };

  // Run request
  const [response] = await translationClient.detectLanguage(request);

  console.log('Detected Languages:');
  for (const language of response.languages) {
    console.log(`Language Code: ${language.languageCode}`);
    console.log(`Confidence: ${language.confidence}`);
  }
  if (!response.languages[0].languageCode) {
    throw new Error('Failed to detect');
  }
  response_.status(200).send(response.languages[0].languageCode);
});

app.post('/translate', async (request_, response_) => {
  const {words, lang} = request_.body;

  const request = {
    parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
    contents: [words],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    // sourceLanguageCode: 'ko',
    targetLanguageCode: lang,
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }

  if (!response.translations[0].translatedText) {
    throw new Error('Fail to translate');
  }
  response_.status(200).send(response.translations[0].translatedText);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// async function translate() {
//   const request = {
//     parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
//     contents: ['Hello, World!'],
//     mimeType: 'text/plain', // mime types: text/plain, text/html
//     // sourceLanguageCode: 'en',
//     targetLanguageCode: 'ko',
//   };
//
//   // Run request
//   const [response] = await translationClient.translateText(request);
//
//   for (const translation of response.translations) {
//     console.log(`Translation: ${translation.translatedText}`);
//   }
// }
//
// translate();
