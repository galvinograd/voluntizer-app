import {Analytics, Hits} from 'react-native-google-analytics';

class GAFacade {
    init = ({userAgent, clientId, appVersion, bundleId}) => {
        this.appVersion = appVersion;
        this.bundleId = bundleId;
        this.ga = new Analytics('UA-104115697-1', clientId, this.appVersion, userAgent);
    };

    sendScreenView = async({screenName}) => {
        const view = Hits.ScreenView(
            this.appName,
            screenName,
            this.appVersion,
            this.bundleId,
        );
        await this.ga.send(view);
    };

    sendEvent = async({category, action, label, value, experiment}) => {
        const event = new Hits.Event(category, action, label, value, experiment);
        await this.ga.send(event);
    };
}

export default new GAFacade();