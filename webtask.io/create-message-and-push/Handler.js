import winston from 'winston';
import ExpoFacade from './ExpoFacade';
import ScapholdFacade from './ScapholdFacade';

async function main(ctx, cb) {
    try {
        winston.info('processing request');
        let messageTitle = ctx.body['changedMessage']['title'];
        let messageText = ctx.body['changedMessage']['text'];

        let username = ctx.secrets.username;
        let password = ctx.secrets.password;

        winston.info('messageTitle: %s', messageTitle);
        winston.info('messageText: %s', messageText);

        const scapholdFacade = new ScapholdFacade(username, password);
        const tokens = await scapholdFacade.getTokens();

        const expoFacade = new ExpoFacade(messageTitle, messageText, 50);
        await expoFacade.push(tokens);

        winston.info('finished transaction successfully');
        cb(null, {'status': 'ok'});
    } catch (error) {
        winston.error('something went wrong');
        cb(error);
    }

}

module.exports = main;
