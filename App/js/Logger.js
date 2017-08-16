import GAFacade from './GAFacade';

function logTrace(component, message, arg) {
    _baseLog({component, message, arg});
}

function logCodeEvent(component, message, arg) {
    _baseLog({component, message, arg, remoteAction: 'logCodeEvent'});
}

function logAction(component, message, arg) {
    _baseLog({component, message, arg, remoteAction: 'logAction'});
}

function logScreen(screenName, arg) {
    _baseScreen({screenName, arg});
}

function thisShouldNotHappen(component, message, arg) {
    _baseLog({component, message, arg, localWarn: true, remoteAction: 'thisShouldNotHappen'});
}

function wakeMeUp(component, message, arg) {
    _baseLog({component, message, arg, localWarn: true, remoteAction: 'wakeMeUp'});
}

function _baseScreen({screenName, arg = null}) {
    // disabled, for some reason sendScreenView does not appear in Google Analytics
    /*
    if (arg) {
        GAFacade.sendScreenView({screenName: `${screenName} - ${JSON.stringify(arg)}`});
    } else {
        GAFacade.sendScreenView({screenName});
    }
    */

    // eslint-disable-next-line no-console
    console.log(_formatMessage('view screen', screenName, arg));
}

function _baseLog({component, message, arg = null, localWarn = false, remoteAction = null}) {
    if (remoteAction) {
        GAFacade.sendEvent({
            category: `${component} - ${message}`,
            action: remoteAction,
            label: JSON.stringify(arg),
        });
    }

    // eslint-disable-next-line no-console
    const consoleFunc = localWarn ? console.warn : console.log;
    consoleFunc(_formatMessage(component, message, arg));
}

function _formatMessage(component, message, arg) {
    if (arg === undefined) {
        return `${component}: ${message}`;
    } else {
        return `${component}: ${message} (arg: ${JSON.stringify(arg)})`;
    }
}

export {
    logTrace,
    logCodeEvent,
    logAction,
    logScreen,
    thisShouldNotHappen,
    wakeMeUp
};