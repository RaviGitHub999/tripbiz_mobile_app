import { View, Text } from 'react-native'
import React, { useState } from 'react'
import SearchInputs from '../common/searchInputs/SearchInputs'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import DropDown from '../common/dropDown/DropDown'
import CustomButton from '../common/customButton/CustomButton'
import { styles } from '../hotel/styles'
import { ScrollView } from 'react-native-gesture-handler'

const HotelSearch = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelNights, setHotelNights] = useState("0");
  const [hotelRooms, setHotelRooms] = useState("1");
  const [hotelRoomArr, setHotelRoomArr] = useState([
    { adults: "1", child: 0, childAge: [] },
    { adults: "1", child: 0, childAge: [] },
    { adults: "1", child: 0, childAge: [] }
  ]);
  return (
   <ScrollView showsVerticalScrollIndicator={false}>
     <View style={styles.mainContainer}>
       <SearchInputs btn={false} dropDown={false} placeholder='Destination'   />
       <View style={{flexDirection:"row",justifyContent:"space-between"}}>
       <SearchInputs datePick='departure' btn={true} dropDown={false} placeholder={"Check-In date"} customStyles={{width:responsiveWidth(42)}} customFontStyles={{fontSize:responsiveHeight(2.3)}}/>
       <SearchInputs datePick='departure' btn={true} dropDown={false} placeholder={"Check-Out date"} customStyles={{width:responsiveWidth(42)}} customFontStyles={{fontSize:responsiveHeight(2.3)}}/>
       </View>
       <View style={styles.aligningItemsInRow}>
       <DropDown particularState='Nights' length={10} customStyles={{width:responsiveWidth(42)}} placeHolder='Nights'/>
       <DropDown particularState='Rooms' length={4} customStyles={{width:responsiveWidth(42)}} placeHolder='Rooms' starting={1}/>
       </View>
       {
        hotelRoomArr &&
        hotelRoomArr.map((room, r)=>
        {
          return(
            <View style={styles.roomCard} key={r}> 
            <Text style={styles.roomTitle}>{`Room ${r + 1}`}</Text>
           <View style={styles.aligningItemsInRow}>
           <DropDown particularState='Nights' length={10} customStyles={{width:responsiveWidth(39.5)}} placeHolder='Adults'/>
           <DropDown particularState='Rooms' length={10} customStyles={{width:responsiveWidth(39.5)}} placeHolder='Children'/>
           </View>
           </View>
          )
        })
       }

       <CustomButton title='Search Hotels' handleSubmit={()=><></>}/>
    </View>
   </ScrollView>
  )
}

export default HotelSearch