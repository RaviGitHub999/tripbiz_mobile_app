import {TextInput, View, Text, StyleSheet,TouchableOpacity} from 'react-native'
import React, { useContext, useState } from 'react'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import MyContext from '../../../context/Context'


const HotelSearchInput = ({placeHolder,value,handleChange}) => {
    const[toggleBtn,setToggle]=useState(false)
    const [active, setActive] = useState(false)
    const{actions,hotelSearchInputToggle}=useContext(MyContext)
    // const handleToggle=()=>
    // {
    //     actions.handleToggleHotelSearchInput()
    // }
    const handleFocus=()=>
    {
        setActive(true)
    }
    const handleBlur = () => {
        setActive(false);
        // actions.handleToggleHotelSearchInput()
      }
  return (
    <View>
        <TouchableOpacity style={[active?styles.isActiveMainContainer:styles.mainContainer,styles.mainContainer]} onPress={handleFocus}>
    {
        active?<TextInput autoFocus style={styles.placeHolderText} value={value} onChangeText={(e)=>handleChange(e)} onFocus={handleFocus} onBlur={handleBlur}/>:<Text style={[styles.title,{paddingHorizontal:responsiveWidth(5)}]}>{placeHolder}</Text>
    }
    </TouchableOpacity>
    </View>
  )
}

export default HotelSearchInput
const styles=StyleSheet.create({
    mainContainer:{
        backgroundColor:colors.whiteSmoke,
        justifyContent:'center',
        borderRadius:responsiveHeight(1.5),
        minHeight:responsiveHeight(8)
    },
    isActiveMainContainer:{
        borderWidth:responsiveHeight(0.3)
    },
    title:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.textFont,
        color:colors.gray
    },
    placeHolderText:{
        paddingHorizontal:responsiveWidth(5),
        fontSize:responsiveWidth(4.2),
        fontFamily:fonts.primary,
        color:colors.primary
    }
})