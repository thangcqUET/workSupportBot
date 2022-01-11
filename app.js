const { Telegraf } = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent')
const process = require('process');
const mongoDBConnection = require('./src/models/mongo_connection');
(async ()=>{
  await mongoDBConnection.initMongoDBConnection();
  const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
      agent: (process.env.PROXY_HOST && (+process.env.PROXY_PORT)) ? new HttpsProxyAgent({
        host: process.env.PROXY_HOST || '',
        port: (+process.env.PROXY_PORT) || '',
      }) : null,
    },
  });
  
  // bot.use(async (ctx, next) => {
  //   console.time(`Processing update ${ctx.update.update_id}`);
  //   await next(); // runs next middleware
  //   // runs after next middleware finishes
  //   console.timeEnd(`Processing update ${ctx.update.update_id}`);
  // });
  bot.start((ctx)=>{
    // add non-exist user
    ctx.reply('add non-exist user');
    let telegramUserId = ctx.message.from.id;
    let name = ctx.message.from.last_name+' '+ctx.message.from.first_name;
    let username = ctx.message.from.username;
    let userModel = mongoDBConnection.exportUserModel();
    let query = {};
    let update = {
      userId: telegramUserId,
      name: name,
      username: username,
    };
    let options = { upsert: false, new: true, setDefaultsOnInsert: true };
    userModel.findOneAndUpdate(query, update, options, (error, data)=>{
      console.log(error);
      console.log(data);
    });
  })
  bot.command('log', (ctx) => {
    let text = ctx.message.text;
    let log = text.split('/log')[1].trim();
    let timestamp = ctx.message.date;
    let detail = '';
    let telegramUserId = ctx.message.from.id;
    let taskLogModel = mongoDBConnection.exportTaskLogModel();
    taskLogModel.create({
      userId:telegramUserId,
      timestamp: timestamp,
      content: log,
      detail: detail,
    });
  })
  bot.on('new_chat_participant', function(message) {
    // 'message' is a Telegram Message
  
    // 'user' below is a Telegram User
    const user = message['new_chat_participant'];
    console.log(user);
  });
  
  
  bot.on('left_chat_participant', function(message) {
    // 'message' is a Telegram Message
  
    // 'user' below is a Telegram User
    const user = message['left_chat_participant'];
    console.log(user);
  });
  bot.launch();
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}).call();
