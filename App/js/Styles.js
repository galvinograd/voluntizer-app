import {StyleSheet} from 'react-native';

const unitSpace = 4;
const unit = 12;
const lightGray = '#9b9b9b';

const AppStyles = StyleSheet.create({
    bigFont: {
        fontSize: 16,
        lineHeight: 16,
    },
    smallFont: {
        fontSize: 14,
        lineHeight: 15,
    },
    nonImportantFont: {
        color: lightGray
    },
    smallCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
});

export {
    AppStyles,
    lightGray,
    unit,
    unitSpace,
};