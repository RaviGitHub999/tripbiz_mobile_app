import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  BackHandler,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Linking,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MyContext from '../../../context/Context';
import {styles} from './styles';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {colors} from '../../../config/theme';
import ProgressBar from '../../common/progressBar/ProgressBar';
import {useRoute} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import TripDetailsFlightCard from './TripDetailsFlightCard';
import PopUp from '../../common/popup/PopUp';
import {RefreshControl} from 'react-native';
import InputField from './InputField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FCard from './FCard';
import TravDetails from './TravDetails';
import HCard from './HCard';
import {Modal} from 'react-native';
import ReCheck from '../../common/recheck/ReCheck';
import CustomSelect from '../../common/mainComponents/customSelect/CustomSelect';
import {TextInput} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CabCard from '../../cab/cabResList/CabCard';
import BusRenderData from '../../bus/busResList/BusRenderData';
import CCard from './CCard';
import BCard from './BCard';
const TripDetails = ({navigation: {navigate, goBack}}) => {
  const [mounted, setMounted] = useState(true);
  const [popup, setPopUp] = useState({
    hotelPrice: false,
  });
  const [hotelTotalPrice, setHotelTotalPrice] = useState(0);
  const [hotelFinalPrice, setHotelFinalPrice] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteType, setDeleteType] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [traveller, setTraveller] = useState(false);
  const [tripId, setTripId] = useState();
  const [travellerCount, setTravellerCount] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [bookingPrice, setBookingPrice] = useState(0);
  const [requestIds, setRequestIds] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [requestId, setRequestId] = useState();
  const [requestData, setRequestData] = useState();
  const [selectedTab, setSelectedTab] = useState('travellers');
  const [travellerDetails, setTravellerDetails] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [showError, setShowError] = useState(false);
  var [fareIsOpen, setFareIsOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [formatDate, setFormatDate] = useState(null);
  const [hotelEndDate, setHotelEndDate] = useState(null);
  const [hotelAdults, setHotelAdults] = useState(null);
  const [reCheckHotelName, setReCheckHotelName] = useState(false);
  const [reCheckLoading, setReCheckLoading] = useState(false);
  const [oldSelectedRoom, setOldSelectedRoom] = useState([]);
  const [newSelectedRoom, setNewSelectedRoom] = useState([]);
  const [openPriceReCheck, setOpenPriceReCheck] = useState(false);
  const [reCheck, setReCheck] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [selectedCard, setSelectedCard] = useState({index: 0, list: 'a'});
  const [expenseType, setExpenseType] = useState('Select Expense');
  const [viewAll, setViewAll] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [datePicker, setDatePicker] = useState(false);
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseShortDate, setExpenseShortDate] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [cost, setCost] = useState('0');
  const [receipt, setReceipt] = useState(null);
  const [allTravellerCounts, setAllTravellerCounts] = useState();
  const [approvalLoading, setApporvalLoading] = useState(false);
  const [approvalError, setApprovalError] = useState(false);
  const expenseTypeData = [
    {
      name: 'Select Expense',
    },
    {
      name: 'Meal',
    },
    {
      name: 'Transport',
    },
    {
      name: 'Miscellaneous',
    },
  ];

  const expenseRenderItem = (item, index) => {
    return (
      <TouchableHighlight
        onPress={() => {
          setExpenseType(item.name),
            handledropDown(),
            setSelectedItemIndex(index);
        }}
        style={[styles.item, selectedItemIndex === index && styles.itemHovered]}
        underlayColor={colors.whiteSmoke}>
        <Text
          style={[
            styles.selectedItemTitle,
            selectedItemIndex === index && styles.activeSelectedItemTitle,
          ]}>
          {item.name}
        </Text>
      </TouchableHighlight>
    );
  };
  const handledropDown = () => {
    setViewAll(!viewAll);
  };

  const handleSelectedDate = useCallback((event, selectedDate) => {
    if (event.type === 'set') {
      setDatePicker(false);
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      setExpenseShortDate(formattedDate);
      setExpenseDate(selectedDate);
    } else {
      setDatePicker(false);
    }
  }, []);

  const {
    actions,
    tripData,
    flightsLogosData,
    userId,
    tripDataLoading,
    userAccountDetails,
    domesticHotel,
  } = useContext(MyContext);
  console.log(tripData, 'fghf');
  var handleClick = async () => {
    setPaymentLoading(true);

    var notflights = checked
      ? tripData?.flights
          ?.filter(hotel => flightNotSubmittedIds.includes(hotel.id))
          .map(data => data.id)
      : [];
    var nothotels = checked
      ? tripData?.hotels
          ?.filter(hotel => hotelNotSubmittedIds.includes(hotel.id))
          .map(data => data.id)
      : [];
    var notcabs = checked
      ? tripData?.cabs
          ?.filter(hotel => cabNotSubmittedIds.includes(hotel.id))
          .map(data => data.id)
      : [];
    var notbus = checked
      ? tripData?.bus
          ?.filter(hotel => busNotSubmittedIds.includes(hotel.id))
          .map(data => data.id)
      : [];
    var submittedFlights = notflights;
    var submittedHotels = nothotels;
    var submittedCabs = notcabs;
    var submittedBus = notbus;
    var finalTravDetails = {
      ...travellerDetails,
      ...tripData.data.travellerDetails,
    };
    if (userAccountDetails.accountType !== 'PostPaid') {
      await actions.makeTripPayment(tripData.data?.name, bookingPrice);
    }

    await actions.editAdminTrips(
      id,
      tripData,
      finalTravDetails,
      submittedHotels,
      submittedFlights,
      requestIds,
      submittedCabs,
      tripData.data?.name,
      submittedBus,
      notbus,
    );
    setPaymentLoading(false);
  };
  var handleManagerClick = async () => {
    setApporvalLoading(true);
    var req = await actions.sendApproval(
      userId,
      userAccountDetails?.manager?.userId,
      id,
      travellerDetails,
      price,
    );
    await actions.sendBookingApprovalEmail({
      id: userId,
      userName: userAccountDetails.firstName + userAccountDetails.lastName,
      userEmail: userAccountDetails.email,
      managerEmail: userAccountDetails.manager.email,
      managerName: userAccountDetails.manager.name,
      tripName: tripData.data.name,
    });
    setApporvalLoading(false);
    setTraveller(true);
    await getTripData();
    setRequestData(req.reqData);
    setRequestId(req.reqId);
  };
  const handlePress = (index, list) => {
    setSelectedCard({index, list});
  };
  var flightSubmittedIds = tripData?.data
    ? tripData?.data?.flights
        .filter(flight => flight.status !== 'Not Submitted')
        .map(status => status.id)
    : [];
  var hotelSubmittedIds = tripData?.data
    ? tripData?.data?.hotels
        .filter(flight => flight.status !== 'Not Submitted')
        .map(status => status.id)
    : [];
  var cabSubmittedIds = tripData?.data
    ? tripData?.data?.cabs
        ?.filter(flight => flight.status !== 'Not Submitted')
        .map(status => status.id)
    : [];
  var busSubmittedIds = tripData?.data
    ? tripData?.data?.bus
        ?.filter(flight => flight.status !== 'Not Submitted')
        .map(status => status.id)
    : [];
  var flightNotSubmittedIds = tripData?.data
    ? tripData?.data?.flights
        .filter(flight => flight.status === 'Not Submitted')
        .map(status => status.id)
    : [];
  var hotelNotSubmittedIds = tripData?.data
    ? tripData?.data?.hotels
        .filter(flight => flight.status === 'Not Submitted')
        .map(status => status.id)
    : [];
  var cabNotSubmittedIds = tripData?.data?.cabs
    ? tripData?.data?.cabs
        ?.filter(flight => flight.status === 'Not Submitted')
        ?.map(status => status.id)
    : [];
  var busNotSubmittedIds = tripData?.data?.bus
    ? tripData?.data?.bus
        ?.filter(flight => flight.status === 'Not Submitted')
        ?.map(status => status.id)
    : [];
  var flightArray = tripData?.requestData
    ? tripData?.requestData?.map(req => req.data.flights)
    : [];
  var hotelArray = tripData?.requestData
    ? tripData?.requestData?.map(req => req.data.hotels)
    : [];
  var cabArray = tripData?.requestData
    ? tripData?.requestData?.map(req => req.data.cabs)
    : [];
  console.log(cabArray);
  var busArray = tripData?.requestData
    ? tripData?.requestData?.map(req => req.data.bus)
    : [];
  var expensePrice = tripData?.expenses
    ? tripData?.expenses?.reduce((sum, arr) => sum + Number(arr.data.cost), 0)
    : 0;
  var flightsIds = flightArray.length > 0 ? [].concat(...flightArray) : [];
  var hotelIds = hotelArray.length > 0 ? [].concat(...hotelArray) : [];
  var cabsIds = cabArray.length > 0 ? [].concat(...cabArray) : [];
  var busIds = busArray.length > 0 ? [].concat(...busArray) : [];
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await getTripData();
      setRefreshing(false);
    }, 2000);
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigate('MyTrips');
        actions.setRes();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  const handleDelete = async () => {
    await actions.deleteTripItem(id, deleteId, deleteType);
    setOpenDelete(false);
  };
  const handlePopUps = arg => {
    if (arg === 'hotelPrice') {
      setPopUp({...popup, hotelPrice: !popup.hotelPrice});
    }
  };
  var statuses = [
    {status: 'Paid and Submitted', color: '#ffa500'},
    {status: 'Need clarification', color: '#FFC107'},
    {status: 'Price Revision', color: '#2196F3'},
    {status: 'Booked', color: '#008000'},
    {status: 'Cancelled', color: '#FF0000'},
    {status: 'Submitted,Payment Pending', color: '#ffa500'},
    {status: 'Booked,Payment Pending', color: '#4CAF50'},
    {status: 'Not Submitted', color: '#808080'},
  ];
  var reqStatuses = [
    {status: 'Approved', color: '#008000'},
    {status: 'Pending', color: '#ffa500'},
    {status: 'Not Requested', color: '#808080'},
  ];
  var price = 0;
  const route = useRoute();
  const {
    params: {id},
  } = route;
  const getTripData = async () => {
    var user = userId;
    actions.getTripDocById(id, user);
  };

  const handlehotelPriceinfo = hotel => {
    handlePopUps('hotelPrice');
    setHotelFinalPrice(hotel.data.hotelFinalPrice);
    setHotelTotalPrice(hotel.data.hotelTotalPrice);
    setSelectedRoom(hotel.data.selectedRoomType);
  };
  const handlehotelPriceinfoClose = () => {
    handlePopUps('hotelPrice');
    setHotelFinalPrice(0);
    setHotelTotalPrice(0);
    setSelectedRoom([]);
  };

  const handleFlights = async () => {
    navigate('Home');
    actions.setSelectedTripId(id);
    await actions.setRes();
    actions.switchComponent('flights');
  };
  const handleHotels = async () => {
    navigate('Home');
    actions.setSelectedTripId(id);
    await actions.setRes();
    actions.switchComponent('hotel');
  };
  const handleCabs = async () => {
    navigate('Home');
    actions.setSelectedTripId(id);
    actions.switchComponent('cab');
  };
  const handleBuses = async () => {
    navigate('Home');
    actions.setSelectedTripId(id);
    await actions.setRes();
    actions.switchComponent('bus');
  };

  var onBtnClick = async () => {
    setTraveller(true);
    setTripId(
      tripData?.flights.length > 0
        ? tripData?.flights[0]?.id
        : tripData?.hotels.length > 0
        ? tripData.hotels[0].id
        : tripData?.cabs.length > 0
        ? tripData?.cabs[0].id
        : tripData?.bus.length > 0
        ? tripData?.bus[0].id
        : 0,
    );
    var adults =
      tripData?.hotels[0]?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
        (acc, obj) => {
          acc.adults += parseInt(obj.adults, 10);
          acc.child += parseInt(obj.child, 10);
          return acc;
        },
        {adults: 0, child: 0},
      );

    // setTravellerCount(
    //   tripData?.flights.length > 0
    //     ? {
    //         adults: Number(tripData?.flights[0]?.data?.adults),
    //         child: Number(tripData?.flights[0]?.data?.child),
    //         infant: Number(tripData?.flights[0]?.data?.infant),
    //       }
    //     : tripData?.hotels.length > 0
    //     ? adults
    //     : {child: 0, adults: 1},
    // );
    setTravellerCount(
      tripData?.flights.length > 0
        ? {
            adults: Number(tripData?.flights[0]?.data?.adults),
            child: Number(tripData?.flights[0]?.data?.child),
            infant: Number(tripData?.flights[0]?.data?.infant),
          }
        : tripData?.hotels.length > 0
        ? adults
        : tripData?.bus?.length > 0
        ? {
            adults: Number(tripData?.bus[0]?.data.passengers),
          }
        : {},
    );
    setUserDetails([
      {
        firstName: userAccountDetails?.firstName,
        lastName: userAccountDetails?.lastName,
        gender: userAccountDetails?.gender,
        mobileNumber: userAccountDetails?.mobileNumber,
        email: userAccountDetails?.email,
      },
    ]);
    var mainprice =
      tripData.flights
        .filter(flight => flightNotSubmittedIds.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.finalPrice, 0) +
      tripData.hotels
        .filter(flight => hotelNotSubmittedIds.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.hotelTotalPrice, 0) +
      tripData.cabs
        .filter(flight => cabNotSubmittedIds.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
      tripData.bus
        .filter(flight => busNotSubmittedIds.includes(flight.id))
        .reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0);

    var reqIds =
      tripData.requestData.length > 0
        ? tripData?.requestData?.map(req => req.id)
        : [];
    setBookingPrice(price);
    setRequestIds(reqIds);
    setFinalPrice(mainprice);
    setRequestId(tripData?.requestData[0]?.id);
    setRequestData(tripData?.requestData[0]?.data);
  };

  useEffect(() => {
    if (mounted) {
      if (!tripDataLoading) {
        var fetchData = async () => {
          await getTripData();
          actions.handleFlightsLogos();
        };
        fetchData();
      }
    }
    return () => {
      setMounted(false);
    };
  }, []);

  var getTime = seconds => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const month = date.toLocaleString('en-US', {month: 'long'});
    var dateString = `${month} ${dayOfWeek}`;
    return dateString;
  };
  var getDate = seconds => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const dayofyear = date.getFullYear();
    const month = date.toLocaleString('en-US', {month: 'long'});
    var dateString = `${month.slice(0, 3)} ${dayOfWeek} ${dayofyear}`;
    return dateString;
  };
  const handleInputChange = (index, key, value, tripId) => {
    setUserDetails(prevUserDetails => {
      const updatedUserDetails = [...prevUserDetails];
      const traveler = updatedUserDetails[index] || {};
      traveler[key] = value;
      updatedUserDetails[index] = traveler;
      return updatedUserDetails;
    });
    setAllTravellerCounts(prevUserDetails => {
      const updatedUserDetails = {...prevUserDetails};
      Object.keys(updatedUserDetails).forEach(id => {
        const travelers = updatedUserDetails[id];
        // Check if the sidebar ID matches the current iteration
        if (id === tripId) {
          const traveler = travelers[index] || {};
          traveler[key] = value;
          travelers[index] = traveler;
          updatedUserDetails[id] = travelers;
        }
      });
      return updatedUserDetails;
    });
  };

  var setFinalDetails = async id1 => {
    const data = [];
    userDetails.forEach((userDetail, index) => {
      const mergedDetails = {
        firstName: '',
        lastName: '',
        gender: userAccountDetails?.gender,
        mobileNumber: userAccountDetails?.mobileNumber,
        email: userAccountDetails?.email,
        ...userDetail,
      };
      data.push(mergedDetails);
    });
    setTravellerDetails({
      ...travellerDetails,
      [id1]: data,
    });
    await actions.updateTravDetails(
      {
        ...travellerDetails,
        [id1]: data,
      },
      id,
    );
  };
  const toggleUp = () => {
    setFareIsOpen(prev => !prev);
  };
  var newdate = getTime(tripData?.data?.date?.seconds);
  const handleBack = () => {
    navigate('MyTrips');
    actions.setRes();
  };

  const handleSelectedTab = item => {
    setSelectedTab(item);
  };
  const renderItem = ({item}) => {
    const date1 = new Date(item.data.flight.Segments[0][0].Origin.DepTime);
    const monthAbbreviation1 = date1.toLocaleString('default', {
      month: 'short',
    });

    var flightStatus = tripData.data.flights.filter(f => f.id === item.id)[0];
    const userDet = tripData?.data?.travellerDetails[item.id];
    var color = statuses.filter(status => {
      return status?.status === flightStatus?.status;
    });
    const day1 = date1.getDate();

    return (
      <View>
        <View style={styles.tripDetailsTitleContainer}>
          <Text
            style={
              styles.tripDetailsTitle
            }>{`Flight:${item.data.flightNew.segments[0].mainFlgtCode}, `}</Text>
          <View style={styles.tripRouteCon}>
            <Text
              style={
                styles.tripDetailsTitle
              }>{`${item.data.flightNew.segments[0].originAirportCode}`}</Text>
            <IconSwitcher
              componentName="AntDesign"
              iconName="arrowright"
              color="black"
              iconsize={2}
            />
            <Text
              style={
                styles.tripDetailsTitle
              }>{`${item.data.flightNew.segments[0].destAirportCode}, `}</Text>
          </View>
          <Text
            style={
              styles.tripDetailsTitle
            }>{`${monthAbbreviation1} ${day1}`}</Text>
        </View>

        <FlatList
          data={[
            ...Array(
              travellerCount.adults +
                travellerCount.child +
                travellerCount.infant,
            ),
          ]}
          renderItem={({index}) => {
            var s = index;
            var type =
              s + 1 <= travellerCount.adults
                ? 'Adult'
                : s + 1 <= travellerCount.adults + travellerCount.child
                ? 'Child'
                : 'Infant';
            var indexe =
              s + 1 <= travellerCount.adults
                ? s
                : s + 1 <= travellerCount.adults + travellerCount.child
                ? s - travellerCount.adults
                : '';
            var isInternational =
              item.data.flightNew.segments[0].destCountryCode !== 'IN' ||
              item.data.flightNew.segments[0].originCountryCode !== 'IN';
            return (
              <View style={{paddingHorizontal: responsiveHeight(1.5)}}>
                <InputField
                  flight={item}
                  userDetails={userDetails}
                  s={s}
                  travIndex={indexe}
                  tripData={tripData}
                  travellerDetails={travellerDetails}
                  handleInputChange={handleInputChange}
                  isEdit={isEdit}
                  travellerType={type}
                  isInternational={isInternational}
                />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* {!(
          tripData?.data?.travellerDetails &&
          tripData?.data?.travellerDetails[item.id]
        ) ? (
          <View style={[styles.btn, {marginVertical: responsiveHeight(2)}]}>
            {isEdit[item.id] ? (
              <TouchableOpacity
                onPress={() => {
                  setIsEdit({
                    ...isEdit,
                    [item.id]: !isEdit[item.id],
                  });
                  setUserDetails(travellerDetails[item.id]);
                }}>
                <Text style={styles.btnTitle}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  setIsEdit({
                    ...isEdit,
                    [item.id]: true,
                  });
                  await setFinalDetails(item.id);
                }}>
                <Text style={[styles.btnTitle]}>Save Details</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null} */}

        {
          !userDet?
          <>
          {flightStatus?.requestStatus === 'Not Requested' ||
        flightStatus?.status === 'Not Submitted' ? (
          <View style={[styles.btn, {marginVertical: responsiveHeight(2)}]}>
            <TouchableOpacity
              onPress={async () => {
                await setFinalDetails(item.id);
              }}>
              <Text style={[styles.btnTitle]}>Save Details</Text>
            </TouchableOpacity>
          </View>
        ) : null}
          </>:null
        }
      </View>
    );
  };

  const hotelrenderItem = ({item}) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var hotelStatus = tripData.data.hotels.filter(hotelMain => {
      return hotelMain.id === item.id;
    })[0];
    const userDet = tripData?.data?.travellerDetails[item.id];
    var color = statuses.filter(status => {
      return status?.status === hotelStatus?.status;
    });
    const checkInDate = new Date(
      item?.data?.hotelSearchQuery?.checkInDate.seconds * 1000,
    );
    const formattedCheckInDate = `${
      monthNames[checkInDate.getMonth()]
    } ${checkInDate.getDate()}`;

    const checkOutDate = new Date(
      item?.data?.hotelSearchQuery?.checkOutDate.seconds * 1000,
    );
    const formattedCheckOutDate = `${
      monthNames[checkOutDate.getMonth()]
    } ${checkOutDate.getDate()}`;

    return (
      <View>
        <View style={styles.tripDetailsTitleContainer}>
          <Text style={styles.tripDetailsTitle}>
            {`Hotel:${item.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName}, `}
          </Text>
          <Text
            style={
              styles.tripDetailsTitle
            }>{`${item?.data?.hotelSearchQuery?.cityDestName},`}</Text>
          <Text
            style={
              styles.tripDetailsTitle
            }>{`${formattedCheckInDate}-${formattedCheckOutDate}`}</Text>
        </View>

        <FlatList
          data={[...Array(travellerCount.adults + travellerCount.child)]}
          renderItem={({index}) => {
            var s = index;
            var type = s + 1 <= travellerCount.adults ? 'Adult' : 'Child';
            var indexe =
              s + 1 <= travellerCount.adults ? s : s - travellerCount.adults;

            return (
              <View style={{paddingHorizontal: responsiveHeight(1.5)}}>
                <InputField
                  flight={item}
                  userDetails={userDetails}
                  s={s}
                  travIndex={indexe}
                  tripData={tripData}
                  travellerDetails={travellerDetails}
                  handleInputChange={handleInputChange}
                  isEdit={isEdit}
                  travellerType={type}
                />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />

      {  
        !userDet?
        <>
        {hotelStatus?.requestStatus === 'Not Requested' ||
        hotelStatus?.status === 'Not Submitted' ? (
          <>
            <View style={styles.btn}>
              <TouchableOpacity
                onPress={async () => {
                  await setFinalDetails(item.id);
                }}>
                <Text style={styles.btnTitle}>Save Details</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        </>
        :null
      }
        {/* {!(
          tripData?.data?.travellerDetails &&
          tripData?.data?.travellerDetails[item.id]
        ) ? (
          <>
            {userDetails.length ===
            travellerCount.adults + travellerCount.child ? (
              <>
                <View style={styles.btn}>
                  {isEdit[item.id] ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsEdit({
                          ...isEdit,
                          [item.id]: !isEdit[item.id],
                        });
                        setUserDetails(travellerDetails[hotel.id]);
                      }}>
                      <Text style={styles.btnTitle}>Edit</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        setIsEdit({
                          ...isEdit,
                          [item.id]: true,
                        });
                        await setFinalDetails(item.id);
                      }}>
                      <Text style={styles.btnTitle}>Save Details</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : null}
          </>
        ) : null} */}
      </View>
    );
  };

  const cabRenderItem = ({item}) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const cabStatus = tripData?.data?.cabs?.find(f => f.id === item.id);
    const userDet = tripData?.data?.travellerDetails[item.id];
   console.log(userDet,"sbdjsh")


    const date = new Date(item?.data?.cabStartDate.seconds * 1000);
    const formattedDate1 = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    const date2 = new Date(item?.data?.cabEndDate.seconds * 1000);
    const formattedDate2 =
      item.data.cabEndDate.length > 0
        ? `${monthNames[date2.getMonth()]} ${date2.getDate()}`
        : '';

    const color =
      statuses.find(status => status?.status === cabStatus?.status)?.color ||
      '#808080';
    return (
      <>
        <View>
          <Text style={styles.tripDetailsTitle}>{cabStatus?.status}</Text>
        </View>
        <View>
          <Text style={styles.tripDetailsTitle}>
            Cab: {item.data.cabCity}, {formattedDate1}
            {formattedDate2 ? ` - ${formattedDate2}` : ''}, {item.data.cabType}
          </Text>
        </View>
        <FlatList
          data={[...Array(travellerCount.adults)]}
          renderItem={({_, index}) => {
            return (
              <View style={{paddingHorizontal: responsiveHeight(1.5)}}>
                <InputField
                  flight={item}
                  userDetails={userDetails}
                  s={index}
                  travIndex={0}
                  tripData={tripData}
                  travellerDetails={travellerDetails}
                  handleInputChange={handleInputChange}
                  isEdit={isEdit}
                  travellerType={'Adult'}
                />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* {!(
          tripData?.data?.travellerDetails &&
          tripData?.data?.travellerDetails[item.id]
        ) ? (
          <>
            {userDetails.length ===
            travellerCount.adults + travellerCount.child ? (
              <>
                <View style={styles.btn}>
                  {isEdit[item.id] ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsEdit({
                          ...isEdit,
                          [item.id]: !isEdit[item.id],
                        });
                        setUserDetails(travellerDetails[item.id]);
                      }}>
                      <Text style={styles.btnTitle}>Edit</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        setIsEdit({
                          ...isEdit,
                          [item.id]: true,
                        });
                        await setFinalDetails(
                          item.id,
                          travellerCount.adults,
                          'cabs',
                        );
                      }}>
                      <Text style={styles.btnTitle}>Save Details</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : null}
          </>
        ) : null} */}

       {
        !userDet?
        <>
         {cabStatus?.requestStatus === 'Not Requested' ||
        cabStatus?.status === 'Not Submitted' ? (
          <>
            <View style={styles.btn}>
              <TouchableOpacity
                onPress={async () => {
                  await setFinalDetails(item.id);
                }}>
                <Text style={styles.btnTitle}>Save Details</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        </>
        :null
       }
      </>
    );
  };

  const busRenderItem = ({item}) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var busStatus = tripData?.data?.bus?.filter(f => f.id === item.id)[0];
    const userDet = tripData?.data?.travellerDetails[item.id];
    const date = new Date(item?.data?.bus.DepartureTime);
    const formattedDate1 = `${monthNames[date.getMonth()]} ${date.getDate()}`;

    const date2 = new Date(item?.data?.bus.ArrivalTime);
    const formattedDate2 = `${monthNames[date2.getMonth()]} ${date2.getDate()}`;
    var color = statuses.filter(status => {
      return status?.status === busStatus?.status;
    });
    return (
      <>
        <View>
          <Text style={styles.tripDetailsTitle}>{busStatus?.status}</Text>
        </View>
        <View>
          <Text style={styles.tripDetailsTitle}>
            Bus: {item.data.origin.cityName} to {item.data.destination.cityName}
            , {`${formattedDate1}-${formattedDate2}`}
          </Text>
        </View>
        <FlatList
          data={[...Array(travellerCount.adults)]}
          renderItem={({_, index}) => {
            var indexe =
              index + 1 <= travellerCount.adults
                ? index
                : index - travellerCount.adults;
            return (
              <View style={{paddingHorizontal: responsiveHeight(1.5)}}>
                <InputField
                  flight={item}
                  userDetails={userDetails}
                  s={index}
                  travIndex={indexe}
                  tripData={tripData}
                  travellerDetails={travellerDetails}
                  handleInputChange={handleInputChange}
                  isEdit={isEdit}
                  travellerType={'Adult'}
                />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* {!(
          tripData?.data?.travellerDetails &&
          tripData?.data?.travellerDetails[item.id]
        ) ? (
          <>
            {userDetails.length ===
            travellerCount.adults + travellerCount.child ? (
              <>
                <View style={styles.btn}>
                  {isEdit[item.id] ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsEdit({
                          ...isEdit,
                          [item.id]: !isEdit[item.id],
                        });
                        setUserDetails(travellerDetails[item.id]);
                      }}>
                      <Text style={styles.btnTitle}>Edit</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        setIsEdit({
                          ...isEdit,
                          [item.id]: true,
                        });
                        await setFinalDetails(
                          item.id,
                          travellerCount.adults,
                          'bus',
                        );
                      }}>
                      <Text style={styles.btnTitle}>Save Details</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : null}
          </>
        ) : null} */}

{
  !userDet?
  <>
  {busStatus?.requestStatus === 'Not Requested' ||
        busStatus?.status === 'Not Submitted' ? (
          <>
            <View style={styles.btn}>
              <TouchableOpacity
                onPress={async () => {
                  await setFinalDetails(item.id);
                }}>
                <Text style={styles.btnTitle}>Save Details</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
  </>
  :null
}
      </>
    );
  };
  const handleDeleteRecheckHotel = id => {
    setOpenDelete(true);
    setDeleteType('hotels');
    setDeleteId(id);
  };
  const handleRecheckHotelPrice = async (
    adults,
    endDate,
    formattedDate1,
    hotel,
  ) => {
    setHotelAdults(adults);
    setHotelEndDate(endDate);
    setFormatDate(formattedDate1);
    setHotelDetails(hotel);
    setReCheckLoading(true);
    setReCheckHotelName(
      hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName,
    );
    setOpenPriceReCheck(true);
    var data = await actions.getHotelUpdatedDetails(
      hotel.data.hotelSearchQuery.cityHotel,
      hotel.data.hotelSearchQuery,
      hotel.data.selectedRoomType,
      hotel.data.hotelSearchRes,
    );
    setOldSelectedRoom(hotel.data.selectedRoomType);
    setNewSelectedRoom(data);
    setReCheckLoading(false);
    setDeleteType('hotels');
    setDeleteId(hotel.id);
  };

  const downloadDoc = async hotelStatus => {
    try {
      await Linking.openURL(hotelStatus[0].downloadURL);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open the URL');
      console.error('An error occurred', error);
    }
  };
  const downloadExpense = async hotelStatus => {
    try {
      await Linking.openURL(hotelStatus);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open the URL');
      console.error('An error occurred', error);
    }
  };
  const handleExpansePrice = price => {
    setCost(price);
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          openCamera();
        } else {
          showSettingsAlert();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setReceipt(imageUri);
      },
    );
  };

  const showSettingsAlert = () => {
    Alert.alert(
      'Camera Permission Denied',
      'Please grant camera permission in app settings to enable this feature .',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => openSettings(),
        },
      ],
      {cancelable: false},
    );
  };

  const openSettings = () => {
    Linking.openSettings();
  };
  const handleOpenCamera = async () => {
    if ((Platform.OS = 'android')) {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (!granted) {
        requestCameraPermission();
        return;
      }
    }
    openCamera();
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Gallery Permission',
            message: 'App needs access to your gallery',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          openGallery();
        } else {
          showSettingsAlertGallery();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setReceipt(imageUri);
      },
    );
  };

  const showSettingsAlertGallery = () => {
    Alert.alert(
      'Gallery Permission Denied',
      'Please grant gallery permission in app settings to enable this feature.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => openSettings(),
        },
      ],
      {cancelable: false},
    );
  };

  const handleOpenGallery = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (!granted) {
        await requestGalleryPermission();
        return;
      }
    }
    openGallery();
  };
  var handleExpenseSubmit = async () => {
    await actions.addExpenseToTrip(
      id,
      expenseType,
      receipt,
      cost,
      expenseDescription,
      expenseDate,
    );
    await getTripData();
    setOpenExpense(false);
  };
  return tripDataLoading ? (
    <View style={styles.LoaderContainer}>
      <View style={styles.Loader}>
        <ProgressBar />
      </View>
    </View>
  ) : (
    tripData && (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{paddingBottom: responsiveHeight(13)}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/* {backNavigation} */}
          <View style={styles.backNavigationContainer}>
            <TouchableOpacity onPress={handleBack}>
              <IconSwitcher
                componentName="AntDesign"
                iconName="arrowleft"
                color={colors.black}
                iconsize={3}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            {/* {dateOfJourney} */}
            <View style={styles.tripDetailsHeader}>
              <Text style={styles.tripName}>{tripData.data?.name}</Text>
              <Text style={styles.tripDateTitle}>
                {`created on: `}
                <Text style={styles.tripDate}>{`${newdate}`}</Text>
              </Text>
            </View>
            {/* bookingStatus */}

            <View style={styles.bookingStatusMainContainer}>
              {statuses.map(status => {
                return (
                  <>
                    {tripData?.data?.flights?.filter(
                      flight => flight.status === status.status,
                    ).length > 0 ||
                    tripData?.data?.hotels?.filter(
                      flight => flight.status === status.status,
                    ).length > 0 ||
                    tripData?.data?.cabs?.filter(
                      flight => flight.status === status.status,
                    ).length > 0 ||
                    tripData?.data?.bus?.filter(
                      flight => flight.status === status.status,
                    ).length > 0 ? (
                      <>
                        <Text style={styles.bookingStatus}>
                          {tripData?.data?.flights?.filter(
                            flight => flight.status === status.status,
                          ).length > 0 ? (
                            <>
                              {
                                tripData?.data?.flights?.filter(
                                  flight => flight.status === status.status,
                                ).length
                              }
                              -Flights,
                            </>
                          ) : null}
                          {tripData?.data?.hotels?.filter(
                            flight => flight.status === status.status,
                          ).length > 0 ? (
                            <>
                              {
                                tripData?.data?.hotels?.filter(
                                  flight => flight.status === status.status,
                                ).length
                              }
                              -Hotels,
                            </>
                          ) : null}
                          {tripData?.data?.cabs?.filter(
                            cabs => cabs.status === status.status,
                          ).length > 0 ? (
                            <>
                              {
                                tripData?.data?.cabs?.filter(
                                  cabs => cabs.status === status.status,
                                ).length
                              }
                              -Cab,
                            </>
                          ) : null}
                          {tripData?.data?.bus?.filter(
                            bus => bus.status === status.status,
                          ).length > 0 ? (
                            <>
                              {
                                tripData?.data?.bus?.filter(
                                  bus => bus.status === status.status,
                                ).length
                              }
                              -Bus
                            </>
                          ) : null}
                        </Text>
                        <View
                          style={[
                            styles.bookingStatusContainer,
                            {backgroundColor: status.color},
                          ]}>
                          <Text
                            style={[
                              styles.bookingStatus,
                              {color: colors.white},
                            ]}>
                            {status.status}
                          </Text>
                        </View>
                      </>
                    ) : null}
                  </>
                );
              })}
            </View>

            {tripData ? (
              <View>
                <View>
                  {tripData?.hotels ? (
                    <>
                      <View style={styles.addingHotelBtnContainer}>
                        <Text style={styles.hotelCardTitle}>Hotels</Text>

                        <TouchableOpacity
                          style={styles.addingHotelBtn}
                          onPress={handleHotels}>
                          <Text style={styles.addingHotelBtnTitle}>
                            Add Hotel{' '}
                          </Text>
                          <IconSwitcher
                            componentName="Feather"
                            iconName="plus"
                            color={colors.primary}
                            iconsize={3}
                          />
                        </TouchableOpacity>
                      </View>

                      {tripData?.hotels
                        ?.sort((a, b) => {
                          var atime = a?.data?.hotelSearchQuery?.checkInDate;
                          var btime = b?.data?.hotelSearchQuery?.checkInDate;
                          return atime - btime;
                        })
                        ?.map((hotel, ind) => {
                          const monthNames = [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                          ];
                          price = price + hotel.data.hotelTotalPrice;
                          var hotelData = tripData?.data?.hotels.filter(
                            hotels => hotels.id === hotel.id,
                          );
                          var hotelTimeStamp = new Date(
                            hotelData[0]?.date?.seconds * 1000,
                          );

                          const updatedAt = hotelData[0]?.updatedAt?.seconds;
                          var hotelUpdatedDate = new Date(updatedAt * 1000);
                          var hotelPrice = 0;
                          var hotelStatus = tripData?.data?.hotels?.filter(
                            f => f.id === hotel.id,
                          );
                          var color = statuses.filter(status => {
                            return status?.status === hotelStatus[0]?.status;
                          });
                          const startdate = new Date(
                            hotel?.data?.hotelSearchQuery?.checkInDate
                              ?.seconds * 1000,
                          );
                          const formattedDate1 = `${
                            monthNames[startdate.getMonth()]
                          } ${startdate.getDate()}`;
                          var endDate = getDate(
                            hotel?.data?.hotelSearchQuery?.checkOutDate
                              ?.seconds,
                          );
                          var img =
                            hotel.data.hotelInfo.HotelInfoResult.HotelDetails
                              .Images[0];
                          var rating = [];
                          var starRating =
                            hotel.data.hotelInfo.HotelInfoResult.HotelDetails
                              .StarRating;
                          var starRatingFull = Math.floor(starRating);
                          var adults =
                            hotel?.data?.hotelSearchQuery?.hotelRoomArr?.reduce(
                              (acc, obj) => {
                                acc.adults += parseInt(obj.adults, 10);
                                acc.child += parseInt(obj.child, 10);
                                return acc;
                              },
                              {adults: 0, child: 0},
                            );
                          var hotelReq = tripData.data.hotels.filter(
                            hotelMain => {
                              return hotelMain.id === hotel.id;
                            },
                          );
                          var reqColor = reqStatuses.filter(status => {
                            return (
                              status?.status === hotelReq[0]?.requestStatus
                            );
                          });
                          var originalDate = hotelData[0]?.updatedAt
                            ? new Date(hotelData[0]?.updatedAt?.seconds * 1000)
                            : new Date(hotelTimeStamp);
                          var threeHoursAfter = new Date(
                            originalDate.getTime() + 3 * 60 * 60 * 1000,
                          );
                          var currentTime = new Date();
                          var isTimeReCheck =
                            hotelData[0]?.status === 'Not Submitted'
                              ? currentTime > threeHoursAfter
                              : false;
                          for (var i = 1; i <= Math.ceil(starRating); i++) {
                            if (i > starRatingFull) {
                              rating.push(
                                <IconSwitcher
                                  componentName="AntDesign"
                                  iconName="star"
                                  color="#ffd700"
                                  iconsize={2}
                                />,
                              );
                            } else {
                              rating.push(
                                <IconSwitcher
                                  componentName="AntDesign"
                                  iconName="star"
                                  color="#ffd700"
                                  iconsize={2}
                                />,
                              );
                            }
                          }

                          return (
                            <View key={ind}>
                              <View
                                style={[
                                  styles.hotelCard,
                                  {
                                    backgroundColor: hotelStatus[0]
                                      ? hotelStatus[0].status === 'Booked'
                                        ? 'honeydew'
                                        : 'white'
                                      : null,
                                  },
                                ]}>
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
                                      source={{
                                        uri: imageError
                                          ? 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                                          : img,
                                      }}
                                      onError={() => {
                                        console.log(
                                          'Image loading error occurred',
                                        );
                                        setImageError(true);
                                      }}
                                      onLoad={() =>
                                        console.log('Image loaded successfully')
                                      }
                                    />
                                  </View>
                                  <View
                                    style={{
                                      width: '65%',
                                      paddingLeft: responsiveHeight(1),
                                      gap: responsiveHeight(1),
                                    }}>
                                    <View
                                      style={styles.bookedHotelDatesContainer}>
                                      <Text style={styles.hotelTitle}>
                                        {
                                          hotel.data.hotelInfo.HotelInfoResult
                                            .HotelDetails.HotelName
                                        }{' '}
                                      </Text>
                                      <View style={styles.hotelDates}>
                                        <Text style={styles.hotelBookedDate}>
                                          {`${formattedDate1} - ${endDate} `}
                                          <Text style={styles.hotelNights}>
                                            (
                                            {
                                              hotel.data.hotelSearchQuery
                                                .hotelNights
                                            }{' '}
                                            Nights)
                                          </Text>
                                        </Text>
                                      </View>
                                    </View>
                                    <View style={styles.hotelRatingContainer}>
                                      {rating.map((star, ind) => {
                                        return <Text key={ind}>{star}</Text>;
                                      })}
                                    </View>
                                    <View style={styles.familyDetails}>
                                      <Text style={styles.familyDetailsTitle}>
                                        Adults-{adults?.adults}
                                      </Text>
                                      <Text style={styles.familyDetailsTitle}>
                                        Children-{adults?.child}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                {hotel?.data?.selectedRoomType &&
                                  hotel?.data?.selectedRoomType.map(
                                    (room, f) => {
                                      // price = price + room.Price.OfferedPriceRoundedOff;
                                      hotelPrice =
                                        hotelPrice +
                                        room.Price.OfferedPriceRoundedOff;
                                      return (
                                        <View style={styles.hotelRoomFeatures}>
                                          <View
                                            style={
                                              styles.hotelRoomFeaturesContainer1
                                            }>
                                            <Text style={styles.roomType}>
                                              {room.RoomTypeName}
                                            </Text>
                                            <Text
                                              style={
                                                styles.hotelRoomPrice
                                              }>{`₹ ${
                                              room.Price.OfferedPriceRoundedOff
                                                ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                                    'en-IN',
                                                  )
                                                : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                                    'en-IN',
                                                  )
                                            }`}</Text>
                                          </View>
                                          <View
                                            style={
                                              styles.hotelRoomFeaturesContainer2
                                            }>
                                            <View style={styles.mealsDeatils}>
                                              <IconSwitcher
                                                componentName="MaterialIcons"
                                                iconName="dinner-dining"
                                                color={colors.primary}
                                                iconsize={2.5}
                                              />
                                              <Text
                                                style={
                                                  styles.foodAndCancellationTitle
                                                }>
                                                {room.Inclusion &&
                                                room.Inclusion.length > 0
                                                  ? actions.checkForTboMeals(
                                                      room.Inclusion,
                                                    )
                                                  : 'No meals'}
                                              </Text>
                                            </View>
                                            <View style={styles.mealsDeatils}>
                                              {room.LastCancellationDate &&
                                              actions.validCancelDate(
                                                room.LastCancellationDate,
                                              ) ? (
                                                <>
                                                  <IconSwitcher
                                                    componentName="Ionicons"
                                                    iconName="checkmark-circle"
                                                    color={colors.primary}
                                                    iconsize={2.5}
                                                  />
                                                  <Text
                                                    style={
                                                      styles.foodAndCancellationTitle
                                                    }>{`Free cancellation upto ${new Date(
                                                    room.LastCancellationDate,
                                                  )
                                                    .toString()
                                                    .slice(4, 10)}`}</Text>
                                                </>
                                              ) : (
                                                <>
                                                  <IconSwitcher
                                                    componentName="MaterialCommunityIcons"
                                                    iconName="cancel"
                                                    color={colors.primary}
                                                    iconsize={2.5}
                                                  />
                                                  <Text
                                                    style={
                                                      styles.foodAndCancellationTitle
                                                    }>
                                                    {'Non-refundable'}
                                                  </Text>
                                                </>
                                              )}
                                            </View>
                                          </View>
                                        </View>
                                      );
                                    },
                                  )}
                                <View style={styles.hotelPriceMainContainer}>
                                  <View
                                    style={
                                      styles.bookingStatusTitlesMainContainer
                                    }>
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
                                        {hotelReq[0]?.requestStatus}
                                      </Text>
                                    </View>
                                  </View>
                                  {hotelStatus[0]?.status ? (
                                    <View
                                      style={
                                        styles.bookingStatusTitlesMainContainer
                                      }>
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
                                          {hotelStatus[0]?.status}
                                        </Text>
                                      </View>
                                    </View>
                                  ) : (
                                    <View
                                      style={
                                        styles.bookingStatusTitlesMainContainer
                                      }>
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
                                        <Text
                                          style={
                                            styles.bookingStatusText
                                          }>{`Not Submitted`}</Text>
                                      </View>
                                    </View>
                                  )}
                                  <View style={styles.hotelTotalPriceContainer}>
                                    <Text
                                      style={
                                        styles.hotelTotalPrice
                                      }>{`Total Price : ₹ ${Math.ceil(
                                      hotel.data.hotelTotalPrice,
                                    ).toLocaleString('en-IN')}`}</Text>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handlehotelPriceinfo(hotel)
                                      }>
                                      <IconSwitcher
                                        componentName="Entypo"
                                        iconName="info-with-circle"
                                        color={colors.black}
                                        iconsize={1.8}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  {hotelStatus[0]?.downloadURL ? (
                                    <TouchableOpacity
                                      style={styles.voucherContainer}
                                      onPress={() => downloadDoc(hotelStatus)}>
                                      <Text style={styles.voucherTitle}>
                                        Voucher
                                      </Text>
                                      <IconSwitcher
                                        componentName="FontAwesome"
                                        iconName="download"
                                        iconsize={2}
                                        color={colors.primary}
                                      />
                                    </TouchableOpacity>
                                  ) : null}
                                </View>
                                <View
                                  style={styles.addedHotelTimeAndDateContainer}>
                                  <View style={styles.addedHotelTitleContainer}>
                                    <Text style={styles.bookingStatusTitles}>
                                      {updatedAt !== undefined
                                        ? `Updated : `
                                        : `Added : `}
                                      <Text
                                        style={styles.addedHotelTimeAndDate}>
                                        {updatedAt !== undefined
                                          ? hotelUpdatedDate
                                              .toString()
                                              .slice(4, 24)
                                          : hotelTimeStamp
                                              .toString()
                                              .slice(4, 24)}
                                      </Text>
                                    </Text>
                                  </View>
                                  <>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setOpenDelete(true);
                                        setDeleteType('hotels');
                                        setDeleteId(hotel.id);
                                      }}>
                                      <IconSwitcher
                                        componentName="MaterialIcons"
                                        iconName="delete"
                                        color={colors.red}
                                        iconsize={2.5}
                                      />
                                    </TouchableOpacity>
                                  </>
                                </View>

                                {isTimeReCheck ? (
                                  <View
                                    style={{
                                      position: 'absolute',
                                      width: responsiveWidth(89),
                                      bottom: 10,
                                      paddingHorizontal: responsiveWidth(2),
                                    }}>
                                    <ReCheck
                                      handleDelete={() =>
                                        handleDeleteRecheckHotel(hotel.id)
                                      }
                                      handleRecheck={() =>
                                        handleRecheckHotelPrice(
                                          adults,
                                          endDate,
                                          formattedDate1,
                                          hotel,
                                        )
                                      }
                                    />
                                  </View>
                                ) : null}
                              </View>
                            </View>
                          );
                        })}
                    </>
                  ) : null}
                </View>
                {/* flight */}
                <View>
                  {tripData?.flights ? (
                    <>
                      <View style={styles.addingHotelBtnContainer}>
                        <Text style={styles.flightCardTitle}>Flights</Text>
                        <TouchableOpacity
                          style={styles.addingHotelBtn}
                          onPress={handleFlights}>
                          <Text style={styles.addingHotelBtnTitle}>
                            Add Flight{' '}
                          </Text>
                          <IconSwitcher
                            componentName="Feather"
                            iconName="plus"
                            color={colors.primary}
                            iconsize={3}
                          />
                        </TouchableOpacity>
                      </View>
                      {tripData?.flights
                        ?.sort((a, b) => {
                          var aflightArr = [a.data.flight].map((flight, f) => {
                            return {...actions.modifyFlightObject(flight)};
                          });
                          var bflightArr = [b.data.flight].map((flight, f) => {
                            return {...actions.modifyFlightObject(flight)};
                          });
                          return (
                            aflightArr[0]?.segments[0]?.depTimeDate -
                            bflightArr[0]?.segments[0]?.depTimeDate
                          );
                        })
                        .map((flight, f) => {
                          var flightStatus = tripData.data.flights.filter(
                            f => f.id === flight.id,
                          );
                          price = price + flight.data.finalPrice;
                          var hotelTimeStamp = new Date(
                            flightStatus[0]?.date?.seconds * 1000,
                          );
                          const updatedAt = flightStatus[0]?.updatedAt?.seconds;
                          var flightUpdatedDate;
                          if (updatedAt) {
                            flightUpdatedDate = new Date(updatedAt * 1000);
                          }
                          // var flightUpdatedDate = new Date(updatedAt * 1000)
                          var flightReq = tripData.data.flights.filter(
                            hotelMain => {
                              return hotelMain.id === flight.id;
                            },
                          );
                          // const data = actions.objToArr(flight.data);

                          var reqColor = reqStatuses.filter(status => {
                            return (
                              status?.status === flightReq[0]?.requestStatus
                            );
                          });

                          return (
                            <>
                              <TripDetailsFlightCard
                                flightGrp={[flight.data.flight]}
                                index={f}
                                flightBooking={flight.data}
                                flightStatus={flightStatus[0]}
                                flightReq={flightReq}
                                timeStamp={hotelTimeStamp}
                                updatedAt={flightUpdatedDate}
                                reqColor={reqColor}
                                tripId={id}
                                flightId={flight.id}
                                tripsPage={true}
                                downloadUrl={
                                  flightStatus[0]?.downloadURL
                                    ? flightStatus[0].downloadURL
                                    : undefined
                                }
                              />
                            </>
                          );
                        })}
                    </>
                  ) : null}
                </View>
              </View>
            ) : null}
            {/* add cabs Button */}
            {tripData?.cabs ? (
              <>
                <View style={styles.addingHotelBtnContainer}>
                  <Text style={styles.flightCardTitle}>Cabs</Text>
                  <TouchableOpacity
                    style={styles.addingHotelBtn}
                    onPress={handleCabs}>
                    <Text style={styles.addingHotelBtnTitle}>Add Cab </Text>
                    <IconSwitcher
                      componentName="Feather"
                      iconName="plus"
                      color={colors.primary}
                      iconsize={3}
                    />
                  </TouchableOpacity>
                </View>

                {tripData?.cabs?.map((cab, f) => {
                  var cabReq = tripData?.data?.cabs?.filter(hotelMain => {
                    return hotelMain.id === cab.id;
                  });
                  price = price + Number(cab.data.cabTotalPrice);
                  return (
                    <>
                      <CabCard
                        item={cab.data.cab}
                        tripsPage={true}
                        startDate={cab.data.cabStartDate}
                        endDate={cab.data.cabEndDate}
                        cabData={cabReq[0]}
                        tripsCabType={cab.data.cabType}
                        cabTotal={cab.data}
                        tripId={id}
                        countCab={cab?.data?.cabCount}
                      />
                    </>
                  );
                })}
              </>
            ) : null}

            {/* { add Bus Button } */}

            {tripData?.bus ? (
              <>
                <View style={styles.addingHotelBtnContainer}>
                  <Text style={styles.flightCardTitle}>Buses</Text>
                  <TouchableOpacity
                    style={styles.addingHotelBtn}
                    onPress={handleBuses}>
                    <Text style={styles.addingHotelBtnTitle}>Add Bus </Text>
                    <IconSwitcher
                      componentName="Feather"
                      iconName="plus"
                      color={colors.primary}
                      iconsize={3}
                    />
                  </TouchableOpacity>
                </View>

                {tripData?.bus?.map(busData => {
                  var bus = busData?.data?.bus;
                  var busDataa = tripData?.data?.bus?.filter(hotelMain => {
                    return hotelMain.id === busData.id;
                  });
                  const selectedSeatsPrice =
                    busData?.data?.selectedSeat?.length > 0
                      ? busData?.data?.selectedSeat?.reduce(
                          (total, seat) =>
                            total + seat.Price.OfferedPriceRoundedOff,
                          0,
                        )
                      : 0;

                  price = price + Number(busData.data.busTotalPrice);
                  return (
                    // <Bus
                    //   bus={bus}
                    //   tripsPage={true}
                    //   bookingBus={busData.data}
                    //   busData={busDataa && busDataa[0]}
                    //   tripId={id}
                    //   selectedSeatsPrice={selectedSeatsPrice}
                    // />
                    <BusRenderData
                      item={bus}
                      tripsPage={true}
                      bookingBus={busData.data}
                      busData={busDataa && busDataa[0]}
                      tripId={id}
                    />
                  );
                })}
              </>
            ) : null}

            <>
              <View style={styles.addingHotelBtnContainer}>
                <Text style={styles.flightCardTitle}>Expenses</Text>
                <TouchableOpacity
                  style={styles.addingHotelBtn}
                  onPress={() => setOpenExpense(true)}>
                  <Text style={styles.addingHotelBtnTitle}>Add Expense </Text>
                  <IconSwitcher
                    componentName="Feather"
                    iconName="plus"
                    color={colors.primary}
                    iconsize={3}
                  />
                </TouchableOpacity>
              </View>

              {tripData?.expenses ? (
                <>
                  {tripData?.expenses?.map((expense, f) => {
                    const expenseDate = new Date(
                      expense?.data?.expenseDate?.seconds * 1000,
                    );
                    const month = expenseDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    return (
                      <View style={styles.expenseCard}>
                        <View style={styles.expenseHeaderContainer}>
                          <Text
                            style={[
                              styles.title,
                              {fontSize: responsiveHeight(2)},
                            ]}>
                            {expense.data.type}
                          </Text>
                          <View style={styles.expenseDateContainer}>
                            <Text style={styles.title}>{`${month}`}</Text>
                          </View>
                        </View>
                        <View style={styles.subContainer}>
                          <Text
                            style={[
                              styles.title,
                              {fontSize: responsiveHeight(2)},
                            ]}>
                            Description:
                          </Text>
                          <Text style={styles.subTitle}>
                            {expense.data.description}
                          </Text>
                        </View>

                        <View style={[styles.expenseHeaderContainer]}>
                          <Text style={styles.totalPrice}>
                            Cost: &#8377;{' '}
                            {`${Math.ceil(expense.data.cost).toLocaleString(
                              'en-IN',
                            )}`}
                          </Text>
                          {expense.data.file && (
                            <TouchableOpacity
                              style={styles.voucherContainer}
                              onPress={() =>
                                downloadExpense(expense.data.file)
                              }>
                              <Text style={styles.voucherTitle}>Voucher</Text>
                              <IconSwitcher
                                componentName="FontAwesome"
                                iconName="download"
                                iconsize={2}
                                color={colors.primary}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : null}
            </>
          </View>
        </ScrollView>

        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceTitle}>Total price:</Text>
          <Text style={styles.totalPrice}>{`₹ ${Math.ceil(price).toLocaleString(
            'en-IN',
          )}`}</Text>
          {tripData?.data?.flights?.filter(
            flight => flight.status === 'Not Submitted',
          )?.length > 0 ||
          tripData?.data?.hotels?.filter(
            flight => flight.status === 'Not Submitted',
          )?.length > 0 ||
          tripData?.data?.cabs?.filter(
            flight => flight.status === 'Not Submitted',
          )?.length > 0 ||
          tripData?.data?.bus?.filter(cab => cab.status === 'Not Submitted')
            ?.length > 0 ? (
            <>
              {tripData?.data?.flights.every(flight => {
                var hotelData = tripData?.data?.flights.filter(
                  hotels => hotels.id === flight.id,
                );
                var hotelTimeStamp =
                  hotelData[0]?.updatedAt?.seconds * 1000
                    ? new Date(hotelData[0].updatedAt?.seconds * 1000)
                    : new Date(hotelData[0]?.date?.seconds * 1000);
                var originalDate = new Date(hotelTimeStamp);
                var threeHoursAfter = new Date(
                  originalDate.getTime() + 3 * 60 * 60 * 1000,
                );
                var currentTime = new Date();
                var isTimeReCheck = currentTime < threeHoursAfter;
                return isTimeReCheck;
              }) &&
              tripData?.data?.hotels.every(hotel => {
                var hotelData = tripData?.data?.hotels.filter(
                  hotels => hotels.id === hotel.id,
                );
                var hotelTimeStamp =
                  hotelData[0]?.updatedAt?.seconds * 1000
                    ? new Date(hotelData[0].updatedAt?.seconds * 1000)
                    : new Date(hotelData[0]?.date?.seconds * 1000);
                var originalDate = new Date(hotelTimeStamp);
                var threeHoursAfter = new Date(
                  originalDate.getTime() + 3 * 60 * 60 * 1000,
                );
                var currentTime = new Date();
                var isTimeReCheck = currentTime < threeHoursAfter;
                return isTimeReCheck;
              }) ? (
                <>
                  <TouchableOpacity style={styles.proceedToBookingBtn}>
                    <Text
                      style={styles.proceedToBookingBtnTitle}
                      onPress={onBtnClick}>
                      Proceed to Booking
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.proceedToBookingBtn}
                  onPress={() => setReCheck(true)}>
                  <Text style={styles.proceedToBookingBtnTitle}>Recheck</Text>
                </TouchableOpacity>
              )}
            </>
          ) : null}
        </View>

        <PopUp
          value={popup.hotelPrice}
          handlePopUpClose={handlehotelPriceinfoClose}>
          <View style={styles.HotelRoomFeaturesMainCon}>
            {selectedRoom?.map((room, r) => {
              return (
                <View style={styles.PopUpHotelRoomFeatures}>
                  <View style={styles.hotelRoomFeaturesContainer1}>
                    <Text style={styles.roomType}>{room.RoomTypeName}</Text>
                    <Text style={styles.hotelRoomPrice}>{`₹ ${
                      room.Price.OfferedPriceRoundedOff
                        ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                            'en-IN',
                          )
                        : room.Price.PublishedPriceRoundedOff.toLocaleString(
                            'en-IN',
                          )
                    }`}</Text>
                  </View>
                  <View style={styles.hotelRoomFeaturesContainer2}>
                    <View style={styles.mealsDeatils}>
                      <IconSwitcher
                        componentName="MaterialIcons"
                        iconName="dinner-dining"
                        color={colors.primary}
                        iconsize={2.5}
                      />
                      <Text style={styles.foodAndCancellationTitle}>
                        {room.Inclusion && room.Inclusion.length > 0
                          ? actions.checkForTboMeals(room.Inclusion)
                          : 'No meals'}
                      </Text>
                    </View>
                    <View style={styles.mealsDeatils}>
                      {room.LastCancellationDate &&
                      actions.validCancelDate(room.LastCancellationDate) ? (
                        <>
                          <IconSwitcher
                            componentName="MaterialCommunityIcons"
                            iconName="cancel"
                            color={colors.primary}
                            iconsize={2.5}
                          />
                          <Text
                            style={
                              styles.foodAndCancellationTitle
                            }>{`Free cancellation upto ${new Date(
                            room.LastCancellationDate,
                          )
                            .toString()
                            .slice(4, 10)}`}</Text>
                        </>
                      ) : (
                        <>
                          <IconSwitcher
                            componentName="MaterialCommunityIcons"
                            iconName="cancel"
                            color={colors.primary}
                            iconsize={2.5}
                          />
                          <Text style={styles.foodAndCancellationTitle}>
                            {'Non-refundable'}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.popUpHotelPriceDescriptionMainContaioner}>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={styles.popUproomPriceTitle}>Room price:</Text>
              <Text
                style={[styles.popUproomPriceTitle, {color: colors.secondary}]}>
                &#8377; {`${hotelFinalPrice.toLocaleString('en-IN')} `}
              </Text>
            </View>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={styles.popUproomserviceChargesTitle}>
                Service Charges
              </Text>
              <Text
                style={[
                  styles.popUproomserviceChargesTitle,
                  {color: colors.highlight},
                ]}>
                + &#8377;{Math.ceil(hotelTotalPrice - hotelFinalPrice)}
              </Text>
            </View>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={[styles.totalPrice, {color: colors.primary}]}>
                Total price:
              </Text>
              <Text style={styles.totalPrice}>
                &#8377;{' '}
                {`${Math.ceil(hotelTotalPrice).toLocaleString('en-IN')}`}
              </Text>
            </View>
          </View>
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
        {/* Proceed to Booking */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={traveller}
          onRequestClose={() => {
            setTraveller(!traveller);
            handleSelectedTab('travellers');
          }}>
          <View
            style={{
              backgroundColor: 'black',
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.5,
            }}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '80%',
                borderRadius: 20,
                padding: 10,
              }}>
              <View
                style={{
                  alignItems: 'flex-end',
                  marginVertical: responsiveHeight(1),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setTraveller(!traveller), handleSelectedTab('travellers');
                  }}>
                  <IconSwitcher
                    componentName="MaterialCommunityIcons"
                    iconName="close"
                    iconsize={2.5}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.tripDetailsTravellerTabs}>
                <TouchableOpacity
                  style={
                    selectedTab === 'travellers'
                      ? styles.tripDetailsTravellerSelectedEachTab
                      : styles.tripDetailsTravellerEachTab
                  }
                  // onPress={() => handleSelectedTab('travellers')}
                  disabled>
                  <Text
                    style={
                      selectedTab === 'travellers'
                        ? styles.tabTitlesSelected
                        : styles.tabTitles
                    }>
                    Traveller Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    selectedTab === 'approval'
                      ? styles.tripDetailsTravellerSelectedEachTab
                      : styles.tripDetailsTravellerEachTab
                  }
                  disabled
                  // onPress={() => handleSelectedTab('approval')}
                >
                  <Text
                    style={
                      selectedTab === 'approval'
                        ? styles.tabTitlesSelected
                        : styles.tabTitles
                    }>
                    Review and Approval
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    selectedTab === 'payment'
                      ? styles.tripDetailsTravellerSelectedEachTab
                      : styles.tripDetailsTravellerEachTab
                  }
                  // onPress={() => handleSelectedTab('payment')}
                  disabled>
                  <Text
                    style={
                      selectedTab === 'payment'
                        ? styles.tabTitlesSelected
                        : styles.tabTitles
                    }>
                    Make Payment
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedTab === 'travellers' ? (
                <>
                  <KeyboardAwareScrollView>
                    <View style={styles.travellerDetailsMainContainer}>
                      <View style={styles.travellerDetailsSubContainer}>
                        {/* travellerDetails */}

                        <View style={styles.travellerDetailsSeperator}>
                          {tripData?.flights?.map((flight, ind) => {
                            const date1 = new Date(
                              flight.data.flight.Segments[0][0].Origin.DepTime,
                            );
                            const monthAbbreviation1 = date1.toLocaleString(
                              'default',
                              {
                                month: 'short',
                              },
                            );
                            const day1 = date1.getDate();
                            var flightReq = tripData.data.flights.filter(
                              hotelMain => {
                                return hotelMain.id === flight.id;
                              },
                            );
                            var flightStatus = tripData.data.flights.filter(
                              f => f.id === flight.id,
                            );
                            var color = statuses.filter(status => {
                              return status?.status === flightStatus[0]?.status;
                            });
                            var reqColor = reqStatuses.filter(status => {
                              return (
                                status?.status === flightReq[0]?.requestStatus
                              );
                            });
                            const isSelected =
                              selectedCard.index === ind &&
                              selectedCard.list === 'a';
                            return (
                              <TouchableOpacity
                                style={[
                                  styles.travelDetailsFlightCard,
                                  {
                                    backgroundColor: !isEdit[flight.id]
                                      ? 'white'
                                      : color[0]
                                      ? color[0].color
                                      : '#808080',
                                  },
                                  {
                                    borderBottomWidth: isSelected
                                      ? responsiveHeight(0.5)
                                      : 0,
                                  },
                                ]}
                                onPress={() => {
                                  setTravellerCount({
                                    adults: Number(flight?.data?.adults),
                                    child: Number(flight?.data?.child),
                                    infant: Number(flight?.data?.infant),
                                  });
                                  setTripId(flight.id);
                                  handlePress(ind, 'a');
                                }}>
                                <IconSwitcher
                                  componentName="MaterialIcons"
                                  iconName="flight-takeoff"
                                  color="black"
                                  iconsize={4}
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    right: responsiveWidth(1),
                                    top: responsiveHeight(0),
                                  }}>
                                  <Text>{ind + 1}</Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}

                          {tripData?.cabs?.map((cab, ind) => {
                            const monthNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            var flightStatus = tripData?.data?.cabs?.filter(
                              f => f.id === cab.id,
                            );
                            var color = statuses?.filter(status => {
                              return (
                                status?.status ===
                                (flightStatus ? flightStatus[0]?.status : '')
                              );
                            });
                            const date = new Date(
                              cab?.data?.cabStartDate.seconds * 1000,
                            );
                            const formattedDate1 = `${
                              monthNames[date.getMonth()]
                            } ${date.getDate()}`;
                            const isSelected =
                              selectedCard.index === ind &&
                              selectedCard.list === 'b';
                            return (
                              <TouchableOpacity
                                style={[
                                  styles.travelDetailsFlightCard,
                                  {
                                    backgroundColor: !isEdit[cab.id]
                                      ? 'white'
                                      : color[0]
                                      ? color[0].color
                                      : '#808080',
                                  },
                                  {
                                    borderBottomWidth: isSelected
                                      ? responsiveHeight(0.5)
                                      : 0,
                                  },
                                ]}
                                onPress={() => {
                                  setTravellerCount({adults: 1});
                                  setTripId(cab.id);
                                  handlePress(ind, 'b');
                                }}>
                                <IconSwitcher
                                  componentName="FontAwesome6"
                                  iconName="taxi"
                                  iconsize={2.5}
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    right: responsiveWidth(1),
                                    top: responsiveHeight(0),
                                  }}>
                                  <Text>{ind + 1}</Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}

                          {tripData?.bus?.map((bus, ind) => {
                            const monthNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            var flightStatus = tripData?.data?.bus?.filter(
                              f => f.id === bus.id,
                            );

                            var color = statuses?.filter(status => {
                              return (
                                status?.status ===
                                (flightStatus ? flightStatus[0]?.status : '')
                              );
                            });

                            const date = new Date(bus?.data?.bus.DepartureTime);
                            const formattedDate1 = `${
                              monthNames[date.getMonth()]
                            } ${date.getDate()}`;
                            const isSelected =
                              selectedCard.index === ind &&
                              selectedCard.list === 'd';
                            return (
                              <TouchableOpacity
                                style={[
                                  styles.travelDetailsFlightCard,
                                  {
                                    backgroundColor: !isEdit[bus.id]
                                      ? 'white'
                                      : color[0]
                                      ? color[0].color
                                      : '#808080',
                                  },
                                  {
                                    borderBottomWidth: isSelected
                                      ? responsiveHeight(0.5)
                                      : 0,
                                  },
                                ]}
                                onPress={() => {
                                  setTravellerCount({
                                    adults: Number(bus?.data?.passengers),
                                  });
                                  setTripId(bus.id);
                                  handlePress(ind, 'd');
                                }}>
                                <IconSwitcher
                                  componentName="FontAwesome6"
                                  iconName="bus"
                                  iconsize={2.5}
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    right: responsiveWidth(1),
                                    top: responsiveHeight(0),
                                  }}>
                                  <Text>{ind + 1}</Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}

                          {tripData?.hotels?.map((hotel, ind) => {
                            const monthNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            const date = new Date(
                              hotel?.data?.hotelSearchQuery?.checkInDate
                                ?.seconds * 1000,
                            );
                            const formattedDate1 = `${
                              monthNames[date.getMonth()]
                            } ${date.getDate()}`;
                            const date2 = new Date(
                              hotel?.data?.hotelSearchQuery?.checkOutDate
                                .seconds * 1000,
                            );
                            const formattedDate2 = `${
                              monthNames[date2.getMonth()]
                            } ${date2.getDate()}`;
                            var hotelReq = tripData?.data?.hotels.filter(
                              hotelMain => {
                                return hotelMain.id === hotel.id;
                              },
                            );
                            var hotelStatus = tripData?.data?.hotels?.filter(
                              f => f.id === hotel.id,
                            );
                            var color = statuses.filter(status => {
                              return status?.status === hotelStatus[0]?.status;
                            });

                            var reqColor = reqStatuses.filter(status => {
                              return (
                                status?.status === hotelReq[0]?.requestStatus
                              );
                            });
                            const isSelected =
                              selectedCard.index === ind &&
                              selectedCard.list === 'c';
                            return (
                              <TouchableOpacity
                                style={[
                                  styles.travelDetailsFlightCard,
                                  {
                                    backgroundColor: !isEdit[hotel.id]
                                      ? 'white'
                                      : color[0]
                                      ? color[0].color
                                      : '#808080',
                                  },
                                  {
                                    borderBottomWidth: isSelected
                                      ? responsiveHeight(0.5)
                                      : 0,
                                  },
                                ]}
                                onPress={() => {
                                  var adults =
                                    hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                                      (acc, obj) => {
                                        acc.adults += parseInt(obj.adults, 10);
                                        acc.child += parseInt(obj.child, 10);
                                        return acc;
                                      },
                                      {adults: 0, child: 0},
                                    );
                                  setTravellerCount(adults);
                                  setTripId(hotel.id);
                                  handlePress(ind, 'c');
                                }}>
                                <IconSwitcher
                                  componentName="FontAwesome6"
                                  iconName="hotel"
                                  color="black"
                                  iconsize={2.5}
                                />
                                <View
                                  style={{
                                    position: 'absolute',
                                    right: responsiveWidth(1),
                                    top: responsiveHeight(0),
                                  }}>
                                  <Text>{ind + 1}</Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {/* each traveller Details */}

                        <View
                          style={{
                            // borderWidth: 2,
                            flex: 1,
                          }}>
                          <FlatList
                            data={tripData?.flights?.filter(
                              flight => flight.id === tripId,
                            )}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                          />
                          <FlatList
                            data={tripData?.hotels?.filter(
                              hotel => hotel.id === tripId,
                            )}
                            renderItem={hotelrenderItem}
                            keyExtractor={(item, index) => index.toString()}
                          />

                          <FlatList
                            data={tripData?.cabs?.filter(
                              cab => cab.id === tripId,
                            )}
                            renderItem={cabRenderItem}
                            keyExtractor={(item, index) => index.toString()}
                          />

                          <FlatList
                            data={tripData?.bus?.filter(
                              bus => bus.id === tripId,
                            )}
                            renderItem={busRenderItem}
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </View>
                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                  <View
                    style={{
                      backgroundColor: colors.highlightLite,
                      paddingHorizontal: responsiveHeight(1),
                      paddingVertical: responsiveHeight(1),
                      borderRadius: responsiveHeight(1),
                      marginTop: responsiveHeight(2),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: responsiveHeight(1),
                        alignItems: 'center',
                      }}>
                      <View>
                        {showError && (
                          <View>
                            <Text style={[styles.title, {color: colors.red}]}>
                              Please fill traveller details for each item{' '}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={[styles.btn]}
                        onPress={() => {
                          if (
                            flightNotSubmittedIds?.every(item =>
                              Object.keys(
                                tripData?.data?.travellerDetails
                                  ? tripData?.data?.travellerDetails
                                  : travellerDetails,
                              ).includes(item),
                            ) &&
                            hotelNotSubmittedIds?.every(item =>
                              Object.keys(
                                tripData?.data?.travellerDetails
                                  ? tripData?.data?.travellerDetails
                                  : travellerDetails,
                              ).includes(item),
                            ) &&
                            cabNotSubmittedIds?.every(item =>
                              Object.keys(
                                tripData?.data?.travellerDetails
                                  ? tripData?.data?.travellerDetails
                                  : travellerDetails,
                              ).includes(item),
                            ) &&
                            busNotSubmittedIds?.every(item =>
                              Object.keys(
                                tripData?.data?.travellerDetails
                                  ? tripData?.data?.travellerDetails
                                  : travellerDetails,
                              ).includes(item),
                            )
                          ) {
                            setShowError(false);
                            setSelectedTab('approval');
                          } else {
                            setShowError(true);
                          }
                        }}>
                        <Text style={styles.btnTitle}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : null}

              {selectedTab === 'approval' ? (
                <>
                  <View style={styles.approvalMainContainer}>
                    <View style={styles.approvalSubContainer}>
                      {/* approval details sidebar- */}
                      {/* two times mapping-first one for req data second one for not requested data */}
                      {tripData?.requestData?.length > 0 ? (
                        <>
                          {tripData?.requestData?.map(request => {
                            return (
                              <>
                                <TouchableOpacity
                                  style={
                                    requestId === request.id
                                      ? styles.activeApprovalRequestDataContainer
                                      : styles.approvalRequestDataContainer
                                  }
                                  onPress={() => {
                                    setRequestData(request.data);
                                    setRequestId(request.id);
                                  }}>
                                  {request.data.flights?.length > 0 ? (
                                    <Text
                                      style={
                                        requestId === request.id
                                          ? styles.activeApprovalRequestDataTitle
                                          : styles.approvalRequestDataTitle
                                      }>
                                      {request.data.flights.length}&nbsp;Flights
                                    </Text>
                                  ) : null}
                                  {request.data.hotels?.length > 0 ? (
                                    <Text
                                      style={
                                        requestId === request.id
                                          ? styles.activeApprovalRequestDataTitle
                                          : styles.approvalRequestDataTitle
                                      }>
                                      {request.data.hotels.length}&nbsp;Hotels
                                    </Text>
                                  ) : null}
                                  {request.data.cabs?.length > 0 ? (
                                    <Text
                                      style={
                                        requestId === request.id
                                          ? styles.activeApprovalRequestDataTitle
                                          : styles.approvalRequestDataTitle
                                      }>
                                      {request.data.cabs.length}&nbsp;Cabs
                                    </Text>
                                  ) : null}

                                  {request.data.bus?.length > 0 ? (
                                    <Text
                                      style={
                                        requestId === request.id
                                          ? styles.activeApprovalRequestDataTitle
                                          : styles.approvalRequestDataTitle
                                      }>
                                      {request.data.bus.length}&nbsp;Bus
                                    </Text>
                                  ) : null}

                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeReqTitle
                                        : styles.reqTitle
                                    }>
                                    Requested
                                  </Text>
                                </TouchableOpacity>
                              </>
                            );
                          })}
                        </>
                      ) : null}

                      <>
                        {tripData?.hotels?.filter(
                          hotel => !hotelIds.includes(hotel.id),
                        )?.length > 0 ||
                        tripData?.flights?.filter(
                          hotel => !flightsIds.includes(hotel.id),
                        )?.length > 0 ||
                        tripData?.cabs?.filter(
                          hotel => !cabsIds.includes(hotel.id)?.length > 0,
                        ) ||
                        tripData?.bus?.filter(
                          hotel => !busIds.includes(hotel.id),
                        )?.length > 0 ? (
                          <TouchableOpacity
                            style={
                              !requestData && !requestId
                                ? styles.activeApprovalRequestDataContainer
                                : styles.approvalRequestDataContainer
                            }
                            onPress={() => {
                              setRequestData(null);
                              setRequestId(null);
                            }}>
                            {tripData?.flights?.filter(
                              hotel => !flightsIds.includes(hotel.id),
                            )?.length > 0 ? (
                              <Text
                                style={
                                  !requestData && !requestId
                                    ? styles.activeApprovalRequestDataTitle
                                    : styles.approvalRequestDataTitle
                                }>
                                <>
                                  {
                                    tripData?.flights?.filter(
                                      hotel => !flightsIds.includes(hotel.id),
                                    )?.length
                                  }
                                  &nbsp;
                                  {tripData?.flights?.filter(
                                    hotel => !flightsIds.includes(hotel.id),
                                  )?.length > 1
                                    ? 'Flights'
                                    : 'Flight'}
                                </>
                              </Text>
                            ) : null}

                            {tripData?.hotels?.filter(
                              hotel => !hotelIds.includes(hotel.id),
                            )?.length > 0 ? (
                              <>
                                <Text
                                  style={
                                    !requestData && !requestId
                                      ? styles.activeApprovalRequestDataTitle
                                      : styles.approvalRequestDataTitle
                                  }>
                                  {
                                    tripData?.hotels?.filter(
                                      hotel => !hotelIds.includes(hotel.id),
                                    )?.length
                                  }
                                  &nbsp;
                                  {tripData?.hotels?.filter(
                                    hotel => !hotelIds.includes(hotel.id),
                                  )?.length > 1
                                    ? 'Hotels'
                                    : 'Hotel'}
                                </Text>
                              </>
                            ) : null}

                            {tripData?.cabs?.filter(
                              cab => !cabsIds.includes(cab.id),
                            )?.length > 0 ? (
                              <>
                                <Text
                                  style={
                                    !requestData && !requestId
                                      ? styles.activeApprovalRequestDataTitle
                                      : styles.approvalRequestDataTitle
                                  }>
                                  {
                                    tripData?.cabs?.filter(
                                      cab => !cabsIds.includes(cab.id),
                                    )?.length
                                  }
                                  &nbsp;
                                  {tripData?.cabs?.filter(
                                    cab => !cabsIds.includes(cab.id),
                                  )?.length > 1
                                    ? 'Cabs'
                                    : 'Cab'}
                                </Text>
                              </>
                            ) : null}

                            {tripData?.bus?.filter(
                              bus => !busIds.includes(bus.id),
                            )?.length > 0 ? (
                              <>
                                <Text
                                  style={
                                    !requestData && !requestId
                                      ? styles.activeApprovalRequestDataTitle
                                      : styles.approvalRequestDataTitle
                                  }>
                                  {
                                    tripData?.bus?.filter(
                                      bus => !busIds.includes(bus.id),
                                    )?.length
                                  }
                                  &nbsp;
                                  {tripData?.bus?.filter(
                                    bus => !busIds.includes(bus.id),
                                  )?.length > 1
                                    ? 'Buses'
                                    : 'Bus'}
                                </Text>
                              </>
                            ) : null}

                            <Text
                              style={
                                !requestData && !requestId
                                  ? styles.activeReqTitle
                                  : styles.reqTitle
                              }>
                              Not Requested
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </>
                    </View>

                    <View style={{flex: 1}}>
                      <ScrollView>
                        {/* approval details sidebar- */}
                        {/* two times mapping-first one for req data second one for not requested data */}
                        {tripData?.requestData?.length > 0 &&
                        requestData &&
                        requestId ? (
                          <View style={{margin: responsiveHeight(1)}}>
                            <View
                              style={[
                                styles.card,
                                {
                                  width: '100%',
                                  gap: responsiveHeight(0.5),
                                  alignItems: 'center',
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.title,
                                  {
                                    fontSize: responsiveHeight(1.8),
                                    marginBottom: responsiveHeight(1.5),
                                  },
                                ]}>
                                Manager Approval
                              </Text>
                              {Object.keys(userAccountDetails?.manager).length >
                              0 ? (
                                <>
                                  <Text
                                    style={
                                      styles.subTitle
                                    }>{`Manager Name : `}</Text>
                                  <Text
                                    style={
                                      styles.title
                                    }>{`${userAccountDetails?.manager?.name}(${userAccountDetails?.manager?.email})`}</Text>
                                  <>
                                    {requestId ? (
                                      <>
                                        {requestData?.status === 'Approved' ? (
                                          <View>
                                            <Text style={styles.subTitle}>
                                              Your trip is approved
                                            </Text>
                                            <View
                                              style={styles.statusContainer}>
                                              <Text style={styles.subTitle}>
                                                Status:
                                              </Text>
                                              <Text
                                                style={
                                                  requestData?.status ===
                                                  'Pending'
                                                    ? styles.statusTitle
                                                    : styles.activeStatusTitle
                                                }>
                                                {requestData?.status}
                                              </Text>
                                            </View>
                                          </View>
                                        ) : (
                                          <View>
                                            <Text style={styles.subTitle}>
                                              Your trip is submitted for
                                              approval
                                            </Text>
                                            <View
                                              style={styles.statusContainer}>
                                              <Text style={styles.subTitle}>
                                                Status:
                                              </Text>
                                              <Text
                                                style={
                                                  requestData?.status ===
                                                  'Pending'
                                                    ? styles.statusTitle
                                                    : styles.activeStatusTitle
                                                }>
                                                {requestData?.status}
                                              </Text>
                                            </View>
                                          </View>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <Text
                                          style={
                                            styles.subTitle
                                          }>{`Send booking for Approval: `}</Text>
                                        <TouchableOpacity
                                          style={styles.btn}
                                          onPress={handleManagerClick}>
                                          <Text
                                            style={[
                                              styles.subTitle,
                                              {color: colors.white},
                                            ]}>
                                            Yes
                                          </Text>
                                        </TouchableOpacity>
                                        <Text style={styles.title}>OR</Text>
                                        <>
                                          {userAccountDetails.approvalType ===
                                          'Mandatory' ? (
                                            <>
                                              <Text>
                                                Approval is mandatory.Please
                                                send the trip for approval.
                                              </Text>
                                              <Text>Note: </Text>
                                              <Text>
                                                Trip will be booked only after
                                                approval from your manager
                                              </Text>
                                            </>
                                          ) : (
                                            <Text style={styles.subTitle}>
                                              Continue booking without Approval
                                            </Text>
                                          )}
                                        </>
                                      </>
                                    )}
                                  </>
                                </>
                              ) : (
                                <View>
                                  <Text>No manager assigned</Text>
                                </View>
                              )}
                            </View>

                            <View style={styles.card}>
                              <Text style={styles.title}>
                                {userAccountDetails?.firstName} (
                                {userAccountDetails?.email})
                              </Text>
                              <Text style={styles.title}>
                                {tripData.data?.name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  gap: responsiveHeight(2),
                                }}>
                                {tripData?.hotels?.filter(hotel =>
                                  requestData?.hotels.includes(hotel.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Hotels -{' '}
                                      {
                                        tripData?.hotels?.filter(hotel =>
                                          requestData?.hotels.includes(
                                            hotel.id,
                                          ),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}

                                {tripData?.flights?.filter(hotel =>
                                  requestData?.flights.includes(hotel.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Flights -{' '}
                                      {
                                        tripData?.flights?.filter(hotel =>
                                          requestData?.flights.includes(
                                            hotel.id,
                                          ),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}

                                {tripData?.cabs?.filter(cab =>
                                  requestData?.cabs.includes(cab.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Cabs -{' '}
                                      {
                                        tripData?.cabs?.filter(cab =>
                                          requestData?.cabs.includes(cab.id),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}

                                {tripData?.bus?.filter(bus =>
                                  requestData?.bus.includes(bus.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Buses -{' '}
                                      {
                                        tripData?.bus?.filter(bus =>
                                          requestData?.bus.includes(bus.id),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}
                              </View>

                              <Text style={styles.title}>
                                Total price:
                                <Text
                                  style={[
                                    styles.title,
                                    {color: colors.secondary},
                                  ]}>
                                  {' '}
                                  &#8377;{' '}
                                  {`${Math.ceil(
                                    requestData?.price,
                                  ).toLocaleString('en-IN')} `}
                                </Text>
                              </Text>
                              <Text style={styles.subTitle}>
                                Requested on:
                                <Text
                                  style={[
                                    styles.subTitle,
                                    {color: colors.highlight},
                                  ]}>
                                  {new Date(
                                    requestData?.createdAt?.seconds * 1000,
                                  ).toLocaleDateString()}
                                </Text>
                              </Text>
                              <TouchableOpacity
                                style={{
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}
                                onPress={toggleUp}>
                                <Text style={styles.subTitle}>
                                  {!fareIsOpen ? 'View' : 'Close'} Trip Details
                                </Text>
                                <IconSwitcher
                                  componentName="EvilIcons"
                                  iconName={
                                    fareIsOpen ? 'chevron-up' : 'chevron-down'
                                  }
                                  color="black"
                                  iconsize={3}
                                />
                              </TouchableOpacity>
                              {fareIsOpen ? (
                                <>
                                  <>
                                    {tripData?.hotels
                                      ?.filter(hotel =>
                                        requestData?.hotels.includes(hotel.id),
                                      )
                                      ?.map((hotel, s) => {
                                        const monthNames = [
                                          'Jan',
                                          'Feb',
                                          'Mar',
                                          'Apr',
                                          'May',
                                          'Jun',
                                          'Jul',
                                          'Aug',
                                          'Sep',
                                          'Oct',
                                          'Nov',
                                          'Dec',
                                        ];
                                        const startdate = new Date(
                                          hotel?.data?.hotelSearchQuery
                                            ?.checkInDate.seconds * 1000,
                                        );
                                        const formattedDate1 = `${
                                          monthNames[startdate.getMonth()]
                                        } ${startdate.getDate()}`;
                                        var endDate = getDate(
                                          hotel?.data?.hotelSearchQuery
                                            ?.checkOutDate.seconds,
                                        );
                                        var adults =
                                          hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                                            (acc, obj) => {
                                              acc.adults += parseInt(
                                                obj.adults,
                                                10,
                                              );
                                              acc.child += parseInt(
                                                obj.child,
                                                10,
                                              );
                                              return acc;
                                            },
                                            {adults: 0, child: 0},
                                          );
                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Hotels
                                              </Text>
                                            ) : null}

                                            <HCard
                                              hotel={hotel}
                                              formattedDate1={formattedDate1}
                                              endDate={endDate}
                                              adults={adults}
                                              recheck={true}
                                            />

                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        hotel.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? 'Adult'
                                                            : 'Child';
                                                        var index =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? i + 1
                                                            : i +
                                                              1 -
                                                              travellerCount.adults;
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={type}
                                                            index={index}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        hotel.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? 'Adult'
                                                            : 'Child';
                                                        var index =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? i + 1
                                                            : i +
                                                              1 -
                                                              travellerCount.adults;
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={type}
                                                            index={index}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>

                                  <>
                                    {tripData?.flights
                                      ?.filter(hotel =>
                                        requestData?.flights.includes(hotel.id),
                                      )
                                      ?.map((flight, s) => {
                                        var airlinename =
                                          flight.data.flightNew.segments[0]
                                            .airlineName;
                                        var airline = flightsLogosData?.filter(
                                          a => {
                                            return (
                                              airlinename.toLowerCase() === a.id
                                            );
                                          },
                                        );
                                        var flightArr = [
                                          flight.data.flight,
                                        ].map((flight, f) => {
                                          return {
                                            ...actions.modifyFlightObject(
                                              flight,
                                            ),
                                          };
                                        });
                                        var adults = flight.data.adults;
                                        var child = flight.data.child;
                                        var infant = flight.data.infant;

                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Flights
                                              </Text>
                                            ) : null}
                                            <>
                                              <FCard
                                                airline={airline}
                                                flightArr={flightArr}
                                                flightData={flight}
                                              />
                                            </>
                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        flight.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <= adults
                                                            ? 'Adult'
                                                            : i + 1 <=
                                                              adults + child
                                                            ? 'Child'
                                                            : 'Infant';
                                                        var index =
                                                          i + 1 <= adults
                                                            ? i + 1
                                                            : i + 1 <=
                                                              adults + child
                                                            ? i - adults + 1
                                                            : i -
                                                              (adults + child) +
                                                              1;
                                                        return (
                                                          <TravDetails
                                                            type={type}
                                                            index={index}
                                                            trav={trav}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        flight.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <= adults
                                                            ? 'Adult'
                                                            : i + 1 <=
                                                              adults + child
                                                            ? 'Child'
                                                            : 'Infant';
                                                        var index =
                                                          i + 1 <= adults
                                                            ? i + 1
                                                            : i + 1 <=
                                                              adults + child
                                                            ? i - adults + 1
                                                            : i -
                                                              (adults + child) +
                                                              1;
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            index={index}
                                                            type={type}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>

                                  <>
                                    {tripData?.cabs
                                      ?.filter(cab =>
                                        requestData?.cabs.includes(cab.id),
                                      )
                                      ?.map((cab, s) => {
                                        var cabSDate = new Date(
                                          cab.data.cabStartDate.seconds * 1000,
                                        )
                                          ?.toString()
                                          ?.slice(4, 10);

                                        var cabEDate = cab.data.cabEndDate
                                          ? new Date(
                                              cab.data.cabEndDate.seconds *
                                                1000,
                                            )
                                              ?.toString()
                                              ?.slice(4, 10)
                                          : '';

                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Cab
                                              </Text>
                                            ) : null}
                                            <View>
                                              <CCard
                                                item={cab.data.cab}
                                                startDate={cabSDate}
                                                endDate={cabEDate}
                                                data={cab.data}
                                              />
                                            </View>
                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        cab.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        cab.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>

                                  <>
                                    {tripData?.bus
                                      ?.filter(bus =>
                                        requestData?.bus.includes(bus.id),
                                      )
                                      ?.map((bus, s) => {
                                        var cabReq =
                                          tripData?.data?.bus?.filter(
                                            hotelMain => {
                                              return hotelMain.id === bus.id;
                                            },
                                          );
                                        var cabSDate = bus.data.bus
                                          .DepartureTime
                                          ? new Date(bus.data.bus.DepartureTime)
                                              ?.toString()
                                              ?.slice(4, 10)
                                          : '';
                                        var cabEDate = bus.data.bus.ArrivalTime
                                          ? new Date(bus.data.bus.ArrivalTime)
                                              ?.toString()
                                              ?.slice(4, 10)
                                          : '';

                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Bus
                                              </Text>
                                            ) : null}
                                            <View>
                                              <BCard
                                                item={bus.data.bus}
                                                startDate={cabSDate}
                                                endDate={cabEDate}
                                                bookingBus={bus.data}
                                              />
                                            </View>
                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        bus.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        bus.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>
                                </>
                              ) : null}
                            </View>
                          </View>
                        ) : (
                          <View style={{margin: responsiveHeight(1)}}>
                            <View
                              style={[
                                styles.card,
                                {
                                  width: '100%',
                                  gap: responsiveHeight(0.5),
                                  alignItems: 'center',
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.title,
                                  {
                                    fontSize: responsiveHeight(1.8),
                                    marginBottom: responsiveHeight(1.5),
                                  },
                                ]}>
                                Manager Approval
                              </Text>
                              {Object.keys(userAccountDetails?.manager).length >
                              0 ? (
                                <>
                                  <Text
                                    style={
                                      styles.subTitle
                                    }>{`Manager Name : `}</Text>
                                  <Text
                                    style={
                                      styles.title
                                    }>{`${userAccountDetails?.manager?.name}(${userAccountDetails?.manager?.email})`}</Text>
                                  <>
                                    {requestId ? (
                                      <>
                                        {requestData?.status === 'Approved' ? (
                                          <View>
                                            <Text style={styles.subTitle}>
                                              Your trip is approved
                                            </Text>
                                            <View
                                              style={styles.statusContainer}>
                                              <Text style={styles.subTitle}>
                                                Status:
                                              </Text>
                                              <Text
                                                style={
                                                  requestData?.status ===
                                                  'Pending'
                                                    ? styles.statusTitle
                                                    : styles.activeStatusTitle
                                                }>
                                                {requestData?.status}
                                              </Text>
                                            </View>
                                          </View>
                                        ) : (
                                          <View>
                                            <Text style={styles.subTitle}>
                                              Your trip is submitted for
                                              approval
                                            </Text>
                                            <View
                                              style={styles.statusContainer}>
                                              <Text style={styles.subTitle}>
                                                Status:
                                              </Text>
                                              <Text
                                                style={
                                                  requestData?.status ===
                                                  'Pending'
                                                    ? styles.statusTitle
                                                    : styles.activeStatusTitle
                                                }>
                                                {requestData?.status}
                                              </Text>
                                            </View>
                                          </View>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <Text
                                          style={
                                            styles.subTitle
                                          }>{`Send booking for Approval: `}</Text>
                                        <TouchableOpacity
                                          style={styles.btn}
                                          onPress={handleManagerClick}>
                                          <Text
                                            style={[
                                              styles.subTitle,
                                              {color: colors.white},
                                            ]}>
                                            Yes
                                          </Text>
                                        </TouchableOpacity>
                                        <Text style={styles.title}>OR</Text>
                                        <Text style={styles.subTitle}>
                                          Continue booking without Approval
                                        </Text>
                                      </>
                                    )}
                                  </>
                                </>
                              ) : (
                                <View>
                                  <Text>No manager assigned</Text>
                                </View>
                              )}
                            </View>

                            <View
                              style={[
                                styles.card,
                                {width: '100%', gap: responsiveHeight(0.5)},
                              ]}>
                              <Text style={styles.title}>
                                {userAccountDetails?.firstName} (
                                {userAccountDetails?.email})
                              </Text>
                              <Text style={styles.title}>
                                {tripData.data?.name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  gap: responsiveHeight(2),
                                  flexWrap: 'wrap',
                                }}>
                                {tripData?.hotels?.filter(
                                  hotel => !hotelIds.includes(hotel.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Hotels -{' '}
                                      {
                                        tripData?.hotels?.filter(
                                          hotel => !hotelIds.includes(hotel.id),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}
                                {tripData?.flights?.filter(
                                  hotel => !flightsIds.includes(hotel.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Flights -{' '}
                                      {
                                        tripData?.flights?.filter(
                                          hotel =>
                                            !flightsIds.includes(hotel.id),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}

                                {tripData?.cabs?.filter(
                                  cab => !cabsIds.includes(cab.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Cabs -{' '}
                                      {
                                        tripData?.cabs?.filter(
                                          cab => !cabsIds.includes(cab.id),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}
                                {tripData?.bus?.filter(
                                  bus => !busIds.includes(bus.id),
                                )?.length > 0 ? (
                                  <View style={styles.btn}>
                                    <Text style={styles.btnTitle}>
                                      Bus -{' '}
                                      {
                                        tripData?.bus?.filter(
                                          bus => !busIds.includes(bus.id),
                                        )?.length
                                      }
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                              <Text style={styles.title}>
                                Total price:
                                <Text
                                  style={[
                                    styles.title,
                                    {color: colors.secondary},
                                  ]}>
                                  {' '}
                                  &#8377;{' '}
                                  {`${Math.ceil(finalPrice).toLocaleString(
                                    'en-IN',
                                  )} `}
                                </Text>
                              </Text>
                              <Text style={styles.subTitle}>
                                Created on:
                                <Text
                                  style={[
                                    styles.subTitle,
                                    {color: colors.highlight},
                                  ]}>{` ${newdate}`}</Text>
                              </Text>
                              <TouchableOpacity
                                style={{
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                }}
                                onPress={toggleUp}>
                                <Text style={styles.subTitle}>
                                  {!fareIsOpen ? 'View' : 'Close'} Trip Details
                                </Text>
                                <IconSwitcher
                                  componentName="EvilIcons"
                                  iconName={
                                    fareIsOpen ? 'chevron-up' : 'chevron-down'
                                  }
                                  color="black"
                                  iconsize={3}
                                />
                              </TouchableOpacity>
                              {fareIsOpen ? (
                                <>
                                  <>
                                    {tripData?.hotels
                                      ?.filter(
                                        hotel => !hotelIds.includes(hotel.id),
                                      )
                                      ?.map((hotel, s) => {
                                        const monthNames = [
                                          'Jan',
                                          'Feb',
                                          'Mar',
                                          'Apr',
                                          'May',
                                          'Jun',
                                          'Jul',
                                          'Aug',
                                          'Sep',
                                          'Oct',
                                          'Nov',
                                          'Dec',
                                        ];
                                        const startdate = new Date(
                                          hotel?.data?.hotelSearchQuery
                                            ?.checkInDate.seconds * 1000,
                                        );
                                        const formattedDate1 = `${
                                          monthNames[startdate.getMonth()]
                                        } ${startdate.getDate()}`;
                                        var endDate = getDate(
                                          hotel?.data?.hotelSearchQuery
                                            ?.checkOutDate.seconds,
                                        );
                                        var adults =
                                          hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                                            (acc, obj) => {
                                              acc.adults += parseInt(
                                                obj.adults,
                                                10,
                                              );
                                              acc.child += parseInt(
                                                obj.child,
                                                10,
                                              );
                                              return acc;
                                            },
                                            {adults: 0, child: 0},
                                          );
                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Hotels
                                              </Text>
                                            ) : null}

                                            <HCard
                                              hotel={hotel}
                                              formattedDate1={formattedDate1}
                                              endDate={endDate}
                                              adults={adults}
                                              recheck={true}
                                            />

                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        hotel.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? 'Adult'
                                                            : 'Child';
                                                        var index =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? i + 1
                                                            : i +
                                                              1 -
                                                              travellerCount.adults;
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={type}
                                                            index={index}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        hotel.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? 'Adult'
                                                            : 'Child';
                                                        var index =
                                                          i + 1 <=
                                                          travellerCount.adults
                                                            ? i + 1
                                                            : i +
                                                              1 -
                                                              travellerCount.adults;
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={type}
                                                            index={index}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>

                                  <>
                                    {tripData?.flights
                                      ?.filter(
                                        hotel => !flightsIds.includes(hotel.id),
                                      )
                                      ?.map((flight, s) => {
                                        var airlinename =
                                          flight.data.flightNew.segments[0]
                                            .airlineName;
                                        var airline = flightsLogosData?.filter(
                                          a => {
                                            return (
                                              airlinename.toLowerCase() === a.id
                                            );
                                          },
                                        );
                                        var flightArr = [
                                          flight.data.flight,
                                        ].map((flight, f) => {
                                          return {
                                            ...actions.modifyFlightObject(
                                              flight,
                                            ),
                                          };
                                        });
                                        var adults = flight.data.adults;
                                        var child = flight.data.child;
                                        var infant = flight.data.infant;

                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Flights
                                              </Text>
                                            ) : null}
                                            <View>
                                              <FCard
                                                airline={airline}
                                                flightArr={flightArr}
                                                flightData={flight}
                                              />
                                            </View>
                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        flight.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <= adults
                                                            ? 'Adult'
                                                            : i + 1 <=
                                                              adults + child
                                                            ? 'Child'
                                                            : 'Infant';
                                                        var index =
                                                          i + 1 <= adults
                                                            ? i + 1
                                                            : i + 1 <=
                                                              adults + child
                                                            ? i - adults + 1
                                                            : i -
                                                              (adults + child) +
                                                              1;
                                                        return (
                                                          <TravDetails
                                                            type={type}
                                                            index={index}
                                                            trav={trav}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        flight.id
                                                      ]?.map((trav, i) => {
                                                        var type =
                                                          i + 1 <= adults
                                                            ? 'Adult'
                                                            : i + 1 <=
                                                              adults + child
                                                            ? 'Child'
                                                            : 'Infant';
                                                        var index =
                                                          i + 1 <= adults
                                                            ? i + 1
                                                            : i + 1 <=
                                                              adults + child
                                                            ? i - adults + 1
                                                            : i -
                                                              (adults + child) +
                                                              1;
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            index={index}
                                                            type={type}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>

                                  <>
                                    {tripData?.cabs
                                      ?.filter(cab => !cabsIds.includes(cab.id))
                                      ?.map((cab, s) => {
                                        var cabSDate = new Date(
                                          cab.data.cabStartDate.seconds * 1000,
                                        )
                                          ?.toString()
                                          ?.slice(4, 10);

                                        var cabEDate = cab.data.cabEndDate
                                          ? new Date(
                                              cab.data.cabEndDate.seconds *
                                                1000,
                                            )
                                              ?.toString()
                                              ?.slice(4, 10)
                                          : '';

                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Cab
                                              </Text>
                                            ) : null}
                                            <View>
                                              <CCard
                                                item={cab.data.cab}
                                                startDate={cabSDate}
                                                endDate={cabEDate}
                                                data={cab.data}
                                              />
                                            </View>
                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        cab.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        cab.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>

                                  <>
                                    {tripData?.bus
                                      ?.filter(bus => !busIds.includes(bus.id))
                                      ?.map((bus, s) => {
                                        var cabReq =
                                          tripData?.data?.bus?.filter(
                                            hotelMain => {
                                              return hotelMain.id === bus.id;
                                            },
                                          );
                                        var cabSDate = bus.data.bus
                                          .DepartureTime
                                          ? new Date(bus.data.bus.DepartureTime)
                                              ?.toString()
                                              ?.slice(4, 10)
                                          : '';
                                        var cabEDate = bus.data.bus.ArrivalTime
                                          ? new Date(bus.data.bus.ArrivalTime)
                                              ?.toString()
                                              ?.slice(4, 10)
                                          : '';
                                        console.log(cabSDate, cabEDate);
                                        return (
                                          <>
                                            {s === 0 ? (
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Bus
                                              </Text>
                                            ) : null}
                                            <View>
                                              <BCard
                                                item={bus.data.bus}
                                                startDate={cabSDate}
                                                endDate={cabEDate}
                                                bookingBus={bus.data}
                                              />
                                            </View>
                                            <>
                                              <Text
                                                style={[
                                                  styles.title,
                                                  {textAlign: 'center'},
                                                ]}>
                                                Traveller Details
                                              </Text>
                                              <View>
                                                <>
                                                  {tripData?.data
                                                    ?.travellerDetails ? (
                                                    <>
                                                      {tripData.data.travellerDetails[
                                                        bus.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  ) : (
                                                    <>
                                                      {travellerDetails[
                                                        bus.id
                                                      ]?.map((trav, i) => {
                                                        return (
                                                          <TravDetails
                                                            trav={trav}
                                                            type={'Adults'}
                                                            index={i + 1}
                                                          />
                                                        );
                                                      })}
                                                    </>
                                                  )}
                                                </>
                                              </View>
                                            </>
                                          </>
                                        );
                                      })}
                                  </>
                                </>
                              ) : null}
                            </View>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: colors.highlightLite,
                      paddingRight: responsiveHeight(2),
                      paddingVertical: responsiveHeight(1),
                      borderRadius: responsiveHeight(1),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: responsiveHeight(1),
                        alignItems: 'center',
                      }}>
                      {approvalError && (
                        <Text style={[styles.title, {color: colors.red}]}>
                          Approval is Mandatory
                        </Text>
                      )}
                      <TouchableOpacity
                        style={[styles.btn]}
                        onPress={() => {
                          setSelectedTab('travellers');
                        }}>
                        <Text style={[styles.subTitle, {color: colors.white}]}>
                          Previous
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btn]}
                        onPress={() => {
                          if (userAccountDetails.approvalType !== 'Mandatory') {
                            setSelectedTab('payment');
                          } else if (
                            requestData?.status === 'Approved' &&
                            userAccountDetails.approvalType === 'Mandatory'
                          ) {
                            setSelectedTab('payment');
                          } else {
                            setApprovalError(true);
                          }
                        }}>
                        <Text style={[styles.subTitle, {color: colors.white}]}>
                          Next
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : null}
              {selectedTab === 'payment' ? (
                <>
                  {tripData?.hotels?.filter(
                    hotel => !hotelSubmittedIds.includes(hotel.id),
                  )?.length !== 0 ||
                  tripData?.flights?.filter(
                    hotel => !flightSubmittedIds.includes(hotel.id),
                  )?.length !== 0 ||
                  tripData?.cabs?.filter(
                    hotel => !cabSubmittedIds.includes(hotel.id),
                  )?.length !== 0 ||
                  tripData?.bus?.filter(
                    hotel => !busSubmittedIds.includes(hotel.id),
                  )?.length !== 0 ? (
                    <View style={styles.paymentMainConatainer}>
                      <View style={styles.paymentTitleContainer}>
                        <Text
                          style={[
                            styles.title,
                            {fontSize: responsiveHeight(2)},
                          ]}>
                          Complete the payment
                        </Text>
                        <Text
                          style={[
                            styles.subTitle,
                            {fontSize: responsiveHeight(1.7)},
                          ]}>
                          Select the trips you want to complete the payment
                        </Text>
                      </View>
                      {tripData?.hotels?.filter(hotel =>
                        hotelNotSubmittedIds.includes(hotel.id),
                      )?.length > 0 ||
                      tripData?.flights?.filter(hotel =>
                        flightNotSubmittedIds.includes(hotel.id),
                      )?.length > 0 ||
                      tripData?.cabs?.filter(
                        hotel => !cabNotSubmittedIds.includes(hotel.id),
                      )?.length > 0 ||
                      tripData?.bus?.filter(
                        hotel => !busNotSubmittedIds.includes(hotel.id),
                      )?.length > 0 ? (
                        <View
                          style={[
                            styles.card,
                            {width: '100%', gap: responsiveHeight(2)},
                          ]}>
                          <View style={styles.paymentCheckBoxContainer}>
                            <TouchableOpacity
                              onPress={() => {
                                if (!checked) {
                                  setChecked(true);
                                  setBookingPrice(prev => prev + finalPrice);
                                } else {
                                  setChecked(false);
                                  setBookingPrice(prev => prev - finalPrice);
                                }
                              }}>
                              <IconSwitcher
                                componentName="MaterialIcons"
                                iconName={
                                  checked
                                    ? 'check-box'
                                    : 'check-box-outline-blank'
                                }
                                color={checked ? colors.facebook : colors.gray}
                                iconsize={3}
                              />
                            </TouchableOpacity>
                            <View style={styles.notSubmitedContainer}>
                              <Text style={styles.notSubmitedTitle}>
                                Not Submitted
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                              }}>
                              <Text style={styles.title}>
                                {tripData?.flights?.filter(hotel =>
                                  flightNotSubmittedIds.includes(hotel.id),
                                ).length > 0 ? (
                                  <>
                                    {
                                      tripData?.flights?.filter(hotel =>
                                        flightNotSubmittedIds.includes(
                                          hotel.id,
                                        ),
                                      ).length
                                    }
                                    -Flights&nbsp;,{' '}
                                  </>
                                ) : null}
                              </Text>
                              <Text style={styles.title}>
                                {tripData?.hotels?.filter(hotel =>
                                  hotelNotSubmittedIds.includes(hotel.id),
                                ).length > 0 ? (
                                  <>
                                    {
                                      tripData?.hotels?.filter(hotel =>
                                        hotelNotSubmittedIds.includes(hotel.id),
                                      ).length
                                    }
                                    -Hotels&nbsp;
                                  </>
                                ) : null}
                              </Text>

                              <Text style={styles.title}>
                                {tripData?.cabs?.filter(hotel =>
                                  cabNotSubmittedIds.includes(hotel.id),
                                ).length > 0 ? (
                                  <>
                                    {
                                      tripData?.cabs?.filter(hotel =>
                                        cabNotSubmittedIds.includes(hotel.id),
                                      ).length
                                    }
                                    -Cabs&nbsp;
                                  </>
                                ) : null}
                              </Text>

                              <Text style={styles.title}>
                                {tripData?.bus?.filter(hotel =>
                                  busNotSubmittedIds.includes(hotel.id),
                                ).length > 0 ? (
                                  <>
                                    {
                                      tripData?.bus?.filter(hotel =>
                                        busNotSubmittedIds.includes(hotel.id),
                                      ).length
                                    }
                                    -Bus&nbsp;
                                  </>
                                ) : null}
                              </Text>
                            </View>
                            <View>
                              <Text style={styles.title}>
                                Price:&nbsp;
                                <Text
                                  style={[
                                    styles.title,
                                    {color: colors.secondary},
                                  ]}>
                                  &#8377;
                                  {Math.ceil(finalPrice).toLocaleString(
                                    'en-IN',
                                  )}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : null}
                      <View
                        style={{
                          alignItems: 'center',
                          gap: responsiveHeight(1),
                        }}>
                        <Text
                          style={[
                            styles.title,
                            {fontSize: responsiveHeight(1.8)},
                          ]}>
                          Account Balance:{' '}
                          <Text
                            style={[
                              styles.totalPrice,
                              {fontSize: responsiveHeight(1.8)},
                            ]}>
                            &#8377;{Math.ceil(userAccountDetails.balance)}
                          </Text>
                        </Text>
                        {bookingPrice > 0 ? (
                          <>
                            {userAccountDetails.accountType === 'PostPaid' ? (
                              <TouchableOpacity
                                style={[
                                  styles.btn,
                                  {
                                    paddingVertical: responsiveHeight(1),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: responsiveHeight(18),
                                  },
                                ]}
                                onPress={handleClick}>
                                {!paymentLoading ? (
                                  <Text
                                    style={[
                                      styles.btnTitle,
                                      {width: responsiveHeight(15)},
                                    ]}>
                                    Submit for Booking
                                  </Text>
                                ) : (
                                  <ActivityIndicator
                                    size={'small'}
                                    color={colors.facebook}
                                  />
                                )}
                              </TouchableOpacity>
                            ) : (
                              <>
                                {userAccountDetails.balance < bookingPrice ? (
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      gap: responsiveHeight(2),
                                    }}>
                                    <Text style={[styles.subTitle]}>
                                      You dont have enough money to complete
                                      payment.Add money to the wallet
                                    </Text>
                                    <TouchableOpacity
                                      style={[
                                        styles.btn,
                                        {paddingVertical: responsiveHeight(1)},
                                      ]}
                                      onPress={() => navigate('Wallet')}>
                                      <Text style={styles.btnTitle}>
                                        Add money
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      gap: responsiveHeight(2),
                                    }}>
                                    <Text
                                      style={[
                                        styles.subTitle,
                                        {fontSize: responsiveHeight(1.8)},
                                      ]}>
                                      Complete the payment
                                    </Text>
                                    <TouchableOpacity
                                      style={[
                                        styles.btn,
                                        {
                                          paddingVertical: responsiveHeight(1),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: responsiveHeight(18),
                                        },
                                      ]}
                                      onPress={handleClick}>
                                      {!paymentLoading ? (
                                        <Text
                                          style={[
                                            styles.btnTitle,
                                            {width: responsiveHeight(15)},
                                          ]}>
                                          Make payment
                                        </Text>
                                      ) : (
                                        <ActivityIndicator
                                          size={'small'}
                                          color={colors.facebook}
                                        />
                                      )}
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <View>
                            <Text
                              style={[styles.subTitle, {color: colors.red}]}>
                              Please select any one of the above to select for
                              booking
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.bookedMsgContainer}>
                      <Text style={styles.title}>
                        Thank you for the booking. Your booking has been
                        submitted. We will get back to you soon.
                      </Text>
                      <TouchableOpacity
                        onPress={() => setTraveller(false)}
                        style={[
                          styles.btn,
                          {paddingVertical: responsiveHeight(1)},
                        ]}>
                        <Text style={styles.btnTitle}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : null}
            </View>
          </View>
        </Modal>

        {/* Rechecking Hotels */}
        <PopUp
          value={openPriceReCheck}
          handlePopUpClose={() => setOpenPriceReCheck(false)}>
          <View style={styles.recheckCard}>
            <HCard
              hotel={hotelDetails}
              formattedDate1={formatDate}
              endDate={hotelEndDate}
              adults={hotelAdults}
              recheck={false}
            />
          </View>

          <View style={{marginTop: responsiveHeight(2)}}>
            {reCheckLoading ? (
              <View style={styles.progressBarContainer}>
                <ProgressBar />
                <Text style={[styles.roomType, {textAlign: 'center'}]}>
                  ReChecking Hotel Rates
                </Text>
              </View>
            ) : newSelectedRoom.length > 0 ? (
              <View>
                <Text style={styles.recheckPriceTitle}>
                  Hotel Price Recheck
                </Text>

                <View style={styles.recheckPriceContainer}>
                  <View style={styles.recheckPriceSubContainer}>
                    <Text style={styles.hotelTitle}>Old Rates</Text>
                    <View style={styles.recheckPriceChildContainer}>
                      <Text style={styles.oldprices}>
                        Old Rates:
                        <Text style={styles.hotelRoomPrice}>
                          &#8377;
                          {oldSelectedRoom
                            .reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPriceRoundedOff),
                              0,
                            )
                            .toLocaleString()}
                        </Text>
                      </Text>
                      <Text style={styles.oldprices}>
                        Service Charges:
                        <Text style={styles.hotelRoomPrice}>
                          &#8377;
                          {Math.ceil(
                            (oldSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPriceRoundedOff),
                              0,
                            ) *
                              domesticHotel) /
                              100,
                          ).toLocaleString()}
                        </Text>
                      </Text>
                      <Text style={styles.oldprices}>
                        Old Total Price:
                        <Text style={styles.hotelRoomPrice}>
                          &#8377;
                          {Math.ceil(
                            oldSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPriceRoundedOff),
                              0,
                            ) +
                              (oldSelectedRoom.reduce(
                                (sum, arr) =>
                                  sum +
                                  Number(arr.Price.OfferedPriceRoundedOff),
                                0,
                              ) *
                                domesticHotel) /
                                100,
                          ).toLocaleString()}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <View style={styles.recheckPriceSubContainer}>
                    <Text style={styles.hotelTitle}>New Rates</Text>
                    <View style={styles.recheckPriceChildContainer}>
                      <Text style={styles.newPrice}>
                        New Rates:
                        <Text style={styles.hotelRoomPrice}>
                          &#8377;
                          {Math.ceil(
                            newSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPrice),
                              0,
                            ),
                          ).toLocaleString()}
                        </Text>
                      </Text>
                      <Text style={styles.newPrice}>
                        Service Charges:
                        <Text style={styles.hotelRoomPrice}>
                          &#8377;
                          {Math.ceil(
                            (newSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPrice),
                              0,
                            ) *
                              domesticHotel) /
                              100,
                          ).toLocaleString()}
                        </Text>
                      </Text>
                      <Text style={styles.newPrice}>
                        New Total Price:
                        <Text style={styles.hotelRoomPrice}>
                          &#8377;
                          {Math.ceil(
                            newSelectedRoom.reduce(
                              (sum, arr) =>
                                sum + Number(arr.Price.OfferedPrice),
                              0,
                            ) +
                              (newSelectedRoom.reduce(
                                (sum, arr) =>
                                  sum + Number(arr.Price.OfferedPrice),
                                0,
                              ) *
                                domesticHotel) /
                                100,
                          ).toLocaleString()}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.hotelRecheckBtnContainer}>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={async () => {
                      await actions.updateHotelBookingDetails(
                        newSelectedRoom.reduce(
                          (sum, arr) =>
                            sum + Math.ceil(Number(arr.Price.OfferedPrice)),
                          0,
                        ),
                        deleteId,
                        id,
                      );
                      setOpenPriceReCheck(false);
                    }}>
                    <Text style={styles.btnTitle}>Keep Hotel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, {backgroundColor: colors.whiteSmoke}]}
                    onPress={() => {
                      handleDelete(), setOpenPriceReCheck(false);
                    }}>
                    <Text style={[styles.btnTitle, {color: colors.primary}]}>
                      Delete Hotel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.title}>
                  The selected hotel is not available please change the hotel
                </Text>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    handleDelete(), setOpenPriceReCheck(false);
                  }}>
                  <Text style={styles.btnTitle}>Delete Hotel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </PopUp>
        {/* Rechecking Button */}
        <PopUp
          value={reCheck}
          handlePopUpClose={() => {
            setReCheck(false);
          }}>
          <Text
            style={[
              styles.heading,
              {textAlign: 'center', marginBottom: responsiveHeight(1)},
            ]}>
            Re-check Rates
          </Text>
          <Text style={[styles.title]}>
            Please re-check rates for the below.Since it is more than 3 hours
            since they have been added to 'My Trips'
          </Text>

          <View style={styles.recheckingDetails}>
            <View style={styles.eachRecheckingDetails}>
              <View>
                {tripData?.flights?.filter(flight => {
                  var hotelData = tripData?.data?.flights.filter(
                    hotels => hotels.id === flight.id,
                  );
                  var hotelTimeStamp = new Date(
                    hotelData[0]?.date?.seconds * 1000,
                  );
                  var originalDate = new Date(hotelTimeStamp);
                  var threeHoursAfter = new Date(
                    originalDate.getTime() + 3 * 60 * 60 * 1000,
                  );
                  var currentTime = new Date();
                  var isTimeReCheck = currentTime > threeHoursAfter;
                  return isTimeReCheck;
                }).length > 0 && (
                  <Text style={styles.hotelTitle}>Flights :</Text>
                )}
              </View>
              {tripData?.flights
                ?.filter(flight => {
                  var hotelData = tripData?.data?.flights.filter(
                    hotels => hotels.id === flight.id,
                  );
                  var hotelTimeStamp = new Date(
                    hotelData[0]?.date?.seconds * 1000,
                  );
                  var originalDate = new Date(hotelTimeStamp);
                  var threeHoursAfter = new Date(
                    originalDate.getTime() + 3 * 60 * 60 * 1000,
                  );
                  var currentTime = new Date();
                  var isTimeReCheck = currentTime > threeHoursAfter;
                  return isTimeReCheck;
                })
                .map((flight, ind) => {
                  return (
                    <Text style={styles.title}>
                      {`${ind + 1} . ${
                        flight.data.flightNew.segments[0].destCityName
                      } to ${flight.data.flightNew.segments[0].originCityName}`}
                    </Text>
                  );
                })}
            </View>
            <View style={styles.eachRecheckingDetails}>
              {tripData?.flights?.filter(flight => {
                var hotelData = tripData?.data?.flights.filter(
                  hotels => hotels.id === flight.id,
                );
                var hotelTimeStamp = new Date(
                  hotelData[0]?.date?.seconds * 1000,
                );
                var originalDate = new Date(hotelTimeStamp);
                var threeHoursAfter = new Date(
                  originalDate.getTime() + 3 * 60 * 60 * 1000,
                );
                var currentTime = new Date();
                var isTimeReCheck = currentTime > threeHoursAfter;
                return isTimeReCheck;
              }).length > 0 && <Text style={styles.hotelTitle}>Hotels :</Text>}
              {tripData?.hotels
                ?.filter(hotel => {
                  var hotelData = tripData?.data?.hotels.filter(
                    hotels => hotels.id === hotel.id,
                  );
                  var hotelTimeStamp = new Date(
                    hotelData[0]?.date?.seconds * 1000,
                  );
                  var originalDate = new Date(hotelTimeStamp);
                  var threeHoursAfter = new Date(
                    originalDate.getTime() + 3 * 60 * 60 * 1000,
                  );
                  var currentTime = new Date();
                  var isTimeReCheck = currentTime > threeHoursAfter;
                  return isTimeReCheck;
                })
                .map((hotel, ind) => {
                  return (
                    <Text style={styles.title}>
                      {`${ind + 1} . ${
                        hotel.data.hotelInfo.HotelInfoResult.HotelDetails
                          .HotelName
                      }`}
                    </Text>
                  );
                })}
            </View>
          </View>
        </PopUp>
        {/* Add Expenses */}

        <PopUp
          value={openExpense}
          handlePopUpClose={() => {
            setOpenExpense(false);
          }}>
          <Text style={styles.heading}>Add Expense</Text>
          <View>
            <Text style={styles.expenseSubTitle}>Expense Type</Text>
            <View style={styles.ExpenseSubContainer}>
              <CustomSelect
                data={expenseTypeData}
                renderData={(item, index) => expenseRenderItem(item, index)}
                selectedItem={expenseType}
                handledropDown={handledropDown}
                viewAll={viewAll}
              />
            </View>
          </View>
          <View>
            <Text style={styles.expenseSubTitle}>Date:</Text>
            <TouchableOpacity
              style={styles.expenseCard}
              onPress={() => setDatePicker(true)}>
              <Text style={styles.placeholderTitle}>
                {expenseShortDate ? expenseShortDate : 'Date'}
              </Text>
            </TouchableOpacity>
          </View>
          {datePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="calendar"
              onChange={handleSelectedDate}
              minimumDate={new Date()}
              is24Hour={true}
            />
          )}
          <View>
            <Text style={styles.expenseSubTitle}>Add Description:</Text>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              style={[
                styles.expenseCard,
                {textAlignVertical: 'top'},
                styles.placeholderTitle,
              ]}
              placeholder="Enter the description of expense"
              onChangeText={e => setExpenseDescription(e)}
              value={expenseDescription}
            />
          </View>

          <View>
            <Text style={styles.expenseSubTitle}>Add Cost(INR):</Text>
            <TextInput
              style={[styles.expenseCard, styles.placeholderTitle]}
              placeholder="Enter the cost of expense"
              value={cost}
              onChangeText={e => handleExpansePrice(e)}
            />
          </View>

          <View>
            <Text style={styles.expenseSubTitle}>Add Receipt:</Text>

            <View style={styles.addReceiptContainer}>
              {receipt && (
                <Image style={styles.receiptImage} source={{uri: receipt}} />
              )}
              <TouchableOpacity
                style={[styles.addReceiptSubContainer, styles.expenseCard]}
                onPress={handleOpenCamera}>
                <IconSwitcher
                  componentName="MaterialIcons"
                  iconName="photo-camera"
                  color={colors.highlight}
                  iconsize={3}
                />
                <Text style={styles.hotelTitle}>Camera</Text>
              </TouchableOpacity>
              <Text style={styles.hotelTitle}>Or</Text>
              <TouchableOpacity
                style={[styles.addReceiptSubContainer, styles.expenseCard]}
                onPress={handleOpenGallery}>
                <IconSwitcher
                  componentName="MaterialIcons"
                  iconName="photo-library"
                  color={colors.highlight}
                  iconsize={3}
                />
                <Text style={styles.hotelTitle}>Upload From Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, {alignSelf: 'center'}]}
            onPress={handleExpenseSubmit}>
            <Text style={styles.btnTitle}>Submit</Text>
          </TouchableOpacity>
        </PopUp>
      </View>
    )
  );
};

export default React.memo(TripDetails);
