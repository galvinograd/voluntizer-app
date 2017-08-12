import GAFacade from './GAFacade';

function logTrace(component, message, arg) {
    // eslint-disable-next-line no-console
    console.log(_formatMessage(component, message, arg));
}

function logEvent(component, message, arg) {
    GAFacade.sendEvent({
        category: `${component} - ${message}`,
        action: 'logEvent',
        label: JSON.stringify(arg),
    });
    // eslint-disable-next-line no-console
    console.log(_formatMessage(component, message, arg));
}

function thisShouldNotHappen(component, message, arg) {
    GAFacade.sendEvent({
        category: `${component} - ${message}`,
        action: 'thisShouldNotHappen',
        label: JSON.stringify(arg),
    });
    // eslint-disable-next-line no-console
    console.warn(_formatMessage(component, message, arg));
}

function wakeMeUp(component, message, arg) {
    GAFacade.sendEvent({
        category: `${component} - ${message}`,
        action: 'wakeMeUp',
        label: JSON.stringify(arg),
    });
    // eslint-disable-next-line no-console
    console.warn(_formatMessage(component, message, arg));
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
    logEvent,
    thisShouldNotHappen,
    wakeMeUp
};
