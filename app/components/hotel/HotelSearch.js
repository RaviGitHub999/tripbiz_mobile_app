import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import SearchInputs from '../common/searchInputs/SearchInputs'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import CustomButton from '../common/customButton/CustomButton'
import { styles } from './styles'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker';
import MyContext from '../../context/Context'
import HotelDropDown from '../common/hotelDropDown/HotelDropDown'
import HotelSearchInput from '../common/HotelSearchInput/HotelSearchInput'
import { colors } from '../../config/theme'
const Item = React.memo(({ cityHotel, handleSelect }) => {
  const { item } = cityHotel
  return (
    <TouchableOpacity style={{
      paddingHorizontal: responsiveWidth(2.5),
      margin: responsiveHeight(0.8)
    }} onPress={() => handleSelect(item)}>
      <Text style={{fontSize:responsiveHeight(2),color:"black"}}>{`${item.DESTINATION},${item?.COUNTRY}`}</Text>
    </TouchableOpacity>
  )
})
const HotelSearch = ({ navigation: { navigate } }) => {
  const [cityHotelQuery, setCityHotelQuery] = useState("");
  const [cityHotelResBox, setCityHotelResBox] = useState(false);
  const [cityHotel, setCityHotel] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [cityHotelItem, setCityHotelItem] = useState({});
  const [cityHotelDisplay, setCityHotelDisplay] = useState("Destination");
  const [checkInDate, setCheckInDate] = useState("Check-In date");
  const [checkOutDate, setCheckOutDate] = useState("Check-Out date");
  const [calenderOpen, setCalenderOpen] = useState({
    checkInCalender: false,
    checkOutCalender: false
  })
  const [selectedHotelCheckInDate, setSelectedHotelCheckInDate] = useState(new Date)
  const [selectedHotelCheckOutDate, setSelectedHotelCheckOutDate] = useState(new Date)
  const [hotelNights, setHotelNights] = useState("0");
  const [hotelRooms, setHotelRooms] = useState("1");
  const [hotelRoomArr, setHotelRoomArr] = useState([
    { adults: "1", child: 0, childAge: [] }
  ]);
  const[checkInTime,setCheckInTime]=useState("")
  const[checkOutTime,setCheckOutTime]=useState("")
  const [errors, setErrors] = useState({});
  // checkInTime: null,
  // checkOutTime: null,
  // selectedHotelCheckInDate: new Date,
  // selectedHotelCheckOutDate: new Date,
  // const { actions,checkInTime,checkOutTime, cityHotelResBox,cityHotelRes,cityHotelQuery,selectedHotel,selectedCheckInDate,selectedCheckOutDate,calenderOpen,hotelNights,hotelRooms,hotelRoomArr,selectedHotelCheckInDate,selectedHotelCheckOutDate} = useContext(MyContext)
  const { actions, hotelCityLoading, cityHotelRes } = useContext(MyContext)
  const handleChangeCityHotelQuery = (e) => {
    setCityHotelQuery(e)
    const query = e.trim();
    const loading = query !== "" ? true : false;
    setCityHotelResBox(loading)
    actions.handleChangeCityHotel(e);
  }

  const handleSelectedHotel = useCallback((item) => {
    // actions.handleToggleHotelSearchInput();
    // actions.selectedHotel(item)
    setCityHotel(item.CITYID);
    setCountryCode(item.COUNTRYCODE);
    setCityHotelItem(item);
    setCityHotelResBox(false)
    setCityHotelDisplay(`${item.DESTINATION},${item.COUNTRY}`)

  }, [])

  const handlerenderData = ({ item }) => {
    return <Item cityHotel={item} handleSelect={handleSelectedHotel} />
  }

  const handleKeyextractor = (item, index) => `${item.refIndex}-${index}`

  const handleOpenCheckinCalender = () => {
    setCalenderOpen({ checkInCalender: true })
  }
  const handleOpenCheckoutCalender = () => {
    setCalenderOpen({ checkOutCalender: true })
  }
  const handleCheckInCalender = (event, selectedDate) => {
    if (event.type === 'set') {
      setCalenderOpen({
        checkInCalender: false
      })
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setCheckInDate(formattedDate)
        setSelectedHotelCheckInDate(selectedDate)
        setCheckInTime(selectedDate)
        // this.setState({
        //   selectedHotelCheckInDate: selectedDate,
        //   selectedCheckInDate: formattedDate,
        //   checkInTime: selectedDate
        // })
      }
      if (checkInTime) {
        const nights = Number(actions.diffNights(selectedDate, selectedHotelCheckOutDate))
        setHotelNights(nights)
      }
    }
    else {
      setCalenderOpen({
          checkInCalender: false
      })
    }
  }

  const handleCheckOutCalender= (event, selectedDate) => {
    if (event.type === 'set') {
      setCalenderOpen({
        checkOutCalender: false
      })
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setCheckOutDate(formattedDate)
        setSelectedHotelCheckOutDate(selectedDate)
        setCheckOutTime(selectedDate)

        // this.setState({
        //   selectedHotelCheckOutDate: selectedDate,
        //   selectedCheckOutDate: formattedDate,
        //   checkOutTime: selectedDate
        // })
      }
      if (checkOutDate) {
        const nights = Number(actions.diffNights(selectedDate,selectedHotelCheckInDate))
        setHotelNights(nights)
      }
    }
    else {
      setCalenderOpen({
        checkOutCalender: false
      })
    }
  }

  const handleHotelRooms = (rooms) => {
    var roomsArr = [...hotelRoomArr];

    if (rooms > roomsArr.length) {
      var diff = rooms - roomsArr.length;
      for (var i = 1; i <= diff; i++) {
        roomsArr.push({ adults: 1, child: 0, childAge: [] });
      }
    } else if (rooms < roomsArr.length) {
      roomsArr = roomsArr.filter((room, r) => {
        return r < rooms;
      });
    }

    setHotelRooms(rooms);
    setHotelRoomArr(roomsArr);
  };

  const handleHotelRoomsArr = (val, type, i) => {
    var roomsArr = [...hotelRoomArr];

    if (type === "adults") {
      roomsArr[i].adults = val;
    } else if (type === "child") {
      roomsArr[i].child = val;
      let childArr = [];

      for (let i = 1; i <= val; i++) {
        childArr.push({ age: 0 });
      }
      roomsArr[i].childAge = [...childArr];
    }

    setHotelRoomArr(roomsArr);
  };
  const  handleChildAge= (roomsArr) => {
    // this.setState({
    //   hotelRoomArr: roomsArr
    // })
    setHotelRoomArr(roomsArr)
  }

  const validate = () => {
    const newErrors = {};
    if (cityHotel==="") newErrors.destination = 'Destination is required';
    if (checkInTime==="") newErrors.checkIn = 'check-In date is required';
    if (checkOutTime==="") newErrors.checkOut = 'check-Out date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleHotelSearch = () => {
    if (validate()) {
      navigate("HotelResList")
      actions.hotelSearch({
        cityHotel,
        cityDestName: `${cityHotelItem.DESTINATION}, ${cityHotelItem.COUNTRY}`,
        countryCode,
        checkInDate,
        checkOutDate,
        selectedHotelCheckInDate,
        selectedHotelCheckOutDate,
        hotelNights,
        hotelRooms,
        hotelRoomArr
      });
actions.handleBookinghotelquery(
  {
    cityHotel,
    cityDestName: `${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`,
    countryCode,
    checkInDate:selectedHotelCheckInDate,
    checkOutDate:selectedHotelCheckOutDate,
    hotelNights,
    hotelRooms,
    hotelRoomArr
  }
)
    } else {
      console.log('Form has errors');
    }
  };
//   const handleHotelSearch = () => {
//     if (checkInTime && checkOutTime) {
//       navigate("HotelResList")
//       actions.hotelSearch({
//         cityHotel,
//         cityDestName: `${cityHotelItem.DESTINATION}, ${cityHotelItem.COUNTRY}`,
//         countryCode,
//         checkInDate,
//         checkOutDate,
//         selectedHotelCheckInDate,
//         selectedHotelCheckOutDate,
//         hotelNights,
//         hotelRooms,
//         hotelRoomArr
//       });
// actions.handleBookinghotelquery(
//   {
//     cityHotel,
//     cityDestName: `${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`,
//     countryCode,
//     checkInDate:selectedHotelCheckInDate,
//     checkOutDate:selectedHotelCheckOutDate,
//     hotelNights,
//     hotelRooms,
//     hotelRoomArr
//   }
// )
//     }
//   }
  

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
      <ScrollView showsVerticalScrollIndicator={false}  keyboardShouldPersistTaps="always" contentContainerStyle={{paddingBottom:responsiveHeight(5)}}>
        <View style={styles.mainContainer}>
          {/* selectedHotel */}
          <HotelSearchInput placeHolder={cityHotelDisplay} value={cityHotelQuery} handleChange={handleChangeCityHotelQuery} />
         {errors.destination&&<Text style={styles.errorText}>{`* ${errors.destination}`}</Text>}
          {cityHotelResBox ?
            <>
              {
                hotelCityLoading ? (
                  <Text>Loading......</Text>
                ) :
                  cityHotelRes.length === 0 ? <View>
                    <Text>No DataFound!!!</Text>
                  </View> :
                  //  { height: cityHotelRes.length < 3 ? responsiveHeight(8) : responsiveHeight(30), }
                   <View style={{  borderWidth:1,
                    borderRadius:responsiveHeight(1.5),
                    backgroundColor:colors.white,
                    overflow:'hidden',}}>
                      <FlatList data={cityHotelRes} renderItem={handlerenderData}
                        // scrollEnabled={cityHotelRes.length > 3}
                        keyExtractor={handleKeyextractor}
                     contentContainerStyle={{justifyContent:"center"}} 
                     style={styles.hotelCityListCard}
          
                     />
                   </View>
              }
            </> : null}

          <View style={{ flexDirection: "row", gap:responsiveHeight(2)}}>
            {/* actions.handleOpenCheckinCalender */}
            {/* actions.handleOpenCheckoutCalender */}
            <SearchInputs btn={true} dropDown={false} placeholder={checkInDate} customStyles={{ width: responsiveWidth(42) }} customFontStyles={{ fontSize: responsiveHeight(2.3) }} handleDatePicker={handleOpenCheckinCalender} />
            <SearchInputs btn={true} dropDown={false} placeholder={checkOutDate} customStyles={{ width: responsiveWidth(42) }} customFontStyles={{ fontSize: responsiveHeight(2.3) }} handleDatePicker={handleOpenCheckoutCalender} />
          </View>
        
         <View style={{ flexDirection: "row", gap:responsiveHeight(2)}}>
          {errors.checkIn&&<Text style={[styles.errorText,{flex:1}]}>{`* ${errors.checkIn}`}</Text>}
          {errors.checkOut&&<Text style={[styles.errorText,{flex:1}]}>{`* ${errors.checkOut}`}</Text>}
          </View>
          <View style={styles.aligningItemsInRow}>
            <HotelDropDown value={hotelNights} customStyles={{ width: responsiveWidth(42) }} placeHolder={"Nights"} disable={true} />
            <HotelDropDown length={4} starting={1} value={hotelRooms} handleChangeValue={handleHotelRooms} customStyles={{ width: responsiveWidth(42) }} placeHolder="Rooms" />
          </View>
        <View style={{paddingVertical:responsiveHeight(1)}}>
        {
            hotelRoomArr &&
            hotelRoomArr.map((room, r) => {
              return (
                <View style={styles.roomCard} key={r}>
                  <Text style={styles.roomTitle}>{`Room ${r + 1}`}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <HotelDropDown length={2} starting={1} value={room.adults} handleChangeValue={(val) =>
                    handleHotelRoomsArr(val, "adults", r)} placeHolder="Adults" customStyles={{ width: responsiveWidth(39) }} />
                    {/* <HotelDropDown length={3} value={room.child} handleChangeValue={(val) =>
                      handleHotelRoomsArr(val, "child", r)} placeHolder={"Children"} customStyles={{ width: responsiveWidth(39) }} /> */}
                  </View>
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {
                      room.childAge &&
                      room.childAge.map((child, c) => {
                        return (
                          <View >
                            <HotelDropDown length={11} starting={1} value={child.age} handleChangeValue={(age) => {
                              let roomsArr = [...hotelRoomArr];

                              roomsArr[r].childAge[c].age = age;

                             handleChildAge(roomsArr);
                            }} placeHolder={`Child ${c + 1} age`} customStyles={{ width: responsiveWidth(39) }} />
                          </View>
                        )
                      })
                    }
                  </View> */}
                </View>
              )
            })
          }
        </View>
          <CustomButton title='Search Hotels' handleSubmit={handleHotelSearch} />
          {calenderOpen.checkInCalender && <DateTimePicker
            value={selectedHotelCheckInDate}
            mode="date"
            display="default"
            onChange={handleCheckInCalender}
            minimumDate={new Date()}
            is24Hour={true}
          />}
          {calenderOpen.checkOutCalender && <DateTimePicker
            value={selectedHotelCheckOutDate}
            mode="date"
            display="default"
            onChange={handleCheckOutCalender}
            minimumDate={selectedHotelCheckInDate}
            is24Hour={true}
          />} 
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default React.memo(HotelSearch)

// import React, { useState, useMemo } from 'react';
// import { View, Text, Button, FlatList, TextInput } from 'react-native';

// const initialData = [
//   { id: 1, name: 'John', age: 25 },
//   { id: 2, name: 'Alice', age: 30 },
//   { id: 3, name: 'Bob', age: 28 },
//   { id: 4, name: 'Emma', age: 35 },
//   // Add more data as needed
// ];

// const App = () => {
//   const [data] = useState(initialData);
//   const [filter, setFilter] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredData = useMemo(() => {
//     let filtered = data;
//     if (filter === 'name') {
//       filtered = filtered.filter(item => item.name.startsWith(searchQuery));
//     }
//     if (filter === 'age') {
//       filtered = filtered.filter(item => item.age.toString().startsWith(searchQuery));
//     }
//     return filtered;
//   }, [data, filter, searchQuery]);

//   const filterByName = () => {
//     setFilter('name');
//   };

//   const filterByAge = () => {
//     setFilter('age');
//   };

//   const clearFilter = () => {
//     setFilter(null);
//     setSearchQuery('');
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <View style={{ flexDirection: 'row', marginBottom: 10 }}>
//         <Button title="Filter by Name" onPress={filterByName} />
//         <Button title="Filter by Age" onPress={filterByAge} />
//         <Button title="Clear Filter" onPress={clearFilter} />
//       </View>
//       <TextInput
//         style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
//         placeholder="Search..."
//         onChangeText={text => setSearchQuery(text)}
//         value={searchQuery}
//       />
//       <FlatList
//         data={filteredData}
//         renderItem={({ item }) => (
//           <View style={{ marginBottom: 10 }}>
//             <Text>Name: {item.name}</Text>
//             <Text>Age: {item.age}</Text>
//           </View>
//         )}
//         keyExtractor={item => item.id.toString()}
//       />
//     </View>
//   );
// };

// export default App;
