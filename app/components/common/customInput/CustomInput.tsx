import { View, Text,TextInput} from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../config/theme';
import { responsiveHeight } from '../../../utils/responsiveScale';
import IconSwitcher from '../icons/IconSwitcher';
interface IProps{
    placeHolder:string,
    title:string,
    iconComponentName:string,
    name:string,
    iconsize?:number,
    handleChange:(event:string,name:string)=>void,
    stateName:string,
    value:string
}
const CustomInput:React.FC<IProps> = ({placeHolder,title,iconComponentName,name,iconsize,handleChange,stateName,value}) => {
    const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View style={styles.mainContainer}>
   <Text style={styles.title}>{title}</Text>
   <View style={isFocused?{...styles.textInputContainer,borderWidth:responsiveHeight(.3),borderRadius:responsiveHeight(1),borderColor:colors.primary}:styles.textInputContainer}>
      <IconSwitcher componentName={iconComponentName} iconName={name} color={colors.primary} iconsize={iconsize}/>
      <TextInput style={styles.textInputBox} placeholder={placeHolder} 
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChangeText={(e)=>handleChange(e,stateName)}
       value={value}
      />  
   </View>
    </View>
  )
}

export default CustomInput