import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { styles } from './ChangePasswordStyles'
import { TextInput } from 'react-native-gesture-handler'
import { responsiveHeight } from '../../../utils/responsiveScale'

const ChangePassword = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.maintitle}>ChangePassword</Text>
      <View style={{width:'60%'}}>
        <Text>Old Password</Text>
        <TextInput placeholder='Enter old password' style={[
              styles.inPut,
              { borderWidth: isFocused ? responsiveHeight(0.15) : 0 }
            ]}
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        />
      </View>
    </View>
  )
}

export default ChangePassword