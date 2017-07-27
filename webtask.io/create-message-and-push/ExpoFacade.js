import Expo from 'exponent-server-sdk';
import winston from 'winston';

export default class ExpoFacade {
    constructor(title, body, bodySize) {
        this.title = title;
        this.body = body;
        this.bodySize = bodySize;
        this.client = new Expo();
    }

    async push(tokens) {
        winston.info('building Expo push notification messages');
        const pushMessages = this._toPushMessages(tokens);

        winston.info('chunkify Expo push notification messages');
        const chunks = this.client.chunkPushNotifications(pushMessages);

        winston.info('sending chunks to Expo');
        const chunkPromises = chunks.map(this._pushChunk.bind(this));
        await Promise.all(chunkPromises);
    }

    async _pushChunk(chunk) {
        try {
            const data = await this.client.sendPushNotificationsAsync(chunk);
            for (let i in data) {
                const expoStatus = data[i]['status'];
                if (expoStatus !== 'ok') {
                    const expoTo = chunk[i]['to'];
                    const expoMessage = data[i]['message'];
                    const expoDetails = JSON.stringify(data[i]['details']);
                    winston.warn(
                        'token %s has status %s ("ok" expected). message: %s. details: %s',
                        expoTo,
                        expoStatus,
                        expoMessage,
                        expoDetails);
                }
            }
        } catch (error) {
            winston.warn(error);
        }
    }

    _toPushMessages(tokens) {
        winston.info('received tokens: %s', tokens.join(', '));
        let pushMessages = [];
        const body = this._truncateBody(this.body);
        for (let token of tokens) {
            if (Expo.isExpoPushToken(token)) {
                pushMessages.push({
                    to: token,
                    title: this.title,
                    body: body,
                    sound: 'default',
                });
            } else {
                winston.warn('%s is not an expo push token', token);
            }
        }
        return pushMessages;
    }

    _truncateBody(body) {
        if (body.length > this.bodySize) {
            return body.substring(0, this.bodySize) + '...';
        } else {
            return body;
        }
    };
}
