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
const HotelSearch = ({navigation:{navigate}}) => {
  // const [cityHotel, setCityHotel] = useState("");
  // const [countryCode, setCountryCode] = useState("IN");
  // const [checkInDate, setCheckInDate] = useState("");
  // const [checkOutDate, setCheckOutDate] = useState("");
  // const [checkInCalender, setCheckInCalender] = useState(new Date)
  // const [checkOutCalender, setCheckOutCalender] = useState(new Date)
  // const [selectedCheckInDate, setSelectedCheckInDate] = useState("Check-In date")
  // const [selectedCheckOutDate, setSelectedCheckOutDate] = useState("Check-Out date")
  // const [hotelNights, setHotelNights] = useState("0");
  // const [hotelRooms, setHotelRooms] = useState("1");
  // const [hotelRoomArr, setHotelRoomArr] = useState([
  //   { adults: "1", child: 0, childAge: [] },
  // ]);
  // const [cityHotelQuery, setCityHotelQuery] = useState("");
  // const [calenderOpen, setCalenderOpen] = useState({ checkInCalender: false, checkOutCalender: false })
  // const [cityHotelResBox, setCityHotelResBox] = useState(false);
  // const [cityHotelItem, setCityHotelItem] = useState({});
  // const [selectedHotel, setSelectedHotel] = useState("Destination")
  const { actions, cityHotelRes,cityHotelQuery,selectedHotel,selectedCheckInDate,selectedCheckOutDate,calenderOpen,hotelNights,hotelRooms,hotelRoomArr,selectedHotelCheckInDate,selectedHotelCheckOutDate} = useContext(MyContext)
  let checkInTime
  let checkOutTime
  const handleChangeCityHotelQuery = (e) => {
    actions.handleChangeCityHotel(e);
  }
  const handleSelectedHotel = (item) => {
    actions.handleToggleHotelSearchInput();
      actions.selectedHotel(item)
  }
  const handleSelectedCheckinDate = useCallback((event, selectedDate) => {

    if (event.type === 'set') {
      setCalenderOpen({ checkInCalender: false });
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        checkInTime = selectedDate
        setCheckInCalender(selectedDate)
        setSelectedCheckInDate(formattedDate)
        const inputDate = new Date(selectedDate);
        const dateString = inputDate.toISOString();
        setCheckInDate(`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`)
        if (checkOutTime) {
          const nights = actions.diffNights(checkInTime, checkOutTime)
          setHotelNights(nights)
        }
      }
    } else {
      setCalenderOpen({ checkInCalender: false });
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
        checkOutTime = selectedDate
        setCheckOutCalender(selectedDate)
        setSelectedCheckOutDate(formattedDate)
        const inputDate = new Date(selectedDate);
        const dateString = inputDate.toISOString();
        setCheckOutDate(`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`)
        if (checkInTime) {
          const nights = actions.diffNights(checkInTime, selectedDate)
          setHotelNights(nights)
        }
      }

    } else {
      setCalenderOpen({ checkOutCalender: false });
    }
  }, []);
  // const handleOpenCheckinCalender = useCallback(() => {
  //   setCalenderOpen((prevState) => ({ ...prevState, checkInCalender: true }));
  // }, []);
  // const handleOpenCheckoutCalender = useCallback(() => {
  //   setCalenderOpen((prevState) => ({ ...prevState, checkOutCalender: true }));
  // }, []);
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
  const handleHotelSearch = () => {
    // if (cityHotel && selectedCheckInDate) {
    //   navigate("HotelResList")
    //   actions.hotelSearch({
    //     cityHotel,
    //     cityDestName: `${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`,
    //     countryCode,
    //     checkInDate,
    //     checkOutDate,
    //     hotelNights,
    //     hotelRooms,
    //     hotelRoomArr,
    //     selectedCheckInDate,
    //     selectedCheckOutDate
    //   })
    // }
    navigate("HotelResList")
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {/* <SearchInputs btn={false} dropDown={false} placeholder='Destination' Value={cityHotelQuery} handleChangeText={handleChangeCityHotelQuery} /> */}
          <HotelSearchInput placeHolder={selectedHotel} value={cityHotelQuery} handleChange={handleChangeCityHotelQuery} />
          {cityHotelRes.length === 0 ? <View>
            <Text>No DataFound!!!</Text>
          </View> :
           <FlatList data={cityHotelRes} renderItem={({ item: { item: { item } } }) => {
              return (
                <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => handleSelectedHotel(item)}>
                  <Text>{`${item.DESTINATION},${item?.STATEPROVINCE
                    ? item?.STATEPROVINCE
                    : item?.COUNTRY
                    }`}</Text>
                </TouchableOpacity>
              )
            }} style={{ borderWidth: 1, paddingHorizontal: responsiveWidth(5), borderRadius: responsiveHeight(1) }} />
          }
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <SearchInputs btn={true} dropDown={false} placeholder={selectedCheckInDate} customStyles={{ width: responsiveWidth(42) }} customFontStyles={{ fontSize: responsiveHeight(2.3) }} handleDatePicker={actions.handleOpenCheckinCalender} />
            <SearchInputs btn={true} dropDown={false} placeholder={selectedCheckOutDate} customStyles={{ width: responsiveWidth(42) }} customFontStyles={{ fontSize: responsiveHeight(2.3) }} handleDatePicker={actions.handleOpenCheckoutCalender} />
          </View>
          <View style={styles.aligningItemsInRow}>
            <HotelDropDown value={hotelNights} customStyles={{ width: responsiveWidth(42) }} placeHolder={"Nights"} disable={true} />
            <HotelDropDown length={4} starting={1} value={hotelRooms} handleChangeValue={actions.handleHotelRooms} customStyles={{ width: responsiveWidth(42) }} placeHolder="Rooms" />
          </View>
          {
            hotelRoomArr &&
            hotelRoomArr.map((room, r) => {
              return (
                <View style={styles.roomCard} key={r}>
                  <Text style={styles.roomTitle}>{`Room ${r + 1}`}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <HotelDropDown length={4} starting={1} value={room.adults} handleChangeValue={(val) =>
                      actions.handleHotelRoomsArr(val, "adults", r)} placeHolder="Adults" customStyles={{ width: responsiveWidth(39) }} />
                    <HotelDropDown length={3} value={room.child} handleChangeValue={(val) =>
                      actions.handleHotelRoomsArr(val, "child", r)} placeHolder={"Children"} customStyles={{ width: responsiveWidth(39) }} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {
                      room.childAge &&
                      room.childAge.map((child, c) => {
                        return (
                          <View >
                            <HotelDropDown length={11} starting={1} value={child.age} handleChangeValue={(age) => {
                              let roomsArr = [...hotelRoomArr];

                              roomsArr[r].childAge[c].age = age;

                             actions.handleChildAge(roomsArr);
                            }} placeHolder={`Child ${c + 1} age`} customStyles={{ width: responsiveWidth(39) }} />
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              )
            })
          }
          <CustomButton title='Search Hotels' handleSubmit={handleHotelSearch} />
          {calenderOpen.checkInCalender && <DateTimePicker
            value={selectedHotelCheckInDate}
            mode="date"
            display="default"
            onChange={actions.handleCheckInCalender}
            minimumDate={new Date()}
            is24Hour={true}
          />}
          {calenderOpen.checkOutCalender && <DateTimePicker
            value={selectedHotelCheckOutDate}
            mode="date"
            display="default"
            onChange={actions.handleCheckOutCalender}
            minimumDate={selectedHotelCheckInDate}
            is24Hour={true}
          />}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default React.memo(HotelSearch)