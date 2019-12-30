const { promisify } = require('util');
const fs = require('fs');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const config = require('../config/config.js');
const memoryFilePath = config.getMemoryFilePath();

class MemoryService {

  async writeFile(numberFromRequest) {
    const numberToStore = numberFromRequest || 0;

    const data = JSON.stringify({
      memory: numberToStore
    });

    try {
      await writeFileAsync(memoryFilePath, data)
      console.log(`Number ${numberToStore} stored in memory.`);
    } catch (err) {
      console.log('File Write Error');
      throw err;
    }
    return numberFromRequest ? { "success": true, "numberStored": numberToStore } : { "success": true, "message": "Memory reseted to 0!" };
  }

  async readFile() {

    try {
      const data = JSON.parse(await readFileAsync(memoryFilePath, 'utf-8'));
      console.log(`Number ${data.memory} read from memory.`);
      return data;
    } catch (err) {
      console.log('File Read Error');
      throw err;
    }
  }
};

module.exports = MemoryService;