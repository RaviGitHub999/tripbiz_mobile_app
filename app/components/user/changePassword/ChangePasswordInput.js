import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../../config/theme';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';

const ChangePasswordInput = ({ placeholderName, stateValue, handleonChange,handleBlur,customStyles,secure}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleonBlur = () => {
        // console.log(stateValue,"ikuy")
        setIsFocused(false);
        handleBlur&&handleBlur(stateValue)
    };
    return (
        <TextInput
            placeholder={placeholderName}
            value={stateValue}
            onChangeText={(e)=>handleonChange(e)}
            style={[
                styles.input,
                { borderWidth: isFocused ? responsiveHeight(0.2) : responsiveHeight(0.13),borderRadius:isFocused? responsiveHeight(1):responsiveHeight(1)},{...customStyles}]}
            onFocus={handleFocus}
            onBlur={handleonBlur}
            secureTextEntry={secure&&secure}
        />
    )
}
const styles = StyleSheet.create({

    input: {
        paddingHorizontal: responsiveWidth(3),
        height: responsiveHeight(5),
        fontSize:responsiveHeight(1.8) 
    },
})
export default ChangePasswordInput