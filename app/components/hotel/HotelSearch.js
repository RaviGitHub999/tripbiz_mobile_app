import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import SearchInputs from '../common/searchInputs/SearchInputs'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import DropDown from '../common/dropDown/DropDown'
import CustomButton from '../common/customButton/CustomButton'
import { styles } from './styles'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MyContext from '../../context/Context'
import HotelDropDown from '../common/hotelDropDown/HotelDropDown'
const HotelSearch = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInCalender, setCheckInCalender] = useState(new Date)
  const [checkOutCalender, setCheckOutCalender] = useState(new Date)
  const [selectedCheckInDate, setSelectedCheckInDate] = useState("Check-In date")
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState("Check-Out date")
  const [hotelNights, setHotelNights] = useState("0");
  const [hotelRooms, setHotelRooms] = useState("1");
  const [hotelRoomArr, setHotelRoomArr] = useState([
    { adults: "1", child: 0, childAge: [] },
  ]);
  const [cityHotelQuery, setCityHotelQuery] = useState("");
  const [calenderOpen, setCalenderOpen] = useState({ checkInCalender: false, checkOutCalender: false })
  const [cityHotelResBox, setCityHotelResBox] = useState(false);
  const [cityHotelItem, setCityHotelItem] = useState({});
  const{actions,cityHotelRes}=useContext(MyContext)
  const handleChangeCityHotelQuery = (e) => {
    setCityHotelQuery(e)
    setCityHotelResBox(true);
    actions.handleChangeCityHotel(e);
  }
  const handleSelectedCheckinDate = useCallback((event, selectedDate) => {
    // console.log("clicked");
    // debugger
    if (event.type === 'set') {
      setCalenderOpen({ checkInCalender: false });
      // setHotelNights("0")
      if (selectedDate) {

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
      // setHotelNights("0")
    }
  }, []);

  const handleSelectedCheckOutDate = useCallback((event, selectedDate) => {
    if (event.type === 'set') {
      setCalenderOpen({ checkOutCalender: false });
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setCheckOutCalender(selectedDate)
        setSelectedCheckOutDate(formattedDate)
        const inputDate = new Date(selectedDate);
        const dateString = inputDate.toISOString();
        setCheckOutDate(`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`)
        const start = new Date(checkInCalender);
        const end = new Date(selectedDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        setHotelNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
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
  const handleChange = (val) => {
    setHotelRoomArr({ adults: val })
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
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.mainContainer}>
        <SearchInputs btn={false} dropDown={false} placeholder='Destination' Value={cityHotelQuery} handleChangeText={handleChangeCityHotelQuery} />
       {cityHotelRes.length === 0 ? <View>
          <Text>No DataFound!!!</Text>
        </View>:
<FlatList data={cityHotelRes} renderItem={({item:{item:{item}}})=>
{
  return(
    <TouchableOpacity style={{marginVertical:5}} onPress={()=>setCityHotelItem(item)}>
      <Text>{`${item.DESTINATION},${item?.STATEPROVINCE
                                      ? item?.STATEPROVINCE
                                      : item?.COUNTRY
                                      }`}</Text>
    </TouchableOpacity>
  )
}} style={{borderWidth:1,paddingHorizontal:responsiveWidth(5),borderRadius:responsiveHeight(1)}}/>
       }
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <SearchInputs btn={true} dropDown={false} placeholder={selectedCheckInDate} customStyles={{ width: responsiveWidth(42) }} customFontStyles={{ fontSize: responsiveHeight(2.3) }} handleDatePicker={handleOpenCheckinCalender} />
          <SearchInputs btn={true} dropDown={false} placeholder={selectedCheckOutDate} customStyles={{ width: responsiveWidth(42) }} customFontStyles={{ fontSize: responsiveHeight(2.3) }} handleDatePicker={handleOpenCheckoutCalender} />
        </View>
        <View style={styles.aligningItemsInRow}>
          <HotelDropDown value={hotelNights}  customStyles={{ width: responsiveWidth(42) }} placeHolder={"Nights"} disable={true}/>
          <HotelDropDown length={4} starting={1} value={hotelRooms} handleChangeValue={handleHotelRooms} customStyles={{ width: responsiveWidth(42) }} placeHolder="Rooms" />
        </View>
        {
          hotelRoomArr &&
          hotelRoomArr.map((room, r) => {
            return (
              <View style={styles.roomCard} key={r}>
                <Text style={styles.roomTitle}>{`Room ${r + 1}`}</Text>
                <View style={{ flexDirection: 'row',justifyContent:'space-between' }}>
                  <HotelDropDown length={4} starting={1} value={room.adults} handleChangeValue={(val) =>
                    handleHotelRoomsArr(val, "adults", r)} placeHolder="Adults" customStyles={{ width: responsiveWidth(39) }}/>
                  <HotelDropDown length={3}  value={room.child} handleChangeValue={(val) =>
                    handleHotelRoomsArr(val, "child", r)} placeHolder={"Children"} customStyles={{ width: responsiveWidth(39) }} />
                </View>
                <View style={{ flexDirection: 'row',justifyContent:'space-between'}}>
                  {
                    room.childAge&&
                    room.childAge.map((child, c)=>
                    {
                      return(
                        <View >
                          <HotelDropDown length={11} starting={1} value={child.age} handleChangeValue={(age) => {
                                      let roomsArr = [...hotelRoomArr];

                                      roomsArr[r].childAge[c].age = age;

                                      setHotelRoomArr(roomsArr);
                                    }} placeHolder={`Child ${c + 1} age`} customStyles={{ width: responsiveWidth(39) }}/>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
            )
          })
        }
        <CustomButton title='Search Hotels' handleSubmit={() => <></>} />
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