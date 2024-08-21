import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert, Linking } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import MyContext from '../../../context/Context'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import PopUp from '../../common/popup/PopUp'
import WebView from 'react-native-webview'
import { styles } from './tripdetailsFlightCardstyles'
import ReCheck from '../../common/recheck/ReCheck'
import FCard from './FCard'
import ProgressBar from '../../common/progressBar/ProgressBar'
import TravellerDetailsBtn from '../../common/mainComponents/TravellerDetailsButton/TravellerDetailsBtn'
import moment from 'moment'
import { Colors } from 'react-native/Libraries/NewAppScreen'
const TripDetailsFlightCard = ({
    flightGrp,
    index,
    bookingPage,
    flightBooking,
    flightStatus,
    flightReq,
    timeStamp,
    reqColor,
    tripId,
    flightId,
    tripsPage,
    downloadUrl,
    updatedAt,
    flight,
    isInternational,
    totalFlight
}) => {
    const [stopDtls, setStopDtls] = useState([]);
    const [showStopDtls, setShowStopDtls] = useState(false);
    const [tripsBaggage, setTripsBaggage] = useState(false)
    const [tripsCancellation, setTripsCancellation] = useState(false)
    const [tripsMeals, setTripsMeals] = useState(false)
    const [tripsSeat, setTripsSeat] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteId, setDeleteId] = useState(false)
    const [deleteType, setDeleteType] = useState(null)
    const [openFlightPrice, setOpenFlightPrice] = useState(false)
    const [openFareRules, setOpenFareRules] = useState(false)
    const [openPriceReCheck, setOpenPriceReCheck] = useState(false)
    const [reCheckLoading, setReCheckLoading] = useState(false)
    const [reCheckData, setReCheckData] = useState(null)
    const [reCheckBaggage, setReCheckBaggage] = useState(0)
    const [reCheckMeals, setReCheckMeals] = useState(0)
    const [reCheckSeats, setReCheckSeats] = useState(0)
    const [checkingDate, setCheckingDate] = useState(null)
    const [recheckSeatsAvailable, setRecheckSeatsAvailable] = useState(false);
    const [alltimeStamp, setAllTimeStamp] = useState(false);
    const [flightRecheckError,setFlightRecheckError]=useState(false)
    const { actions, flightsLogosData, domesticFlight } = useContext(MyContext)
    const statuses = [
        { status: "Submitted", color: "#ffa500" },
        { status: "Need clarification", color: "#FFC107" },
        { status: "Price Revision", color: "#2196F3" },
        { status: "Booked", color: "#008000" },
        { status: "Cancelled", color: "#FF0000" },
        { status: "Submitted,Payment Pending", color: "#ffa500" },
        { status: "Booked,Payment Pending", color: "#4AF50" },
        { status: "Not Submitted", color: "#808080" }
    ];
    // var color = statuses.filter((status) => { return status?.status === flightStatus?.status })
    const adColor = statuses.filter((status) => { return status?.status === flightStatus?.status })
    const id = flightBooking?.seats[0].length > 0 ? Object.keys(flightBooking?.seats[0][0]) : ''
    const fareData = tripsPage ? actions.getTotalFares([flightBooking]) : '';
    const flightArr = flightGrp.map((flight, f) => {
        return { ...actions.modifyFlightObject(flight) };
    });
    let airlinename = flightArr[0].segments[0].airlineName;

    var originalDate = flightStatus?.updatedAt ? new Date(flightStatus.updatedAt?.seconds * 1000) : new Date(timeStamp);
    var threeHoursAfter = new Date(originalDate.getTime() + (3 * 60 * 60 * 1000));
    var currentTime = new Date();
    var isTimeReCheck = flightStatus?.status === "Not Submitted" ? currentTime > threeHoursAfter : false

    const flightSymbol = useCallback(
        airlineName => {
            const logo = flightsLogosData.find(
                ele => ele.id === airlineName?.toLowerCase(),
            );
            return logo?.url;
        },
        [flightsLogosData],
    );
    var flightLogo = [{ url: flightSymbol(airlinename) }]
    const handleDelete = async () => {
        await actions.deleteTripItem(tripId, deleteId, deleteType);
        setOpenDelete(false)
    }

    function isDateNotLessThanCurrent(givenDate) {
      const currentDate = moment();
      const dateToCheck = moment(givenDate);
      return dateToCheck.isSameOrAfter(currentDate);
  }


    const handleRenderingFlightCard = ({ item }) => {
        var flightCode = '';
        item.flightCodes.forEach((code, c) => {
            if (c === item.flightCodes.length - 1) {
                flightCode += code;
            } else {
                flightCode += `${code}, `;
            }
        });
        setCheckingDate(isDateNotLessThanCurrent(item.depTimeDate))
        return (
            <View style={styles.renderingMainContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.flightDetailsContainer}>
                        <View style={styles.flightLogoContainer}>
                            {flightSymbol(airlinename) ? (
                                <Image
                                    source={{ uri: flightSymbol(airlinename) }}
                                    style={styles.flightLogo}
                                    resizeMode="contain"
                                />
                            ) : (
                                <IconSwitcher
                                    componentName="FontAwesome5"
                                    iconName="plane-departure"
                                    iconsize={3}
                                />
                            )}
                        </View>
                        <View >
                            <Text style={styles.airlineName}> {`${item.airlineName}`}</Text>
                        </View>
                        <View >
                            <Text style={styles.flightNumbers}> ({flightCode})</Text>
                        </View>
                    </View>
                    <View style={styles.depTimeDateContainer}>
                        <Text style={styles.depTimeDate}>{item.depTimeDate.toString().slice(4, 10)}</Text>
                    </View>
                </View>
                <View style={styles.flightsTimingContainer}>
                    <View style={styles.originContainer}>
                        <Text style={styles.originTitle}>{item.originAirportCode}</Text>
                        <Text style={styles.flightTimings}>{item.depTime}</Text>
                    </View>
                    <View style={styles.directionContainer}>
                        <TouchableOpacity style={styles.stopsBtn} onPress={() => handleStops(item)}>
                            <Text style={styles.stopsBtnText}>
                                {item.stopOverPts.length === 0
                                    ? 'Direct'
                                    : `${item.stopOverPts.length > 1
                                        ? `${item.stopOverPts.length} stops`
                                        : '1 stop'
                                    }`}
                            </Text>
                            {item.stopOverPts.length !== 0 ? (
                                <IconSwitcher
                                    componentName="EvilIcons"
                                    iconName="chevron-up"
                                    iconsize={3.5}
                                    color={colors.highlight}
                                />
                            ) : null}
                        </TouchableOpacity>
                        <View style={styles.dashedLine}></View>
                        <Text style={styles.flighttotalTime}>{item.duration}</Text>
                    </View>
                    <View style={styles.destinationContainer}>
                        <Text style={styles.destinationTitle}> {item.destAirportCode}</Text>
                        <Text style={styles.flightTimings}> {item.arrTime}</Text>
                    </View>
                    <View>
                        {/* {
                  <View>
                    <Text>{`+ ${item.arrAfterDays}`}</Text>
                    <Text>{`${item.arrAfterDays > 1 ? "Days" : "Day"}`}</Text>
                    </View>
                }  */}
                    </View>
                </View>

                <View style={styles.bookingFlightCityNameAirportName}>
                    <View style={styles.originDetailsContainer}>
                        <Text style={styles.originCityName}>{item.originCityName}</Text>
                        <Text style={styles.originAirportName}>{item.originAirportName}</Text>
                    </View>
                    <View style={styles.destDetailsContainer}>
                        <Text style={styles.destCityName}>{item.destCityName}</Text>
                        <Text style={styles.destAirportName} >{item.destAirportName}</Text>
                    </View>
                </View>
            </View>
        );
    };
    const handleStops = (item) => {
        setStopDtls(item.segRoutes);
        setShowStopDtls(true);
    }
    const handleStopsClose = () => {
        setStopDtls([]);
        setShowStopDtls(false);
    }
    const handletripsBaggageinfo = () => {
        setTripsBaggage(true)
    }
    const handletripsBaggageinfoClose = () => {
        setTripsBaggage(false)
    }
    const handletripsCancellationinfo = () => {
        setTripsCancellation(true)
    }
    const handletripsCancellationinfoClose = () => {
        setTripsCancellation(false)
    }
    const handletripsMealsinfo = () => {
        setTripsMeals(true)
    }
    const handletripsMealsinfoClose = () => {
        setTripsMeals(false)
    }
    const handletripsSeatinfo = () => {
        setTripsSeat(true)
    }
    const handletripsSeatinfoClose = () => {
        setTripsSeat(false)
    }
    const handleFareRulesInfo = () => {
        setOpenFareRules(true)
    }
    const handleFareRulesClose = () => {
        setOpenFareRules(false)
    }
    const increaseFontSizeScript = `
        var style = document.createElement('style');
        style.innerHTML = 'body { font-size: 40px !important; }';
        document.head.appendChild(style);
      `;
    const handleDeleteRecheckFlight = () => {
        setOpenDelete(true)
        setDeleteType("flights")
        setDeleteId(flightId)
    }
    const getUpdatedFares = (ssrData) => {
        var baggagePrice = 0
        var mealPrice = 0
        var seatPrice = 0
        if (ssrData.Baggage) {
            flightBooking?.selectedBaggage?.forEach((selectedBaggage, s) => {
                selectedBaggage.forEach((selected) => {
                    const matchingBag = ssrData.Baggage[s].find((bag) => bag.Weight === selected.baggage && bag.Price === selected.price);
                    if (matchingBag) {
                        baggagePrice += matchingBag.Price;
                    }
                });
            });
        }
        if (ssrData.MealDynamic) {
            flightBooking?.selectedMeals?.forEach((selectedMeals, s) => {
                selectedMeals.forEach((selected) => {
                    const matchingMeal = ssrData.MealDynamic[s].find((meal) => meal.AirlineDescription === selected.mealDesc && meal.Price === selected.price);
                    if (matchingMeal) {
                        mealPrice += matchingMeal.Price;
                    }
                });
            });
        }
        if (ssrData.SeatDynamic) {
            var x = 0;
            flightBooking.seats.forEach((seat, s) => {
                seat.forEach((t, i) => {
                    Object.keys(t).forEach((sa) => {
                        var seatDetails = t[sa]
                        var matchingData = ssrData?.SeatDynamic[s].SegmentSeat[i].RowSeats[Number(seatDetails.RowNo)].Seats.find((X) => X.RowNo === seatDetails.RowNo && X.SeatNo === seatDetails.SeatNo)
                        x += matchingData.Price
                    })
                })
            })
        }
        setReCheckSeats(x);
        setReCheckBaggage(baggagePrice)
        setReCheckMeals(mealPrice)
    }

    const areSeatsAvailable = (seatData, selectedSeats) => {
        if (!selectedSeats || !seatData) {
          setRecheckSeatsAvailable(true);
          return;
        }
        const allSeats = [];
        for (let segment of seatData) {
          for (let rowSeats of segment.Seats) {
            allSeats.push(rowSeats);
          }
        }
    
        // Check each selected seat
        for (let key in selectedSeats) {
          console.log(allSeats);
          const seat = allSeats.find((s) => s.Code === key);
          console.log(seat);
          if (!seat || seat.AvailablityType !== String(1)) {
            setRecheckSeatsAvailable(false);
            // return false; // Seat is not available
          }
        }
    
        setRecheckSeatsAvailable(true); // All selected seats are available
      };

    const handleRecheckFlightPrice = async () => {
        setReCheckLoading(true)
        setOpenPriceReCheck(true)
        setFlightRecheckError(false)
         if(checkingDate)
            {
              
                var data = await actions.getFlightUpdatedDetails(flightBooking.flightRequest, flightBooking.flight)
                if (data.length !== 0) {
                  getUpdatedFares(data.ssrData)
                  setReCheckData(data)
                  areSeatsAvailable(
                      data?.ssrData?.SeatDynamic !== undefined
                        ? data?.ssrData?.SeatDynamic[0]?.SegmentSeat[0]
                            ?.RowSeats
                        : null,
                      flightBooking?.seats !== undefined
                        ? flightBooking?.seats[0][0]
                        : null
                      // selectedSeats
                    ); 
              }
              else{
                setReCheckLoading(false)
                setDeleteType("flights")
                setDeleteId(flightId)
                setFlightRecheckError(true)
              }
              
               
                
            }
        setReCheckLoading(false)
        setDeleteType("flights")
        setDeleteId(flightId)
    }

    const downloadDoc = async () => {
        try {
            await Linking.openURL(downloadUrl);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while trying to open the URL');
            console.error('An error occurred', error);
        }
    }
const openAllTimeStamps=()=>
{
setAllTimeStamp(true)
}
const closeAllTimeStamps=()=>
{
  setAllTimeStamp(false)
}
const getFlightStatusStyle = (status) => {
  switch (status) {
    case "Booked":
      return  "honeydew" ;
    case "Cancelled":
      return  "#ffe4e4" ;
    default:
      return "white";
  }
};
    return (
      <View style={styles.mainConatiner}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: flightStatus&&getFlightStatusStyle(flightStatus.status)  
            },
          ]}>
          <FlatList
            data={flightArr[0].segments}
            renderItem={handleRenderingFlightCard}
            keyExtractor={item => item.resultIndex}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
          <View style={styles.flightBookingTravellerDetailsContainer}>
            <Text style={styles.flightBookingTravellerDetailsTitle}>
              {flightBooking.flightNew.fareType}
            </Text>
            <Text style={styles.flightBookingTravellerDetailsTitle}>
              {`${flightBooking.adults} ${
                flightBooking.adults > 1 ? 'Adults' : 'Adults'
              } ${
                flightBooking.child > 0
                  ? `, ${flightBooking.child} ${
                      flightBooking.child > 1 ? 'children' : 'child'
                    }`
                  : ''
              }   ${
                flightBooking.infant > 0
                  ? `, ${flightBooking.infant} ${
                      flightBooking.infant > 1 ? 'infants' : 'infant'
                    }`
                  : ''
              }`}
            </Text>
            <Text style={styles.flightBookingTravellerDetailsTitle}>
              {flightArr[0].segments[0].cabinClass}
            </Text>
          </View>

          <View style={styles.flightExpensesContainer}>
            <TouchableOpacity onPress={handletripsBaggageinfo}>
              <IconSwitcher
                componentName="MaterialIcons"
                iconName="luggage"
                color={colors.primary}
                iconsize={3}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handletripsCancellationinfo}>
              <IconSwitcher
                componentName="FontAwesome6"
                iconName="calendar-xmark"
                color={colors.primary}
                iconsize={2.5}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handletripsMealsinfo}>
              <IconSwitcher
                componentName="MaterialCommunityIcons"
                iconName="silverware-fork-knife"
                color={colors.primary}
                iconsize={2.5}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFareRulesInfo}>
              <IconSwitcher
                componentName="Entypo"
                iconName="info-with-circle"
                color={colors.primary}
                iconsize={2.3}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handletripsSeatinfo}>
              <IconSwitcher
                componentName="FontAwesome5"
                iconName="chair"
                color={colors.primary}
                iconsize={2.5}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.flightPriceMainContainer}>
            <View style={styles.bookingStatusTitlesMainContainer}>
              <Text
                style={styles.bookingStatusTitles}>{`Approval Status : `}</Text>
              <View
                style={[
                  styles.bookingStatusTextContainer,
                  {
                    backgroundColor: reqColor[0]
                      ? reqColor[0]?.color
                      : '#808080',
                  },
                ]}>
                <Text style={styles.bookingStatusText}>
                  {flightReq[0]?.requestStatus}
                </Text>
              </View>
            </View>

            {flightStatus ? (
              <>
                {flightStatus?.status ? (
                  <View style={styles.bookingStatusTitlesMainContainer}>
                    <Text
                      style={
                        styles.bookingStatusTitles
                      }>{`Booking Status : `}</Text>
                    <View
                      style={[
                        styles.bookingStatusTextContainer,
                        {
                          backgroundColor: adColor[0]
                            ? adColor[0].color
                            : '#808080',
                        },
                      ]}>
                      <Text style={styles.bookingStatusText}>
                        {flightStatus.status}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </>
            ) : (
              <View style={styles.bookingStatusTitlesMainContainer}>
                <Text
                  style={[
                    styles.bookingStatusTitles,
                  ]}>{`Booking Status : `}</Text>
                <View
                  style={[
                    styles.bookingStatusTextContainer,
                    {
                      backgroundColor: adColor[0]
                        ? adColor[0].color
                        : '#808080',
                    },
                  ]}>
                  <Text style={styles.bookingStatusText}>Not Submitted</Text>
                </View>
              </View>
            )}

            <View
              style={[
                styles.hotelTotalPriceContainer,
                {justifyContent: 'space-between'},
              ]}>
              <View style={styles.hotelTotalPriceContainer}>
                <Text
                  style={styles.hotelTotalPrice}>{`Total Price : ₹ ${Math.ceil(flightBooking?.finalPrice)?.toLocaleString(
                    "en-IN"
                  )}`}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setOpenFlightPrice(prev => !prev);
                  }}>
                  <IconSwitcher
                    componentName="Entypo"
                    iconName="info-with-circle"
                    color={colors.black}
                    iconsize={1.8}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={openAllTimeStamps}>
                <IconSwitcher
                  componentName="MaterialIcons"
                  iconName="access-alarm"
                  color={colors.black}
                  iconsize={3}
                />
              </TouchableOpacity>
            </View>

            {downloadUrl ? (
              <TouchableOpacity
                style={styles.voucherContainer}
                onPress={() => downloadDoc()}>
                <Text style={styles.voucherTitle}>Voucher</Text>
                <IconSwitcher
                  componentName="FontAwesome"
                  iconName="download"
                  iconsize={2}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.addedFlightTimeAndDateContainer}>
            <View style={styles.addedFlightTitleContainer}>
              <Text style={styles.bookingStatusTitles}>
                {updatedAt !== undefined ? 'Updated :' : `Added : `}
                <Text style={styles.addedHotelTimeAndDate}>{`${
                  updatedAt !== undefined
                    ? updatedAt.toString().slice(4, 24)
                    : timeStamp.toString().slice(4, 24)
                }`}</Text>
              </Text>
            </View>
           {flightReq[0]?.requestStatus === "Pending" ||
                flightStatus?.status === "Submitted" ||
                flightStatus?.status === "Booked" ||
                flightReq[0]?.requestStatus === "Approved" ? null : <>
              <TouchableOpacity
                onPress={() => {
                  setOpenDelete(true);
                  setDeleteType('flights');
                  setDeleteId(flightId);
                }}>
                <IconSwitcher
                  componentName="MaterialIcons"
                  iconName="delete"
                  color={colors.red}
                  iconsize={2.5}
                />
              </TouchableOpacity>
            </>}
          </View>
          <TravellerDetailsBtn
            adults={flight?.data?.adults}
            eachTripData={flight}
            tripId={tripId}
            child={flight?.data?.child}
            infant={flight?.data?.infant}
            isInternational={isInternational}
            status={flightStatus?.status}
          />
          {isTimeReCheck ? (
            <View
              style={{
                position: 'absolute',
                width: responsiveWidth(89),
                bottom: 10,
                paddingHorizontal: responsiveWidth(2),
              }}>
              <ReCheck
                handleDelete={handleDeleteRecheckFlight}
                handleRecheck={handleRecheckFlightPrice}
              />
            </View>
          ) : null}
        </View>

        <PopUp value={showStopDtls} handlePopUpClose={handleStopsClose}>
          <View>
            {stopDtls &&
              stopDtls.map((stop, s) => {
                return (
                  <View>
                    {stop.layoverDur ? (
                      <View style={{flexDirection: 'row'}}>
                        <IconSwitcher
                          componentName="AntDesign"
                          iconsize={3}
                          iconName="arrowright"
                          color="black"
                        />
                        <Text style={[styles.titles,{flex:1,fontSize:responsiveHeight(1.8)}]}>
                          {' '}
                          {`Layover for ${stop.layoverDur} in ${stop.arrCity}`}
                        </Text>
                      </View>
                    ) : null}
                    <View style={[styles.flightsTimingContainer,{backgroundColor:colors.whiteSmoke,padding:responsiveHeight(1.5)}]}>
                      <View style={styles.originContainer}>
                        <Text style={styles.originTitle}>{stop.depTime}</Text>
                        <Text style={styles.flightTimings}>
                          {stop.originCode}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.directionContainer,
                          {justifyContent: 'center'},
                        ]}>
                        <View
                          style={{
                            borderTopWidth: 1,
                            borderStyle: 'dashed',
                          }}></View>
                        <Text style={styles.flighttotalTime}>
                          {stop.flightDur}
                        </Text>
                      </View>
                      <View style={styles.destinationContainer}>
                        <Text style={styles.destinationTitle}>
                          {' '}
                          {stop.arrTime}
                        </Text>
                        <Text style={styles.flightTimings}>
                          {' '}
                          {stop.destCode}
                        </Text>
                      </View>
                      <View></View>
                    </View>
                  </View>
                );
              })}
          </View>
        </PopUp>

        <PopUp
          value={tripsBaggage}
          handlePopUpClose={handletripsBaggageinfoClose}>
          {tripsPage ? (
            <>
              <Text style={styles.baggageTitle}>Baggage details</Text>
              <View style={styles.BaggageDetailsMainContainer}>
                {flightBooking?.baggageDtls?.cabinBaggage ? (
                  <View style={styles.BaggageDetails}>
                    <IconSwitcher
                      componentName="AntDesign"
                      iconName="arrowright"
                      color={colors.primary}
                      iconsize={2.5}
                    />
                    <Text style={styles.baggageTitles}>
                      Cabin baggage:{' '}
                      <Text style={styles.baggageTitlesHighlight}>
                        {flightBooking?.baggageDtls?.cabinBaggage}
                      </Text>
                    </Text>
                  </View>
                ) : null}
                {flightBooking?.baggageDtls?.baggage ? (
                  <View style={styles.BaggageDetails}>
                    <IconSwitcher
                      componentName="AntDesign"
                      iconName="arrowright"
                      color={colors.primary}
                      iconsize={2.5}
                    />
                    <Text style={styles.baggageTitles}>
                      Check-in baggage:{' '}
                      <Text style={styles.baggageTitlesHighlight}>
                        {' '}
                        {flightBooking?.baggageDtls?.baggage}
                      </Text>
                    </Text>
                  </View>
                ) : null}
              </View>
            </>
          ) : null}
        </PopUp>

        <PopUp
          value={tripsCancellation}
          handlePopUpClose={handletripsCancellationinfoClose}>
          {Array.isArray(flightBooking?.flight?.MiniFareRules) ? (
            <>
              {flightBooking?.flight?.MiniFareRules &&
              flightBooking?.flight?.MiniFareRules ? (
                <>
                  <Text style={styles.CancellationAndDateChangeTitle}>
                    Cancellation and date change
                  </Text>
                  <View style={styles.CancellationAndDateChangeCon}>
                    <View style={styles.cancel}>
                      <Text style={styles.CancellationAndDateChangesubTitle}>
                        Cancellation
                      </Text>
                      {flightBooking?.flight?.MiniFareRules &&
                        flightBooking?.flight?.MiniFareRules[0]
                          .map((rule, r) => {
                            if (rule.Type === 'Cancellation') {
                              return (
                                <View style={styles.cancellationContainer}>
                                  <IconSwitcher
                                    componentName="AntDesign"
                                    iconName="arrowright"
                                    color={colors.lightGray}
                                    iconsize={2.5}
                                  />
                                  <Text style={styles.subTitles}>
                                    {rule.To === null ||
                                    rule.From === null ||
                                    rule.Unit === null
                                      ? ''
                                      : rule.To === ''
                                      ? `> ${rule.From} ${rule.Unit} of departure date`
                                      : rule.From === '0'
                                      ? `0- ${rule.To} ${rule.Unit} of departure date`
                                      : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.CancellationAndDateChangesubTitle,
                                      {color: colors.highlight},
                                    ]}>
                                    {rule.Details}
                                  </Text>
                                </View>
                              );
                            }
                            return null;
                          })
                          .filter((rule, r) => rule !== null)}
                    </View>
                    <View style={styles.dashedLine} />
                    <View style={styles.cancel}>
                      <Text style={styles.CancellationAndDateChangesubTitle}>
                        Date change
                      </Text>
                      {flightBooking?.flight?.MiniFareRules &&
                        flightBooking?.flight?.MiniFareRules[0]
                          .map((rule, r) => {
                            if (rule.Type === 'Reissue') {
                              return (
                                <View style={styles.cancellationContainer}>
                                  <IconSwitcher
                                    componentName="AntDesign"
                                    iconName="arrowright"
                                    color={colors.lightGray}
                                    iconsize={2.5}
                                  />
                                  <Text style={styles.subTitles}>
                                    {rule.To === null ||
                                    rule.From === null ||
                                    rule.Unit === null
                                      ? ''
                                      : rule.To === ''
                                      ? `> ${rule.From} ${rule.Unit} of departure date`
                                      : rule.From === '0'
                                      ? `0- ${rule.To} ${rule.Unit} of departure date`
                                      : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.CancellationAndDateChangesubTitle,
                                      {color: colors.highlight},
                                    ]}>
                                    {rule.Details}
                                  </Text>
                                </View>
                              );
                            }
                            return null;
                          })
                          .filter((rule, r) => rule !== null)}
                    </View>
                  </View>
                </>
              ) : null}
            </>
          ) : null}
        </PopUp>

        <PopUp value={tripsMeals} handlePopUpClose={handletripsMealsinfoClose}>
          {Array.isArray(flightBooking?.selectedMeals) ? (
            <>
              {flightBooking.selectedMeals.map(meal => {
                return (
                  <>
                    <Text style={[styles.baggageTitle, {textAlign: 'center'}]}>
                      Selected Meals
                    </Text>
                    {meal.map((meal, s) => {
                      var type =
                        s + 1 <= flightBooking.adults
                          ? 'Adult'
                          : s + 1 <= flightBooking.adults + flightBooking.child
                          ? 'Child'
                          : 'Infant';
                      var indexe =
                        s + 1 <= flightBooking.adults
                          ? s
                          : s + 1 <= flightBooking.adults + flightBooking.child
                          ? s - flightBooking.adults
                          : 'Infant';
                      return (
                        <Text style={styles.baggageTitles}>
                          {type}-{indexe + 1}:{meal.mealDesc} -&gt;
                          <Text style={{color: colors.secondary}}>
                            {' '}
                            &#8377;{meal.price}
                          </Text>
                        </Text>
                      );
                    })}
                  </>
                );
              })}
            </>
          ) : null}
        </PopUp>

        <PopUp value={tripsSeat} handlePopUpClose={handletripsSeatinfoClose}>
          {id.length > 0 ? (
            <View style={styles.selectedSeatContainer}>
              <Text style={styles.selectedSeatData}>Selected Seats:</Text>
              {id.map((ids, index) => {
                return (
                  <>
                    <Text style={styles.selectedSeatData}>
                      Passenger-{index + 1}:&nbsp;
                      {flightBooking
                        ? flightBooking?.seats[0].length > 0
                          ? flightBooking?.seats[0][0][ids]?.Code
                          : ''
                        : ''}
                      &nbsp;
                      {index !== id.length - 1 ? ',' : ''}
                    </Text>
                  </>
                );
              })}
            </View>
          ) : null}
        </PopUp>

        <PopUp
          value={openDelete}
          handlePopUpClose={() => {
            setOpenDelete(false);
          }}>
          <Text style={styles.hotelDeleteMsg}>
            Are you sure you want to delete the trip item
          </Text>
          <View style={styles.hotelDeletingBtnsContainer}>
            <TouchableOpacity
              style={styles.hotelDeleteBtn}
              onPress={handleDelete}>
              <Text style={styles.hotelDeleteBtnTitle}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hotelDeleteBtn}
              onPress={() => {
                setOpenDelete(false);
              }}>
              <Text style={styles.hotelDeleteBtnTitle}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </PopUp>

        <PopUp
          value={openFlightPrice}
          handlePopUpClose={() => {
            setOpenFlightPrice(prev => !prev);
          }}>
          <View style={styles.flightPriceAndChargesContainer}>
            {tripsPage ? (
             <>
             {
              [flightBooking].length === 1 &&[flightBooking][0].flightNew.segments.length > 1 ? 
              <>
                {[flightBooking].map((book, b) => {
                  return (
                    <View style={styles.flightDirectionMainContainer} key={b}>
                      <View style={styles.flightDirectionContainer}>
                        <Text
                          style={
                            styles.airportName
                          }> Flight Fare</Text>
                      </View>
                      <Text style={styles.flightPrice}>
                        &#8377;{' '}
                        {`${
                          book.flight.Fare.OfferedFare
                            ? Math.ceil(
                                book.flight.Fare.OfferedFare,
                              ).toLocaleString('en-IN')
                            : Math.ceil(
                                book.flight.Fare.PublishedFare,
                              ).toLocaleString('en-IN')
                        }`}
                      </Text>
                    </View>
                  );
                })}
              </>:
              <>
              {[flightBooking].map((book, b) => {
                return (
                  <View key={b} style={styles.flightDirectionMainContainer}>
                    <View style={styles.flightDirectionContainer}>
                      <Text
                        style={
                          styles.airportName
                        }>{`${book.flightNew.segments[0].originAirportCode}`}</Text>
                      <IconSwitcher
                        componentName="AntDesign"
                        iconName="arrowright"
                        color="black"
                        iconsize={2}
                      />
                      <Text
                        style={
                          styles.airportName
                        }>{`${book.flightNew.segments[0].destAirportCode}`}</Text>
                    </View>
                    <Text style={styles.flightPrice}>
                      &#8377;{' '}
                      {`${
                        book.flight.Fare.OfferedFare
                          ? Math.ceil(
                              book.flight.Fare.OfferedFare,
                            ).toLocaleString('en-IN')
                          : Math.ceil(
                              book.flight.Fare.PublishedFare,
                            ).toLocaleString('en-IN')
                      }`}
                    </Text>
                  </View>
                );
              })}
            </>
             }
             
             </>
            ) : null}
            <View style={styles.horizontalLine} />
            {fareData?.totalBaggagePrice ? (
              <View style={styles.serviceCharges}>
                <Text style={styles.flightCharges}>Excess baggage</Text>
                <Text style={[styles.flightChargesPrice,{fontSize:responsiveHeight(1.8)}]}>
                  + &#8377;
                  {` ${fareData?.totalBaggagePrice?.toLocaleString('en-IN')}`}
                </Text>
              </View>
            ) : null}

            {fareData?.totalMealPrice ? (
              <View style={styles.serviceCharges}>
                <Text style={styles.flightCharges}>Add-on meal</Text>
                <Text style={[styles.flightChargesPrice,{fontSize:responsiveHeight(1.8)}]}>
                  + &#8377;
                  {` ${fareData?.totalMealPrice?.toLocaleString('en-IN')}`}
                </Text>
              </View>
            ) : null}

            {fareData?.totalSeatCharges ? (
              <View style={styles.serviceCharges}>
                <Text style={styles.flightCharges}>Seat Charges</Text>
                <Text style={[styles.flightChargesPrice,{fontSize:responsiveHeight(1.8)}]}>
                  + &#8377;
                  {` ${fareData?.totalSeatCharges?.toLocaleString('en-IN')}`}
                </Text>
              </View>
            ) : null}

            <View style={styles.serviceCharges}>
              <Text style={styles.flightCharges}>Service Charges</Text>
              <Text style={[styles.flightChargesPrice,{fontSize:responsiveHeight(1.8)}]}>
                + &#8377;
                {Math.ceil(flightBooking?.finalFlightServiceCharge)}
              </Text>
            </View>
            <View style={styles.serviceCharges}>
              <Text style={styles.flightCharges}>GST</Text>
              <Text style={[styles.flightChargesPrice,{fontSize:responsiveHeight(1.8)}]}>
                + &#8377;
                {Math.ceil(flightBooking?.gstInFinalserviceCharge)}
              </Text>
            </View>
          </View>
          <View style={styles.flightPriceContainer}>
            <Text style={styles.totalFareTitle}>Total fare</Text>
            <Text style={styles.totalFare}>
              &#8377;{' '}
              {` ${Math.ceil(flightBooking?.finalPrice).toLocaleString('en-IN')}`}
            </Text>
          </View>
        </PopUp>

        <PopUp
          value={openFareRules}
          handlePopUpClose={handleFareRulesClose}
          customStyles={{width: '100%'}}>
          {flightBooking?.fareRules ? (
            <View style={{height: responsiveHeight(60)}}>
              <WebView
                source={{html: flightBooking?.fareRules}}
                injectedJavaScript={increaseFontSizeScript}
              />
            </View>
          ) : (
            <View style={styles.notfoundFareRuleContainer}>
              <Text style={styles.notfoundFareRuleTitle}>
                Not Found Any FareRules
              </Text>
            </View>
          )}
        </PopUp>
        {/* recheckRatesPopUp */}
        <PopUp
          value={openPriceReCheck}
          handlePopUpClose={() => {
            setOpenPriceReCheck(false);
          }}>
          {tripsPage ? (
            <>
              <FCard
                airline={flightLogo}
                flightArr={flightArr}
                flightData={{data: flightBooking}}
              />
              {checkingDate ?!flightRecheckError? (
                <>
                  {reCheckLoading ? (
                    <View style={styles.progressBarContainer}>
                      <ProgressBar />
                      <Text style={styles.progressBarTitle}>
                        ReChecking Flight Rates
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.recheckPriceMainContainer}>
                      <Text style={styles.recheckPriceTitle}>
                        Flight Price Recheck
                      </Text>
                      <View style={styles.flightDetails}>
                        <Text style={styles.recheckPriceSubTitles}>
                          Flight Details:
                        </Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.recheckPriceTitles}>
                          {flightBooking.flightNew.segments[0].originCityName}{' '}
                          to {flightBooking.flightNew.segments[0].destCityName}
                        </Text>
                      </View>
                      <View style={styles.recheckRatesContainer}>
                        <Text style={styles.titles}>Old Rates</Text>
                        <Text style={styles.oldprices}>
                          Flight Price:
                          <Text style={styles.recheckPrices}>
                            {' '}
                            &#8377;
                            {` ${
                              flightBooking.flight.Fare.OfferedFare
                                ? Math.ceil(
                                    flightBooking.flight.Fare.OfferedFare,
                                  ).toLocaleString('en-IN')
                                : Math.ceil(
                                    flightBooking.flight.Fare.PublishedFare,
                                  ).toLocaleString('en-IN')
                            }`}
                          </Text>{' '}
                        </Text>
                        {fareData?.totalBaggagePrice ? (
                          <Text style={styles.oldprices}>
                            Baggage:
                            <Text
                              style={
                                styles.recheckPrices
                              }>{` ${fareData?.totalBaggagePrice?.toLocaleString(
                              'en-IN',
                            )}`}</Text>
                          </Text>
                        ) : null}
                        {fareData?.totalMealPrice ? (
                          <Text style={styles.oldprices}>
                            Meal:
                            <Text
                              style={
                                styles.recheckPrices
                              }>{` ${fareData?.totalMealPrice?.toLocaleString(
                              'en-IN',
                            )}`}</Text>
                          </Text>
                        ) : null}
                        {fareData?.totalSeatCharges ? (
                          <Text style={styles.oldprices}>
                            Seat:
                            <Text style={styles.recheckPrices}>
                              {' '}
                              {` ${fareData?.totalSeatCharges?.toLocaleString(
                                'en-IN',
                              )}`}
                            </Text>
                          </Text>
                        ) : null}
                        <Text style={styles.oldprices}>
                          Service Fee and Taxes :
                          <Text style={styles.recheckPrices}>
                            {' '}
                            &#8377;{' '}
                            {Math.ceil(
                              (fareData?.totalFareSum * domesticFlight) / 100,
                            )}
                          </Text>{' '}
                        </Text>
                        <Text style={styles.oldprices}>
                          Total Price :
                          <Text style={styles.recheckPrices}>
                            {' '}
                            &#8377;{' '}
                            {Math.ceil(fareData?.finalPrice).toLocaleString(
                              'en-IN',
                            )}
                          </Text>{' '}
                        </Text>
                      </View>

                      <View style={styles.recheckRatesContainer}>
                        <Text style={styles.titles}>New Rates</Text>
                        <Text style={styles.newPrice}>
                          Flight Price:
                          <Text style={styles.recheckPrices}>
                            &#8377;
                            {` ${
                              reCheckData?.flightData?.Fare?.OfferedFare
                                ? Math.ceil(
                                    reCheckData?.flightData?.Fare?.OfferedFare,
                                  ).toLocaleString('en-IN')
                                : Math.ceil(
                                    reCheckData?.flightData?.Fare
                                      ?.PublishedFare,
                                  ).toLocaleString('en-IN')
                            }`}
                          </Text>{' '}
                        </Text>
                        {fareData?.totalBaggagePrice ? (
                          <Text style={styles.newPrice}>
                            Baggage:
                            <Text style={styles.recheckPrices}>
                              {' '}
                              {Math.ceil(reCheckBaggage).toLocaleString(
                                'en-IN',
                              )}
                            </Text>
                          </Text>
                        ) : null}
                        {fareData?.totalMealPrice ? (
                          <Text style={styles.newPrice}>
                            Meal:
                            <Text style={styles.recheckPrices}>
                              {' '}
                              {Math.ceil(reCheckMeals).toLocaleString('en-IN')}
                            </Text>
                          </Text>
                        ) : null}
                        {fareData?.totalSeatCharges ? (
                          <Text style={styles.newPrice}>
                            Seat:
                            <Text style={styles.recheckPrices}>
                              {' '}
                              {Math.ceil(reCheckSeats).toLocaleString('en-IN')}
                            </Text>
                          </Text>
                        ) : null}
                        <Text style={styles.newPrice}>
                          Service Fee and Taxes :
                          <Text style={styles.recheckPrices}>
                            {' '}
                            &#8377;
                            {` ${Math.ceil(
                              ((reCheckData?.flightData?.Fare?.OfferedFare +
                                reCheckBaggage +
                                reCheckSeats +
                                reCheckMeals) *
                                domesticFlight) /
                                100,
                            )?.toLocaleString('en-IN')}`}
                          </Text>{' '}
                        </Text>
                        <Text style={styles.newPrice}>
                          Total Price :
                          <Text style={styles.recheckPrices}>
                            {' '}
                            &#8377;{' '}
                            {` ${Math.ceil(
                              reCheckData?.flightData?.Fare?.OfferedFare +
                                reCheckBaggage +
                                reCheckSeats +
                                reCheckMeals +
                                ((reCheckData?.flightData?.Fare?.OfferedFare +
                                  reCheckBaggage +
                                  reCheckSeats +
                                  reCheckMeals) *
                                  domesticFlight) /
                                  100,
                            )?.toLocaleString('en-IN')}`}
                          </Text>{' '}
                        </Text>
                      </View>
                      <View style={styles.recheckBtnContainers}>
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={async () =>
                            await actions.updateFlightBookingDetails(
                              recheckSeatsAvailable
                                ? reCheckData?.flightData?.Fare?.OfferedFare
                                : Math.ceil(
                                    reCheckData?.flightData?.Fare?.OfferedFare -
                                      reCheckSeats,
                                  ),
                              flightId,
                              tripId,
                            )
                          }>
                          <Text style={styles.btnTitle}>Keep Flight</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.btn,
                            {backgroundColor: colors.whiteSmoke},
                          ]}
                          onPress={handleDelete}>
                          <Text style={[styles.recheckPriceSubTitles]}>
                            Delete Flight
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
              ):
              <View style={styles.exceedDateContainer}>
              <Text style={styles.recheckPriceTitles}>
               Selected Flight is not available. Please add another Flight.
              </Text>
              <TouchableOpacity
                style={[styles.btn]}
                onPress={() => {
                  handleDelete(), setOpenPriceReCheck(false);
                }}>
                <Text style={styles.btnTitle}>Delete Flight</Text>
              </TouchableOpacity>
            </View>
              : (
                <View style={styles.exceedDateContainer}>
                  <Text style={styles.recheckPriceTitles}>
                    Flight date has exceeded. Please change the date.
                  </Text>
                  <TouchableOpacity
                    style={[styles.btn]}
                    onPress={() => {
                      handleDelete(), setOpenPriceReCheck(false);
                    }}>
                    <Text style={styles.btnTitle}>Delete Flight</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : null}
        </PopUp>
        {/* alltimeStamps */}
        <PopUp value={alltimeStamp} handlePopUpClose={closeAllTimeStamps}>
          <View style={styles.timeStampsContainer}>
          <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={1.8}
              />
            <Text style={styles.timeStampsTitles}>Added Date :</Text>
            <Text style={styles.timeStampsTitles}>
              {totalFlight &&
                totalFlight[0]?.date &&
                moment(totalFlight[0]?.date?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                )}
            </Text>
          </View>
          <View style={styles.timeStampsContainer}>
          <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={1.8}
              />
            <Text style={styles.timeStampsTitles}>Sent to Approval :</Text>
            <Text style={styles.timeStampsTitles}>
              {totalFlight &&
                totalFlight[0]?.manager_request_time ?
                moment(totalFlight[0]?.manager_request_time * 1000).format(
                  'MMMM D, h:mm a',
                ):'Not Requested for Approval'}
            </Text>
          </View>
          <View style={styles.timeStampsContainer}>
          <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={1.8}
              />
            <Text style={styles.timeStampsTitles}>Approved Date :</Text>
            <Text style={styles.timeStampsTitles}>
              {totalFlight &&
                totalFlight[0]?.managerApprovedTime ?
                moment(totalFlight[0]?.managerApprovedTime?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                ):'Not Approved'}
            </Text>
          </View>
          <View style={styles.timeStampsContainer}>
          <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={1.8}
              />
            <Text style={styles.timeStampsTitles}>Submitted Date :</Text>
            <Text style={styles.timeStampsTitles}>
              {totalFlight &&
                totalFlight[0]?.submitted_date ?
                moment(totalFlight[0]?.submitted_date?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                ):'Not Submitted'}
            </Text>
          </View>
          <View style={styles.timeStampsContainer}>
          <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={1.8}
              />
            <Text style={styles.timeStampsTitles}>Booked Date :</Text>
            <Text style={styles.timeStampsTitles}>
              {totalFlight &&
                totalFlight[0]?.booked_date ?
                moment(totalFlight[0]?.booked_date?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                ):'Not Booked'}
            </Text>
          </View>
        </PopUp>
      </View>
    );
}

export default React.memo(TripDetailsFlightCard)
