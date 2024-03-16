import React, { useContext, useEffect, useState } from 'react';
import { View, Text, BackHandler, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MyContext from '../../../context/Context';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors } from '../../../config/theme';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from '../../common/progressBar/ProgressBar';
import { useRoute } from '@react-navigation/native';
import { responsiveHeight } from '../../../utils/responsiveScale';
import FlightCard from '../../flightList/FlightCard';
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import TripDetailsFlightCard from './TripDetailsFlightCard';
const TripDetails = ({ navigation }) => {
  const [mounted, setMounted] = useState(true)
  const [airlinelogos, setAirlinelogos] = useState([]);
  const { actions, tripData, userId, tripDataLoading, userAccountDetails } = useContext(MyContext)

  //   const handleBackButtonPress = () => {
  //     actions.setFlightBookPage(false);
  //     actions.setBookingFlight([]);
  //     actions.setFlightResJType(0)
  // };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // handleBackButtonPress();
  //       navigation.goBack();
  //       return true;
  //     };
  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, []) 
  // );
  console.log(tripData.flights, "kkkkkkkk")
  var statuses = [
    { status: "Paid and Submitted", color: "#4CAF50" },
    { status: "Need clarification", color: "#FFC107" },
    { status: "Price Revision", color: "#2196F3" },
    { status: "Booked", color: "#9C27B0" },
    { status: "Cancelled", color: "#FF0000" },
    { status: "Not Submitted", color: "#808080" }];
  var reqStatuses = [
    { status: "Approved", color: "#008000" },
    { status: "Pending", color: "#ffa500" },
    { status: "Not Requested", color: "#808080" }
  ];
  var price = 0;
  const route = useRoute();
  const { params: { id } } = route;
  const getTripData = async () => {
    var user = userId
    actions.getTripDocById(id, user);
  }
  const getData = async () => {
    const db = firestore();
    const AccountsCollectionRef = db.collection("airlinelogos");

    try {
      const querySnapshot = await AccountsCollectionRef.get();
      const updatedAirlinelogos = [];

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const { id, url } = doc.data();
        updatedAirlinelogos.push({ id, url });
        setAirlinelogos(prevState => ({ ...prevState, [id]: url }));
      });

      setAirlinelogos(updatedAirlinelogos);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const tripFlightsData = tripData?.flights?.sort((a, b) => {
    var aflightArr = [a.data.flight].map((flight, f) => {
      return { ...actions.modifyFlightObject(flight) };
    });
    var bflightArr = [b.data.flight].map((flight, f) => {
      return { ...actions.modifyFlightObject(flight) };
    });
    return aflightArr[0]?.segments[0]?.depTimeDate - bflightArr[0]?.segments[0]?.depTimeDate
  })



  useEffect(() => {

    if (mounted) {
      if (!tripDataLoading) {
        var fetchData = async () => {
          await getTripData();
          await getData()
        }
        fetchData();
      }
    }
    return () => {
      setMounted(false)
    }
  }, [])


  var getTime = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    var dateString = `${month} ${dayOfWeek}`;
    return dateString;
  }
  var getDate = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const dayofyear = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    var dateString = `${month.slice(0, 3)} ${dayOfWeek} ${dayofyear}`;
    return dateString;
  }

  var newdate = getTime(tripData?.data?.date?.seconds)
  // console.log(tripDetailsLoader, "tripDetailsLoader")
  if (tripDataLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ProgressBar />
      </View>
    );
  }
  console.log(price, "price")
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: responsiveHeight(13) }}>
        {/* {backNavigation} */}
        <View style={styles.backNavigationContainer}>
          <TouchableOpacity >
            <IconSwitcher componentName='AntDesign' iconName='arrowleft' color={colors.black} iconsize={3} />
          </TouchableOpacity>
        </View>
        <View style={styles.subContainer}>
          {/* {dateOfJourney} */}
          <View style={styles.tripDetailsHeader}>
            <Text style={styles.tripName}>{tripData.data?.name}</Text>
            <Text style={styles.tripDateTitle}>{`created on: `}<Text style={styles.tripDate}>{`${newdate}`}</Text></Text>
          </View>
          {/* bookingStatus */}
          <View style={styles.bookingStatusContainer}>
            {
              tripData?.data?.flights?.filter((flight) => flight.status === "Not Submitted").length > 0 || tripData?.data?.hotels?.filter((flight) => flight.status === "Not Submitted").length > 0 ?
                (
                  <Text style={styles.bookingStatus}>
                    {tripData?.data?.flights?.filter((flight) => flight.status === "Not Submitted").length > 0 ? (<>{tripData?.data?.flights?.filter((flight) => flight.status === "Not Submitted").length}-Flights</>) : (null)}
                    {tripData?.data?.hotels?.filter((flight) => flight.status === "Not Submitted").length > 0 ? (<>,{tripData?.data?.hotels?.filter((flight) => flight.status === "Not Submitted").length}-Hotels</>) : null}
                    &nbsp;not submitted for booking
                  </Text>
                ) : (null)
            }
          </View>
          {
            tripData ?
              <View>
                <View>
                  {
                    tripData?.hotels ?
                      <>
                        <Text style={styles.hotelCardTitle}>Hotels</Text>
                        {
                          tripData?.hotels?.sort((a, b) => {
                            var atime = a?.data?.hotelSearchQuery?.checkInDate;
                            var btime = b?.data?.hotelSearchQuery?.checkInDate;
                            return atime - btime
                          })?.map((hotel, ind) => {
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                            ];
                            price = price + hotel.data.hotelTotalPrice
                            var hotelData = tripData?.data?.hotels.filter((hotels) => hotels.id === hotel.id)
                            var hotelTimeStamp = new Date(hotelData[0]?.date?.seconds * 1000);
                            var hotelPrice = 0;
                            var hotelStatus = tripData?.data?.hotels?.filter((f) => f.id === hotel.id)
                            var color = statuses.filter((status) => { return status?.status === hotelStatus[0]?.status })
                            const startdate = new Date(hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000);
                            const formattedDate1 = `${monthNames[startdate.getMonth()]} ${startdate.getDate()}`;
                            var endDate = getDate(hotel?.data?.hotelSearchQuery?.checkOutDate.seconds)
                            var img = hotel.data.hotelInfo.HotelInfoResult.HotelDetails.Images[0];
                            var rating = [];
                            var starRating = hotel.data.hotelInfo.HotelInfoResult.HotelDetails.StarRating;
                            var starRatingFull = Math.floor(starRating);
                            var adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce((acc, obj) => {
                              acc.adults += parseInt(obj.adults, 10);
                              acc.child += parseInt(obj.child, 10);
                              return acc;
                            }, { adults: 0, child: 0 });
                            var hotelReq = tripData.data.hotels.filter((hotelMain) => {
                              return hotelMain.id === hotel.id
                            });
                            var reqColor = reqStatuses.filter((status) => { return status?.status === hotelReq[0]?.requestStatus })
                            for (var i = 1; i <= Math.ceil(starRating); i++) {
                              if (i > starRatingFull) {
                                rating.push(
                                  <IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={2} />
                                );
                              } else {
                                rating.push(
                                  <IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={2} />
                                );
                              }
                            }
                            return (
                              <View key={ind} >
                                <View style={styles.hotelCard}>

                                  <View style={styles.hotelDetailsContainer}>
                                    <View style={styles.hotelImgContainer}>
                                      <Image style={styles.hotelImg} src={img} alt='hotel' />
                                    </View>
                                    <View style={{ width: "65%", paddingLeft: responsiveHeight(1), gap: responsiveHeight(1) }}>
                                      <View style={styles.bookedHotelDatesContainer}>
                                        <Text style={styles.hotelTitle}>{hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName} </Text>
                                        <View style={styles.hotelDates}>
                                          <Text style={styles.hotelBookedDate}>{`${formattedDate1} - ${endDate} `}<Text style={styles.hotelNights}>({hotel.data.hotelSearchQuery.hotelNights} Nights)</Text></Text>
                                        </View>
                                      </View>
                                      <View style={styles.hotelRatingContainer}>
                                        {rating.map((star, ind) => {
                                          return (
                                            <Text key={ind}>{star}</Text>
                                          )
                                        })}
                                      </View>
                                      <View style={styles.familyDetails}>
                                        <Text>Adults-{adults?.adults}</Text>
                                        <Text>Children-{adults?.child}</Text>
                                      </View>
                                    </View>
                                  </View>
                                  {
                                    hotel?.data?.selectedRoomType && hotel?.data?.selectedRoomType.map((room, f) => {
                                      // price = price + room.Price.OfferedPriceRoundedOff;
                                      hotelPrice = hotelPrice + room.Price.OfferedPriceRoundedOff;
                                      return (
                                        <View style={styles.hotelRoomFeatures}>
                                          <View style={styles.hotelRoomFeaturesContainer1}>
                                            <Text style={styles.roomType}>{room.RoomTypeName}</Text>
                                            <Text style={styles.hotelRoomPrice}>{`₹ ${room.Price.OfferedPriceRoundedOff ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                              "en-IN"
                                            )
                                              : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                                "en-IN"
                                              )}`}</Text>
                                          </View>
                                          <View style={styles.hotelRoomFeaturesContainer2}>
                                            <View style={styles.mealsDeatils}>
                                              <IconSwitcher componentName='MaterialIcons' iconName='dinner-dining' color={colors.primary} iconsize={2.5} />
                                              <Text style={styles.foodAndCancellationTitle}>
                                                {room.Inclusion && room.Inclusion.length > 0 ? actions.checkForTboMeals(room.Inclusion) : "No meals"}</Text>
                                            </View>
                                            <View style={styles.mealsDeatils}>
                                              {
                                                room.LastCancellationDate && actions.validCancelDate(room.LastCancellationDate) ?
                                                  <>
                                                    <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color={colors.primary} iconsize={2.5} />
                                                    <Text style={styles.foodAndCancellationTitle}>{`Free cancellation upto ${new Date(room.LastCancellationDate).toString().slice(4, 10)}`}</Text>
                                                  </>
                                                  :
                                                  <>
                                                    <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color={colors.primary} iconsize={2.5} />
                                                    <Text style={styles.foodAndCancellationTitle}>{"Non-refundable"}</Text>
                                                  </>
                                              }

                                            </View>
                                          </View>
                                        </View>
                                      )
                                    })
                                  }
                                  <View style={styles.hotelPriceMainContainer}>
                                    {
                                      hotelStatus[0]?.status ?
                                        <View style={styles.bookingStatusTitlesMainContainer}>
                                          <Text style={styles.bookingStatusTitles}>{`Booking Status : `}</Text>
                                          <View style={[styles.bookingStatusTextContainer,{ backgroundColor: color[0] ? color[0].color : '#808080' }]}><Text style={styles.bookingStatusText}>{hotelStatus[0]?.status}</Text></View>
                                        </View> :
                                        <View style={styles.bookingStatusTitlesMainContainer}>
                                          <Text style={styles.bookingStatusTitles}>{`Booking Status : `}</Text>
                                          <View style={[styles.bookingStatusTextContainer,{ backgroundColor: color[0] ? color[0].color : '#808080' }]}><Text style={styles.bookingStatusText}>{`Not Submitted`}</Text></View>
                                        </View>
                                    }

                                    
                                    <View style={styles.bookingStatusTitlesMainContainer}>
                                    <Text style={styles.bookingStatusTitles}>{`Approval Status : `}</Text>
                                    <View style={[styles.bookingStatusTextContainer,{ backgroundColor: color[0] ? color[0].color : '#808080' }]}>
                                    <Text style={styles.bookingStatusText}>{hotelReq[0]?.requestStatus}</Text>
                                    </View>
                                    </View>

                                   <View style={styles.hotelTotalPriceContainer}>
                                   <Text style={styles.hotelTotalPrice}>{`Total Price : ₹ ${Math.ceil(hotel.data.hotelTotalPrice).toLocaleString("en-IN")}`}</Text>
                                   <TouchableOpacity>
                                   <IconSwitcher componentName='Entypo' iconName='info-with-circle' color={colors.black} iconsize={1.8}/>
                                   </TouchableOpacity>
                                   </View>
                                  </View>
                                  <View style={styles.addedHotelTimeAndDateContainer}>
                                    <View style={styles.addedHotelTitleContainer}>
                                      <Text style={styles.bookingStatusTitles}>{`Added Date: `}<Text style={styles.addedHotelTimeAndDate}>{`${hotelTimeStamp.toLocaleString()}`}</Text></Text>
                                    </View>
                                    <>
                                      <TouchableOpacity>
                                        <IconSwitcher componentName='MaterialIcons' iconName='delete' color={colors.red} iconsize={2.5} />
                                      </TouchableOpacity>
                                    </>
                                  </View>
                                </View>
                              </View>
                            )
                          })
                        }
                        <View style={styles.addingHotelBtnContainer}>
                          <TouchableOpacity style={styles.addingHotelBtn}>
                            <Text style={styles.addingHotelBtnTitle}>Add Hotel </Text>
                            <IconSwitcher componentName='Feather' iconName='plus' color={colors.primary} iconsize={3} />
                          </TouchableOpacity>
                        </View>
                      </>
                      : null
                  }
                </View>
                {/* flight */}
                <View>
                  {tripData?.flights ?
                    <>
                      <Text style={styles.flightCardTitle}>Flights</Text>
                      {/* <FlatList
                      data={tripFlightsData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item: flight, index }) => {
                        // var aflightArr = [flight.data.flight].map((flight, f) => {
                        //   return { ...actions.modifyFlightObject(flight) };
                        // });
                        var flightStatus = tripData.data.flights.filter((f) => f.id === flight.id);
                        price = price + flight.data.finalPrice;
                        console.log(price,"flight.data.finalPrice")
                        var hotelData = tripData?.data?.flights.filter((hotels) => hotels.id === flight.id);
                        var hotelTimeStamp = new Date(hotelData[0]?.date?.seconds * 1000);
                        var flightReq = tripData.data.flights.filter((hotelMain) => {
                          return hotelMain.id === flight.id;
                        });
                        var reqColor = reqStatuses.filter((status) => { return status?.status === flightReq[0]?.requestStatus });

                        return (
                          // <FlightCard
                          //     flightGrp={[flight.data.flight]}
                          //     index={index}
                          //     tripsPage={true}
                          //     bookingPage={true}
                          //     flightBooking={flight.data}
                          //     downloadUrl={flightStatus[0]?.downloadURL ? flightStatus[0].downloadURL : undefined}
                          //     flightStatus={flightStatus[0]}
                          //     timeStamp={hotelTimeStamp}
                          //     flightId={flight.id}
                          //     tripId={id}
                          //     flightReq={flightReq}
                          //     reqColor={reqColor}
                          // />
                          <TripDetailsFlightCard
                            flightGrp={[flight.data.flight]}
                            index={index}
                            flightBooking={flight.data}
                            flightStatus={flightStatus[0]}
                            flightReq={flightReq}
                            timeStamp={hotelTimeStamp}
                          />
                          
                        );
                      }}
                      contentContainerStyle={{ paddingBottom: responsiveHeight(0) }} /> */}
                      {
                        tripData?.flights?.sort((a, b) => {
                          var aflightArr = [a.data.flight].map((flight, f) => {
                            return { ...actions.modifyFlightObject(flight) };
                          });
                          var bflightArr = [b.data.flight].map((flight, f) => {
                            return { ...actions.modifyFlightObject(flight) };
                          });
                          return aflightArr[0]?.segments[0]?.depTimeDate - bflightArr[0]?.segments[0]?.depTimeDate
                        }).map((flight, f) => {
                          var flightStatus = tripData.data.flights.filter((f) => f.id === flight.id)
                          console.log(price, "flight.data.finalPrice")
                          price = price + flight.data.finalPrice
                          console.log(flight.data.finalPrice, "flight.data.finalPrice")
                          var hotelTimeStamp = new Date(flightStatus[0]?.date?.seconds * 1000);
                          var flightReq = tripData.data.flights.filter((hotelMain) => {
                            return hotelMain.id === flight.id
                          });
                          const data = actions.objToArr(flight.data)

                          var reqColor = reqStatuses.filter((status) => { return status?.status === flightReq[0]?.requestStatus })

                          return (
                            <>
                              <TripDetailsFlightCard
                                flightGrp={[flight.data.flight]}
                                index={f}
                                flightBooking={flight.data}
                                flightStatus={flightStatus[0]}
                                flightReq={flightReq}
                                timeStamp={hotelTimeStamp}
                              />
                            </>
                          )
                        })
                      }
                      <View style={styles.addingHotelBtnContainer}>
                        <TouchableOpacity style={styles.addingHotelBtn}>
                          <Text style={styles.addingHotelBtnTitle}>Add Hotel </Text>
                          <IconSwitcher componentName='Feather' iconName='plus' color={colors.primary} iconsize={3} />
                        </TouchableOpacity>
                      </View>
                    </>
                    : null}

                </View>
              </View>
              : null
          }

        </View>
      </ScrollView>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceTitle}>Total price:</Text>
        <Text style={styles.totalPrice}>{`₹ ${price}`}</Text>
        <TouchableOpacity style={styles.proceedToBookingBtn}>
          <Text style={styles.proceedToBookingBtnTitle}>
            Proceed to Booking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripDetails;
