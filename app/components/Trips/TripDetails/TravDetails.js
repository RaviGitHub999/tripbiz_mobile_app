import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { responsiveHeight } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'

const TravDetails = ({ trav, index, type }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={[styles.title,{marginBottom:responsiveHeight(1)}]}>{type}-{index}</Text>
      <View>
        <Text style={styles.subTitle}>First Name: <Text style={styles.title1}>{trav.firstName}</Text></Text>
        <Text style={styles.subTitle}>Last Name: <Text style={styles.title1}>{trav.lastName}</Text></Text>
        <Text style={styles.subTitle}>Email: <Text style={styles.title1}>{trav.email}</Text></Text>
        <Text style={styles.subTitle}>Mobile Number: <Text style={styles.title1}>{trav.mobileNumber}</Text></Text>
      </View>
    </View>
  )
}
const styles=StyleSheet.create(
    {
        mainContainer:{
            marginTop:responsiveHeight(1)
        },
        title:{
            fontSize:responsiveHeight(1.5),
            fontFamily:fonts.primary,
            color:colors.primary,
            textAlign:'center'
        },
        title1:{
            fontSize:responsiveHeight(1.3),
            fontFamily:fonts.primary,
            color:colors.primary,
            textAlign:'center'
        },
        subTitle:{
            fontSize:responsiveHeight(1.5),
            fontFamily:fonts.textInput,
            color:colors.primary,
            textAlign:'center'   
        }
    }
)
export default TravDetails