import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import IconSwitcher from '../common/icons/IconSwitcher'
import { colors } from '../../config/theme'
import { styles } from './styles'
import CustomRadioButton from '../common/customRadioButton/CustomRadioButton'
import MyContext from '../../context/Context'
const sunImg = [
  {
    title: "Before 6 AM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png",
    clicked: false
  },
  {
    title: "6 AM - 12 PM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png",
    clicked: false
  },
  {
    title: "12 PM - 6 PM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png",
    clicked: false
  },
  {
    title: "After 6 PM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png",
    clicked: false
  }
]

const FlightFilters = () => {
  console.log("filterComponent")
  const [times, setTimes] = useState(sunImg);
  const [selectedStops, setSelectedStops] = useState<number | null>(null);
  const [depSelectedTime, setDepSelectedTime] = useState(null);
  const [arrSelectedTime, setArrSelectedTime] = useState(null);
  const [airports, setAirports] = useState({});
  const [stops, setStops] = useState();
  const [intStops1, setIntStops1] = useState();
  const [intStops2, setIntStops2] = useState();
  const [airline, setAirline] = useState();
  const [intarrSelectedTime1, setIntSelectedArrTime1] = useState(null);
  const [intarrSelectedTime2, setIntSelectedArrTime2] = useState(null);
  const [intdepSelectedTime1, setIntSelectedDepTime1] = useState(null);
  const [intdepSelectedTime2, setIntSelectedDepTime2] = useState(null);
  const [count, setCount] = useState(0);
  const [cost, setCost] = useState(true)
  const [duration, setDuration] = useState(false);
  const { actions } = useContext<any>(MyContext)
  const toggleSelection = (index: number) => {
    const updatedTimes = [...times];
    updatedTimes[index].clicked = !updatedTimes[index].clicked;
    setTimes(updatedTimes);
  };
  const img = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleSelection(index)} style={[styles.sunimgCardContainer, item.clicked && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const handleFlightStops = (item: number) => {
    if (item === selectedStops) {
      setSelectedStops(null)
    }
    else {
      setSelectedStops(item)
    }
  }
  const arrHandleTimeClick = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      await actions.setOriginStartTime(startDate);
      await actions.setOriginEndTime(endDate);
    } else if (arrSelectedTime === null) {
      await actions.setOriginStartTime(null);
      await actions.setOriginEndTime(null);
    }
  };

  const depHandleTimeClick = async (time) => {
    const startDate = new Date();
    const endDate = new Date();

    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      await actions.setDestStartTime(startDate);
      await actions.setDestEndTime(endDate);
    } else if (depSelectedTime === null) {
      await actions.setDestStartTime(null);
      await actions.setDestEndTime(null);
    }
  };

  var intArrHandleTime1Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();

    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      await actions.setIntOriginStartTime1(startDate);
      await actions.setIntOriginEndTime1(endDate);
    } else if (intarrSelectedTime1 === null) {
      await actions.setIntOriginStartTime1(null);
      await actions.setIntOriginEndTime1(null);
    }
  }
  var intArrHandleTime2Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();

    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      await actions.setIntOriginStartTime2(startDate);
      await actions.setIntOriginEndTime2(endDate);
    } else if (intarrSelectedTime1 === null) {
      await actions.setIntOriginStartTime2(null);
      await actions.setIntOriginEndTime2(null);
    }
  }

  var intDepHandleTime1Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      await actions.setIntDestStartTime1(startDate);
      await actions.setIntDestEndTime1(endDate);
    } else if (intdepSelectedTime1 === null) {
      await actions.setIntDestStartTime1(null);
      await actions.setIntDestEndTime1(null);
    }
  }

  var intDepHandleTime2Click = async (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      await actions.setIntDestStartTime2(startDate);
      await actions.setIntDestEndTime2(endDate);
    } else if (intdepSelectedTime1 === null) {
      await actions.setIntDestStartTime2(null);
      await actions.setIntDestEndTime2(null);
    }
  }
  let applyFilters = async () => {
    actions.handleFlightsFilter(false)
    setCount(0);
    actions.setAirlineName(airline);
    if (airline) {
      setCount((prev) => prev + 1);
    }
    actions.setStopPts(stops)
    if (stops) {
      setCount((prev) => prev + 1);
    }
    actions.setIntStopPts1(intStops1)
    if (intStops1) {
      setCount((prev) => prev + 1);
    }
    actions.setIntStopPts2(intStops2);
    if (intStops2) {
      setCount((prev) => prev + 1);
    }
    intArrHandleTime1Click(intarrSelectedTime1);
    if (intarrSelectedTime1) {
      setCount((prev) => prev + 1);
    }
    intArrHandleTime2Click(intarrSelectedTime2);
    if (intarrSelectedTime2) {
      setCount((prev) => prev + 1);
    }
    arrHandleTimeClick(arrSelectedTime);
    if (arrSelectedTime) {
      setCount((prev) => prev + 1);
    }
    intDepHandleTime1Click(intdepSelectedTime1)
    if (intdepSelectedTime1) {
      setCount((prev) => prev + 1);
    }
    intDepHandleTime2Click(intdepSelectedTime2)
    if (intdepSelectedTime2) {
      setCount((prev) => prev + 1);
    }
    depHandleTimeClick(depSelectedTime)
    if (depSelectedTime) {
      setCount((prev) => prev + 1);
    }
  }
  return (
    <ScrollView nestedScrollEnabled style={styles.upArrowIconmainContainer}>
      <View style={styles.filtersIconContainer}>
        <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
        <Text style={styles.filterHeader}>{"Filters"}</Text>
      </View>
      <View style={styles.filtersmainContainer}>
        <View>
          <Text style={styles.filterTitles}>{"Airline"}</Text>
          {/* <FlatList data={flightsNamesList} renderItem={handleFlightsNames} numColumns={4} style={styles.flightNamesRenderContainer} nestedScrollEnabled /> */}
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Stops"}</Text>
          <View style={styles.stopsContainer}>
            <CustomRadioButton
              label="Nonstop only"
              selected={selectedStops === 0}
              onSelect={() => handleFlightStops(0)}
            />
            <CustomRadioButton
              label="1 stop or fewer"
              selected={selectedStops === 1}
              onSelect={() => handleFlightStops(1)}
            />
            <CustomRadioButton
              label="2 stops or fewer"
              selected={selectedStops === 2}
              onSelect={() => handleFlightStops(2)}
            />
          </View>
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Departure Time"}</Text>
          <View style={styles.mappedSunImgContainer}>
            {img}
          </View>
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Arrival Time"}</Text>
          <View style={styles.mappedSunImgContainer}>
            {img}
          </View>
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Sort"}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.upArrowIcon} onPress={() => actions.handleFlightsFilter(false)}>
        <IconSwitcher componentName='Ionicons' iconName='chevron-up' color={colors.black} iconsize={3.5} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Apply</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default React.memo(FlightFilters)
