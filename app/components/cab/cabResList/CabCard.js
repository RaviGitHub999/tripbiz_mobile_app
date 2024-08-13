import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  Alert,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import MyContext from '../../../context/Context';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import {colors, fonts} from '../../../config/theme';
import IconSwitcher from '../../common/icons/IconSwitcher';
import PopUp from '../../common/popup/PopUp';
import {TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TravellerDetailsBtn from '../../common/mainComponents/TravellerDetailsButton/TravellerDetailsBtn';
import moment from 'moment';
var imgs = [
  {
    passenger: 4,
    type: 'Sedan',
    image:
      'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/hatchback_new.png',
  },
  {
    passenger: 4,
    type: 'Indica or similar',
    image: 'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/sedan_new.png',
  },
  {
    passenger: 6,
    type: 'SUV (Innova/Ertiga)',
    image: 'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
  },
  {
    passenger: 6,
    type: 'Innova',
    image: 'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
  },
  {
    passenger: 6,
    type: 'Innova crysta',
    image: 'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
  },
  {
    passenger: 6,
    type: 'Innova Crysta',
    image: 'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
  },
  {
    passenger: 6,
    type: 'Ertiga',
    image: 'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
  },
];
const cabTypes = [
  '8 hrs cab at disposal',
  '12 hrs cab at disposal',
  '4 hrs cab at disposal',
  '10 hrs cab at disposal',
];
var statuses = [
  {status: 'Submitted', color: '#ffa500'},
  {status: 'Need clarification', color: '#FFC107'},
  {status: 'Price Revision', color: '#2196F3'},
  {status: 'Booked', color: 'green'},
  {status: 'Cancelled', color: '#FF0000'},
  {status: 'Submitted,Payment Pending', color: '#ffa500'},
  {status: 'Booked,Payment Pending', color: '#4CAF50'},
  {status: 'Not Submitted', color: '#808080'},
];
var reqStatuses = [
  {status: 'Approved', color: '#008000'},
  {status: 'Pending', color: '#ffa500'},
  {status: 'Not Requested', color: '#808080'},
  { status: "Skipped", color: "#FF0000" },
];

const CabCard = ({
  item,
  startDate,
  endDate,
  tripsPage,
  cabData,
  cabTotal,
  tripsCabType,
  approvePage,
  tripId,
  countCab,
  totalCab,
}) => {
  const {navigate} = useNavigation();
  var [submitIsOpen, setSubmitIsOpen] = useState(false);
  var [isloading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  const [openDelete, setOpenDelete] = useState(false);
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [pickUpPopup, setPickUpPopup] = useState(false);
  const [pickUp, setPickUp] = useState("");
  const [drop, setDrop] = useState("");
  const [pickUpError, setPickUpError] = useState('');
  const [dropError, setDropError] = useState('');

  const {
    actions,
    cabNights,
    cabStartDate,
    cabEndDate,
    cabCount,
    cabCity,
    cabType,
    cabService,
    selectedTime,
    userTripStatus,
    GSTpercent,
    minimumServiceCharge
  } = useContext(MyContext);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await actions.getLastDoc();
  //   };

  //   fetchData();
  // }, []);  
  const [openPriceInfo, setOpenPriceInfo] = useState(false);
  var myStr = cabCity + '_trip';
  let formattedDate;
  if (cabStartDate) {
    formattedDate = `${cabStartDate?.toLocaleString('default', {
      month: 'long',
    })} ${cabStartDate?.getDate()}`;
  }
  const combinedString = `${myStr}_${formattedDate}`;
  var [defaultInput, setDefaultInput] = useState(combinedString);

  var cabImg = imgs.filter(img => img.type.trim() === item.carType.trim());

  var cabFinalPrice;
  if (cabNights > 0) {
    cabFinalPrice = item.price * Number(cabCount) * cabNights;
  } else {
    cabFinalPrice = item.price * Number(cabCount);
  }

  const sortedTrips = userTripStatus.userTrips.slice().sort((a, b) => {
    var aTime = new Date(a?.data?.date?.seconds * 1000);
    var bTime = new Date(b?.data?.date?.seconds * 1000);
    return bTime - aTime;
  });

  var getTime = seconds => {
    const timestampInSeconds = seconds;
    const timestampInMilliseconds = timestampInSeconds * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
  };

  const bookingrenderItem = ({item}) => {
    const date = getTime(item?.data?.date?.seconds);
    const dateStr = date.toString().slice(4, 10);

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => {
          addtoTrip(item.id);
          navigate('TripDetails', {id: item.id});
        }}>
        <Text style={styles.tripTitle}>{item.data.name}</Text>
        <Text style={styles.tripDate}>{dateStr}</Text>
      </TouchableOpacity>
    );
  };

  const handleAddToTrip = async () => {
    setIsLoading(true);
    // var cabTotalPrice = (cabFinalPrice * cabService) / 100 + cabFinalPrice;
    const calculateCabservice = (cabFinalPrice * cabService) / 100;
    const finalServiceCharge =
    calculateCabservice > minimumServiceCharge? calculateCabservice : minimumServiceCharge;
  const gstInFinalserviceCharge = finalServiceCharge * (GSTpercent / 100);
  var cabTotalPrice =
  finalServiceCharge + gstInFinalserviceCharge + cabFinalPrice;

    let newtripid = await actions.editTripBtn(defaultInput, 'cabs', {
      cabCity,
      cabType,
      cab: item,
      cabStartDate,
      cabEndDate,
      cabCount,
      cabTotalPrice,
      cabFinalPrice,
      cabNights,
      selectedTime,
      pickUp,
      drop,
      finalServiceCharge: finalServiceCharge,
      gstInFinalserviceCharge: gstInFinalserviceCharge,
    });
    setIsLoading(false);
    setSubmitIsOpen(false);
    navigate('TripDetails', {id: newtripid});
    // await actions.getLastDoc();
  };
  const handleInputChange = e => {
    setDefaultInput(e);
  };
  const addtoTrip = async id => {
    // var cabTotalPrice = (cabFinalPrice * cabService) / 100 + cabFinalPrice;
    setSubmitIsOpen(false);
    const calculateCabservice = (cabFinalPrice * cabService) / 100;
    const finalServiceCharge =
    calculateCabservice > minimumServiceCharge? calculateCabservice : minimumServiceCharge;
  const gstInFinalserviceCharge = finalServiceCharge * (GSTpercent / 100);
  var cabTotalPrice =
  finalServiceCharge + gstInFinalserviceCharge + cabFinalPrice;
    await actions.editTripById(
      id,
      {
        cabCity,
        cabType,
        cab: item,
        cabStartDate,
        cabEndDate,
        cabCount,
        cabTotalPrice,
        cabFinalPrice,
        cabNights,
        selectedTime,
        pickUp,
        drop,
        finalServiceCharge: finalServiceCharge,
        gstInFinalserviceCharge: gstInFinalserviceCharge,
      },
      'cabs',
    );
    // await actions.getLastDoc();
  };
  var color = statuses.filter(status => {
    return status?.status === cabData?.status;
  });
  var reqColor = reqStatuses.filter(status => {
    return status?.status === cabData?.requestStatus;
  });

  const downloadDoc = async hotelStatus => {
    try {
      await Linking.openURL(hotelStatus);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open the URL');
      console.error('An error occurred', error);
    }
  };
  var handleDelete = async () => {
    await actions.deleteTripItem(tripId, cabData?.id, 'cabs');
    setOpenDelete(false);
    //await getTripData()
  };
  const openAllTimeStamps = () => {
    setAllTimeStamp(true);
  };
  const closeAllTimeStamps = () => {
    setAllTimeStamp(false);
  };
  const handlePress = () => {
    let valid = true;
    if (cabType === "Airport to City center Hotel" || cabType === "City center hotel to airport") {
      if (pickUp === "") {
        setPickUpError("Pick up location cannot be empty.");
        valid = false;
      } else {
        setPickUpError('');
      }
      if (drop === "") {
        setDropError("Drop off location cannot be empty.");
        valid = false;
      } else {
        setDropError('');
      }
    } else {
      if (pickUp === "") {
        setPickUpError("Pick up location cannot be empty.");
        valid = false;
      } else {
        setPickUpError('');
      }
    }

    if (valid) {
      setSubmitIsOpen(true);
      setPickUpPopup(false);
    }
  };
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
    <>
      <View
        style={[
          styles.mainContainer,
          {
            backgroundColor: cabData?.status
             &&getFlightStatusStyle(cabData?.status),
              marginHorizontal:responsiveWidth(3)
          },
        ]}>
        <View style={styles.container}>
          <Image
            source={{uri: cabImg[0]?.image}}
            style={styles.img}
            resizeMode="contain"
          />
          <View style={styles.cabTitleContainer}>
            <Text style={styles.title}>{item.carType}</Text>
            <Text
              style={styles.subTitle}>{`(${item['passenger']} Seater)`}</Text>
            {tripsPage ? (
              <>
                <Text style={styles.subTitle}>{tripsCabType}</Text>
                <Text style={styles.title}>{cabTotal?.cabCity}</Text>
              </>
            ) : null}
          </View>

          <View style={styles.dateContainer}>
            {tripsPage || approvePage ? (
              <Text style={styles.subTitle}>
                {`${new Date(startDate.seconds * 1000)
                  ?.toString()
                  ?.slice(4, 10)} ${endDate ? '-' : ''} ${
                  endDate
                    ? new Date(endDate.seconds * 1000)?.toString()?.slice(4, 10)
                    : ''
                } `}
                {`(${
                  cabTotal?.cabNights > 0 && cabTotal?.cabNights === 1
                    ? cabTotal?.cabNights + ' Trip'
                    : cabTotal?.cabNights + ' days'
                })`}
              </Text>
            ) : (
              <Text style={styles.subTitle}>
                {`${cabStartDate?.toString()?.slice(4, 10)} ${
                  cabEndDate ? '-' : ''
                }${cabEndDate ? cabEndDate?.toString()?.slice(4, 10) : ''}  `}
                {`(${
                  cabNights > 0 && cabEndDate ? cabNights + 'days' : 'Trip'
                })`}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{`No of Cabs-${
            tripsPage ? countCab : cabCount
          }`}</Text>
          {item.Notes && !tripsPage ? (
            <View style={styles.headerSubContainer_1}>
              <Text style={styles.title}>{item?.Notes}</Text>
            </View>
          ) : null}
          <View style={styles.headerSubContainer_1}>
            <Text style={[styles.title, {color: colors.secondary}]}>
              &#8377;
              {` ${item.price} ${
                !cabTypes.includes(tripsPage ? tripsCabType : cabType)
                  ? 'per trip'
                  : 'per day'
              }`}
            </Text>
          </View>
          {!tripsPage && (
            <View style={styles.headerSubContainer_1}>
              <Text style={styles.title}>{`Total : `}</Text>
              <Text style={styles.price}>
                &#8377;{' '}
                {`${cabFinalPrice.toLocaleString()} ( + ${cabService}% service fee)`}
              </Text>
            </View>
          )}

          {tripsPage && (
            <View style={styles.headerSubContainer_1}>
              <Text style={styles.subTitle}>{`Pick up Time : `}</Text>
              <Text style={styles.title}>{cabTotal.selectedTime}</Text>
            </View>
          )}
        </View>

        {!tripsPage && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              // setSubmitIsOpen(true);
              setPickUpPopup(true);
            }}>
            <Text style={styles.btnTitle}>Add to trip</Text>
          </TouchableOpacity>
        )}

        {tripsPage ? (
          <>
            <View style={styles.hotelPriceMainContainer}>
              <View style={styles.bookingStatusTitlesMainContainer}>
                <Text
                  style={
                    styles.bookingStatusTitles
                  }>{`Approval Status : `}</Text>
                <View
                  style={[
                    styles.bookingStatusTextContainer,
                    {
                      backgroundColor: reqColor[0]
                        ? reqColor[0].color
                        : '#808080',
                    },
                  ]}>
                  <Text style={styles.bookingStatusText}>
                    {cabData?.requestStatus}
                  </Text>
                </View>
              </View>
              <>
                {cabData?.status ? (
                  <View style={styles.bookingStatusTitlesMainContainer}>
                    <Text
                      style={
                        styles.bookingStatusTitles
                      }>{`Booking Status : `}</Text>
                    <View
                      style={[
                        styles.bookingStatusTextContainer,
                        {
                          backgroundColor: color[0]
                            ? color[0].color
                            : '#808080',
                        },
                      ]}>
                      <Text style={styles.bookingStatusText}>
                        {cabData?.status}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </>
              {tripsPage ? (
                <View
                  style={[
                    styles.hotelTotalPriceContainer,
                    {justifyContent: 'space-between'},
                  ]}>
                  <View style={styles.hotelTotalPriceContainer}>
                    <Text
                      style={
                        styles.hotelTotalPrice
                      }>{`Total Price : ₹ ${Math.ceil(
                      cabTotal.cabTotalPrice,
                    ).toLocaleString('en-IN')}`}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setOpenPriceInfo(true);
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
              ) : null}
              {cabData?.downloadURL && tripsPage ? (
                <TouchableOpacity
                  style={styles.voucherContainer}
                  onPress={() => downloadDoc(cabData?.downloadURL)}>
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

            <View style={styles.addedHotelTimeAndDateContainer}>
              <View style={styles.addedHotelTitleContainer}>
                <Text style={styles.bookingStatusTitles}>
                  {`Added Date: `}
                  <Text style={styles.addedHotelTimeAndDate}>
                    {new Date(cabData?.date?.seconds * 1000)
                      .toString()
                      .slice(4, 15)}
                  </Text>
                </Text>
              </View>
              {cabData?.requestStatus === 'Pending' ||
              cabData?.status === 'Submitted' ||
              cabData?.status === 'Booked' ||
              cabData?.requestStatus === 'Approved' ? null : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setOpenDelete(true);
                    }}>
                    <IconSwitcher
                      componentName="MaterialIcons"
                      iconName="delete"
                      color={colors.red}
                      iconsize={2.5}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : null}
        {tripsPage ? (
          <TravellerDetailsBtn
            adults={1}
            eachTripData={totalCab}
            tripId={tripId}
            status={cabData?.status}
          />
        ) : null}
      </View>
      <PopUp
        value={submitIsOpen}
        handlePopUpClose={() => setSubmitIsOpen(false)}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {activeTab === 'tab1' ? (
            <View style={styles.tripsContainer}>
              <TouchableOpacity
                style={styles.createNewTripBtn}
                onPress={() => setActiveTab('tab2')}>
                <Text style={styles.createNewTripBtnTitle}>
                  Create New Trip
                </Text>
                <IconSwitcher
                  componentName="Entypo"
                  iconName="plus"
                  color={colors.black}
                  iconsize={3}
                />
              </TouchableOpacity>
              {userTripStatus.userTrips.length > 0 ? (
                <FlatList
                  data={sortedTrips}
                  renderItem={bookingrenderItem}
                  keyExtractor={item => item.id}
                  ListHeaderComponent={() => {
                    return (
                      <View>
                        <Text style={styles.triptitles}>Or</Text>
                        <Text style={styles.triptitles}>
                          Select an existing trip
                        </Text>
                      </View>
                    );
                  }}
                  ListHeaderComponentStyle={{marginTop: responsiveHeight(1)}}
                  style={{height: responsiveHeight(50)}}
                  contentContainerStyle={{
                    paddingHorizontal: responsiveWidth(3),
                  }}
                  nestedScrollEnabled
                />
              ) : (
                <View style={{marginTop: responsiveHeight(1)}}>
                  <ActivityIndicator size={'large'} color={'blue'} />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.addingNewTripContainer}>
              <TouchableOpacity onPress={() => setActiveTab('tab1')}>
                <IconSwitcher
                  componentName="MaterialCommunityIcons"
                  iconName="arrow-left-thin"
                  color={colors.primary}
                  iconsize={4}
                />
              </TouchableOpacity>
              <View style={styles.addingNewTripSubContainer}>
                <Text style={styles.newtriptitle}>Enter new trip Name</Text>
                <TextInput
                  editable
                  multiline
                  numberOfLines={3}
                  placeholder="Enter name of your trip"
                  style={styles.multiTextContainer}
                  value={defaultInput}
                  onChangeText={handleInputChange}
                />
                <TouchableOpacity
                  style={styles.addingNewTripBtn}
                  onPress={handleAddToTrip}>
                  <Text style={styles.addingNewTripBtnText}>Add to trip</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableWithoutFeedback>
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
        value={openPriceInfo}
        handlePopUpClose={() => {
          setOpenPriceInfo(false);
        }}>
        <View style={styles.priceInfo}>
          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>Cab Price</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight}]}>
              &#8377;{` ${cabTotal?.cabFinalPrice}`}
            </Text>
          </View>
          <View style={styles.horizentalLine} />
          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>Service Charges</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight,fontSize:responsiveHeight(1.8)}]}>
              + &#8377;{' '}
              {Math.ceil(cabTotal?.finalServiceCharge)}
            </Text>
          </View>

          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>GST</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight,fontSize:responsiveHeight(1.8)}]}>
              + &#8377;{' '}
              {Math.ceil(cabTotal?.gstInFinalserviceCharge)}
            </Text>
          </View>
          <View
            style={[
              styles.priceDetailsContainer,
              {marginTop: responsiveHeight(2)},
            ]}>
            <Text style={styles.priceDetails}>Total fare</Text>
            <Text style={[styles.priceDetails, {color: colors.secondary}]}>
              + &#8377;
              {` ${Math.ceil(cabTotal?.cabTotalPrice).toLocaleString('en-IN')}`}
            </Text>
          </View>
        </View>
      </PopUp>
      <PopUp value={alltimeStamp} handlePopUpClose={closeAllTimeStamps}>
        <View style={styles.timeStampsContainer}>
          <IconSwitcher
            componentName="Octicons"
            iconName="dot-fill"
            iconsize={1.8}
          />
          <Text style={styles.timeStampsTitles}>Added Date :</Text>
          <Text style={styles.timeStampsTitles}>
            {cabData?.date &&
              moment(cabData?.date?.seconds * 1000).format('MMMM D, h:mm a')}
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
            {cabData?.manager_request_time
              ? moment(cabData?.manager_request_time * 1000).format(
                  'MMMM D, h:mm a',
                )
              : 'Not Requested for Approval'}
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
            {cabData?.managerApprovedTime
              ? moment(cabData?.managerApprovedTime?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                )
              : 'Not Approved'}
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
            {cabData?.submitted_date
              ? moment(cabData?.submitted_date?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                )
              : 'Not Submitted'}
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
            {cabData?.booked_date
              ? moment(cabData?.booked_date?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                )
              : 'Not Booked'}
          </Text>
        </View>
      </PopUp>

      <PopUp
        value={pickUpPopup}
        handlePopUpClose={() => {
          setPickUpPopup(false);
        }}>
       <View style={{gap:responsiveHeight(1)}}>
       <View style={{gap:responsiveHeight(1)}}>
        <Text style={[styles.newtriptitle,{fontSize:responsiveHeight(2)}]}>Pick up</Text>
        <TextInput
          editable
          multiline
          // numberOfLines={2}
          placeholder="Enter name of your trip"
          style={[styles.multiTextContainer,{fontSize:responsiveHeight(2)}]}
          value={pickUp}
          onChangeText={(e) => setPickUp(e)}
        />
        {pickUpError ? <Text style={styles.errorText}>{pickUpError}</Text> : null}
      </View>

       {(cabType === "City center hotel to airport"||cabType === "Airport to City center Hotel")&& <View style={{gap:responsiveHeight(1)}}>
       <Text style={[styles.newtriptitle,{fontSize:responsiveHeight(2)}]}>Drop</Text>
        <TextInput
          editable
          multiline
          // numberOfLines={1}
          placeholder="Enter name of your trip"
          style={[styles.multiTextContainer,{fontSize:responsiveHeight(2)}]}
          value={drop}
          onChangeText={(e) => setDrop(e)}
        />
        {dropError ? <Text style={styles.errorText}>{dropError}</Text> : null}
       </View>}

       <TouchableOpacity
            style={[styles.btn,{alignSelf:'center'}]}
            onPress={handlePress}>
            <Text style={styles.btnTitle}>Add to trip</Text>
          </TouchableOpacity>
       </View>

      </PopUp>
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: responsiveHeight(1.5),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    marginHorizontal: responsiveWidth(1.5),
    borderRadius: responsiveHeight(1.5),
    elevation: responsiveHeight(0.4),
    backgroundColor: colors.white,
  },
  container: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
  },
  img: {
    height: responsiveHeight(6),
    width: responsiveHeight(8),
  },
  cabTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '47%',
    alignItems: 'center',
  },
  headerSubContainer_1: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dateContainer: {
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    padding: responsiveHeight(0.8),
    borderTopLeftRadius: responsiveHeight(1.5),
    borderBottomLeftRadius: responsiveHeight(1.5),
    position: 'absolute',
    right: responsiveWidth(-2),
    width: '28%',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveHeight(1.6),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  subTitle: {
    fontSize: responsiveHeight(1.3),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  detailsContainer: {
    marginTop: responsiveHeight(1),
    gap: responsiveHeight(0.5),
    paddingRight: responsiveWidth(1),
  },
  price: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: colors.secondary,
  },
  btn: {
    borderWidth: 1,
    alignSelf: 'flex-end',
    padding: responsiveHeight(1),
    marginTop: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    backgroundColor: colors.primary,
  },
  btnTitle: {
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.primary,
    color: colors.white,
  },
  tripsContainer: {
    alignItems: 'center',
  },
  createNewTripBtn: {
    borderWidth: responsiveHeight(0.2),
    flexDirection: 'row',
    gap: responsiveHeight(1),
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1),
    borderStyle: 'dashed',
    backgroundColor: '#edf8f4',
    borderRadius: responsiveHeight(0.8),
    width: '90%',
    justifyContent: 'center',
  },
  createNewTripBtnTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  triptitles: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
    textAlign: 'center',
  },
  tripCard: {
    marginVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: responsiveWidth(-0.2), height: responsiveHeight(-5)},
    shadowOpacity: responsiveHeight(0.3),
    shadowRadius: responsiveHeight(3),
    elevation: responsiveHeight(0.4),
    width: '100%',
  },
  tripTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  tripDate: {
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.textFont,
    color: colors.highlight,
  },
  addingNewTripContainer: {
    gap: responsiveHeight(1.5),
  },
  addingNewTripSubContainer: {
    gap: responsiveHeight(1),
  },
  addingNewTripBtn: {
    borderWidth: 1,
    padding: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveHeight(1.3),
    backgroundColor: colors.black,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
  },
  addingNewTripBtnText: {
    color: colors.white,
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
  },
  multiTextContainer: {
    borderWidth: responsiveHeight(0.18),
    textAlignVertical: 'top',
    borderRadius: responsiveHeight(1.3),
    paddingHorizontal: responsiveWidth(3),
    fontSize: responsiveHeight(2.3),
  },
  newtriptitle: {
    fontSize: responsiveHeight(2.5),
    fontFamily: fonts.primary,
    color: colors.primary,
    // textAlign: 'center'
  },
  addedHotelTimeAndDateContainer: {
    paddingTop: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addedHotelTitleContainer: {
    width: '90%',
  },
  bookingStatusTitles: {
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.primary,
    color: colors.lightGray,
  },
  addedHotelTimeAndDate: {
    color: colors.primary,
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.primary,
  },
  hotelPriceMainContainer: {
    borderTopWidth: responsiveHeight(0.1),
    borderBottomWidth: responsiveHeight(0.1),
    borderStyle: 'dotted',
    marginTop: responsiveHeight(1.7),
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    gap: responsiveHeight(2),
  },
  bookingStatusTitlesMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  bookingStatusTextContainer: {
    paddingHorizontal: responsiveWidth(2),
    alignItems: 'center',
    borderRadius: responsiveHeight(1),
    paddingVertical: responsiveHeight(0.3),
    justifyContent: 'center',
  },
  bookingStatusText: {
    color: colors.white,
    fontSize: responsiveHeight(1.3),
    fontFamily: fonts.primary,
  },
  hotelTotalPriceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },
  hotelTotalPrice: {
    fontSize: responsiveHeight(2.2),
    fontFamily: fonts.textFont,
    color: colors.secondary,
  },
  hotelDeleteMsg: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textInput,
    color: colors.primary,
  },
  hotelDeletingBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(6),
  },
  hotelDeleteBtn: {
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: responsiveHeight(1),
    backgroundColor: colors.primary,
  },
  hotelDeleteBtnTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textInput,
    color: colors.white,
  },
  priceDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceDetailsTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.lightGray,
  },
  priceDetails: {
    fontSize: responsiveHeight(2.3),
    fontFamily: fonts.secondry,
    color: colors.primary,
  },
  horizentalLine: {
    borderTopWidth: responsiveHeight(0.2),
    color: colors.lightGray,
    borderStyle: 'dashed',
    marginVertical: responsiveHeight(1),
  },
  priceInfo: {
    alignSelf: 'center',
    width: '80%',
  },
  timeStampsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  timeStampsTitles: {
    fontSize: responsiveHeight(1.6),
    fontFamily: fonts.primary,
    color: colors.primary,
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: responsiveHeight(1.5),
  },
  voucherContainer:
  {
    flexDirection:"row",
    alignItems:"center",
    gap:responsiveHeight(1),
    borderWidth:responsiveFontSize(0.18),
    alignSelf:'flex-start',
    padding:responsiveWidth(2),
    borderColor:colors.primary,
    borderRadius:responsiveHeight(1)
  },
  voucherTitle:
  {
    fontSize:responsiveHeight(1.8),
    fontFamily:fonts.secondry,
    textAlign:'center',
    color:colors.primary
  },
});
export default CabCard;
