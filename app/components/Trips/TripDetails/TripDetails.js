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
  return (
    <View style={styles.mainContainer}>
      {/* {backNavigation} */}
      <View style={styles.backNavigationContainer}>
        <TouchableOpacity >
          <IconSwitcher componentName='AntDesign' iconName='arrowleft' color={colors.black} iconsize={3} />
        </TouchableOpacity>
      </View>

      {/* <div className='tripDetails-header'>
                <div className='tripDetails-header-name'>
                    <span className='trip-name'>{tripData.data?.name}</span>
                    <span>created on: <span>{newdate}</span></span>
                </div>
            </div> */}
      <View style={styles.subContainer}>
        {/* {dateOfJourney} */}
        <View style={styles.tripDetailsHeader}>
          <Text style={styles.tripName}>{tripData.data?.name}</Text>
          <Text style={styles.tripDateTitle}>{`created on: `}<Text style={styles.tripDate}>{`${newdate}`}</Text></Text>
        </View>
        {
          tripData ?
            <View>
              <View>
                {
                  tripData?.hotels ?
                    <>
                      <Text>Hotels</Text>
                      {
                        tripData?.hotels?.sort((a, b) => {
                          var atime = a?.data?.hotelSearchQuery?.checkInDate;
                          var btime = b?.data?.hotelSearchQuery?.checkInDate;
                          return atime - btime
                        })?.map((hotel, ind) => {
                          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                          ];
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
                                <IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={2.5} />
                              );
                            } else {
                              rating.push(
                                <IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={2.5} />
                              );
                            }
                          }
                          return (
                            <View key={ind} >
                              <View style={styles.hotelCard}>
                                <View style={styles.hotelImgContainer}>
                                  <Image style={styles.hotelImg} src={img} alt='kkk' />
                                </View>
                                <View  style={styles.hotelDescriptionContainer}>
                                  <View style={styles.hotelBookedDataContainer}>
                                    <View style={styles.hotelTitleContainer}>
                                    <Text style={styles.hotelTitle}>The Down Town Hotel</Text>
                                    </View>
                                    <View style={styles.hotelBookedDateContainer}>
                                      {/* <Text style={styles.hotelBookedDate}>Mar 13-Mar 15 2024</Text> */}
                                      <Text style={styles.hotelNights}>{'(2 Nights)'}</Text>
                                    </View>
                                  </View>
                                </View>
                              </View>

                            </View>
                          )
                        })
                      }
                    </>
                    : null
                }
              </View>
              <View></View>
            </View>
            : null
        }

      </View>

    </View>
  );
};

export default TripDetails;
