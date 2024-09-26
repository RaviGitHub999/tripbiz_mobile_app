import { View, Text, FlatList, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import MyContext from '../../context/Context'
import FlightCard from './FlightCard'
import IconSwitcher from '../common/icons/IconSwitcher'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import { colors, fonts } from '../../config/theme'
import CustomRadioButton from '../common/customRadioButton/CustomRadioButton'
import FilterHeader from '../common/filterHeader/FilterHeader'
const sunImg = [
  {
    title: "Before 6 AM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png",
    clicked: false,
    time: "morning"
  },
  {
    title: "6 AM - 12 PM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png",
    clicked: false,
    time: "noon"
  },
  {
    title: "12 PM - 6 PM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png",
    clicked: false,
    time: "evening"
  },
  {
    title: "After 6 PM",
    url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png",
    clicked: false,
    time: "night"
  }
]
const flightStops = [
  {
    title: 'Nonstop only',
    stops: 0
  },
  {
    title: '1 stop or fewer',
    stops: 1
  },
  {
    title: '2 stops or fewer',
    stops: 2
  }
]
const sortData =
  [
    {
      title: "Price",
      des: "Lowest to Highest",
      id: 0
    },
    {
      title: "Duration",
      des: "Shortest to Longest",
      id: 1
    },
  ]
const FlightList = ({ index, props }) => {
  console.log("list")
  const [times, setTimes] = useState(sunImg);
  const [selectedStops, setSelectedStops] = useState(null);
  const [depSelectedTime, setDepSelectedTime] = useState(null);
  const [arrSelectedTime, setArrSelectedTime] = useState(null);
  const [airports, setAirports] = useState({});
  const [stops, setStops] = useState(null);
  const [intStops1, setIntStops1] = useState(null);
  const [intStops2, setIntStops2] = useState(null);
  const [airline, setAirline] = useState();
  const [intarrSelectedTime1, setIntSelectedArrTime1] = useState(null);
  const [intarrSelectedTime2, setIntSelectedArrTime2] = useState(null);
  const [intdepSelectedTime1, setIntSelectedDepTime1] = useState(null);
  const [intdepSelectedTime2, setIntSelectedDepTime2] = useState(null);
  const [count, setCount] = useState(0);
  const [cost, setCost] = useState(true)
  var [showFilters, setShowFilters] = useState(false);
  const [duration, setDuration] = useState(false);
  const [sortInd, setSortInd] = useState(0)
  const { actions,
    flightResList,
    internationalFlights,
    flightResJType,
    flightResult,
    byDuration,
    byCost,
    intStopPts2
  } = useContext(MyContext)
  var flightArr = flightResList[0]?.map((flight) => {
    return { ...actions.modifyFlightObject(flight[0]) };
  });
  const toggleSelection1 = (index) => {
    const updatedTimes = [...times];
    setArrSelectedTime((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
    // setDepSelectedTime((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
  };
  const toggleSelection2 = (index) => {
    const updatedTimes = [...times];
    // setArrSelectedTime((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
    setDepSelectedTime((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
  };
  const toggleintDepSelection1 = (index) => {
    const updatedTimes = [...times];
    // setIntSelectedDepTime1((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
    setIntSelectedArrTime1((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
  };
  const toggleintDepSelection2 = (index) => {
    const updatedTimes = [...times];
    setIntSelectedArrTime2((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
  }
  const toggleintArrSelection1 = (index) => {
    const updatedTimes = [...times];
    // setIntSelectedArrTime1((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
    setIntSelectedDepTime1((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
  };

  const toggleintArrSelection2 = (index) => {
    const updatedTimes = [...times];
    // setIntSelectedArrTime2((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
    setIntSelectedDepTime2((prev) => prev === updatedTimes[index].time ? null : updatedTimes[index].time)
  };
  const img1 = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleSelection1(index)} style={[styles.sunimgCardContainer, arrSelectedTime === item.time && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={[styles.title, arrSelectedTime === item.time && styles.selectedText]}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const img2 = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleSelection2(index)} style={[styles.sunimgCardContainer, depSelectedTime === item.time && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={[styles.title, depSelectedTime === item.time && styles.selectedText]}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const intdepimg1 = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleintDepSelection1(index)} style={[styles.sunimgCardContainer, intarrSelectedTime1 === item.time && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={[styles.title, intarrSelectedTime1 === item.time && styles.selectedText]}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const intdepimg2 = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleintDepSelection2(index)} style={[styles.sunimgCardContainer, intarrSelectedTime2 === item.time && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={[styles.title, intarrSelectedTime2 === item.time && styles.selectedText]}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const intarrimg1 = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleintArrSelection1(index)} style={[styles.sunimgCardContainer, intdepSelectedTime1 === item.time && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={[styles.title, intdepSelectedTime1 === item.time && styles.selectedText]}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const intarrimg2 = times.map((item, index) => {
    return (
      <TouchableOpacity key={item.title} onPress={() => toggleintArrSelection2(index)} style={[styles.sunimgCardContainer, intdepSelectedTime2 === item.time && styles.selected]}>
        <Image source={{ uri: item.url }} style={styles.sunImges} />
        <Text style={[styles.title, intdepSelectedTime2 === item.time && styles.selectedText]}>{item.title}</Text>
      </TouchableOpacity>
    )
  })
  const flatListRef = useRef(null)
  const flatListRefint1 = useRef(null)
  const flatListRefint2 = useRef(null)
  const handleFlightStops = useCallback((item, index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index });
    return setStops((prevAirline) =>
      prevAirline === item ? null : item
    );
  }, [flatListRef, setStops]);
  const handleintFlightStops1 = useCallback((item, index) => {
    flatListRefint1.current?.scrollToIndex({ animated: true, index: index });
    return setIntStops1((prevAirline) =>
      prevAirline === item ? null : item
    );
  }, [flatListRef, setIntStops1]);
  const handleintFlightStops2 = useCallback((item, index) => {
    flatListRefint2.current?.scrollToIndex({ animated: true, index: index });
    return setIntStops2((prevAirline) =>
      prevAirline === item ? null : item
    );
  }, [flatListRef, setIntStops2]);
  const handleFlightsNameFilter = (airlinename) => {
    setAirline((prevAirline) =>
      prevAirline === airlinename ? null : airlinename
    )
  }
  const handleFlightsNames = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleFlightsNameFilter(item)} style={[styles.flightNameBtn, airline === item && styles.selectedFlightNameBtn]}>
        <Text style={[styles.flightName, airline === item && styles.selectedFlightName]}>{item}</Text>
      </TouchableOpacity>
    )
  }
  const handleCost = () => {
    setCost(true)
    setDuration(false)
    setSortInd(0)
  }
  const handleDuration = () => {
    setCost(false)
    setDuration(true)
    setSortInd(1)
  }
  const arrHandleTimeClick = (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      actions.setOriginStartTime(startDate);
      actions.setOriginEndTime(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      actions.setOriginStartTime(startDate);
      actions.setOriginEndTime(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      actions.setOriginStartTime(startDate);
      actions.setOriginEndTime(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      actions.setOriginStartTime(startDate);
      actions.setOriginEndTime(endDate);
    } else if (arrSelectedTime === null) {
      actions.setOriginStartTime(null);
      actions.setOriginEndTime(null);
    }
  };

  const depHandleTimeClick = (time) => {
    const startDate = new Date();
    const endDate = new Date();

    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      actions.setDestStartTime(startDate);
      actions.setDestEndTime(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      actions.setDestStartTime(startDate);
      actions.setDestEndTime(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      actions.setDestStartTime(startDate);
      actions.setDestEndTime(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      actions.setDestStartTime(startDate);
      actions.setDestEndTime(endDate);
    } else if (depSelectedTime === null) {
      actions.setDestStartTime(null);
      actions.setDestEndTime(null);
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

  var intDepHandleTime1Click = (time) => {
    const startDate = new Date();
    const endDate = new Date();
    if (time === "morning") {
      startDate.setHours(0);
      endDate.setHours(6);
      actions.setIntDestStartTime1(startDate);
      actions.setIntDestEndTime1(endDate);
    } else if (time === "noon") {
      startDate.setHours(6);
      endDate.setHours(12);
      actions.setIntDestStartTime1(startDate);
      actions.setIntDestEndTime1(endDate);
    } else if (time === "evening") {
      startDate.setHours(12);
      endDate.setHours(18);
      actions.setIntDestStartTime1(startDate);
      actions.setIntDestEndTime1(endDate);
    } else if (time === "night") {
      startDate.setHours(18);
      endDate.setHours(23);
      endDate.setMinutes(59)
      actions.setIntDestStartTime1(startDate);
      actions.setIntDestEndTime1(endDate);
    } else if (intdepSelectedTime1 === null) {
      actions.setIntDestStartTime1(null);
      actions.setIntDestEndTime1(null);
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
  const removeFilters = () => {
    setCount(0)
    actions.setDestStartTime(null);
    actions.setDestEndTime(null);
    actions.setOriginStartTime(null);
    actions.setOriginEndTime(null);
    actions.setStopPts(null);
    actions.setAirlineName("");
    actions.setByCost(true);
    actions.setByDuration(false);
    actions.setIntDestEndTime1(null)
    actions.setIntDestEndTime2(null)
    actions.setIntDestStartTime1(null)
    actions.setIntDestStartTime2(null)
    actions.setIntOriginEndTime1(null)
    actions.setIntOriginEndTime2(null)
    actions.setIntOriginStartTime1(null)
    actions.setIntOriginStartTime2(null)
    actions.setIntStopPts1(null)
    actions.setIntStopPts2(null)
    setIntSelectedArrTime1(null)
    setIntSelectedArrTime2(null)
    setIntSelectedDepTime1(null)
    setIntSelectedDepTime2(null)
    setArrSelectedTime(null);
    setDepSelectedTime(null);
    setStops(null);
    setAirline(null);
    setIntStops1(null);
    setIntStops2(null);
    setCost(true)
    setDuration(false)
    setSortInd(0)
  };
  var applyFilters = () => {
    setShowFilters(false)
    // let countUpdate = 0;
    setCount(0);
    actions.setAirlineName(airline);
    if (airline) {
      setCount((prev) => prev + 1);
    }
    actions.setStopPts(stops)
    if (stops !== null) {
      setCount((prev) => prev + 1);
    }
    actions.setIntStopPts1(intStops1)
    if (intStops1 !== null) {
      setCount((prev) => prev + 1);
    }
    actions.setIntStopPts2(intStops2);
    if (intStops2 !== null) {
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
      // countUpdate++;
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
    actions.setByCost(cost)
    actions.setByDuration(duration)
    if (duration) {
      setCount((prev) => prev + 1);
    }
  }
  const addToObj = (item) => {
    if (!airports[item]) {
      const updatedTargetObject = { ...airports, [item]: true };
      setAirports(updatedTargetObject);
    }
  };
  flightArr?.map((flight) => {
    return { ...addToObj(flight.segments[0].airlineName) };
  });
  var isInternationalRound = flightArr?.every((seg) => {
    return seg.segments.length === 2
  });
  var airlines = Object.entries(airports).map(([key, value]) => {
    return `${key}`;
  });
  const memoizedRenderItem = useMemo(() => {
    return ({ item, index }) => {
      return (
        <FlightCard
          flightGrp={item}
          index={index}
          props={props}
          removeFilters={removeFilters}
        />
      );
    };
  }, [])
  const handlePress = useCallback(() => {
    setShowFilters(true);
  }, []);
  const handlejourneyType = useCallback((value) => {
    actions.setFlightResJType(value)
    removeFilters()
  }, [])
const listEmpty=()=>
  {
    return(
      <View style={styles.listEmptyContainer}>
        <Text style={styles.filterHeader}>No Data Found!!!</Text>
      </View>
    )
  }
  return (
    <View style={{ flex: 1 }}>
      {
        flightResList.length > 0 ?
          <FilterHeader value={showFilters} handlefiltersToggleActions={handlePress} handlefilters={applyFilters} filtersCount={count} removeFilters={removeFilters}>
            <View style={styles.filtersmainContainer}>
              <View>
                <Text style={styles.filterTitles}>{"Airline"}</Text>
                <View style={styles.flightNamesContentContainer}>
                  {airlines.map((item) => {
                    return (
                      <TouchableOpacity onPress={() => handleFlightsNameFilter(item)} style={[styles.flightNameBtn, airline === item && styles.selectedFlightNameBtn]}>
                        <Text style={[styles.flightName, airline === item && styles.selectedFlightName]}>{item}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.filterTitles}>{"Stops"}</Text>
                {isInternationalRound ?
                  <View style={styles.stopsMainContainer}>
                    <View>
                      <Text style={styles.stopsSubTitle}>Onward Flight</Text>
                      <View style={[styles.stopsContainer]}>
                        <FlatList ref={flatListRef} data={flightStops} renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity onPress={() => handleintFlightStops1(item.stops, index)} style={[styles.flightStopsTitle, intStops1 === item.stops && styles.activeStop]}>
                              <Text key={item.stops} style={[styles.flightStopsText, intStops1 === item.stops && styles.activeStopsText]}>{item.title}</Text>
                            </TouchableOpacity>
                          )
                        }} horizontal showsHorizontalScrollIndicator={false} />
                      </View>
                    </View>
                    <View>
                      <Text style={styles.stopsSubTitle}>Return Flight</Text>
                      <View style={[styles.stopsContainer]}>
                        <FlatList ref={flatListRef} data={flightStops} renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity onPress={() => handleintFlightStops2(item.stops, index)} style={[styles.flightStopsTitle, intStops2 === item.stops && styles.activeStop]}>
                              <Text key={item.stops} style={[styles.flightStopsText, intStops2 === item.stops && styles.activeStopsText]}>{item.title}</Text>
                            </TouchableOpacity>
                          )
                        }} horizontal showsHorizontalScrollIndicator={false} />
                      </View>
                    </View>

                  </View>


                  : <View style={[styles.stopsContainer]}>
                    <FlatList ref={flatListRef} data={flightStops} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity onPress={() => handleFlightStops(item.stops, index)} style={[styles.flightStopsTitle, stops === item.stops && styles.activeStop]}>
                          <Text key={item.stops} style={[styles.flightStopsText, stops === item.stops && styles.activeStopsText]}>{item.title}</Text>
                        </TouchableOpacity>
                      )
                    }} horizontal showsHorizontalScrollIndicator={false} />
                  </View>}
              </View>
              <View>
                <Text style={styles.filterTitles}>{"Departure Time"}</Text>
                {isInternationalRound ?
                  <View style={styles.stopsMainContainer}>
                    <View>
                      <Text style={styles.stopsSubTitle}>Onward flight</Text>
                      <View style={styles.mappedSunImgContainer}>
                        {intdepimg1}
                      </View>
                    </View>
                    <View>
                      <Text style={styles.stopsSubTitle}>Return flight</Text>
                      <View style={styles.mappedSunImgContainer}>
                        {intdepimg2}
                      </View>
                    </View>
                  </View>
                  :
                  <View style={styles.mappedSunImgContainer}>
                    {img1}
                  </View>
                }
              </View>
              <View>
                <Text style={styles.filterTitles}>{"Arrival Time"}</Text>
                {isInternationalRound ?
                  <View style={styles.stopsMainContainer}>
                    <View>
                      <Text style={styles.stopsSubTitle}>Onward flight</Text>
                      <View style={styles.mappedSunImgContainer}>
                        {intarrimg1}
                      </View>
                    </View>
                    <View>
                      <Text style={styles.stopsSubTitle}>Return flight</Text>
                      <View style={styles.mappedSunImgContainer}>
                        {intarrimg2}
                      </View>
                    </View>
                  </View>
                  : <View style={styles.mappedSunImgContainer}>
                    {img2}
                  </View>}
              </View>
              <View style={styles.sortingMainContainer}>
                <Text style={styles.filterTitles}>{"Sort"}</Text>
                <FlatList data={sortData} renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity style={item.id === sortInd ? [styles.sortingBtnsContainer, styles.sortingBtnsSelectedContainer] : styles.sortingBtnsContainer} onPress={item.title === "Price" ? handleCost : handleDuration}>
                      <Text style={item.id === sortInd ? [styles.sortingBtnText, styles.sortingBtnSelectedText] : styles.sortingBtnText}>{`${item.title}(${item.des})`}</Text>
                    </TouchableOpacity>
                  )
                }} horizontal />
              </View>
            </View>

            <TouchableOpacity style={styles.upArrowIcon} onPress={() => setShowFilters(false)}>
              <IconSwitcher componentName='Ionicons' iconName='chevron-up' color={colors.black} iconsize={3.5} />
            </TouchableOpacity>
            {/* </ScrollView> */}

          </FilterHeader>
          : null
      }

      {
        count > 0 ? (
          <TouchableOpacity onPress={() => removeFilters()} style={styles.clearFiltersBtn}>
            <Text style={styles.clearFiltersBtnTitle}>Clear Filters</Text>
          </TouchableOpacity>
        ) : null
      }
      {
        flightResList.length > 1 && !internationalFlights ?
          <View style={styles.flightResultsNavMainContainer}>
            <TouchableOpacity style={[styles.flightResultsNavItem, flightResJType === 0 && styles.flightResultsNavSelectedItem]} onPress={() => { handlejourneyType(0), removeFilters() }}>
              <Text style={[styles.flightResultsNavItemText, flightResJType === 0 && styles.flightResultsNavSelectedItemText]}>{`${flightResult?.Origin}`}</Text>
              <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={flightResJType === 0 ? colors.white : colors.black} />
              <Text style={[styles.flightResultsNavItemText, flightResJType === 0 && styles.flightResultsNavSelectedItemText]}>{`${flightResult?.Destination}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.flightResultsNavItem, flightResJType === 1 && styles.flightResultsNavSelectedItem]} onPress={() => { handlejourneyType(1), removeFilters() }}>
              <Text style={[styles.flightResultsNavItemText, flightResJType === 1 && styles.flightResultsNavSelectedItemText]}>{`${flightResult?.Destination}`}</Text>
              <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={flightResJType === 1 ? colors.white : colors.black} />
              <Text style={[styles.flightResultsNavItemText, flightResJType === 1 && styles.flightResultsNavSelectedItemText]}>{`${flightResult?.Origin}`}</Text>
            </TouchableOpacity>
          </View> : null
      }

      <View style={{ flex: 1 }}>
        {
          flightResList.length > 0 ? (
            flightResList[index] && !showFilters &&
            <FlatList
              data={actions.filterFlights(flightResList[index])}
              renderItem={memoizedRenderItem}
              contentContainerStyle={{ paddingBottom: responsiveHeight(20) }}
              ListEmptyComponent={listEmpty}
            />
          ) : <View style={styles.noFlightsTitleContainer}>
            <Text style={styles.noFlightsTitle}>Flight search hasn't returned any results</Text>
          </View>
        }
      </View>
    </View>
  )
}

export default React.memo(FlightList)
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  headerContainer: {
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: colors.primary,
    paddingVertical: responsiveHeight(2),
    rowGap: responsiveHeight(1.5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: responsiveHeight(1.2),
  },
  title: {
    fontFamily: fonts.primary,
    color: colors.gray,
    fontSize: responsiveHeight(1.5),
    // width: "90%"
  },
  selectedText: {
    color: colors.white
  },
  editButton: {
    backgroundColor: colors.highlight,
    height: responsiveHeight(3.8),
    width: responsiveHeight(3.8),
    borderRadius: responsiveHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  travellerDescription: {
    flexDirection: 'row'
  },
  descriptionTitles: {
    color: colors.white,
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textFont
  },
  activeIndicatorMainContainer: {
    flex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodata: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    fontSize: responsiveHeight(2.5),
    fontFamily: fonts.textFont,
    color: colors.black
  },
  filtersHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    // paddingHorizontal: responsiveHeight(1),
    // paddingVertical: responsiveHeight(1.5),
    // borderBlockColor: colors.white,
    elevation: responsiveHeight(0.1),
  },
  filtersIconContainer: {
    flexDirection: 'row',
    columnGap: responsiveHeight(1),
    alignItems: 'center',
    paddingLeft: responsiveWidth(2),
    paddingVertical: responsiveHeight(1.5),
    borderWidth: 1
  },
  filterHeader: {
    fontSize: responsiveHeight(2.5),
    color: colors.black,
    fontFamily: fonts.textFont
  },
  upArrowIconmainContainer:
  {
    paddingLeft: responsiveWidth(2),
  },
  upArrowIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(1)
  },
  // filterHeader: {
  //     fontSize: responsiveHeight(2.8),
  //     color: colors.black,
  //     fontFamily: fonts.textFont
  // },
  // filtersIconContainer: {
  //     flexDirection: 'row',
  //     columnGap: responsiveHeight(1),
  //     alignItems: 'center'
  // },
  filtersmainContainer: {
    // marginTop: responsiveHeight(2),
    rowGap: responsiveHeight(2),
    // paddingHorizontal: responsiveWidth(3)
  },
  filterTitles: {
    fontSize: responsiveHeight(2.3),
    letterSpacing: responsiveWidth(0.2),
    fontFamily: fonts.textFont,
    color: colors.black
  },
  sunImges: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
  },
  mappedSunImgContainer: {
    flexDirection: 'row',
    columnGap: responsiveWidth(2),
    marginTop: responsiveHeight(1)
  },
  sunimgCardContainer: {
    alignItems: "center",
    justifyContent: 'center',
    padding: responsiveHeight(0.6)
  },
  // title: {
  //     fontSize: responsiveHeight(1.5)
  // },
  selected: {
    backgroundColor: colors.gray,
  },
  flightNameBtn: {
    borderWidth: 1,
    // width: "30%",
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveHeight(0.5),
    marginRight: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    borderRadius: responsiveHeight(2),
    // flexDirection:'row'
  },
  flightNamesRenderContainer: {
    flex: 1,
    marginTop: responsiveHeight(2),

  },
  flightNamesContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    marginTop:responsiveHeight(1)
  },
  selectedFlightNameBtn: {
    backgroundColor: colors.gray
  },
  flightName: {
    fontSize: responsiveHeight(1.6),
    fontFamily: fonts.textFont,
  },
  selectedFlightName: {
    color: colors.white
  },
  stopsContainer: {
    columnGap: responsiveWidth(2),
    marginTop: responsiveHeight(1.2),
    flexDirection: "row"
  },
  flightStopsTitle: {
    borderWidth: 1,
    paddingVertical: responsiveHeight(0.6),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: responsiveWidth(2)
  },
  activeStop: {
    backgroundColor: colors.gray
  },
  flightStopsText: {
    fontSize: responsiveHeight(1.8),
    fontFamily:fonts.textFont,
    color:colors.gray
  },
  activeStopsText: {
    fontFamily: fonts.primary,
    color: colors.white
  },
  sortingBtnsContainer: {
    borderWidth: 1,
    width: responsiveWidth(35),
    height: responsiveHeight(6),
    marginRight: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveHeight(2)
  },
  sortingBtnsSelectedContainer: {
    backgroundColor: colors.primary
  },
  sortingBtnText:
  {
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.primary,
    color: colors.black
  },
  sortingBtnSelectedText: {
    color: colors.white
  },
  sortingMainContainer: {
    rowGap: responsiveHeight(1.5)
  },
  applyFiltersBtn: {
    alignSelf: "flex-end",
    borderWidth: 1,
    paddingHorizontal: responsiveHeight(2),
    paddingVertical: responsiveHeight(0.6),
    marginRight: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveHeight(1.2),
    backgroundColor: colors.black
  },
  applyFiltersBtnText: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.white
  },
  flightResultsNavMainContainer: {
    flexDirection: "row",
    alignSelf: 'center',
    columnGap: responsiveHeight(2),
    marginTop: responsiveHeight(2)
  },
  flightResultsNavItem: {
    flexDirection: "row",
    columnGap: responsiveWidth(2),
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(2.5),
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.3),
    borderRadius: responsiveHeight(3)
  },
  flightResultsNavSelectedItem: {
    backgroundColor: colors.black
  },
  flightResultsNavItemText: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: colors.black
  },
  flightResultsNavSelectedItemText: {
    color: colors.white
  },
  clearFiltersBtn: {
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(5),
    marginTop: responsiveHeight(2),
  },
  clearFiltersBtnTitle: {
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(1.8),
    color: colors.black,
    textDecorationLine: 'underline'
  },
  noFlightsTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(1),

  },
  noFlightsTitle: {
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(2.8),
    color: colors.primary
  },
  listEmptyContainer:{
    alignItems:'center',
    marginTop:responsiveHeight(2)
  },
  stopsSubTitle:{
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(1.6),
    color: colors.primary
  },
  stopsMainContainer:{
    gap:responsiveHeight(1),
    marginTop:responsiveHeight(1)
  }
})  
