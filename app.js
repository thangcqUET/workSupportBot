const { Telegraf } = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent')
const process = require('process');
const mongoDBConnection = require('./src/models/mongo_connection');
mongoDBConnection.initMongoDBConnection();
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
bot.command('log', (ctx) => {
  let text = ctx.message.text;
  let log = text.split('/log')[1].trim();
  let timestamp = ctx.message.date;
  let detail = '';
  let telegramUserId = ctx.message.from.id;
})
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
