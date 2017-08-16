// @flow
import React from 'react';
import {AppState, FlatList, StyleSheet, View} from 'react-native';
import {createRefetchContainer, graphql} from 'react-relay';
import MessagesItem from './MessagesItem';
import {lightGray} from './Styles';
import {logAction, logCodeEvent, logTrace, wakeMeUp} from './Logger';
import UserAgentExtractor from './UserAgentExtractor';
import GAFacade from './GAFacade';
import PushNotificationsFacade from './PushNotificationsFacade';
import {APP_VERSION, BUNDLE_ID} from './Config';


class MessagesScreen extends React.Component {
    state = {
        refreshing: false
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.messageFlatList}
                    data={this.props.messages.allMessages.edges}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={MessagesScreen._renderSeparator}
                    keyExtractor={MessagesScreen._keyExtractor}
                    onRefresh={this._onRefreshPull}
                    refreshing={this.state.refreshing}/>
                <UserAgentExtractor
                    onUserAgent={this._initGA}/>
            </View>
        );
    }

    componentDidMount() {
        AppState.addEventListener('change', this._onAppStateActive);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._onAppStateActive);
    }

    _initGA = async (userAgent) => {
        try {
            logTrace(userAgent);
            const pn = PushNotificationsFacade;

            const expoToken = await pn.getExpoToken();
            logTrace(expoToken);

            GAFacade.init({
                userAgent: userAgent,
                clientId: expoToken || 'unregistered',
                appVersion: APP_VERSION,
                bundleId: BUNDLE_ID,
            });

            if (!expoToken) {
                wakeMeUp('push notifications', 'expo token is empty');
                return;
            }

            pn.registerExpoToken(expoToken);

            const granted = await pn.askPermissions();
            if (!granted) {
                logCodeEvent('push notifications', 'permissions not granted');
            }
        } catch (error) {
            wakeMeUp('push notifications', 'unexpected error', error);
        }
    };

    _onAppStateActive = (state) => {
        if (state === 'active') {
            logAction('root', 'app opened');
            this._onRefresh();
        }
    };

    _onRefreshPull = () => {
        logAction('message list', 'pull to refresh');
        this._onRefresh();
    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.props.relay.refetch(
            null,
            null,
            this._onRefreshFinished,
            {force: true},
        );
    };

    _onRefreshFinished = (error) => {
        if (error) {
            wakeMeUp('message list', 'refresh failed', error);
        } else {
            logCodeEvent('message list', 'refresh successfully');
        }
        this.setState({refreshing: false});
    };

    _renderItem = ({item}) => {
        return <MessagesItem
            message={item.node}
            onPressItem={this._onPressItem}/>;
    };

    _onPressItem = (id: string) => {
        logAction('message list', 'select message', id);
        this.props.navigation.navigate('Message', this._findMessage(id));
    };

    _findMessage = (id) => {
        return this.props.messages.allMessages.edges.find(n => n.node.id === id).node;
    };

    static _renderSeparator() {
        return <View style={styles.separator}/>;
    }

    // eslint-disable-next-line no-unused-vars
    static _keyExtractor(item, index) {
        return item.node.id;
    }
}


export default createRefetchContainer(MessagesScreen,
    {
        messages: graphql`
            fragment MessagesScreen_messages on Viewer {
                allMessages {
                    edges {
                        node {
                            id,
                            createdAt,
                            title,
                            text,
                            owner {
                                profileUrl,
                                firstName,
                                lastName,
                                mobile
                            }
                        }
                    }
                }
            }
        `
    },
    graphql.experimental`
        query MessagesScreenRefetchQuery {
            viewer {
                ...MessagesScreen_messages
            }
        }
    `
);


const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    messageFlatList: {
        backgroundColor: 'white',
        height: '100%',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        flex: 1,
        backgroundColor: lightGray
    }
});