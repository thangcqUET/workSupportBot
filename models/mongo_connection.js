'use strict'
const { mongodb } = require('config');
const mongoose = require('mongoose');
const { EventEmitter } = require('events');

class MongoDBConnection extends EventEmitter {
    constructor(options) {
        super();
        this.mongodb_host = mongodb.host;
        this.mongodb_port = parseInt(mongodb.port);
        this.mongodb_user = mongodb.user;
        this.mongodb_password = mongodb.password;
        this.mongodb_database = mongodb.database;
        // this.initMongoDBConnection();
        this.connected = false;
    }

    initMongoDBConnection() {
        return new Promise((resolve, reject) => {
            let url = `mongodb://${this.mongodb_host}:${this.mongodb_port}/${this.mongodb_database}`;
            mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                poolSize: 10,
                useCreateIndex: true,
                autoIndex: false,
                useFindAndModify: false,
            }).catch(err => {
                logger.error(`[MongoDB] Error: ${err}`);
                reject(err);
            })
            this.db = mongoose.connection;
            this.db.on('error', err => {
                logger.error(`[MongoDB] Connection error: ${err}`);
                this.connected = false;
                this.emit('error', err);
            });
            this.db.on('open', err => {
                logger.info(`[MongoDB] Connected to mongodb://${this.mongodb_host}:${this.mongodb_port}/${this.mongodb_database}`);
                this.connected = true;
                this.emit('open');
                resolve();
            });
        })
    }

    exportUserModel(userId) {
        const userSchema = require('./schemas/user');
        file_schema.path('events').ref(`${chn_id}_event`);
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