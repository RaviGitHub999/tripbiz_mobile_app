import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import CustomSelect from '../common/customSelect/CustomSelect'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale';
import { colors, fonts } from '../../config/theme';

export default function Wallet() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const arr=
  [
{
  name:"ravi"
},
{
  name:"kiran"
},
{
  name:"rishi"
},
{
  name:"ravi"
},
{
  name:"kiran"
},
{
  name:"rishi"
},
  ]

  const renderItem=(item,index)=>
    {
      return(
        <TouchableHighlight
      onPress={()=>{setSelectedItem(item.name),handledropDown(),setSelectedItemIndex(index)}}
      style={[
        styles.item,
        selectedItemIndex === index && styles.itemHovered,
    ]}
    underlayColor={colors.whiteSmoke} >
          <Text style={[styles.selectedItemTitle,selectedItemIndex === index&&styles.activeSelectedItemTitle]}>{item.name}</Text>
        </TouchableHighlight>
      )
    }
    const handledropDown = () => {
      setViewAll(!viewAll);
  };
  return (
    <View> 
      <CustomSelect initialName={"No_Data"} data={arr} renderData={(item,index)=>renderItem(item,index)
      } selectedItem={selectedItem} handledropDown={handledropDown} viewAll={viewAll}/>
    </View>
  )
}
const styles=StyleSheet.create({
  item: {
    paddingVertical: responsiveHeight(0.6),
    paddingLeft: responsiveWidth(2),
},
itemHovered: {
    backgroundColor: colors.facebook,
},
selectedItemTitle:
{
  fontSize:responsiveHeight(2),
  fontFamily:fonts.textInput,
  color:colors.primary

},
activeSelectedItemTitle:
{
  color:colors.white
}
})