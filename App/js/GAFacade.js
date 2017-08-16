import {Analytics, Hits} from 'react-native-google-analytics';
import {GOOGLE_ANALYTICS_ID} from './Config';

class GAFacade {
    init = ({userAgent, clientId, appVersion, bundleId}) => {
        this.appVersion = appVersion;
        this.bundleId = bundleId;
        this.ga = new Analytics(GOOGLE_ANALYTICS_ID, clientId, this.appVersion, userAgent);
    };

    sendScreenView = async({screenName}) => {
        const view = Hits.ScreenView(
            this.bundleId,
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