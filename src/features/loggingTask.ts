import {Feature} from './feature';

class LoggingTask implements Feature{
    constructor(params){
        let bot = params.bot;
        let mongoDBConnection = params.mongoDBConnection;
    }
    init: () => {
        
    };
}