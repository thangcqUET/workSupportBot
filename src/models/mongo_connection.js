const { mongodb } = require('config');
const mongoose = require('mongoose');
const { EventEmitter } = require('events');

class MongoDBConnection extends EventEmitter {
  constructor() {
    super();
    this.mongodb_host = process.env.MONGO_HOST;
    this.mongodb_port = +process.env.MONGO_PORT;
    this.mongodb_user = process.env.MONGO_USER;
    this.mongodb_password = process.env.MONGO_PASS;
    this.mongodb_database = process.env.MONGO_DATABASE;
    // this.initMongoDBConnection();
    this.connected = false;
  }

  initMongoDBConnection() {
    return new Promise((resolve, reject) => {
      const url = `mongodb://${this.mongodb_host}:${this.mongodb_port}/${this.mongodb_database}`;
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10,
        useCreateIndex: true,
        autoIndex: false,
        useFindAndModify: false,
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
        console.log(`[MongoDB] Connected to mongodb://${this.mongodb_host}:${this.mongodb_port}/${this.mongodb_database}`);
        this.connected = true;
        this.emit('open');
        resolve();
      });
    });
  }

  exportUserModel(userId) {
    const userSchema = require('./schemas/user');
    userSchema.path('events').ref(`${chn_id}_event`);
    const file_model = mongoose.model(`${chn_id}_mediafile`, file_schema);
    // file_model.createIndexes();
    return file_model;
  }

  exportEventModel(chn_id) {
    const event_schema = require('./schemas/events_schema');
    event_schema.path('files').ref(`${chn_id}_mediafile`);
    const event_model = mongoose.model(`${chn_id}_event`, event_schema);
    // event_model.createIndexes();
    return event_model;
  }

  disconnect() {
    mongoose.disconnect();
  }
}

module.exports = new MongoDBConnection();
