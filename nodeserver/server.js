const express = require('express');
const cors = require('cors');
let memory = require('./api/memory');

const config = require('./config/config.js');
const port = config.getPort();

const server = express();
server.use(express.json());
server.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

// server.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });

server.route("/writeMemory")
  .post(memory.postNumber)
  .put(memory.resetMemory);

server.route("/readMemory")
  .get(memory.getNumber);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = server;