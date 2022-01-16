class SignUp{
    constructor(params) {
        this.bot = params.bot;
        this.mongoDBConnection = params.mongoDBConnection;
    }
    async init() {
        this.bot.start(async (ctx) => {
            // add non-exist user
            let telegramUserId = ctx.message.from.id;
            let name = ctx.message.from.last_name + ' ' + ctx.message.from.first_name;
            let username = ctx.message.from.username;
            let userModel = this.mongoDBConnection.exportUserModel();
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
        this.bot.command('stop', async (ctx) => {
            let telegramUserId = ctx.message.from.id;
            let userModel = this.mongoDBConnection.exportUserModel();
            let query = {
                userId: telegramUserId
            };
            await userModel.findOneAndRemove(query);
            ctx.reply('Remove account');
        })
    }
}
module.exports={
    SignUp,
}