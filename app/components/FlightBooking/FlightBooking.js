import { Animated, Modal, Text, View, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import IconSwitcher from '../common/icons/IconSwitcher'
import MyContext from '../../context/Context'
import ProgressBar from '../common/progressBar/ProgressBar'
import { styles } from './styles'
import FlightCard from '../flightList/FlightCard'
import { colors } from '../../config/theme'
import Select from '../common/select/Select'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'

const FlightBooking = ({ navigation }) => {
    var [bookIndex, setBookIndex] = useState(0);
    var [segIndex, setSegIndex] = useState(0);
    var [seatSegIdx, setSeatSegIdx] = useState(0);
    var [selectSeats, setSelectSeats] = useState(false);
    var [seatData, setSeatData] = useState([]);
    var [selectedSeats, setSelectedSeats] = useState([[], []]);
    var [wingPosArr, setWingPosArr] = useState([]);
    var [fareIsOpen, setFareIsOpen] = useState(false);
    var [submitIsOpen, setSubmitIsOpen] = useState(false);
    var [activeTab, setActiveTab] = useState('tab1');
    const [isOpen, setIsOpen] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const { actions, flightBookDataLoading, bookingFlight } = useContext(MyContext)
    var { totalFareSum, totalSeatCharges, totalBaggagePrice, totalMealPrice } =
        actions.getTotalFares(bookingFlight);
    if (flightBookDataLoading) {
        return (
            <View style={styles.mainContainer}>
                <ProgressBar />
            </View>
        );
    }

    const toggleView = () => {
        Animated.timing(animatedValue, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsOpen(!isOpen);
        });
    };
    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const animatedStyles = {
        transform: [{ translateY }],
    };
    const changeBookIndex = (value) => {
        setBookIndex(value);
        setSegIndex(0);
        // setSeatSegIdx(0);
        // setSelectedSeats([[], []]);
    };
    const handleSeatSelectionPopUp = () => {
        setSelectSeats(true);
        setSeatData(
            actions.fillUpSegmentSeats(
                bookingFlight[bookIndex].seatData[segIndex].SegmentSeat
            )
        );
        setWingPosArr(
            actions.getWingPosArr(
                bookingFlight[bookIndex].seatData[segIndex].SegmentSeat
            )
        );
        var selectedSeats = bookingFlight[bookIndex].seats.map(
            (seg, sg) => {
                var seatSegs = seg.map((seatSeg, se) => {
                    return Object.keys(seatSeg);
                });
                return seatSegs;
            }
        );

        setSelectedSeats(selectedSeats);
    }
    const handleBackButtonPress = () => {
        actions.setFlightBookPage(false);
        actions.setBookingFlight([]);
        actions.setFlightResJType(0)
        // navigation.goBack()
    };
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleBackButtonPress} style={styles.backBtnContainer}>
                <IconSwitcher componentName='AntDesign' iconName='arrowleft' color='black' iconsize={3} />
            </TouchableOpacity>
            <View style={{ flex: 2 }}>
                <ScrollView nestedScrollEnabled contentContainerStyle={{ paddingBottom: 20 }} style={{ backgroundColor: colors.white }}>
                    <FlatList data={bookingFlight} renderItem={({ item, index }) => {
                        return (
                            <View style={{ paddingVertical: responsiveHeight(1) }}>
                                <FlightCard
                                    flightGrp={[{ ...bookingFlight[index]?.flight }]}
                                    index={index}
                                    bookingPage={true}
                                    segIndex={segIndex}
                                />
                            </View>
                        )
                    }} />

                    {
                        bookingFlight.length > 1 ?
                            <View style={styles.flightResultsNavMainContainer}>
                                <TouchableOpacity style={[styles.flightResultsNavItem, bookIndex === 0 && styles.flightResultsNavSelectedItem]} onPress={() => changeBookIndex(0)}>
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={bookIndex === 0 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.flightResultsNavItem, bookIndex === 1 && styles.flightResultsNavSelectedItem]} onPress={() => changeBookIndex(1)}>
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[1]?.flightNew?.segments[0]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={bookIndex === 1 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[1]?.flightNew?.segments[0]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                            </View> : bookingFlight.length === 1 &&
                                bookingFlight[0].flightNew.segments.length > 1 ? <View style={styles.flightResultsNavMainContainer}>
                                <TouchableOpacity style={[styles.flightResultsNavItem, segIndex === 0 && styles.flightResultsNavSelectedItem]} onPress={() => setSegIndex(0)}>
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={segIndex === 0 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.flightResultsNavItem, segIndex === 1 && styles.flightResultsNavSelectedItem]} onPress={() => setSegIndex(1)}>
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[1]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={segIndex === 1 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[1]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                            </View> : null
                    }
                    <View style={styles.baggageAndMealsContainer}>
                        {/* Baggage and Meals */}
                        <Text style={styles.baggageAndMealsTitle}>Baggage and Meals</Text>
                        <View style={styles.baggageDetailsContainer}>
                            <Text style={styles.baggageDetailsText}>Baggage details</Text>
                            <View style={styles.bookingFlightCabinAndCheckInContainer}>
                                {bookingFlight[bookIndex].baggageDtls?.cabinBaggage ? <View style={styles.bookingFlightCabinAndCheckInSubContainer}>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.black} iconsize={3} />
                                    <Text style={styles.flightBaggageText}>Cabin baggage:<Text style={styles.flightBaggageDataText}> {bookingFlight[bookIndex].baggageDtls?.cabinBaggage}</Text></Text>
                                </View> : null}
                                {bookingFlight[bookIndex].baggageDtls?.baggage ? <View style={styles.bookingFlightCabinAndCheckInSubContainer}>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.black} iconsize={3} />
                                    <Text style={styles.flightBaggageText}>Check-in baggage:<Text style={styles.flightBaggageDataText}> {bookingFlight[bookIndex].baggageDtls?.baggage}</Text></Text>
                                </View> : null}
                            </View>
                            {bookingFlight[bookIndex].baggageData.length > 0 && <View style={styles.horizontalLine} />}
                            {bookingFlight[bookIndex].baggageData &&
                                bookingFlight[bookIndex].baggageData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                                <Text style={styles.flightextrabagAndMealTitle}>Select extra baggage</Text>
                                <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"baggage"} />
                            </View> : null}
                            {bookingFlight[bookIndex].mealData.length > 0 && <View style={styles.horizontalLine} />}
                            {bookingFlight[bookIndex].mealData &&
                                bookingFlight[bookIndex].mealData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                                <Text style={styles.flightextrabagAndMealTitle}>Select add-on meal</Text>
                                <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"meal"} />
                            </View> : null}
                        </View>
                    </View>
                    {/* Cancellation and date change */}
                    {bookingFlight[bookIndex].flight.MiniFareRules &&
                        bookingFlight[bookIndex].flight.MiniFareRules[segIndex] ? <View style={styles.cancellationAndDateChangeMainContainer}>
                        <Text style={styles.cancellationAndDateChangeTitle}>Cancellation and date change</Text>
                        <View style={styles.cancellationAndDateChangeDetailsContainer}>
                            <View>
                                <Text style={styles.baggageAndMealsTitle}>Cancellation</Text>
                                <View>
                                    <View>
                                        {bookingFlight[bookIndex].flight.MiniFareRules[segIndex] &&
                                            bookingFlight[bookIndex].flight.MiniFareRules[segIndex]
                                                .map((rule, r) => {
                                                    if (rule.Type === "Cancellation") {
                                                        return (
                                                            <View style={rule.From === null && { flexDirection: 'row' }}>
                                                                <View style={styles.cancellationAndDateChangeDetailsEachContainer} key={r}>
                                                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={3} />
                                                                    <Text style={styles.cancellationAndDateChangeDetailsEachContainerText}>{rule.To === null ||
                                                                        rule.From === null ||
                                                                        rule.Unit === null
                                                                        ? ""
                                                                        : rule.To === ""
                                                                            ? `Upto ${rule.From} ${rule.Unit} of departure date`
                                                                            : rule.From === "0"
                                                                                ? `Within ${rule.To} ${rule.Unit} of departure date`
                                                                                : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}</Text>
                                                                </View>
                                                                <Text style={[styles.flightPrice, { color: colors.highlight, fontSize: responsiveHeight(2) }]}>
                                                                    {rule.Details}
                                                                </Text>
                                                            </View>
                                                        );
                                                    }
                                                    return null;
                                                }).filter((rule, r) => rule !== null)}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.horizontalLine} />
                            <View>
                                <Text style={styles.baggageAndMealsTitle}>Date change</Text>
                                <View>
                                    {bookingFlight[bookIndex].flight.MiniFareRules[segIndex] &&
                                        bookingFlight[bookIndex].flight.MiniFareRules[segIndex]
                                            .map((rule, r) => {
                                                if (rule.Type === "Reissue") {
                                                    return (
                                                        <View style={rule.From === null && { flexDirection: 'row' }}>
                                                            <View style={styles.cancellationAndDateChangeDetailsEachContainer} key={r}>
                                                                <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={3} />
                                                                <Text style={styles.cancellationAndDateChangeDetailsEachContainerText}>
                                                                    {rule.To === null ||
                                                                        rule.From === null ||
                                                                        rule.Unit === null
                                                                        ? ""
                                                                        : rule.To === ""
                                                                            ? `Upto ${rule.From} ${rule.Unit} of departure date`
                                                                            : rule.From === "0"
                                                                                ? `Within ${rule.To} ${rule.Unit} of departure date`
                                                                                : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                                                                </Text>
                                                            </View>
                                                            <Text style={[styles.flightPrice, { color: colors.highlight, fontSize: responsiveHeight(2) }]}>
                                                                {rule.Details}
                                                            </Text>
                                                        </View>
                                                    );
                                                }
                                                return null;
                                            }).filter((rule, r) => rule !== null)}
                                </View>
                            </View>
                        </View>
                    </View> : null}
                    {
                        bookingFlight[bookIndex].seatData &&
                            bookingFlight[bookIndex].seatData[segIndex] &&
                            actions.validSeatMap(bookingFlight[bookIndex].seatData[segIndex]) ? <View style={styles.seatSelectionBtnContainer}>
                            <TouchableOpacity style={styles.seatSelectionBtn} onPress={handleSeatSelectionPopUp}>
                                <Text style={styles.seatSelectionBtnTitle}>Select seats</Text>
                            </TouchableOpacity>
                        </View> : null
                    }


                </ScrollView>

            </View>

            <View style={[styles.totalFareContainer, isOpen && { flex: 0.7 }]}>
                <View >
                    <TouchableOpacity onPress={toggleView} style={styles.totalFareToggleIconContainer}>
                        <IconSwitcher componentName='Ionicons' iconName={isOpen ? "chevron-down-sharp" : 'chevron-up-sharp'} color={colors.black} iconsize={3} />
                    </TouchableOpacity>
                    {isOpen && <Animated.View style={[{ borderBottomWidth: 1, justifyContent: 'space-between', marginHorizontal: responsiveWidth(3) }, animatedStyles]}>
                        {
                            bookingFlight.map((book, b) => {
                                return (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <View style={styles.flightDepAndArrContainer} key={b}>
                                            <Text style={styles.flightDepAndArrText}>{`${book?.flightNew?.segments[0].originAirportCode}`}</Text>
                                            <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.secondary} iconsize={2.8} />
                                            <Text style={styles.flightDepAndArrText}>{`${book?.flightNew?.segments[0].destAirportCode}`}</Text>
                                        </View>
                                        <View >
                                            <Text style={[styles.flightPrice, { color: colors.highlight }]}>
                                                {`₹ ${book.flight.Fare.OfferedFare
                                                    ? Math.ceil(
                                                        book.flight.Fare.OfferedFare
                                                    ).toLocaleString("en-IN")
                                                    : Math.ceil(
                                                        book.flight.Fare.PublishedFare
                                                    ).toLocaleString("en-IN")
                                                    }/-`}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })
                        }
                        {/* <View style={styles.horizontalLine}/> */}
                    </Animated.View>}
                </View>
                <View style={styles.totalFareFlightDetailsContainer}>
                    <Text style={styles.flighttotalFareText}>Total fare</Text>
                    <Text style={styles.flightPrice}> {`₹ ${totalFareSum?.toLocaleString("en-IN")}/-`}</Text>
                    <TouchableOpacity style={styles.submitTripBtn}>
                        <Text style={styles.submitTripBtnText}>Add to trip</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Modal
                animationType="slide"
                visible={selectSeats}
            >
                <View style={{ height: "100%", width: "100%", backgroundColor: colors.black, position: "absolute", opacity: 0.5, }}></View>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                    <View style={{ backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10,borderWidth:1,flex:1 }}>
                        <TouchableOpacity onPress={() => setSelectSeats(false)} style={{ alignItems: 'flex-end' }}>
                            <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                        </TouchableOpacity>
                        <View style={{borderWidth:1,flexDirection:'row',paddingHorizontal:5,justifyContent:"space-between"}}>
                                                            <IconSwitcher componentName='Feather' iconName='chevrons-left' color={colors.black} iconsize={3} />
                                                            <Text> Emergency exit</Text>
                                                            <IconSwitcher componentName='Feather' iconName='chevrons-right' color={colors.black} iconsize={3} />
                                                        </View>
                                                        <View style={{borderWidth:1,flex:1}}>

                                                        </View>
                    </View>

                    <View>
                    </View>
                </View>
            </Modal> */}
            <Modal
                animationType="slide"
                visible={selectSeats}>
                <View style={{ height: "100%", width: "100%", backgroundColor: colors.black, position: "absolute", opacity: 0.5, }}></View>
                <View style={{  flex: 1, justifyContent: 'center', paddingHorizontal: responsiveWidth(2) }}>
                    <View >
                        <TouchableOpacity onPress={() => setSelectSeats(false)} style={{ alignItems: 'flex-end' }}>
                            <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                        </TouchableOpacity>
                        <View style={{borderWidth:1,alignItems:'center',justifyContent:'center',flexDirection:'row',height:"80%"}}>
                        {/* <View style={{borderWidth:1,width:"10%",height:50}}></View> */}
                        <View style={{alignItems:'center',borderWidth:1}}>
                           <View >
                           {
  seatData[seatSegIdx] && <FlatList
  style={{borderColor:'green',borderWidth:3}}
  data={seatData[seatSegIdx]?.RowSeats}
  keyExtractor={(row, index) => index.toString()}
  renderItem={({ item: row,index }) => (
    <View>
        
       {/* {actions.isExitRow(row)&&<View style={{borderTopWidth:1,borderBottomWidth:1,borderRightWidth:1,position:"absolute",height:200,width:20,top:-50,left:-22,}}/>} */}
                              {actions.isExitRow(row) ?  <View style={{borderWidth:1,flexDirection:'row',paddingHorizontal:5,justifyContent:"space-between"}}>
                                                            <IconSwitcher componentName='Feather' iconName='chevrons-left' color={colors.black} iconsize={3} />
                                                            <Text> Emergency exit</Text>
                                                            <IconSwitcher componentName='Feather' iconName='chevrons-right' color={colors.black} iconsize={3} />
                                                        </View>
                                                        :null}
                                                        {/* {actions.isExitRow(row)&&<View style={{borderTopWidth:1,borderBottomWidth:1,borderLeftWidth:1,position:"absolute",height:200,width:20,top:-50,right:-22}}/>}        */}
        <FlatList
      data={row?.Seats}
      numColumns={6}
      keyExtractor={(seat, index) => index.toString()}
      renderItem={({ item, index }) => (
       <View>
      
         <View style={[style.item, index % 6 === 2 ? style.spaceBetween : null]}>
          <Text>{item.Code}</Text>
          {/* <Text>{`${item.Price.toLocaleString("en-IN")} /-`}</Text> */}
        </View>
        </View>
      )}
    />
    </View>
  )}
/>


}

                           </View>
                        </View>
                        {/* <View style={{borderWidth:1,width:"10%",height:50}}></View> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default (FlightBooking)
const style = StyleSheet.create({
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 35, 
      width:35,
      borderWidth: 1, 
      margin:5,
    //   padding:10
    // flexWrap:"wrap"
    },
    spaceBetween: {
      marginRight: 30, 
      
    },
  });
  