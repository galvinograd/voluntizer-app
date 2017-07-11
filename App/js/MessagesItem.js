import React from 'react';
import {Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {AppStyles, unit, unitSpace} from './Styles';


export default class MessagesItem extends React.Component {
    render() {
        parsedDate = new Date(this.props.message.createdAt);
        return (
            <TouchableWithoutFeedback
                onPress={this._onPress}>
                <View
                    style={styles.container}>
                    <Image
                        style={[styles.image, AppStyles.smallCircle]}
                        source={{uri: this.props.message.owner.profileUrl}}/>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={[styles.headerTitle, AppStyles.bigFont]}>{this.props.message.title}</Text>
                            <Text style={[AppStyles.nonImportantFont, AppStyles.smallFont]}>{parsedDate.toLocaleDateString('en-US-u-ca-iso8601')}</Text>
                        </View>
                        <View style={styles.body}>
                            <Text style={[styles.bodySender, AppStyles.smallFont]}>{this.props.message.owner.firstName} {this.props.message.owner.lastName}</Text>
                            <Text style={[styles.bodyDescription, AppStyles.smallFont, AppStyles.nonImportantFont]} numberOfLines={2}>{this.props.message.text}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _onPress = () => {
        this.props.onPressItem(this.props.message.id);
    };
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: unit,
    },
    image: {
        marginRight: unit,
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: {
        marginBottom: unitSpace,
    },
    unread: {
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
    },
    bodySender: {
        textAlign: 'left',
        marginBottom: unitSpace,
    },
    bodyDescription: {
        textAlign: 'left',
        paddingRight: unit,
    }
});