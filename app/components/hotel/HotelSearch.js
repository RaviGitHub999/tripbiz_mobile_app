import { View, Text } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import SearchInputs from '../common/searchInputs/SearchInputs'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import DropDown from '../common/dropDown/DropDown'
import CustomButton from '../common/customButton/CustomButton'
import { styles } from './styles'
import { ScrollView } from 'react-native-gesture-handler'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MyContext from '../../context/Context'
import HotelDropDown from '../common/hotelDropDown/HotelDropDown'
const HotelSearch = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const[checkInCalender,setCheckInCalender]=useState(new Date)
  const[checkOutCalender,setCheckOutCalender]=useState(new Date)
  const[selectedCheckInDate,setSelectedCheckInDate]=useState("Check-In date")
  const[selectedCheckOutDate,setSelectedCheckOutDate]=useState("Check-Out date")
  const [hotelNights, setHotelNights] = useState("0");
  const [hotelRooms, setHotelRooms] = useState("1");
  const [hotelRoomArr, setHotelRoomArr] = useState([
    { adults: "1", child: 0, childAge: [] },
  ]);
  const [cityHotelQuery, setCityHotelQuery] = useState("");
  const [calenderOpen, setCalenderOpen] = useState({ checkInCalender: false, checkOutCalender: false })
  // const{hotelRoomArr}=useContext(MyContext)
 const handleChangeCityHotelQuery=(e)=>
 {
  setCityHotelQuery(e)
 }
 const handleSelectedCheckinDate = useCallback((event, selectedDate) => {
  // console.log("clicked");
  // debugger
  if (event.type === 'set') {
    setCalenderOpen({ checkInCalender: false });
    if(selectedDate)
    {
      
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      setCheckInCalender(selectedDate)
      setSelectedCheckInDate(formattedDate)
      const inputDate = new Date(selectedDate);
      const dateString = inputDate.toISOString();
      setCheckInDate(`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`)
    }
  } else {
    setCalenderOpen({ checkInCalender: false });
  }
}, []);

const handleSelectedCheckOutDate = useCallback((event, selectedDate) => {
  if (event.type === 'set') {
    setCalenderOpen({ checkOutCalender: false });
    if(selectedDate)
    {
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      setCheckOutCalender(selectedDate)
      setSelectedCheckOutDate(formattedDate)
      const inputDate = new Date(selectedDate);
      const dateString = inputDate.toISOString();
      setCheckOutDate(`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`)
    }
  
  } else {
    setCalenderOpen({ checkOutCalender: false });
  }
}, []);
const handleOpenCheckinCalender = useCallback(() => {
  setCalenderOpen((prevState) => ({ ...prevState, checkInCalender: true }));
}, []);
const handleOpenCheckoutCalender = useCallback(() => {
  setCalenderOpen((prevState) => ({ ...prevState, checkOutCalender: true }));
}, []);
const handleChange=(val)=>
{
  setHotelRoomArr({adults:val})
}
  return (
   <ScrollView showsVerticalScrollIndicator={false}>
     <View style={styles.mainContainer}>
       <SearchInputs btn={false} dropDown={false} placeholder='Destination' Value={cityHotelQuery} handleChangeText={handleChangeCityHotelQuery}/>
       <View style={{flexDirection:"row",justifyContent:"space-between"}}>
       <SearchInputs  btn={true} dropDown={false} placeholder={selectedCheckInDate} customStyles={{width:responsiveWidth(42)}} customFontStyles={{fontSize:responsiveHeight(2.3)}} handleDatePicker={handleOpenCheckinCalender}/>
       <SearchInputs  btn={true} dropDown={false} placeholder={selectedCheckOutDate} customStyles={{width:responsiveWidth(42)}} customFontStyles={{fontSize:responsiveHeight(2.3)}} handleDatePicker={handleOpenCheckoutCalender}/>
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
           <View style={{flexDirection:'row'}}>
           {/* <DropDown particularState='hAdults' length={3} starting={1} customStyles={{width:responsiveWidth(39.5)}} placeHolder='Adults' hotel={true}/>
           <DropDown particularState='hChild' length={3} customStyles={{width:responsiveWidth(39.5)}} placeHolder='Children' hotel={true}/> */}
             <HotelDropDown length={4} starting={1} value={hotelRoomArr.adults} handleChangeValue={handleChange}/>
             <HotelDropDown length={4} starting={1} value={hotelRoomArr.adults} handleChangeValue={handleChange}/>
           </View>
           </View>
          )
        })
       }
       <CustomButton title='Search Hotels' handleSubmit={()=><></>}/>
       {calenderOpen.checkInCalender && <DateTimePicker
          value={checkInCalender}
          mode="date"
          display="default"
          onChange={handleSelectedCheckinDate}
          minimumDate={new Date()}
          is24Hour={true}
        />}
        {calenderOpen.checkOutCalender && <DateTimePicker
          value={checkOutCalender}
          mode="date"
          display="default"
          onChange={handleSelectedCheckOutDate}
          minimumDate={checkInCalender}
          is24Hour={true}
        />}
    </View>
   </ScrollView>
  )
}

export default HotelSearch