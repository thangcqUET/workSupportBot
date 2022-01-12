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
  bot.start(async (ctx)=>{
    // add non-exist user
    let telegramUserId = ctx.message.from.id;
    let name = ctx.message.from.last_name+' '+ctx.message.from.first_name;
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
    if(res.lastErrorObject.updatedExisting){
      ctx.reply('Your account already exists');
    }else{
      ctx.reply('Sign Up Success')
    }
  })
  bot.command('log', async (ctx) => {
    let text = ctx.message.text;
    let log = text.split('/log')[1].trim();
    let timestamp = ctx.message.date;
    let detail = '';
    let telegramUserId = ctx.message.from.id;
    let taskLogModel = mongoDBConnection.exportTaskLogModel();
    await taskLogModel.create({
      userId:telegramUserId,
      timestamp: timestamp,
      content: log,
      detail: detail,
    });
  })
  bot.launch();
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}).call();
