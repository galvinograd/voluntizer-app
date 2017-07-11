import React from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {AppStyles} from './Styles';

export default function ({faName, onPress, style = null}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.buttonRound, AppStyles.smallCircle, style]}>
                <FontAwesome
                    name={faName}
                    color='purple'
                    style={{alignSelf: 'center'}}
                    size={15}/>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    buttonRound: {
        borderWidth: 1,
        borderColor: 'purple',
        justifyContent: 'center',
    }
});