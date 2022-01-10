const { Telegraf } = require('telegraf');
const HttpsProxyAgent = require('https-proxy-agent')
const process = require('process');
const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { agent: new HttpsProxyAgent({host: process.env.PROXY_HOST, port: (+process.env.PROXY_PORT)}) }
});

// bot.use(async (ctx, next) => {
//   console.time(`Processing update ${ctx.update.update_id}`);
//   await next(); // runs next middleware
//   // runs after next middleware finishes
//   console.timeEnd(`Processing update ${ctx.update.update_id}`);
// });
bot.command('log', (ctx) => {
  ctx.reply('Hello');
})
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
