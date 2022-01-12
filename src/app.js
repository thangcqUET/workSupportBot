const { Telegraf } = require('telegraf');
const nodeSchedule = require('node-schedule');
const HttpsProxyAgent = require('https-proxy-agent')
const process = require('process');
const mongoDBConnection = require('./models/mongo_connection');
(async () => {
  await mongoDBConnection.initMongoDBConnection();
  const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
      agent: (process.env.PROXY_HOST && (+process.env.PROXY_PORT)) ? new HttpsProxyAgent({
        host: process.env.PROXY_HOST || '',
        port: (+process.env.PROXY_PORT) || '',
      }) : null,
    },
  });
  bot.start(async (ctx) => {
    // add non-exist user
    let telegramUserId = ctx.message.from.id;
    let name = ctx.message.from.last_name + ' ' + ctx.message.from.first_name;
    let username = ctx.message.from.username;
    let userModel = mongoDBConnection.exportUserModel();
    let query = {
      userId: telegramUserId
    };
    let update = {
      userId: telegramUserId,
      name: name,
      username: username,
    };
    let options = { upsert: true, new: true, rawResult: true };
    let res = await userModel.findOneAndUpdate(query, update, options);
    if (res.lastErrorObject.updatedExisting) {
      ctx.reply('Your account already exists');
    } else {
      ctx.reply('Sign Up Success');
    }
  })
  bot.command('stop',async (ctx) => {
    let telegramUserId = ctx.message.from.id;
    let userModel = mongoDBConnection.exportUserModel();
    let query = {
      userId: telegramUserId
    };
    await userModel.findOneAndRemove(query);
    ctx.reply('Remove account');
  })
  bot.command('log', async (ctx) => {
    let text = ctx.message.text;
    let log = text.split('/log')[1].trim();
    let timestamp = ctx.message.date;
    let detail = '';
    let telegramUserId = ctx.message.from.id;
    let taskLogModel = mongoDBConnection.exportTaskLogModel();
    await taskLogModel.create({
      userId: telegramUserId,
      timestamp: timestamp,
      content: log,
      detail: detail,
    });
  })
  let rule = new nodeSchedule.RecurrenceRule();
  rule.dayOfWeek = [1,2,3,4,5];
  rule.hour = [17,18,19,20,21,22,23];
  // rule.hour = [8,10,14,16,17];
  // rule.minute = 30;
  rule.minute = [10,20,30,40,50,59];
  let rule2 = new nodeSchedule.RecurrenceRule();
  rule2.dayOfWeek = [1,2,3,4,5];
  rule2.hour = [17,18,19,20,21,22,23];
  // rule.hour = [8,10,14,16,17];
  // rule.minute = 30;
  rule2.minute = [5,15,25,35,45,55];
  nodeSchedule.scheduleJob(rule, ()=>{
    loggingRemind(bot);
  });
  bot.launch();
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}).call();

/**
 * 
 * @param {Telegraf} bot 
 */
async function loggingRemind(bot) {
  let userModel = mongoDBConnection.exportUserModel();
  let users = await userModel.find({});
  for (const user of users) {
    let teleId = user.userId;
    bot.telegram.sendMessage(teleId,'What are you doing?');
  }
}
