import { View, Text,TextInput, TouchableOpacity} from 'react-native'
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
    value:string,
    secure?:boolean,
    showPassword:()=>void,
}
const CustomInput:React.FC<IProps> = ({placeHolder,title,iconComponentName,name,iconsize,handleChange,stateName,value,secure,showPassword}) => {
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
   <View style={isFocused?{...styles.textInputContainer,borderWidth:responsiveHeight(.18),borderRadius:responsiveHeight(.7),borderColor:colors.primary}:styles.textInputContainer}>
      <IconSwitcher componentName={iconComponentName} iconName={name} color={colors.primary} iconsize={iconsize}/>
      <TextInput style={styles.textInputBox} placeholder={placeHolder} 
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChangeText={(e)=>handleChange(e,stateName)}
       value={value}
       secureTextEntry={secure}
      />  
       {showPassword&&<TouchableOpacity onPress={()=>showPassword()}>
        <IconSwitcher componentName={"Ionicons"} iconName={secure?"eye-off":"eye"} color={colors.primary} iconsize={iconsize}/>
        </TouchableOpacity>}
   </View>
    </View>
  )
}

export default CustomInput