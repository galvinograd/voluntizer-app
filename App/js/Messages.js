import React from 'react';
import {ActivityIndicator, Platform, StatusBar, Text} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {graphql, QueryRenderer} from 'react-relay';
import {environment} from './Graphql';
import ShowMessagesScreen from './ShowMessageScreen';
import MessagesScreen from './MessagesScreen';
import {registerExpoToken} from './PushNotifications';
import CreateDeviceMutation from './CreateDeviceMutation';

class MessagesScreenWithQuery extends React.Component {
    render() {
        return (
            <QueryRenderer
                environment={environment}
                query={
                    graphql`
                query MessagesQuery {
                    viewer {
                        ...MessagesScreen_messages
                    }
                }
            `
                }
                variables={{}}
                render={
                    ({error, props}) => {
                        if (props) {
                            return <MessagesScreen messages={props.viewer} navigation={this.props.navigation}/>
                        } else if (error) {
                            return <Text>{error.message}</Text>;
                        } else {
                            return <ActivityIndicator style={{marginTop: 32}} size="large" color="black"/>;
                        }
                    }
                }
            />
        );
    }

    componentDidMount() {
        registerExpoToken()
            .then((expoToken) => {
                console.log(expoToken);
                let x = CreateDeviceMutation(environment, expoToken);
                console.log(x);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}

export default StackNavigator({
        MessageList: {
            screen: MessagesScreenWithQuery,
            navigationOptions: {
                title: 'הודעות',
                headerBackTitle: ' ',
                headerTintColor: 'purple',
                headerTitleStyle: {color: 'black'}
            }
        },
        Message: {
            screen: ShowMessagesScreen,
            navigationOptions: ({
                                    navigation
                                }) =>
                ({
                    title: navigation.state.params.title,
                    headerTintColor: 'purple',
                    headerTitleStyle: {color: 'black'}
                }),
        },
    },
    {
        cardStyle: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
        }
    }
);
