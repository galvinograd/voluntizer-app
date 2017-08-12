import {Notifications, Permissions} from 'expo';
import {logEvent} from './Logger';
import {environment} from './Graphql';
import CreateDeviceMutation from './CreateDeviceMutation';

class PushNotificationsFacade {
    registerExpoToken = (expoToken) => {
        logEvent('push notifications', 'register - backend', 'attempt');
        CreateDeviceMutation(environment, expoToken);
    };

    askPermissions = async () => {
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
    };

    getExpoToken = async () => {
        if (!this.expoToken) {
            this.expoToken = await Notifications.getExpoPushTokenAsync();
        }
        return this.expoToken;
    };
}

export default new PushNotificationsFacade();