import {Notifications, Permissions} from 'expo';
import {logEvent, wakeMeUp} from './Logger';
import {environment} from './Graphql';
import CreateDeviceMutation from './CreateDeviceMutation';

async function registerExpoToken() {
    try {
        const granted = await askPermissions();
        if (!granted) {
            logEvent('push notifications', 'permissions not granted');
            return;
        }

        const expoToken = await getExpoToken();
        if (!expoToken) {
            wakeMeUp('push notifications', 'expo token is empty');
            return;
        }

        CreateDeviceMutation(environment, expoToken);
    } catch (err) {
        wakeMeUp('push notifications', 'unexpected', err);
    }
}

async function askPermissions() {
    const {existingStatus} = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
    let finalStatus = existingStatus;

    logEvent('push notifications', 'existing permissions', existingStatus);

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const {status} = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
        finalStatus = status;

        logEvent('push notifications', 'asked permissions', status);
    }

    return finalStatus === 'granted';
}

async function getExpoToken() {
    return await Notifications.getExpoPushTokenAsync();
}

export {
    registerExpoToken,
    getExpoToken,
    askPermissions
};