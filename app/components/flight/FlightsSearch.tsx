import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { styles } from './styles'
import { responsiveWidth } from '../../utils/responsiveScale'
import SearchInputs from '../common/searchInputs/SearchInputs'
import DropDown from '../common/dropDown/DropDown'
import CustomButton from '../common/customButton/CustomButton'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MyContext from '../../context/Context'
import IconSwitcher from '../common/icons/IconSwitcher'
import { colors } from '../../config/theme'
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
  const [isSearchReady, setSearchReady] = useState(false);
  // const [active, setActive] = useState(btns[0].journeyType)
  const [calenderOpen, setCalenderOpen] = useState<CalenderOpen>({ departureCalender: false, returCalender: false })
  const { journeyWay,departureformattedDate, actions, oriRes, desRes, origin, airportOriginLoading, airportOriginData, destination, originSelectedAirport, originselected, destinationSelectedAirPort, destinationselected, departure, returnDate, dateValue, returnDateValue, airportDestData, airportDestLoading,directflight } = useContext<any>(MyContext)
  const handleActive = useCallback((item: IBtns) => {
    // setActive(item.journeyType);
    actions.handleJourneyWay(item.journeyTypeNo);
  }, []);
  const handleRender = useCallback(({ item }: { item: IBtns }) => {

    return (
      <TouchableOpacity style={[styles.btnsContainer, journeyWay === item.journeyTypeNo && styles.active]}
        onPress={() => handleActive(item)}>
        <Text style={[styles.btnTitle, journeyWay === item.journeyTypeNo && styles.activeText]}>{item.journeyType}</Text>
      </TouchableOpacity>
    );
  }, [journeyWay]);
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
    <TouchableOpacity style={styles.renderItemsContainer} onPress={() => {actions.handleOriginSelectedAirPort(item)}}>
      <View>
        <Text style={{color:"#505050"}}>{`${item.address.cityName},${item.address.countryName}`}</Text>
        <Text style={styles.airportName}>{item.name}</Text>
      </View>
      <View>
        <Text style={{color:colors.primary}}>{item.iataCode}</Text>
      </View>
    </TouchableOpacity>
  ));
  // const handleSearch = () => {
  //   if (originSelectedAirport.address.cityName && destinationSelectedAirPort.address.cityName && departureformattedDate.length !== 0) {
  //     navigate("OneWayFlights")
  //     // actions.flightSearch()
  //     // actions.handleFlightsLogos()
  //   }

  // }
  const handleSearch =  () => {
    if (originSelectedAirport.address.cityName && destinationSelectedAirPort.address.cityName && departureformattedDate.length !== 0) {
      navigate("OneWayFlights");
    }
  }
  // const handleSearch = async () => {
  //   if (originSelectedAirport.address.cityName && destinationSelectedAirPort.address.cityName && departureformattedDate.length !== 0) {
  //     console.log('Before flightSearch');
  //     await actions.flightSearch();
  //     console.log('After flightSearch');
  
  //     console.log('Before handleFlightsLogos');
  //     await actions.handleFlightsLogos();
  //     console.log('After handleFlightsLogos');
  
  //     console.log('Before navigate');
  //     navigate("OneWayFlights");
  //     console.log('After navigate');
  //   }
  // }
  

  // useEffect(() => {
  //   if (isSearchReady) {
     
  //   }
  // }, [isSearchReady]);
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
                  <Text style={{color:"#505050"}}>Loading......</Text>
                ) : airportOriginData.length === 0 ?
                  <Text style={{color:"#505050"}}>No Data!!!</Text> : <View style={{ flex: 1 }}>
                    <FlatList data={airportOriginData} renderItem={({ item }: any) => <MemoizedAirportItem {...item} />} nestedScrollEnabled style={styles.airportOriginDataContainer}  />
                  </View>}
              </View> : null
          }
          <SearchInputs btn={false} dropDown={false} placeholder='Destination' handleChangeText={handleChange} Value={destination} stateName="destination" selectedObj={destinationSelectedAirPort} selected={destinationselected} />
          {
            desRes ?
              <View >
                {airportDestLoading ? (
                  <Text style={{color:"#505050"}}>Loading......</Text>
                ) : airportDestData.length === 0 ?
                  <Text style={{color:"#505050"}}>No Data!!!</Text> : <View style={{ flex: 1 }}>
                    <FlatList data={airportDestData} renderItem={({ item }) => {
                      return (
                        <TouchableOpacity style={styles.renderItemsContainer} onPress={() => actions.handleDestinationSelectedAirPort(item)}>
                          <View>
                            <Text style={{color:"#505050"}}>{`${item.address.cityName},${item.address.countryName}`}</Text>
                            <Text style={styles.airportName}>{item.name}</Text>
                          </View>
                          <View>
                            <Text style={{color:colors.primary}}>{item.iataCode}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} nestedScrollEnabled style={styles.airportOriginDataContainer} />
                  </View>}
              </View> : null
          }
          <View {...journeyWay === "2" && { style: { flexDirection: 'row', justifyContent: 'space-between' } }}>
            <SearchInputs  btn={true} dropDown={false} placeholder={departure}{...journeyWay === "2" && { customStyles: { width: responsiveWidth(41) } }} handleDatePicker={handleOpenCalender} />
            {journeyWay === "2" && <SearchInputs  btn={true} dropDown={false} placeholder={returnDate} customStyles={{ width: responsiveWidth(41) }} handleDatePicker={handleOpenReturnCalender} />}
          </View>
          <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
            <DropDown length={10} particularState='Adults' placeHolder='Adults'/>
            <DropDown length={9} particularState='Children' placeHolder='Children'/>
            <DropDown length={9} particularState='Infants' placeHolder='Infants'/>
          </View>
          <SearchInputs btn={true} dropDown={true}  />

         
   <View style={styles.directFlightContainer}>
  <TouchableOpacity onPress={actions.handleDirectFlight}>
  {!directflight? <IconSwitcher componentName='MaterialCommunityIcons' iconName='checkbox-blank-outline' color={colors.gray} iconsize={2.4}/>
    :<IconSwitcher componentName='MaterialCommunityIcons' iconName='checkbox-marked' color={colors.facebook} iconsize={2.4}/>}
  </TouchableOpacity>
  <Text style={styles.directFlightTitle}>Direct flights only</Text>
   </View>
    




          <View style={styles.searchFlightsBtnConatainer}>
            <CustomButton title='Search Flight' handleSubmit={handleSearch} />
          </View>
        </View>
        {calenderOpen.departureCalender && <DateTimePicker
          value={dateValue}
          mode="date"
          display="calendar"
          onChange={handleSelectedDate}
          minimumDate={new Date()}
          is24Hour={true}
        />}
        {calenderOpen.returCalender && <DateTimePicker
          value={returnDateValue}
          mode="date"
          display="calendar"
          onChange={handleSelectedReturnDate}
          minimumDate={dateValue}
          is24Hour={true}
        />}
      </ScrollView>
    </View>
  )
}

export default React.memo(FlightsSearch)