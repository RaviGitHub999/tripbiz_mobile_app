import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {styles} from './styles';
import ToggleButtonInput from '../common/mainComponents/toggleButtonInput/ToggleButtonInput';
import CalenderButton from '../common/mainComponents/calenderButton/CalenderButton';
import HotelDropDown from '../common/hotelDropDown/HotelDropDown';
import CustomButton from '../common/customButton/CustomButton';
import MyContext from '../../context/Context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
const BusSearch = () => {
  const [busOrigin, setBusOrigin] = useState('');
  const [busOriginRes, setBusOriginRes] = useState(false);
  const [busOriginCityName, setBusOriginCityName] = useState('');
  const [busOriginDisplay, setBusOriginDisplay] = useState(false);
  const [busOriginDetails, setBusOriginDetails] = useState({});

  const [busDestination, setBusDestination] = useState('');
  const [busDestRes, setBusDestRes] = useState(false);
  const [busDestCityName, setBusDestCityName] = useState('');
  const [busDestDisplay, setBusDestDisplay] = useState(false);
  const [busDestDetails, setBusDestDetails] = useState({});

  const [busOutboundDate, setBusOutBoundDate] = useState(new Date());
  const [cabFormatedDate, setCabFormatedDate] = useState("")
  const [calenderOpen, setCalenderOpen] = useState(false);
  const {
    NoofBusPassengers,
    actions,
    busOriginData,
    busOriginLoading,
    busDestData,
    busDestLoading,
    busResList,
    busErrorMessage,
    searchingBus,
  } = useContext(MyContext);
  const{navigate}=useNavigation()
  const handleInputChange = (e, name) => {
    if (name === 'origin') {
      setBusOrigin(e);
      setBusOriginRes(true);
      if (e === '') {
        setBusOriginRes(false);
      }
      actions.handleChangeBusKeyword(e, 'origin');
    } else {
      setBusDestination(e);
      setBusDestRes(true);
      if (e === '') {
        setBusDestRes(false);
      }
      actions.handleChangeBusKeyword(e, 'destination');
    }
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };
  const handlenoOfPassengers = val => {
    actions.changeBusPassengers(val);
  };
  const handleSelectOriCityName = item => {
    setBusOriginRes(false);
    setBusOriginCityName(item.cityName);
    setBusOrigin('');
    setBusOriginDisplay(false);
    setBusOriginDetails(item);
  };
  const handleSelectDesCityName = item => {
    setBusDestRes(false);
    setBusDestCityName(item.cityName);
    setBusDestDetails(item);
    setBusDestination('');
    setBusDestDisplay(false);
  };
  const handleOriginData = (item, name) => {
    return (
      <TouchableOpacity
        style={styles.cityName}
        onPress={() =>
          name === 'origin'
            ? handleSelectOriCityName(item)
            : handleSelectDesCityName(item)
        }>
        <Text style={[styles.selectedItemTitle]}>{item.cityName}</Text>
      </TouchableOpacity>
    );
  };
  const handleCalender = () => {
    setCalenderOpen({startDate: true});
  };

  const handleStartDate = (event, selectedDate) => {
    if (event.type === 'set') {
      setCalenderOpen(false)
      if (selectedDate) 
        {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setCabFormatedDate(formattedDate)
        setBusOutBoundDate(selectedDate)
      }
    }
    else 
    {
      setCalenderOpen( false)
    }
  }
const searchBus=()=>
  {
    actions.getLastDoc();
    if (busOriginDetails && busDestDetails) {
      navigate("BusResList")
      actions.busSearch(
        busOriginDetails,
        busDestDetails,
        busOutboundDate,
      );
    }
  }

  return (
<>
<KeyboardAvoidingView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <ScrollView>
          <View style={styles.mainContainer}>
            <ToggleButtonInput
              placeHolder="Origin"
              inputValue={busOrigin}
              handleInputChange={e => handleInputChange(e, 'origin')}
              selected={busOriginCityName}
            />
            {busOriginRes ? (
              busOriginLoading ? (
                <Text style={styles.loaderTitle}>Loading .....</Text>
              ) : busOriginData.length === 0 ? (
                <Text style={styles.loaderTitle}>No results</Text>
              ) : (
                <View>
                  <FlatList
                    data={busOriginData}
                    renderItem={({item}) => handleOriginData(item, 'origin')}
                    keyExtractor={item => item.id}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={10}
                    removeClippedSubviews={true}
                    style={styles.cityListContainer}
                    nestedScrollEnabled
                    contentContainerStyle={styles.containerStyle}
                  />
                </View>
              )
            ) : null}
            <ToggleButtonInput
              placeHolder="Destination"
              inputValue={busDestination}
              handleInputChange={e => handleInputChange(e, 'destination')}
              selected={busDestCityName}
            />
            {busDestRes ? (
              busDestLoading ? (
                <Text style={styles.loaderTitle}>Loading .....</Text>
              ) : busDestData.length === 0 ? (
                <Text style={styles.loaderTitle}>No results</Text>
              ) : (
                <View>
                  <FlatList
                    data={busDestData}
                    renderItem={({item}) =>
                      handleOriginData(item, 'destination')
                    }
                    keyExtractor={item => item.id}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={10}
                    removeClippedSubviews={true}
                    style={styles.cityListContainer}
                    nestedScrollEnabled
                    contentContainerStyle={styles.containerStyle}
                  />
                </View>
              )
            ) : null}
            <CalenderButton
              title={'Departure'}
              handlePress={handleCalender}
              value={cabFormatedDate}
            />
            <View style={{width: '50%'}}>
              <HotelDropDown
                length={6}
                starting={1}
                placeHolder="Adults"
                value={NoofBusPassengers}
                handleChangeValue={val => handlenoOfPassengers(val)}
              />
            </View>

            <CustomButton title="Search Buses" handleSubmit={searchBus}/>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    {
  calenderOpen && (
    <DateTimePicker
      value={busOutboundDate}
      mode="date"
      display="default"
      onChange={handleStartDate}
      minimumDate={new Date()}
      is24Hour={true}
    />
  )
}
</>
  );
};

export default BusSearch;

