const Telegraf = require('telegraf');
const MongoDBConnection = require('../models/mongo_connection');
const nodeSchedule = require('node-schedule');
class LoggingTask{
    /**
     * 
     * @param {object} params 
     * @param {Telegraf} [params.bot]
     * @param {MongoDBConnection} [params.mongoDBConnection]
     */
    constructor(params) {
        this.bot = params.bot;
        this.mongoDBConnection = params.mongoDBConnection;
    }
    async init() {
        this.bot.command('log', async (ctx) => {
            let text = ctx.message.text;
            let log = text.split('/log')[1].trim();
            let timestamp = ctx.message.date;
            let detail = '';
            let telegramUserId = ctx.message.from.id;
            let taskLogModel = this.mongoDBConnection.exportTaskLogModel();
            await taskLogModel.create({
                userId: telegramUserId,
                timestamp: timestamp,
                content: log,
                detail: detail,
            });
        })
        let rule = new nodeSchedule.RecurrenceRule();
        rule.dayOfWeek = [1, 2, 3, 4, 5];
        rule.hour = [8,10,14,16,17];
        rule.minute = 30;
        // rule.hour = [17, 18, 19, 20, 21, 22, 23];
        // rule.minute = [10, 20, 30, 40, 50, 59];
        nodeSchedule.scheduleJob(rule, () => {
            this.loggingRemind();
        });
    }
    async loggingRemind() {
        let userModel = this.mongoDBConnection.exportUserModel();
        let users = await userModel.find({});
        for (const user of users) {
            let teleId = user.userId;
            this.bot.telegram.sendMessage(teleId, 'What are you doing?');
        }
    }
}
module.exports={
    LoggingTask,
};