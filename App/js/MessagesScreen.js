// @flow
import React from 'react';
import {AppState, FlatList, StyleSheet, View, Picker} from 'react-native';
import {createRefetchContainer, graphql} from 'react-relay';
import MessagesItem from './MessagesItem';
import {lightGray} from './Styles';
import {logEvent, wakeMeUp} from './Logger';


class MessagesScreen extends React.Component {
    state = {
        refreshing: false
    };

    render() {
        console.log(this.props.messages.allMessages.edges[0].node.text||'NULL');
        console.log(`Render: state:${JSON.stringify(this.state)}`);

        return (
            <View>
                <FlatList
                style={styles.container}
                data={this.props.messages.allMessages.edges.filter(item=>(!this.state.region || item.node.text.indexOf(this.state.region)!==-1))}
                renderItem={this._renderItem}
                ItemSeparatorComponent={MessagesScreen._renderSeparator}
                keyExtractor={MessagesScreen._keyExtractor}
                onRefresh={this._onRefresh}
                refreshing={this.state.refreshing}/>
                 <Picker
                    selectedValue={this.state.region}
                    onValueChange={(itemValue, itemIndex) => {console.log(`State change. val=${itemValue}, indx=${itemIndex}`);this.setState({region: itemValue});}}>
                        <Picker.Item label="כל הארץ" value="" />
                        <Picker.Item label="תל-אביב" value="telaviv" />
                        <Picker.Item label="ירושלים" value="jerusalem" />
                        <Picker.Item label="באר-שבע" value="beersheva" />
                        <Picker.Item label="חיפה" value="haifa" />
                </Picker>
            </View>
        );
    }

    componentDidMount() {
        AppState.addEventListener('change', this._onAppStateActive);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._onAppStateActive);
    }

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