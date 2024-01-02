import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveHeight } from '../../../utils/responsiveScale';
import { colors, fonts } from '../../../config/theme';
interface IProps {
    label?: string,
    selected: boolean,
    onSelect: () => void
}
const CustomRadioButton: React.FC<IProps> = ({ label, selected, onSelect }) => (
    <View style={styles.container}>
        <TouchableOpacity
            style={[styles.radioButton, selected && { borderColor: '#007BFF' }]}
            onPress={onSelect}
        >
            <View style={[styles.innerCircle, selected && { backgroundColor: '#007BFF', borderRadius: responsiveHeight(3) }]} />

        </TouchableOpacity>
        <Text style={styles.label}>{label}</Text>
    </View>

);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        columnGap: responsiveHeight(1),
        alignItems: 'center',
        // justifyContent:'center'
    },
    innerCircle: {
        height: responsiveHeight(1),
        width: responsiveHeight(1),

    },
    radioButton: {
        borderWidth: responsiveHeight(0.2),
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        height: responsiveHeight(2),
        width: responsiveHeight(2),
        borderRadius: responsiveHeight(2)
    },
    radioButtonText: {
        fontSize: 16,
    },
    label: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.black,
    }
});
export default CustomRadioButton