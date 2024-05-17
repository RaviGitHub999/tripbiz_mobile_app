import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import IconSwitcher from '../icons/IconSwitcher'
import { colors } from '../../../config/theme'
import { styles } from './styles'

const ReCheck = ({handleDelete,handleRecheck}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={handleDelete}>
        <IconSwitcher componentName='MaterialCommunityIcons' iconName='delete' color={colors.red} iconsize={3}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleRecheck}>
        <Text style={styles.btnTitle}>ReCheck</Text>
      </TouchableOpacity> 
    </View>
  )
}

export default ReCheck