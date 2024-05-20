import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { colors } from '../../../config/theme';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';

const TripDetailsInput = ({placeholderName,stateValue,handleonChange, isEditable}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };


  return ( 
          <TextInput 
            placeholder={placeholderName} 
            value={stateValue} 
            onChangeText={(e) =>handleonChange(e)} 
            style={[
              styles.input,
              { borderWidth: isFocused ? responsiveHeight(0.15) : 0 }
            ]}
            onFocus={handleFocus} 
            onBlur={handleBlur} 
            editable={isEditable?false:true}
          />
  );
};

const styles = StyleSheet.create({

  input: {
    backgroundColor: colors.white,
    borderRadius: responsiveHeight(1),
    elevation: 4,
    paddingHorizontal: responsiveWidth(3),
    // height:responsiveHeight(5),
  },
});

export default TripDetailsInput;
