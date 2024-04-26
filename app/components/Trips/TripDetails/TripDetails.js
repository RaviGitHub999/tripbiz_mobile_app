import React, { useContext, useEffect, useState } from 'react';
import { View, Text, BackHandler, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MyContext from '../../../context/Context';
import { styles } from './styles';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors } from '../../../config/theme';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from '../../common/progressBar/ProgressBar';
import { useRoute } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';
import TripDetailsFlightCard from './TripDetailsFlightCard';
import PopUp from '../../common/popup/PopUp';
import { RefreshControl } from 'react-native';
import InputField from './InputField';
const TripDetails = ({ navigation: { navigate, goBack } }) => {
  const [mounted, setMounted] = useState(true)
  const [airlinelogos, setAirlinelogos] = useState([]);
  const [popup, setPopUp] = useState({
    hotelPrice: false,
  })
  const [hotelTotalPrice, setHotelTotalPrice] = useState(0)
  const [hotelFinalPrice, setHotelFinalPrice] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(false)
  const [deleteType, setDeleteType] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [traveller, setTraveller] = useState(false);
  const [tripId, setTripId] = useState();
  const [travellerCount, setTravellerCount] = useState()
  const [userDetails, setUserDetails] = useState([]);
  const [bookingPrice, setBookingPrice] = useState(0)
  const [requestIds, setRequestIds] = useState([])
  const [finalPrice, setFinalPrice] = useState(0);
  const [requestId, setRequestId] = useState();
  const [requestData, setRequestData] = useState();
  const [selectedTab, setSelectedTab] = useState("travellers");
  const [travellerDetails, setTravellerDetails] = useState({});
  const [isEdit, setIsEdit] = useState({})
  const [showError, setShowError] = useState(false)
  const { actions, tripData, userId, tripDataLoading, userAccountDetails } = useContext(MyContext)

  var flightSubmittedIds = tripData?.data ? tripData?.data?.flights.filter((flight) => flight.status !== "Not Submitted").map((status) => status.id) : []
    var hotelSubmittedIds = tripData?.data ? tripData?.data?.hotels.filter((flight) => flight.status !== "Not Submitted").map((status) => status.id) : []
    var flightNotSubmittedIds = tripData?.data ? tripData?.data?.flights.filter((flight) => flight.status === "Not Submitted").map((status) => status.id) : []
    var hotelNotSubmittedIds = tripData?.data ? tripData?.data?.hotels.filter((flight) => flight.status === "Not Submitted").map((status) => status.id) : []

    var flightArray = tripData?.requestData ? tripData?.requestData?.map((req) => req.data.flights) : []
    var hotelArray = tripData?.requestData ? tripData?.requestData?.map((req) => req.data.hotels) : []

    var flightsIds = flightArray.length > 0 ? [].concat(...flightArray) : []
    var hotelIds = hotelArray.length > 0 ? [].concat(...hotelArray) : []

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await getTripData();
      await getData()
      setRefreshing(false);
    }, 2000);
  };
  //   const handleBackButtonPress = () => {
  //     actions.setFlightBookPage(false);
  //     actions.setBookingFlight([]);
  //     actions.setFlightResJType(0)
  // };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigate("MyTrips")
        actions.setRes()
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  const handleDelete = async () => {
    await actions.deleteTripItem(id, deleteId, deleteType);
    setOpenDelete(false)
    // setSelectedTab("approval")
    //await getTripData()
  }
  const handlePopUps = (arg) => {
    if (arg === "hotelPrice") {
      setPopUp({ ...popup, hotelPrice: !popup.hotelPrice })
    }

  }
  var statuses = [
    { status: "Paid and Submitted", color: "#ffa500" },
    { status: "Need clarification", color: "#FFC107" },
    { status: "Price Revision", color: "#2196F3" },
    { status: "Booked", color: "#4CAF50" },
    { status: "Cancelled", color: "#FF0000" },
    { status: "Submitted,Payment Pending", color: "#ffa500" },
    { status: "Booked,Payment Pending", color: "#4CAF50" },
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

  const handlehotelPriceinfo = (hotel) => {
    handlePopUps("hotelPrice")
    setHotelFinalPrice(hotel.data.hotelFinalPrice)
    setHotelTotalPrice(hotel.data.hotelTotalPrice)
    setSelectedRoom(hotel.data.selectedRoomType)
  }
  const handlehotelPriceinfoClose = () => {
    handlePopUps("hotelPrice")
    setHotelFinalPrice(0)
    setHotelTotalPrice(0)
    setSelectedRoom([])
  }

  const handleFlights = async () => {
    navigate("Home")
    actions.setSelectedTripId(id);
    await actions.setRes();
    actions.switchComponent("flights")
  }
  const handleHotels = async () => {
    navigate('Home')
    actions.setSelectedTripId(id);
    await actions.setRes();
    actions.switchComponent("hotel")
  }

  var onBtnClick = async () => {
    setTraveller(true);
    setTripId(tripData?.flights.length > 0 ?
      tripData?.flights[0]?.id :
      (tripData?.hotels.length > 0 ?
        tripData.hotels[0].id : tripData?.cabs.length > 0 ? tripData?.cabs[0].id : 0));
    var adults = tripData?.hotels[0]?.data?.hotelSearchQuery?.hotelRoomArr.reduce((acc, obj) => {
      acc.adults += parseInt(obj.adults, 10);
      acc.child += parseInt(obj.child, 10);
      return acc;
    }, { adults: 0, child: 0 });

    setTravellerCount(tripData?.flights.length > 0 ?
      { adults: Number(tripData?.flights[0]?.data?.adults), child: Number(tripData?.flights[0]?.data?.child), infant: Number(tripData?.flights[0]?.data?.infant) } :
      (tripData?.hotels.length > 0 ?
        adults : { child: 0, adults: 1 }))
    setUserDetails([{
      firstName: userAccountDetails?.firstName,
      lastName: userAccountDetails?.lastName,
      mobileNumber: userAccountDetails?.mobileNumber,
      email: userAccountDetails?.email,
    }])
    var totprice = tripData.requestData.length > 0 ? tripData?.requestData?.reduce((acc, item) => acc + item.data.price, 0) : 0;
    var finprice = price - totprice
    console.log(finprice);
    var reqIds = tripData.requestData.length > 0 ? tripData?.requestData?.map((req) => req.id) : [];
    setBookingPrice(price)
    setRequestIds(reqIds)
    setFinalPrice(finprice)
    setRequestId(tripData?.requestData[0]?.id)
    setRequestData(tripData?.requestData[0]?.data)
  }

  useEffect(() => {
    if (mounted) {
      if (!tripDataLoading) {
        var fetchData = async () => {
          await getTripData();
          await getData()
          actions.handleFlightsLogos()
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
  const handleInputChange = (index, key, value) => {
    setUserDetails((prevUserDetails) => {
      const updatedUserDetails = [...prevUserDetails];
      const traveler = updatedUserDetails[index] || {};
      traveler[key] = value;
      updatedUserDetails[index] = traveler;
      console.log(updatedUserDetails);
      return updatedUserDetails;
    });
  };

  var setFinalDetails = async (id1) => {
    const data = [];
    userDetails.forEach((userDetail, index) => {
      const mergedDetails = {
        firstName: userAccountDetails?.firstName,
        lastName: userAccountDetails?.lastName,
        mobileNumber: userAccountDetails?.mobileNumber,
        email: userAccountDetails?.email,
        ...userDetail
      };
      data.push(mergedDetails)
    });
    setTravellerDetails({
      ...travellerDetails,
      [id1]: data
    })
  }


  var newdate = getTime(tripData?.data?.date?.seconds)
  // if (tripDataLoading) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ProgressBar />
  //     </View>
  //   );
  // }
  const handleBack = () => {
    navigate("MyTrips")
    actions.setRes()
  }

  const handleSelectedTab = (item) => {
    setSelectedTab(item)
    // setShowError(false)
  }
  return (
    tripDataLoading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ProgressBar />
    </View> :
      tripData && <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: responsiveHeight(13) }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* {backNavigation} */}
          <View style={styles.backNavigationContainer}>
            <TouchableOpacity onPress={handleBack}>
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
                              const startdate = new Date(hotel?.data?.hotelSearchQuery?.checkInDate?.seconds * 1000);
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
                                        {/* <Image
                                    style={styles.hotelImg}
                                    source={{ uri: imageError ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : img }}   
                                    onError={() => setImageError(true)}
                                    // onLoad={()=>setImageError(false)}
                                  /> */}
                                        <Image
                                          style={styles.hotelImg}
                                          source={{ uri: imageError ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : img }}
                                          onError={() => {
                                            console.log("Image loading error occurred");
                                            setImageError(true);
                                          }}
                                          onLoad={() => console.log("Image loaded successfully")}
                                        />
                                        {/* <FastImage
style={styles.hotelImg}
source={{
  uri: imageError
    ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
    : img
}}
onError={() => {
  console.log("Image loading error occurred");
  setImageError(true);
}}
onLoad={() => console.log("Image loaded successfully")}
/> */}

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
                                          <Text style={styles.familyDetailsTitle}>Adults-{adults?.adults}</Text>
                                          <Text style={styles.familyDetailsTitle}>Children-{adults?.child}</Text>
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
                                            <View style={[styles.bookingStatusTextContainer, { backgroundColor: color[0] ? color[0].color : '#808080' }]}><Text style={styles.bookingStatusText}>{hotelStatus[0]?.status}</Text></View>
                                          </View> :
                                          <View style={styles.bookingStatusTitlesMainContainer}>
                                            <Text style={styles.bookingStatusTitles}>{`Booking Status : `}</Text>
                                            <View style={[styles.bookingStatusTextContainer, { backgroundColor: color[0] ? color[0].color : '#808080' }]}><Text style={styles.bookingStatusText}>{`Not Submitted`}</Text></View>
                                          </View>
                                      }


                                      <View style={styles.bookingStatusTitlesMainContainer}>
                                        <Text style={styles.bookingStatusTitles}>{`Approval Status : `}</Text>
                                        <View style={[styles.bookingStatusTextContainer, { backgroundColor: color[0] ? color[0].color : '#808080' }]}>
                                          <Text style={styles.bookingStatusText}>{hotelReq[0]?.requestStatus}</Text>
                                        </View>
                                      </View>

                                      <View style={styles.hotelTotalPriceContainer}>
                                        <Text style={styles.hotelTotalPrice}>{`Total Price : ₹ ${Math.ceil(hotel.data.hotelTotalPrice).toLocaleString("en-IN")}`}</Text>
                                        <TouchableOpacity onPress={() => handlehotelPriceinfo(hotel)}>
                                          <IconSwitcher componentName='Entypo' iconName='info-with-circle' color={colors.black} iconsize={1.8} />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                    <View style={styles.addedHotelTimeAndDateContainer}>
                                      <View style={styles.addedHotelTitleContainer}>
                                        <Text style={styles.bookingStatusTitles}>{`Added Date: `}<Text style={styles.addedHotelTimeAndDate}>{hotelTimeStamp.toString().slice(4, 24)}</Text></Text>
                                      </View>
                                      <>
                                        <TouchableOpacity onPress={() => {
                                          setOpenDelete(true)
                                          setDeleteType("hotels")
                                          setDeleteId(hotel.id)
                                        }}>
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
                            <TouchableOpacity style={styles.addingHotelBtn} onPress={handleHotels}>
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
                            price = price + flight.data.finalPrice
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
                                  reqColor={reqColor}
                                  tripId={id}
                                  flightId={flight.id}
                                  tripsPage={true}
                                />
                              </>
                            )
                          })
                        }
                        <View style={styles.addingHotelBtnContainer}>
                          <TouchableOpacity style={styles.addingHotelBtn} onPress={handleFlights}>
                            <Text style={styles.addingHotelBtnTitle}>Add Flight </Text>
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
          <Text style={styles.totalPrice}>{`₹ ${Math.ceil(price)}`}</Text>
          {
            tripData?.data?.flights?.filter((flight) => flight.status === "Not Submitted")?.length > 0 || tripData?.data?.hotels?.filter((flight) => flight.status === "Not Submitted")?.length > 0 ?
              <TouchableOpacity style={styles.proceedToBookingBtn}>
                <Text style={styles.proceedToBookingBtnTitle} onPress={onBtnClick}>
                  Proceed to Booking
                </Text>
              </TouchableOpacity> : null
          }
        </View>

        <PopUp value={popup.hotelPrice} handlePopUpClose={handlehotelPriceinfoClose}>
          <View style={styles.HotelRoomFeaturesMainCon}>
            {
              selectedRoom?.map((room, r) => {
                return (
                  <View style={styles.PopUpHotelRoomFeatures}>
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
          </View>
          <View style={styles.popUpHotelPriceDescriptionMainContaioner}>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={styles.popUproomPriceTitle}>Room price:</Text>
              <Text style={[styles.popUproomPriceTitle, { color: colors.secondary }]}>&#8377; {`${hotelFinalPrice.toLocaleString("en-IN")} `}</Text>
            </View>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={styles.popUproomserviceChargesTitle}>Service Charges</Text>
              <Text style={[styles.popUproomserviceChargesTitle, { color: colors.highlight }]}>+ &#8377;{Math.ceil((hotelTotalPrice - hotelFinalPrice))}</Text>
            </View>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={[styles.totalPrice, { color: colors.primary }]}>Total price:</Text>
              <Text style={styles.totalPrice}>&#8377; {`${Math.ceil(hotelTotalPrice).toLocaleString("en-IN")}`}</Text>
            </View>
          </View>
        </PopUp>

        <PopUp value={openDelete} handlePopUpClose={() => {
          setOpenDelete(false)
        }}>
          <Text style={styles.hotelDeleteMsg}>Are you sure you want to delete the trip item</Text>
          <View style={styles.hotelDeletingBtnsContainer}>
            <TouchableOpacity style={styles.hotelDeleteBtn} onPress={handleDelete}>
              <Text style={styles.hotelDeleteBtnTitle}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hotelDeleteBtn} onPress={() => {
              setOpenDelete(false)
            }}>
              <Text style={styles.hotelDeleteBtnTitle}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </PopUp>
        {/* Proceed to Booking */}
        <PopUp customStyles={{ width: "100%", height: "90%" }} value={traveller} handlePopUpClose={() => {
          setTraveller(false);
          setSelectedTab("travellers")
          setShowError(false)
        }}>

          <View style={styles.tripDetailsTravellerTabs}>
            <TouchableOpacity style={selectedTab === "travellers" ? styles.tripDetailsTravellerSelectedEachTab : styles.tripDetailsTravellerEachTab} onPress={() => handleSelectedTab("travellers")}>
              <Text style={selectedTab === "travellers" ? styles.tabTitlesSelected : styles.tabTitles}>Traveller Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={selectedTab === "approval" ? styles.tripDetailsTravellerSelectedEachTab : styles.tripDetailsTravellerEachTab} onPress={() => handleSelectedTab("approval")}>
              <Text style={selectedTab === "approval" ? styles.tabTitlesSelected : styles.tabTitles}>Review and Approval</Text>
            </TouchableOpacity>
            <TouchableOpacity style={selectedTab === "payment" ? styles.tripDetailsTravellerSelectedEachTab : styles.tripDetailsTravellerEachTab} onPress={() => handleSelectedTab("payment")}>
              <Text style={selectedTab === "payment" ? styles.tabTitlesSelected : styles.tabTitles}>Make Payment</Text>
            </TouchableOpacity>
          </View>
          {selectedTab === "travellers" ?
          <ScrollView style={{ flex: 1 }}>
            <View style={{ borderWidth: 2, borderColor: 'green', marginTop: responsiveHeight(2), flexDirection: 'row' }}>
              <View style={{ borderRightWidth: 2, borderColor: 'blue' }}>
                {
                  tripData?.flights?.map((flight, ind) => {
                    const date1 = new Date(flight.data.flight.Segments[0][0].Origin.DepTime);
                    const monthAbbreviation1 = date1.toLocaleString('default', { month: 'short' });
                    const day1 = date1.getDate();
                    var flightReq = tripData.data.flights.filter((hotelMain) => {
                      return hotelMain.id === flight.id
                    });
                    var flightStatus = tripData.data.flights.filter((f) => f.id === flight.id)
                    var color = statuses.filter((status) => { return status?.status === flightStatus[0]?.status })
                    var reqColor = reqStatuses.filter((status) => { return status?.status === flightReq[0]?.requestStatus })
                    return (
                      <TouchableOpacity style={[styles.travelDetailsFlightCard, { backgroundColor: color[0] ? color[0].color : "#808080" }]} onPress={() => {
                        setTravellerCount({ adults: Number(flight?.data?.adults), child: Number(flight?.data?.child), infant: Number(flight?.data?.infant) })
                        setTripId(flight.id)
                      }}>
                        <IconSwitcher componentName='MaterialIcons' iconName='flight-takeoff' color='black' iconsize={4} />
                        <View style={{ position: "absolute", right: responsiveWidth(1), top: responsiveHeight(0) }}>
                          <Text>{ind + 1}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }

                {
                  tripData?.hotels?.map((hotel, ind) => {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                    const date = new Date(hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000);
                    const formattedDate1 = `${monthNames[date.getMonth()]} ${date.getDate()}`;
                    const date2 = new Date(hotel?.data?.hotelSearchQuery?.checkOutDate.seconds * 1000);
                    const formattedDate2 = `${monthNames[date2.getMonth()]} ${date2.getDate()}`;
                    var hotelReq = tripData?.data?.hotels.filter((hotelMain) => {
                      return hotelMain.id === hotel.id
                    });
                    var hotelStatus = tripData?.data?.hotels?.filter((f) => f.id === hotel.id)
                    var color = statuses.filter((status) => { return status?.status === hotelStatus[0]?.status })

                    var reqColor = reqStatuses.filter((status) => { return status?.status === hotelReq[0]?.requestStatus })
                    return (
                      <TouchableOpacity style={[styles.travelDetailsFlightCard, { backgroundColor: color[0] ? color[0].color : "#808080" }]} onPress={() => {
                        var adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce((acc, obj) => {
                          acc.adults += parseInt(obj.adults, 10);
                          acc.child += parseInt(obj.child, 10);
                          return acc;
                        }, { adults: 0, child: 0 });
                        setTravellerCount(adults)
                        setTripId(hotel.id)
                      }}>
                        <IconSwitcher componentName='FontAwesome6' iconName='hotel' color='black' iconsize={2.5} />
                        <View style={{ position: "absolute", right: responsiveWidth(1), top: responsiveHeight(0) }}>
                          <Text>{ind + 1}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
              <View style={{ borderWidth: 2, borderColor: 'yellow', flex: 1 }}>
                {
                  tripData?.flights?.filter((flight) => flight.id === tripId)?.map((flight) => {
                    const date1 = new Date(flight.data.flight.Segments[0][0].Origin.DepTime);
                    const monthAbbreviation1 = date1.toLocaleString('default', { month: 'short' });
                    const day1 = date1.getDate();
                    return (
                      <>
                        <View style={styles.tripDetailsTitleContainer}>
                          <Text style={styles.tripDetailsTitle}>
                            {`Flight:${flight.data.flightNew.segments[0].mainFlgtCode}, `}
                          </Text>
                          <View style={styles.tripRouteCon}>
                            <Text style={styles.tripDetailsTitle}>{`${flight.data.flightNew.segments[0].originAirportCode}`}</Text>
                            <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={2} />
                            <Text style={styles.tripDetailsTitle}>{`${flight.data.flightNew.segments[0].destAirportCode}, `}</Text>
                          </View>
                          <Text style={styles.tripDetailsTitle}>{`${monthAbbreviation1} ${day1}`}</Text>
                        </View>
                        {
                          [...Array(travellerCount.adults + travellerCount.child + travellerCount.infant)]?.map((index, s) => {
                            var type = s + 1 <= travellerCount.adults ? 'Adult' : (s + 1 <= (travellerCount.adults + travellerCount.child) ? "Child" : "Infant")
                            var indexe = s + 1 <= travellerCount.adults ? s : (s + 1 <= (travellerCount.adults + travellerCount.child) ? s - travellerCount.adults : "")
                            var isInternational = flight.data.flightNew.segments[0].destCountryCode !== "IN" || flight.data.flightNew.segments[0].originCountryCode !== "IN"

                            return (
                              <View style={{ paddingHorizontal: 10, marginVertical: 0, borderWidth: 1, paddingVertical: 20 }}>
                                <InputField flight={flight} userDetails={userDetails} s={s} travIndex={indexe} tripData={tripData} travellerDetails={travellerDetails} handleInputChange={handleInputChange} isEdit={isEdit} travellerType={type} isInternational={isInternational} />

                              </View>
                            )
                          })
                        }
                        {
                          !(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ?
                            <View style={styles.btn}>
                              {
                                isEdit[flight.id] ? (
                                  <TouchableOpacity onPress={() =>
                                    setIsEdit({
                                      ...isEdit,
                                      [flight.id]: !isEdit[flight.id]
                                    })
                                  }>
                                    <Text style={styles.btnTitle}>Edit</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity onPress={async () => {
                                    setIsEdit({
                                      ...isEdit,
                                      [flight.id]: true
                                    })
                                    await setFinalDetails(flight.id)
                                  }}>
                                    <Text style={styles.btnTitle}>Save Details</Text>
                                  </TouchableOpacity>
                                )
                              }
                            </View> : null

                        }
                      </>
                    )

                  }
                  )
                }
                {
                  tripData?.hotels?.filter((hotel) => hotel.id === tripId).map((hotel) => {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                    const date = new Date(hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000);
                    const formattedDate1 = `${monthNames[date.getMonth()]} ${date.getDate()}`;
                    const date2 = new Date(hotel?.data?.hotelSearchQuery?.checkOutDate.seconds * 1000);
                    const formattedDate2 = `${monthNames[date2.getMonth()]} ${date2.getDate()}`;
                    return (
                      <>
                        <View style={styles.tripDetailsTitleContainer}>
                          <Text style={styles.tripDetailsTitle}>
                            {`Hotel:${hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName}, `}
                          </Text>
                          <Text style={styles.tripDetailsTitle}>{`${hotel?.data?.hotelSearchQuery?.cityDestName},`}</Text>
                          <Text style={styles.tripDetailsTitle}>{`${formattedDate1}-${formattedDate2}`}</Text>
                        </View>
                        {
                          [...Array(travellerCount.adults + travellerCount.child)]?.map((index, s) => {
                            var type = s + 1 <= travellerCount.adults ? 'Adult' : "Child"
                            var indexe = s + 1 <= travellerCount.adults ? s : (s - travellerCount.adults)
                            return (
                              <View style={{ paddingHorizontal: 10, marginVertical: 0, borderWidth: 1, paddingVertical: 20 }}>
                                <InputField flight={hotel} userDetails={userDetails} s={s} travIndex={indexe} tripData={tripData} travellerDetails={travellerDetails} handleInputChange={handleInputChange} isEdit={isEdit} travellerType={type} />
                              </View>
                            )
                          })
                        }

                        {
                          !(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[hotel.id]) ?
                            <>
                              {
                                userDetails.length === (travellerCount.adults + travellerCount.child) ?
                                  <>
                                    <View style={styles.btn}>
                                      {
                                        isEdit[hotel.id] ? (
                                          <TouchableOpacity onPress={() =>
                                            setIsEdit({
                                              ...isEdit,
                                              [hotel.id]: !isEdit[hotel.id]
                                            })
                                          }>
                                            <Text style={styles.btnTitle}>Edit</Text>
                                          </TouchableOpacity>
                                        ) : (
                                          <TouchableOpacity onPress={async () => {
                                            setIsEdit({
                                              ...isEdit,
                                              [hotel.id]: true
                                            })
                                            await setFinalDetails(hotel.id.id)
                                          }}>
                                            <Text style={styles.btnTitle}>Save Details</Text>
                                          </TouchableOpacity>
                                        )
                                      }
                                    </View>
                                  </>
                                  : null

                              }
                            </>
                            : null

                        }
                      </>
                    )
                  })
                }
                <View>
                  {
                    showError && (
                      <View >
                        <Text>Please fill traveller details for each item</Text>
                      </View>
                    )
                  }
                  <TouchableOpacity
                    onPress={() => {
                      if (flightNotSubmittedIds?.every(item => Object.keys(travellerDetails).includes(item))) {
                        setSelectedTab("approval")
                      }
                      else {
                        setShowError(true)
                      }
                    }}
                  >
                  <Text>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
          :null}
        </PopUp>
      </View>
  );
};

export default React.memo(TripDetails);
