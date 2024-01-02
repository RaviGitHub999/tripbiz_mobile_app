import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from './styles'
interface Iprops{
  title:string,
  handleSubmit:()=>void
}
const CustomButton:React.FC<Iprops> = ({title,handleSubmit}) => {
  return (
    <View>
   <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
    <Text style={styles.btnText}>{title}</Text>
   </TouchableOpacity>
    </View>
  )
}

export default CustomButton