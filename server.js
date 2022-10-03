const redis = require('redis');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const HTTP_PORT = 8080;

app.listen(HTTP_PORT, () => {
  console.log(`StopClop Backend running on port ${HTTP_PORT}`);
});

app.get('/data', (req, res) => {
  res.status(200).send('string data');
});

app.post('/test', (req, res) => {
  const password = '3relVJzJyVzsE6U/tJ2bBbQGpWI';
  const host = '51.15.234.81';
  const port = '6380';
  const client = redis.createClient({
    socket: {
      host,
      port,
    },
    password,
  });
  client.connect().then(async () => {
    await client.set('key', 'value');
  });
  console.log('HEY');
  res.status(200);
});

app.use(function (req, res) {
  res.status(404);
});
