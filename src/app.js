const { Telegraf } = require('telegraf');
const nodeSchedule = require('node-schedule');
const HttpsProxyAgent = require('https-proxy-agent')
const process = require('process');
const mongoDBConnection = require('./models/mongo_connection');
const SignUp = require('./features/signup').SignUp;
const LoggingTask = require('./features/loggingTask').LoggingTask;
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
  let signUp = new SignUp({
    bot: bot,
    mongoDBConnection: mongoDBConnection,
  });
  let loggingTask = new LoggingTask({
    bot: bot,
    mongoDBConnection: mongoDBConnection,
  })
  await signUp.init();
  await loggingTask.init();
  bot.launch();
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}).call(0);
