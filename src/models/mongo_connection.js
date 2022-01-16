const mongoose = require('mongoose');
const { EventEmitter } = require('events');
const process = require('process');
class MongoDBConnection extends EventEmitter {
  constructor() {
    super();
    this.mongodbHost = process.env.MONGO_HOST;
    this.mongodbPort = +process.env.MONGO_PORT;
    this.mongodbUser = process.env.MONGO_USER;
    this.mongodbPassword = process.env.MONGO_PASS;
    this.mongodbDatabase = process.env.MONGO_DATABASE;
    // this.initMongoDBConnection();
    this.connected = false;
  }

  initMongoDBConnection() {
    return new Promise((resolve, reject) => {
      const url = `mongodb://${(this.mongodbUser||this.mongodbPassword)?(this.mongodbUser+':'+this.mongodbPassword+'@'):''}${this.mongodbHost}:${this.mongodbPort}/${this.mongodbDatabase}`;
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // poolSize: 10,
        // useCreateIndex: true,
        autoIndex: false,
        // useFindAndModify: false,
      }).catch((err) => {
        console.error(`[MongoDB] Error: ${err}`);
        reject(err);
      });
      this.db = mongoose.connection;
      this.db.on('error', (err) => {
        console.error(`[MongoDB] Connection error: ${err}`);
        this.connected = false;
        this.emit('error', err);
      });
      this.db.on('open', () => {
        console.log(`[MongoDB] Connected to mongodb://${this.mongodbHost}:${this.mongodbPort}/${this.mongodbDatabase}`);
        this.connected = true;
        this.emit('open');
        resolve();
      });
    });
  }

  exportUserModel() {
    const userSchema = require('./schemas/user');
    const userModel = mongoose.model(`Users`, userSchema);
    return userModel;
  }

  exportTaskLogModel() {
    const taskLogSchema = require('./schemas/taskLog');
    const taskLogModel = mongoose.model(`TaskLogs`, taskLogSchema);
    return taskLogModel;
  }

  disconnect() {
    mongoose.disconnect();
  }
}

module.exports = new MongoDBConnection();
