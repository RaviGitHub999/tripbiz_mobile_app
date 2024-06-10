import { View, Text, StyleSheet,TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import IconSwitcher from '../icons/IconSwitcher'
import { FlatList } from 'react-native-gesture-handler'
const HotelDropDown = ({length,starting,value,handleChangeValue,customStyles,placeHolder,disable,dropDownData}) => {
    const[toggleBtn,setToogleBtn]=useState(false)
const handleSelectedValue=(val)=>
{
    handleChangeValue(val)
    setToogleBtn(false)
}
    const numbers = Array.from({ length}, (_, index) => index);
    const list = numbers.map((number) => {
        let start=starting?number+1:number
        return(
         <TouchableOpacity key={number} onPress={()=>handleSelectedValue(start)} style={[styles.item,value===start&&styles.activeItem]} >
         <Text>{start}</Text>
     </TouchableOpacity>
        )
        })

        const handleRenderData=(({item})=>
        {
            return(
                <TouchableHighlight key={item} onPress={()=>handleSelectedValue(item)} style={[styles.item,value===item&&styles.activeItem]} underlayColor={styles.activeItem}>
                <Text>{item}</Text>
            </TouchableHighlight>
            )
        })
    const handleToggle =()=>
    {
        setToogleBtn(!toggleBtn)
    }
  return (
   <View>
    <TouchableOpacity  onPress={handleToggle} disabled={disable}>
{ toggleBtn?<View style={[styles.mainContainer,styles.mainContainerActive,customStyles]}>
  <Text style={styles.value}>{value}</Text>
  <IconSwitcher componentName='Entypo' iconName='chevron-small-down' color={colors.black} iconsize={3}/>
 </View>:
 <View style={[styles.mainContainer,customStyles]}>
 <Text style={styles.title}>{placeHolder}</Text>
  <Text style={styles.value}>{value}</Text>
 </View>}
    </TouchableOpacity>
   { toggleBtn&&<View style={styles.hotelDropDownContainer}>
     {dropDownData?<FlatList data={dropDownData} renderItem={handleRenderData} vertical/>:list}
    </View>}
   </View>
  )
}

export default HotelDropDown
const styles=StyleSheet.create({

    mainContainer: {
        backgroundColor: colors.whiteSmoke,
        rowGap: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(2.5),
        borderRadius: responsiveHeight(1.5),
        paddingVertical: responsiveHeight(0.5),
        // width: responsiveWidth(24),
        height:responsiveHeight(8),
        // justifyContent:'center'
    },
    title:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.secondry,
        color:colors.lightGray
    },
    value:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.textFont,
        color:colors.primary 
    },
    mainContainerActive:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
borderWidth:responsiveHeight(0.3)
    },
    hotelDropDownContainer:{
borderWidth:1,
// paddingHorizontal: responsiveWidth(2.5),
rowGap:responsiveHeight(0.5),
backgroundColor:colors.white,
maxHeight:responsiveHeight(20)
    },
    item:{

        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical:responsiveHeight(0.3)
    },
    activeItem:{
        backgroundColor:'#86c9e8',
    }
})