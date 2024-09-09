import { TouchableHighlight, View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { styles } from './styles'
import ToggleButtonInput from '../common/mainComponents/toggleButtonInput/ToggleButtonInput'
import CustomSelect from '../common/mainComponents/customSelect/CustomSelect'
import { colors } from '../../config/theme'
import { responsiveHeight } from '../../utils/responsiveScale'
import CalenderButton from '../common/mainComponents/calenderButton/CalenderButton'
import CustomButton from '../common/customButton/CustomButton'
import HotelDropDown from '../common/hotelDropDown/HotelDropDown'
import DateTimePicker from '@react-native-community/datetimepicker';
import MyContext from '../../context/Context'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CabsData from "../jsonData/Cabs.json"
import { useFocusEffect, useNavigation } from '@react-navigation/native'
const cabTypes =
  [
    "8 hrs cab at disposal",
    "12 hrs cab at disposal",
    "4 hrs cab at disposal",
    "10 hrs cab at disposal"
  ]
  const cabTypeError=[
    "8 hrs cab at disposal",
    "12 hrs cab at disposal",
    "4 hrs cab at disposal",
    "10 hrs cab at disposal",
    "Airport to City center Hotel",
    "City center hotel to airport"
  ]
const cabTimings = {
  "Airport to City center Hotel": 
  [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
  ],
  "City center hotel to Airport": 
  [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
  ],
  "City center hotel to airport": 
  [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
  ],
  "4 hrs cab at disposal": 
  [
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
  ],
  "8 hrs cab at disposal": 
  [
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
  ],
  "12 hrs cab at disposal": ["08:00"],
  "10 hrs cab at disposal": 
  [
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
  ],
};

const defaultTimings = [
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
];
const CabSearch = () => {
  const [cabCity, setCabCity] = useState("");
  const [cityCabResBox, setCityCabResBox] = useState(false);
  const [cabType, setCabType] = useState("Select the Destination Above");
  const [cabCityItem, setCabCityItem] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [noOfCabs, setNoOfCabs] = useState("1");
  const [selectedTime, setSelectedTime] = useState("00:15");
  const [calenderOpen, setCalenderOpen] = useState({
    startDate: false,
    endDate: false
  })
  const [cabStartDate, setCabStartDate] = useState(new Date());
  const [cabEndDate, setCabEndDate] = useState(new Date());
  const [cabStartFormated, setCabStartFormated] = useState("")
  const [cabEndFormated, setCabEndFormated] = useState("")
  const [btnEnable, setBtnEnable] = useState(true)
  const [nights, setNights] = useState("0");
  const [errors, setErrors] = useState({});
  const { actions, cabSearchRes } = useContext(MyContext)
  const{navigate}=useNavigation()
  const getCabTypesForCity = (cityName) => {
    return CabsData.reduce((acc, cityObj) => {
      if (cityObj[cityName]) {
        acc = acc.concat(Object.keys(cityObj[cityName]));
      }
      return acc;
    }, []);
  };
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };
  const handleInputChange = (text) => {
    setCabCity(text);
    setCityCabResBox(true);
    actions.changeCabCityKeyword(text);
  };
  const handleSelectItem = (item, index) => {
    setCabType(item),
      handledropDown(),
      setSelectedItemIndex(index),
      setSelectedTime("00:15")
  }
  const cabCityRenderItem = (item, index) => {
    return (
      <TouchableHighlight
        onPress={() => handleSelectItem(item, index)}
        style={[
          styles.item,
          selectedItemIndex === index && styles.itemHovered,
        ]}
        underlayColor={colors.whiteSmoke} >
        <Text style={[styles.selectedItemTitle, selectedItemIndex === index && styles.activeSelectedItemTitle]}>{item}</Text>
      </TouchableHighlight>
    )
  }
  const handledropDown = () => {
    setViewAll(!viewAll);
  };
  const handleCabs = (e) => {
    setNoOfCabs(e)
  }
  const handleselectTime = (e) => {
    setSelectedTime(e)
  }
  const handleCabTimings = (buttonId) => {
    switch (buttonId) {
      case 'Airport to City center Hotel':
        return cabTimings['Airport to City center Hotel'];
      case 'City center Hotel to Airport':
        return cabTimings['City center hotel to Airport'];
      case '4 hrs cab at disposal':
        return cabTimings['4 hrs cab at disposal'];
      case '8 hrs cab at disposal':
        return cabTimings['8 hrs cab at disposal'];
      case '12 hrs cab at disposal':
        return cabTimings['12 hrs cab at disposal'];
      case '10 hrs cab at disposal':
        return cabTimings['10 hrs cab at disposal'];
      default:
        return defaultTimings;
    }
  };
  const handleCalender_1 = () => {
    setCalenderOpen({ startDate: true })
  }
  const handleCalender_2 = () => {
    setCalenderOpen({ endDate: true })
  }

  const handleStartDate = (event, selectedDate) => {
    if (event.type === 'set') {
      setCalenderOpen({ startDate: false })
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setCabStartFormated(formattedDate)
        setCabStartDate(selectedDate)
      }

      if (cabStartFormated) {
        // const nights = Number(actions.diffNights(selectedDate, cabEndDate))
        setNights(0)
      }
    }
    else {
      setCalenderOpen({ startDate: false })
    }
  }

  const handleEndDate = (event, selectedDate) => {
    if (event.type === 'set') {
      setCalenderOpen({ endDate: false })
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        setCabEndFormated(formattedDate)
        setCabEndDate(selectedDate)

      }
      if (cabStartDate) {
        const nights = Number(actions.diffNights(selectedDate, cabStartDate))
        setNights(nights)
      }
    }
    else {
      setCalenderOpen({ endDate: false })
    }
  }
  const handleSelectCityName = (item) => {
    setCabCityItem(item)
    setCityCabResBox(false)
    setBtnEnable(false)
  }
  const handleCabsCityNames = ({ item: { item } }) => {
    return (
      <TouchableOpacity style={styles.cityName} onPress={() => handleSelectCityName(item)}>
        <Text style={[styles.selectedItemTitle]}>{item}</Text>
      </TouchableOpacity>
    )
  }
  const handleEmptyComponent = () => {
    return (
      <Text style={styles.selectedItemTitle}>No Data Found !!!</Text>
    )
  }
  // const searchCabs=()=>
  //   {
  //    actions.fetchCabs(
  //       cabCityItem,
  //       cabType,
  //       cabStartDate,
  //       cabEndDate>new Date()?cabEndDate:"",
  //       noOfCabs,
  //       Number(nights) + 1,
  //       selectedTime,
  //     )
  //     navigate("CabResList")
  //   }
    const validate = () => {
      const newErrors= {};
      if (cabCityItem==="") newErrors.destination = 'Destination is required';
      if (!cabTypeError.includes(cabType)) newErrors.cabType = 'CabType is required';
      if (cabStartFormated==="") newErrors.startDate = 'Start date is required';
      if (cabEndFormated===""&&cabTypes.includes(cabType)) newErrors.endDate = 'End date is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const searchCabs = () => {
      if (validate()) {
        actions.fetchCabs(
          cabCityItem,
          cabType,
          cabStartDate,
          cabEndDate>new Date()?cabEndDate:"",
          noOfCabs,
          Number(nights) + 1,
          selectedTime,
        )
        navigate("CabResList")
      } else {
        console.log('Form has errors');
      }
    };
    useFocusEffect(
      React.useCallback(() => {
    setNights("0")
    setCabStartDate(new Date())
    setCabEndDate(new Date())
    setCabStartFormated(""),
    setCabEndFormated("")
    setSelectedItemIndex(0),
    setNoOfCabs("1")
    setSelectedTime("00:15")

      }, [])
    );
  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} >
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.mainContainer}>
              <ToggleButtonInput placeHolder="Destination" inputValue={cabCity} handleInputChange={(e) => handleInputChange(e)} selected={cabCityItem} />
              {errors.destination&&<Text style={styles.errorText}>{`* ${errors.destination}`}</Text>}
              {
                cityCabResBox ?
                  <>
                    <FlatList data={cabSearchRes} renderItem={handleCabsCityNames} style={styles.cityListContainer} nestedScrollEnabled contentContainerStyle={styles.containerStyle} ListEmptyComponent={handleEmptyComponent} />
                  </> :
                  null
              }
              <CustomSelect data={getCabTypesForCity(cabCityItem)} renderData={(item, index) => cabCityRenderItem(item, index)
              } selectedItem={cabType} handledropDown={handledropDown} viewAll={viewAll} CustomStyle={styles.customStyle} disable={btnEnable} />
              {errors.cabType&&<Text style={styles.errorText}>{`* ${errors.cabType}`}</Text>}
              <CalenderButton title={"Start Date"} handlePress={handleCalender_1} value={cabStartFormated} />
             {errors.startDate&&<Text style={[styles.errorText]}>{`* ${errors.startDate}`}</Text>}
              {cabTypes.includes(cabType) ? <CalenderButton title={"End Date"} handlePress={handleCalender_2} value={cabEndFormated} /> : null}
             {errors.endDate&&<Text style={[styles.errorText]}>{`* ${errors.endDate}`}</Text>}
              <View style={{ flexDirection: 'row', gap: 30 }}>
                <View style={{ flex: 1 }}>
                  <HotelDropDown length={4} starting={1} value={noOfCabs} handleChangeValue={handleCabs} placeHolder="No of Cabs" />
                </View>
                <View style={{ flex: 1 }}>
                  <HotelDropDown value={selectedTime} handleChangeValue={handleselectTime} placeHolder="Time" dropDownData={handleCabTimings(cabType)} />
                </View>
              </View>
              <CustomButton title='Search Cabs' handleSubmit={searchCabs}/>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>
      {
        calenderOpen.startDate &&
        <DateTimePicker
          value={cabStartDate}
          mode="date"
          display="default"
          onChange={handleStartDate}
          minimumDate={new Date()}
          is24Hour={true}
        />
      }
      {
        calenderOpen.endDate &&
        <DateTimePicker
          value={cabEndDate}
          mode="date"
          display="default"
          onChange={handleEndDate}
          minimumDate={cabStartDate}
          is24Hour={true}
        />
      }
    </>
  )
}

export default CabSearch