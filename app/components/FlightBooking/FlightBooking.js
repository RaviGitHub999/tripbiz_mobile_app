import { Animated, Text, View } from 'react-native'
import React, { useContext, useMemo, useRef, useState } from 'react'
import IconSwitcher from '../common/icons/IconSwitcher'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import MyContext from '../../context/Context'
import ProgressBar from '../common/progressBar/ProgressBar'
import { styles } from './styles'
import FlightCard from '../flightList/FlightCard'
import { colors } from '../../config/theme'
import Select from '../common/select/Select'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'

const FlightBooking = () => {
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
      
  const memoizedRenderItem = useMemo(() => {
    return ({ item, index }) => {
      return (
        <FlightCard
          flightGrp={[{ ...bookingFlight[index]?.flight }]}
          index={index}
          bookingPage={true}
          segIndex={segIndex}
        />
      );
    };
  }, [bookingFlight, segIndex])
    return (
        <View style={{flex:1}}>
            <TouchableOpacity onPress={() => {
                actions.setFlightBookPage(false);
                actions.setBookingFlight([]);
            }} style={styles.backBtnContainer}>
                <IconSwitcher componentName='AntDesign' iconName='arrowleft' color='black' iconsize={3} />
            </TouchableOpacity>
          <View style={{flex:2}}>
          <ScrollView nestedScrollEnabled contentContainerStyle={{paddingBottom:20}}>
                {/* <FlatList data={bookingFlight} renderItem={({ item, index }) => {
                    return (
                        <FlightCard
                            flightGrp={[{ ...bookingFlight[index]?.flight }]}
                            index={index}
                            bookingPage={true}
                            segIndex={segIndex}
                        />
                    )
                }} /> */}
                 <FlatList 
      data={bookingFlight}
      renderItem={memoizedRenderItem}
      keyExtractor={(item, index) => index.toString()} // Assuming each item can be uniquely identified by its index
    />
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
                       { bookingFlight[bookIndex].baggageData.length > 0 &&<View style={styles.horizontalLine} />}
                        {bookingFlight[bookIndex].baggageData &&
                            bookingFlight[bookIndex].baggageData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                            <Text style={styles.flightextrabagAndMealTitle}>Select extra baggage</Text>
                            <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"baggage"} />
                        </View> : null}
                       {  bookingFlight[bookIndex].mealData.length > 0 && <View style={styles.horizontalLine} />}
                        {bookingFlight[bookIndex].mealData &&
                            bookingFlight[bookIndex].mealData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                            <Text style={styles.flightextrabagAndMealTitle}>Select add-on meal</Text>
                            <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"meal"} />
                        </View> : null}
                    </View>
                </View>
                {/* Cancellation and date change */}
              { bookingFlight[bookIndex].flight.MiniFareRules &&
            bookingFlight[bookIndex].flight.MiniFareRules[segIndex]? <View style={styles.cancellationAndDateChangeMainContainer}>
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
                                                        <View style={rule.From===null&&{flexDirection:'row'}}>
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
                                                            <Text style={[styles.flightPrice,{color:colors.highlight,fontSize:responsiveHeight(2)}]}>
                                                                {rule.Details}
                                                            </Text>
                                                        </View>
                                                    );
                                                }
                                                return null;
                                            }) .filter((rule, r) => rule !== null)}
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
                                                    <View style={rule.From===null&&{flexDirection:'row'}}>
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
                                                        <Text style={[styles.flightPrice,{color:colors.highlight,fontSize:responsiveHeight(2)}]}>
                                                            {rule.Details}
                                                        </Text>
                                                    </View>
                                                );
                                            }
                                            return null;
                                        }) .filter((rule, r) => rule !== null)}
                            </View>
                        </View>
                    </View>
                </View>:null}
            </ScrollView>
           
          </View>
          <View style={[styles.totalFareContainer,isOpen&&{flex:0.4}]}>
               <View >
               <TouchableOpacity onPress={toggleView} style={styles.totalFareToggleIconContainer}>
               <IconSwitcher componentName='Ionicons' iconName={isOpen?"chevron-down-sharp":'chevron-up-sharp'} color={colors.black} iconsize={3}/>
               </TouchableOpacity>
               {isOpen&&<Animated.View style={[{borderBottomWidth:1,flexDirection:'row',justifyContent:'space-between',marginHorizontal:responsiveWidth(3),height:responsiveHeight(5),alignItems:'center'},animatedStyles]}>
                {
                        bookingFlight.map((book, b) => {
                          return (
                            <>
                              <View style={styles.flightDepAndArrContainer} key={b}>
                                <Text style={styles.flightDepAndArrText}>{`${book.flightNew.segments[0].originAirportCode}`}</Text>
                                <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.secondary} iconsize={2.8} />
                                <Text style={styles.flightDepAndArrText}>{`${book.flightNew.segments[0].destAirportCode}`}</Text>
                              </View>
                              <View >
                               <Text style={[styles.flightPrice,{color:colors.highlight}]}>
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
                            </>
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
        </View>
    )
}

export default React.memo(FlightBooking)