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
    host: process.env.HOST,
    port: process.env.PORT,
  },
  password: process.env.PASSWORD,
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

app.use(function (req, res) {
  res.status(404);
});
