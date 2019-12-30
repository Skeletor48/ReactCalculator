const config = require('./config.json');
const environment = process.env.NODE_ENV || 'default';
const environmentConfig = config[environment];

function getPort(){
  return environmentConfig.http.port;
}

function getMemoryFilePath(){
  return environmentConfig.memoryFile;
}


module.exports = {getPort,getMemoryFilePath}