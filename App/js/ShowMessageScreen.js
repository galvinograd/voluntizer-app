import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {phonecall, text} from 'react-native-communications';
import RoundButton from './RoundButton';
import {AppStyles, lightGray, unit, unitSpace} from './Styles';
import {logAction, logScreen} from './Logger';


export default class ShowMessagesScreen extends React.Component {
    render() {
        const {params} = this.props.navigation.state;

        const _onCallPress = () => {
            logAction('message screen', 'call button', params.id);
            phonecall(params.owner.mobile, false);
        };

        const _onMessagePress = () => {
            logAction('message screen', 'text button', params.id);
            text(params.owner.mobile, 'אני אשמח להצטרף! אפשר לשמוע עוד פרטים?');
        };

        return (
            <ScrollView style={styles.container}>
                <Text style={[styles.text, AppStyles.bigFont]}>{params.text}</Text>
                <View style={styles.contactRow}>
                    <RoundButton onPress={_onCallPress} faName="phone"/>
                    <RoundButton onPress={_onMessagePress} faName="comments" style={{marginRight: unit}}/>
                    <View style={styles.body}>
                        <Text
                            style={[styles.bodySender, AppStyles.smallFont]}>{params.owner.firstName} {params.owner.lastName}</Text>
                        <Text style={[styles.bodyDescription, AppStyles.bigFont]}>{params.owner.mobile}</Text>
                    </View>
                    <Image style={[styles.image, AppStyles.smallCircle]} source={{uri: params.owner.profileUrl}}/>
                </View>
            </ScrollView>
        );
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        logScreen('ShowMessageScreen', params.id);
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    image: {
        marginRight: unit,
        alignSelf: 'center',
    },
    body: {
        flexGrow: 1,
    },
    bodySender: {
        textAlign: 'left',
        marginBottom: unitSpace,
    },
    text: {
        textAlign: 'left',
        padding: unit,
        marginTop: unit / 2
    },
    bodyDescription: {
        textAlign: 'left',
    },
    contactRow: {
        marginTop: unit,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: lightGray,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: lightGray,
        padding: unit,
        flexDirection: 'row-reverse',
        flex: 1,
        alignItems: 'center',
    },
    contactDetails: {
        alignSelf: 'stretch',
    }
});
