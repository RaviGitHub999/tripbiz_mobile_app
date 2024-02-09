import {TextInput, View, Text, StyleSheet,TouchableOpacity} from 'react-native'
import React, { useContext, useState } from 'react'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import MyContext from '../../../context/Context'


const HotelSearchInput = ({placeHolder,value}) => {
    const[toggleBtn,setToggle]=useState(false)
    const{actions,hotelSearchInputToggle}=useContext(MyContext)
    const handleToggle=()=>
    {
        actions.handleToggleHotelSearchInput()
    }
  return (
    <View>
        <TouchableOpacity style={[hotelSearchInputToggle?styles.isActiveMainContainer:styles.mainContainer,styles.mainContainer]} onPress={handleToggle}>
    {
        hotelSearchInputToggle?<TextInput autoFocus style={{ paddingHorizontal:responsiveWidth(5),}}/>:<Text style={[styles.title,{paddingHorizontal:responsiveWidth(5)}]}>{placeHolder}</Text>
    }
    </TouchableOpacity>
    </View>
  )
}

export default HotelSearchInput
const styles=StyleSheet.create({
    mainContainer:{
        backgroundColor:"gray",
        justifyContent:'center',
        borderRadius:responsiveHeight(1.5),
       
        height:responsiveHeight(7)
    },
    isActiveMainContainer:{
        borderWidth:responsiveHeight(0.3)
    },
    title:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.textFont,
        color:colors.gray
    },
})