import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState, useCallback, useContext } from 'react'
import { styles } from './styles'
import { responsiveWidth } from '../../utils/responsiveScale'
import SearchInputs from '../common/searchInputs/SearchInputs'
import DropDown from '../common/dropDown/DropDown'
import CustomButton from '../common/customButton/CustomButton'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MyContext from '../../context/Context'
const btns = [{ journeyType: "One Way", journeyTypeNo: "1" }, { journeyType: "Round Trip", journeyTypeNo: "2" }]
interface IBtns {
  journeyType: string,
  journeyTypeNo: string
}
interface CalenderOpen {
  departureCalender?: boolean,
  returCalender?: boolean
}
interface IProps {
  navigation: {
    navigate: (arg: string) => void
  }
}
const FlightsSearch: React.FC<IProps> = ({ navigation: { navigate } }) => {
  const [active, setActive] = useState(btns[0].journeyType)
  const [calenderOpen, setCalenderOpen] = useState<CalenderOpen>({ departureCalender: false, returCalender: false })
  const { departureformattedDate, actions, oriRes, desRes, origin, airportOriginLoading, airportOriginData, destination, originSelectedAirport, originselected, destinationSelectedAirPort, destinationselected, departure, returnDate, dateValue, returnDateValue, airportDestData, airportDestLoading } = useContext<any>(MyContext)
  const handleActive = useCallback((item: IBtns) => {
    setActive(item.journeyType);
    actions.handleJourneyWay(item.journeyTypeNo);
  }, []);
  const handleRender = useCallback(({ item }: { item: IBtns }) => {

    return (
      <TouchableOpacity style={[styles.btnsContainer, active === item.journeyType && styles.active]}
        onPress={() => handleActive(item)}>
        <Text style={[styles.btnTitle, active === item.journeyType && styles.activeText]}>{item.journeyType}</Text>
      </TouchableOpacity>
    );
  }, [active, setActive]);
  const handleSelectedDate = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    // console.log("clicked");
    // debugger
    if (event.type === 'set') {
      setCalenderOpen({ departureCalender: false });
      actions.handleDepartureDateChange(selectedDate)
    } else {
      setCalenderOpen({ departureCalender: false });
    }
  }, []);

  const handleSelectedReturnDate = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set') {
      setCalenderOpen({ returCalender: false });
      actions.handleReturnDateChange(selectedDate)
    } else {
      setCalenderOpen({ returCalender: false });
    }
  }, []);
  const handleOpenCalender = useCallback(() => {
    setCalenderOpen((prevState) => ({ ...prevState, departureCalender: true }));
  }, []);
  const handleOpenReturnCalender = useCallback(() => {
    setCalenderOpen((prevState) => ({ ...prevState, returCalender: true }));
  }, []);
  const handleChange = (e: string, name: string) => {

    if (name === "origin") {
      actions.changeOriginAirportKeyword(e);
      actions.handleChangeOriginTextInput({ e, name })
    }
    else {
      actions.changeDestAirportKeyword(e)
      actions.handleChangeDestinationTextInput({ e, name })
    }
  }
  const MemoizedAirportItem = React.memo((item: any) => (
    <TouchableOpacity style={styles.renderItemsContainer} onPress={() => actions.handleOriginSelectedAirPort(item)}>
      <View>
        <Text>{`${item.address.cityName},${item.address.countryName}`}</Text>
        <Text style={styles.airportName}>{item.name}</Text>
      </View>
      <View>
        <Text>{item.iataCode}</Text>
      </View>
    </TouchableOpacity>
  ));
  const handleSearch = () => {
    if (originSelectedAirport.address.cityName && destinationSelectedAirPort.address.cityName && departureformattedDate.length !== 0) {
      navigate("OneWayFlights")
      actions.flightSearch()
      // dispatch(fetchFlightsLogos())
    }

  }
  return (
    <View style={styles.subContainer}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
        <FlatList data={btns} renderItem={handleRender} keyExtractor={item => item.journeyType} horizontal style={styles.btnContainer} />
        <View style={styles.fieldsContainer}>
          <SearchInputs btn={false} dropDown={false} placeholder='Origin' handleChangeText={handleChange} Value={origin} stateName="origin" selectedObj={originSelectedAirport} selected={originselected} />
          {
            oriRes ?
              <View >
                {airportOriginLoading ? (
                  <Text>Loading......</Text>
                ) : airportOriginData.length === 0 ?
                  <Text>No Data!!!</Text> : <View style={{ flex: 1 }}>
                    <FlatList data={airportOriginData} renderItem={({ item }: any) => <MemoizedAirportItem {...item} />} nestedScrollEnabled style={styles.airportOriginDataContainer} />
                  </View>}
              </View> : null
          }
          <SearchInputs btn={false} dropDown={false} placeholder='Destination' handleChangeText={handleChange} Value={destination} stateName="destination" selectedObj={destinationSelectedAirPort} selected={destinationselected} />
          {
            desRes ?
              <View >
                {airportDestLoading ? (
                  <Text>Loading......</Text>
                ) : airportDestData.length === 0 ?
                  <Text>No Data!!!</Text> : <View style={{ flex: 1 }}>
                    <FlatList data={airportDestData} renderItem={({ item }) => {
                      return (
                        <TouchableOpacity style={styles.renderItemsContainer} onPress={() => actions.handleDestinationSelectedAirPort(item)}>
                          <View>
                            <Text>{`${item.address.cityName},${item.address.countryName}`}</Text>
                            <Text style={styles.airportName}>{item.name}</Text>
                          </View>
                          <View>
                            <Text>{item.iataCode}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} nestedScrollEnabled style={styles.airportOriginDataContainer} />
                  </View>}
              </View> : null
          }
          <View {...active === "Round Trip" && { style: { flexDirection: 'row', justifyContent: 'space-between' } }}>
            <SearchInputs datePick='departure' btn={true} dropDown={false} placeholder={departure}{...active === "Round Trip" && { customStyles: { width: responsiveWidth(41) } }} handleDatePicker={handleOpenCalender} />
            {active === "Round Trip" && <SearchInputs datePick="return" btn={true} dropDown={false} placeholder={returnDate} customStyles={{ width: responsiveWidth(41) }} handleDatePicker={handleOpenReturnCalender} />}
          </View>
          <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
            <DropDown length={10} particularState='adults' />
            <DropDown length={9} particularState='children' />
            <DropDown length={9} particularState='infants' />
          </View>
          <SearchInputs btn={true} dropDown={true} placeholder='Origin' />
          <View style={styles.searchFlightsBtnConatainer}>
            <CustomButton title='Search Flight' handleSubmit={handleSearch} />
          </View>
        </View>
        {calenderOpen.departureCalender && <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleSelectedDate}
          minimumDate={new Date()}
          is24Hour={true}
        />}
        {calenderOpen.returCalender && <DateTimePicker
          value={returnDateValue}
          mode="date"
          display="default"
          onChange={handleSelectedReturnDate}
          minimumDate={dateValue}
          is24Hour={true}
        />}
      </ScrollView>
    </View>
  )
}

export default React.memo(FlightsSearch)