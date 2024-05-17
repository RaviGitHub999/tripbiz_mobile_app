import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from './styles'
import { ActivityIndicator } from 'react-native'
import { colors } from '../../../config/theme'
interface Iprops{
  title:string,
  handleSubmit:()=>void,
  loading?:boolean
}
const CustomButton:React.FC<Iprops> = ({title,handleSubmit,loading}) => {
  return (

   <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
   {loading?<ActivityIndicator color={colors.facebook} size={'small'}/>:<Text style={styles.btnText}>{title}</Text>}
   </TouchableOpacity>

  )
}

export default CustomButton