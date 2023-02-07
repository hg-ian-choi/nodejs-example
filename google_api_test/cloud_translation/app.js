require('dotenv').config();
const express = require('express');

const { TranslationServiceClient } = require('@google-cloud/translate');
// Instantiates a client
const translationClient = new TranslationServiceClient({
  keyFile: __dirname + '/key.json',
});

const app = express();
const port = 8089;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/translate', async (req_, res_) => {
  const _words = req_.body.words;

  const request = {
    parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
    contents: ['Hello, World!'],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'ko',
    targetLanguageCode: 'jp',
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function translate() {
  const request = {
    parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
    contents: ['Hello, World!'],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    // sourceLanguageCode: 'en',
    targetLanguageCode: 'ko',
  };
  
  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }
}

translate();
