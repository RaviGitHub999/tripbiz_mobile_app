import { View, Text, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import MyContext from '../../context/Context'
import FlightCard from './FlightCard'
import IconSwitcher from '../common/icons/IconSwitcher'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import { colors, fonts } from '../../config/theme'
import CustomRadioButton from '../common/customRadioButton/CustomRadioButton'
const sunImg = [
    {
        title: "Before 6 AM",
        url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_inactive.png",
        clicked: false,
        time:"morning"
    },
    {
        title: "6 AM - 12 PM",
        url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png",
        clicked: false,
        time:"noon"
    },
    {
        title: "12 PM - 6 PM",
        url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png",
        clicked: false,
        time:"evening"
    },
    {
        title: "After 6 PM",
        url: "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png",
        clicked: false,
        time:"night"
    }
]
const flightStops=[
  {
    title:'Nonstop only',
    stops:0
  },
  {
    title:'1 stop or fewer',
    stops:1
  },
  {
    title:'2 stops or fewer',
    stops:2
  }
]
const FlightList = ({ index }) => {
    const [times, setTimes] = useState(sunImg);
    const [selectedStops, setSelectedStops] = useState(null);
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
    const { flightResList, actions,showFilters } = useContext(MyContext)
    var flightArr = flightResList[0].map((flight) => {
        return { ...actions.modifyFlightObject(flight[0]) };
      });
      const toggleSelection1 = (index) => {
        const updatedTimes = [...times];
        setDepSelectedTime((prev)=>prev===updatedTimes[index].time?null:updatedTimes[index].time)
      };
      const toggleSelection2 = (index) => {
        const updatedTimes = [...times];
        setArrSelectedTime((prev)=>prev===updatedTimes[index].time?null:updatedTimes[index].time)
      };
      const img1 = times.map((item, index) => {
        return (
          <TouchableOpacity key={item.title} onPress={() => toggleSelection1(index)} style={[styles.sunimgCardContainer, depSelectedTime===item.time && styles.selected]}>
            <Image source={{ uri: item.url }} style={styles.sunImges} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )
      })
      const img2 = times.map((item, index) => {
        return (
          <TouchableOpacity key={item.title} onPress={() => toggleSelection2(index)} style={[styles.sunimgCardContainer, arrSelectedTime===item.time && styles.selected]}>
            <Image source={{ uri: item.url }} style={styles.sunImges} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )
      })
      const flatListRef = useRef(null)
      const handleFlightStops = (item,index) => {
        flatListRef.current?.scrollToIndex({ animated: true, index: index });
       return setStops((prevAirline) =>
        prevAirline === item ? null : item
      );
      }
      const handleFlightsNameFilter=(airlinename)=>
      {
        setAirline((prevAirline) =>
        prevAirline === airlinename ? null : airlinename
      )
      }
      const handleFlightsNames = ({ item }) => {
        return (
          <TouchableOpacity onPress={()=>handleFlightsNameFilter(item)} style={[styles.flightNameBtn, airline === item && styles.selectedFlightNameBtn]}>
            <Text  style={[styles.flightName, airline === item && styles.selectedFlightName]}>{item}</Text>
          </TouchableOpacity>
        )
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
      var applyFilters = async () => {
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
        // actions.setIntStopPts1(intStops1)
        // if (intStops1) {
        //   setCount((prev) => prev + 1);
        // }
        // actions.setIntStopPts2(intStops2);
        // if (intStops2) {
        //   setCount((prev) => prev + 1);
        // }
        // intArrHandleTime1Click(intarrSelectedTime1);
        // if (intarrSelectedTime1) {
        //   setCount((prev) => prev + 1);
        // }
        // intArrHandleTime2Click(intarrSelectedTime2);
        // if (intarrSelectedTime2) {
        //   setCount((prev) => prev + 1);
        // }
        arrHandleTimeClick(arrSelectedTime);
        if (arrSelectedTime) {
          setCount((prev) => prev + 1);
        }
        // intDepHandleTime1Click(intdepSelectedTime1)
        // if (intdepSelectedTime1) {
        //   setCount((prev) => prev + 1);
        // }
        // intDepHandleTime2Click(intdepSelectedTime2)
        // if (intdepSelectedTime2) {
        //   setCount((prev) => prev + 1);
        // }
        depHandleTimeClick(depSelectedTime)
        if (depSelectedTime) {
          setCount((prev) => prev + 1);
        }
    } 
        const addToObj = (item) => {
            if (!airports[item]) {
              const updatedTargetObject = { ...airports, [item]: true };
              setAirports(updatedTargetObject);
            }
          };
          flightArr.map((flight) => {
            return { ...addToObj(flight.segments[0].airlineName) };
          });
          var isInternationalRound = flightArr.every((seg) => {
            return seg.segments.length === 2
          });
          var airlines = Object.entries(airports).map(([key, value]) => {
            return `${key}`;
          });   
    return (
        <View>
          {!showFilters? <View style={styles.filtersHeaderContainer}>
                    <View style={styles.filtersIconContainer}>
                        <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
                        <Text style={styles.filterHeader}>{"Filters"}</Text>
                    </View>
                    <TouchableOpacity onPress={() => actions.handleFlightsFilter(true)}>
                        <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
                    </TouchableOpacity>
                </View>:<ScrollView nestedScrollEnabled style={styles.upArrowIconmainContainer}>
      <View style={styles.filtersIconContainer}>
        <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
        <Text style={styles.filterHeader}>{"Filters"}</Text>
      </View>
      <View style={styles.filtersmainContainer}>
        <View>
          <Text style={styles.filterTitles}>{"Airline"}</Text>
          <FlatList data={airlines} renderItem={handleFlightsNames} numColumns={3} style={styles.flightNamesRenderContainer} nestedScrollEnabled />
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Stops"}</Text>
          <View style={[styles.stopsContainer]}>
            <FlatList ref={flatListRef} data={flightStops} renderItem={({item,index})=>
            {
              return(
                  <TouchableOpacity onPress={() => handleFlightStops(item.stops,index)}  style={[styles.flightStopsTitle,stops===item.stops&&styles.activeStop]}>
                    <Text key={item.stops} style={[styles.flightStopsText,stops===item.stops&&styles.activeStopsText]}>{item.title}</Text>
                  </TouchableOpacity>
              )
            }} horizontal showsHorizontalScrollIndicator={false}/>
          </View>
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Departure Time"}</Text>
          <View style={styles.mappedSunImgContainer}>
            {img1}
          </View>
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Arrival Time"}</Text>
          <View style={styles.mappedSunImgContainer}>
            {img2}
          </View>
        </View>
        <View>
          <Text style={styles.filterTitles}>{"Sort"}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.upArrowIcon} onPress={() => actions.handleFlightsFilter(false)}>
        <IconSwitcher componentName='Ionicons' iconName='chevron-up' color={colors.black} iconsize={3.5} />
      </TouchableOpacity>
      <TouchableOpacity onPress={applyFilters}>
        <Text>Apply</Text>
      </TouchableOpacity>
    </ScrollView>}
   <View>
   {flightResList &&
                flightResList[index] &&
                <FlatList data={actions
                    .filterFlights(flightResList[index])} renderItem={({ item, index }) => {
                    return (
                        <FlightCard
                            flightGrp={item}
                            index={index}
                        />
                    )
                }} contentContainerStyle={{paddingBottom:responsiveHeight(20)}} />
            }
   </View>
        </View>
    )
}

export default React.memo(FlightList)
const styles=StyleSheet.create({
    mainContainer:{
        flex:1
    },
    headerContainer:{
        paddingHorizontal:responsiveWidth(3),
        backgroundColor:colors.primary,
        paddingVertical:responsiveHeight(2),
        rowGap:responsiveHeight(1.5),
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        columnGap:responsiveHeight(1.2),
    },
    title:{
        fontFamily:fonts.primary,
        color:colors.white,
        fontSize:responsiveHeight(1.5),
        width:"90%"
    },
    editButton:{
        backgroundColor:colors.highlight,
        height:responsiveHeight(3.8),
        width:responsiveHeight(3.8),
        borderRadius:responsiveHeight(3),
        alignItems:'center',
        justifyContent:'center',
    },
    travellerDescription:{
        flexDirection:'row'
    },
    descriptionTitles:{
color:colors.white,
fontSize:responsiveHeight(2),
fontFamily:fonts.textFont
    },
    activeIndicatorMainContainer:{
        flex:1,
    },
    activeIndicator:{ 
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
},
nodata:{
    textAlign:'center',
    textAlignVertical:'center',
    flex:1,
    fontSize:responsiveHeight(2.5),
    fontFamily:fonts.textFont,
    color:colors.black
},
filtersHeaderContainer:{
flexDirection:'row',
justifyContent:'space-between',
paddingHorizontal:responsiveHeight(1),
paddingVertical:responsiveHeight(1.5),
borderBlockColor:colors.white,
elevation:responsiveHeight(0.1)
},
filtersIconContainer:{
    flexDirection:'row',
    columnGap:responsiveHeight(1),
    alignItems:'center'
},
filterHeader:{
    fontSize:responsiveHeight(2.5),
    color:colors.black,
    fontFamily:fonts.textFont
},
upArrowIconmainContainer:
{
    borderWidth: 1,
    paddingLeft: responsiveWidth(2),
},
upArrowIcon: {
    alignItems: 'center',
    justifyContent: 'center'
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
    marginTop: responsiveHeight(2),
    rowGap: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3)
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
    // borderWidth:1,
    alignItems: "center",
    justifyContent: 'center',
    padding: responsiveHeight(1)
},
// title: {
//     fontSize: responsiveHeight(1.5)
// },
selected: {
    backgroundColor: 'green',
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
    marginTop: responsiveHeight(2)
},
selectedFlightNameBtn:{
    backgroundColor:colors.gray
},
flightName:{
    fontSize:responsiveHeight(1.6),
    fontFamily:fonts.textFont,
},
selectedFlightName:{
color:colors.white
},
stopsContainer:{
   columnGap:responsiveWidth(2),
    marginTop:responsiveHeight(2),
    flexDirection:"row"
},
flightStopsTitle:{
  borderWidth:1,
  paddingVertical:responsiveHeight(0.6),
  paddingHorizontal:responsiveWidth(3),
  borderRadius:responsiveHeight(3),
  alignItems:'center',
  justifyContent:'center',
  marginLeft:responsiveWidth(2)
},
activeStop:{
  backgroundColor:colors.gray
},
flightStopsText:{
  fontSize:responsiveHeight(1.8)
},
activeStopsText:{
  fontFamily:fonts.primary,
  color:colors.white
}
})