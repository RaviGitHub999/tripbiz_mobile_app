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
  // const [cityHotelResBox, setCityHotelResBox] = useState(true);
  const [cityHotelQuery, setCityHotelQuery] = useState("");
  const [cityHotelResBox, setCityHotelResBox] = useState(false);
  // const { actions,checkInTime,checkOutTime, cityHotelResBox,cityHotelRes,cityHotelQuery,selectedHotel,selectedCheckInDate,selectedCheckOutDate,calenderOpen,hotelNights,hotelRooms,hotelRoomArr,selectedHotelCheckInDate,selectedHotelCheckOutDate} = useContext(MyContext)
  const{actions,selectedHotel}=useContext(MyContext)
  const handleChangeCityHotelQuery = (e) => {
    setCityHotelQuery(e)
    setCityHotelResBox(true)
    actions.handleChangeCityHotel(e);
  }
  const handleSelectedHotel = (item) => {
    actions.handleToggleHotelSearchInput();
      actions.selectedHotel(item)
  }
  const handleHotelSearch = () => {
    if(checkInTime&&checkOutTime)
    {

      navigate("HotelResList")
    }
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
        {/* selectedHotel */}
          <HotelSearchInput placeHolder={selectedHotel} value={cityHotelQuery} handleChange={handleChangeCityHotelQuery} />
          {/* {cityHotelRes.length === 0 ? <View>
            <Text>No DataFound!!!</Text>
          </View> :
      cityHotelResBox?<FlatList data={cityHotelRes} renderItem={({ item:{item}}) => {
        // console.log(item,"item")
        return (
          <TouchableOpacity style={{ marginVertical: 5 }} onPress={() =>{ handleSelectedHotel(item), actions.handleToggleHotelSearchInput()}}>
            <Text>{`${item.DESTINATION},${item?.STATEPROVINCE
              ? item?.STATEPROVINCE
              : item?.COUNTRY
              }`}</Text>
          </TouchableOpacity>
        )
      }} style={{ borderWidth: 1, paddingHorizontal: responsiveWidth(5), borderRadius: responsiveHeight(1) }} />:null
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
          />} */}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default React.memo(HotelSearch)