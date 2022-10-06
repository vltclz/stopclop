const redis = require('redis');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const HTTP_PORT = 8080;
const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});
client.connect();

app.listen(HTTP_PORT, () => {
  console.log(`StopClop Backend running on port ${HTTP_PORT}`);
});

app.get('/data', (req, res) => {
  res.status(200).send('string data');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, entryKey } = req.body;
    const usersKeys = await client.keys('password.*');
    if (usersKeys.some((key) => `password.${username}` === key))
      return res.status(400).json();

    const validEntryKey = await client.get('entryKey');
    if (entryKey !== validEntryKey) return res.status(400).json();

    await client.set(`password.${username}`, password);
    const id = await client.xAdd(`stream.${username}`, '*', ['']);
    await client.xDel(`stream.${username}`, id);

    return res.status(204).json();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userPassword = await client.get(`password.${username}`);
    if (password !== userPassword) return res.status(400).json();

    return res.status(204).json();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

app.get('/:username/stream', async (req, res) => {
  try {
    const userToken = await client.get(`password.${req.params.username}`);
    if (!userToken) return res.status(400).json();
    if (userToken !== req.headers.authorization) return res.status(403).json();

    const stream = await client.xRange(
      `stream.${req.params.username}`,
      '-',
      '+'
    );
    return res.status(200).json(stream);
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

app.post('/:username/stream/:type', async (req, res) => {
  try {
    const userToken = await client.get(`password.${req.params.username}`);
    if (!userToken) return res.status(400).json();
    if (userToken !== req.headers.authorization) return res.status(403).json();

    await client.xAdd(`stream.${req.params.username}`, '*', {
      type: req.params.type,
    });
    const stream = await client.xRange(
      `stream.${req.params.username}`,
      '-',
      '+'
    );
    return res.status(200).json(stream);
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

app.use(function (req, res) {
  res.status(404);
});
