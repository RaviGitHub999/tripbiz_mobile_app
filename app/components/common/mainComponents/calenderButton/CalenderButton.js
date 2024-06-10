import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { responsiveHeight, responsiveWidth } from '../../../../utils/responsiveScale';
import { colors, fonts } from '../../../../config/theme';

const CalenderButton = ({title,handlePress,value}) => {
    const [isEditing, setIsEditing] = useState(false);
  return (
    <Pressable style={[styles.button,isEditing&&styles.buttonEditing]} onPress={handlePress}>
      <Text style={styles.buttonText}>{value?value:title}</Text>
  </Pressable>
  )
}

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
    buttonEditing: {
      borderColor: colors.primary,
      borderWidth: responsiveHeight(0.28),
    },
  
  });
export default CalenderButton