import React from 'react';
import {Notifications, Permissions} from 'expo';

async function registerExpoToken() {
    const {existingStatus} = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const {status} = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        // return finalStatus;
        console.log(finalStatus);
    }

    return await Notifications.getExponentPushTokenAsync();
}

export {
    registerExpoToken
};