import React from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {AppStyles} from './Styles';

function RoundButton({faName, onPress, style = null}) {
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
    );
}

export default RoundButton;

const styles = StyleSheet.create({
    buttonRound: {
        borderWidth: 1,
        borderColor: 'purple',
        justifyContent: 'center',
    }
});