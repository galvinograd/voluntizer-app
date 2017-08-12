// @flow
import React from 'react';
import {AppState, FlatList, StyleSheet, View} from 'react-native';
import {createRefetchContainer, graphql} from 'react-relay';
import MessagesItem from './MessagesItem';
import {lightGray} from './Styles';
import {logEvent, logTrace, wakeMeUp} from './Logger';
import UserAgentExtractor from './UserAgentExtractor';
import GAFacade from './GAFacade';
import PushNotificationsFacade from './PushNotificationsFacade';


class MessagesScreen extends React.Component {
    state = {
        refreshing: false
    };

    render() {
        return (
            <View>
                <UserAgentExtractor
                    onUserAgent={this._initGA}/>
                <FlatList
                    style={styles.container}
                    data={this.props.messages.allMessages.edges}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={MessagesScreen._renderSeparator}
                    keyExtractor={MessagesScreen._keyExtractor}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}/>
            </View>
        );
    }

    componentDidMount() {
        AppState.addEventListener('change', this._onAppStateActive);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._onAppStateActive);
    }

    _initGA = async(userAgent) => {
        try {
            logTrace(userAgent);
            const pn = PushNotificationsFacade;

            const expoToken = await pn.getExpoToken();
            logTrace(expoToken);

            GAFacade.init({
                userAgent: userAgent,
                clientId: expoToken || 'unregistered',
                appVersion: 1,
                bundleId: 'com.voluntizer',
            });

            if (!expoToken) {
                wakeMeUp('push notifications', 'expo token is empty');
                return;
            }

            pn.registerExpoToken(expoToken);

            const granted = await pn.askPermissions();
            if (!granted) {
                logEvent('push notifications', 'permissions not granted');
            }
        } catch (error) {
            wakeMeUp('push notifications', 'unexpected error', error);
        }
    };

    _onAppStateActive = (state) => {
        if (state === 'active') {
            logEvent('root', 'app opened');
            this._onRefresh();
        }
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
            logEvent('message list', 'refresh');
        }
        this.setState({refreshing: false});
    };

    _renderItem = ({item}) => {
        return <MessagesItem
            message={item.node}
            onPressItem={this._onPressItem}/>;
    };

    _onPressItem = (id: string) => {
        logEvent('message list', 'select message', id);
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
        backgroundColor: 'white',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        flex: 1,
        backgroundColor: lightGray
    }
});