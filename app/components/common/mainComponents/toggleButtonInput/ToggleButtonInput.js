import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { responsiveHeight, responsiveWidth } from '../../../../utils/responsiveScale';
import { colors, fonts } from '../../../../config/theme';

const ToggleButtonInput = ({placeHolder,inputValue,handleInputChange}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Pressable style={[styles.button,isEditing&&styles.buttonEditing]} onPress={handleButtonClick}>
      {isEditing ? (
        <TextInput
          ref={inputRef}
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          style={styles.input}
          placeholder={placeHolder}
        />
      ) : (
        <Text style={styles.buttonText}>Origin</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
      paddingHorizontal:responsiveWidth(4),
      paddingVertical:responsiveHeight(1),
      height:responsiveHeight(7),
      justifyContent:'center',
      borderRadius:responsiveHeight(1.5),
      backgroundColor:colors.whiteSmoke,
    
  },
  buttonText: {
      fontSize:responsiveHeight(2),
      fontFamily:fonts.secondry
  },
  input: {
    height:responsiveHeight(7),
    fontSize:responsiveHeight(2),
    fontFamily:fonts.secondry
  },
  buttonEditing: {
    borderColor: colors.primary,
    borderWidth: responsiveHeight(0.28),
  },
  title:{
    fontSize:responsiveHeight(2),
    fontFamily:fonts.secondry
  }

});

export default ToggleButtonInput;
