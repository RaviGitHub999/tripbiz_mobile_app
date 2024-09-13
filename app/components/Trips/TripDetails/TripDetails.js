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
import {colors, fonts} from '../../../config/theme';
import ProgressBar from '../../common/progressBar/ProgressBar';
import {useRoute} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import TripDetailsFlightCard from './TripDetailsFlightCard';
import PopUp from '../../common/popup/PopUp';
import {RefreshControl} from 'react-native';
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
import RNFetchBlob from 'rn-fetch-blob';
import TravellerDetailsBtn from '../../common/mainComponents/TravellerDetailsButton/TravellerDetailsBtn';
import moment from 'moment';
import Toast from 'react-native-toast-message';
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
  const [check, setCheck] = useState([]);
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
  const [isAddedAlltravellers, setIsAddedAlltravellers] = useState(false);
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const [timeStampDate, setTimeStampData] = useState();
  const [comment, setComment] = useState({});
  const [managerComment, setManagerComment] = useState('');
  const [viewComments, setViewComments] = useState(false);
  const [viewpaymentComments, setViewPaymentComments] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    flights: [],
    hotels: [],
    cabs: [],
    buses: [],
  });
  const [bookingIndex, setBookingIndex] = useState([]);
  const [bookingNumber, setBookingNumber] = useState(0);
  const [mandatoryError, setMandatoryError] = useState('');
  const [otherPriceInfo, setOtherPriceInfo] = useState(false);
  const [otherPrice, setOtherPrice] = useState({});
  const [allotherTime, setAllOtherTime] = useState(false);
  const [allotherTimeData, setAllOtherTimeData] = useState();
  const [isAnySelected, setIsAnySelected] = useState(true);
  const [totalCheckedPrice, setTotalCheckedPrice] = useState(0);
  const {
    actions,
    tripData,
    flightsLogosData,
    userId,
    tripDataLoading,
    userAccountDetails,
    domesticHotel,
  } = useContext(MyContext);
  const errorMessage =
    userAccountDetails.approvalType === 'Mandatory'
      ? 'Approval is Mandatory'
      : 'Please select any above options';
  useEffect(() => {
    if (tripData?.data?.bookings?.length) {
      setCheck(new Array(tripData?.data?.bookings.length).fill(false));
      setManagerComment(new Array(tripData?.data?.bookings.length).fill(false));
    }
  }, [tripData?.data?.bookings?.length]);
  const handleCheckboxChange = (book, index) => {
    const updatedChecked = [...check];
    updatedChecked[index] = !updatedChecked[index];
    let newTotal = totalCheckedPrice;

  if (updatedChecked[index] ) {
    newTotal += Math.ceil(book.bookingPrice);
  } else {
    newTotal -= Math.ceil(book.bookingPrice);
  }
    handleCheck(book, updatedChecked[index], index);
    setCheck(updatedChecked);
    setTotalCheckedPrice(newTotal)
  };
  const handleviewPaymentComment = index => {
    const updatedChecked = [...viewpaymentComments];
    updatedChecked[index] = !updatedChecked[index];
    setViewPaymentComments(updatedChecked);
  };
  const handleCheck = (booking, isChecked, index) => {
    setSelectedItems(prevState => {
      const newState = {...prevState};

      ['flights', 'hotels', 'cabs', 'bus'].forEach(type => {
        booking[type].forEach(item => {
          if (isChecked) {
            if (!newState[type === 'bus' ? 'buses' : type].includes(item.id)) {
              newState[type === 'bus' ? 'buses' : type].push(item.id);
            }
          } else {
            newState[type === 'bus' ? 'buses' : type] = newState[
              type === 'bus' ? 'buses' : type
            ].filter(id => id !== item.id);
          }
        });
      });
      return newState;
    });
    setBookingIndex(prevState => {
      const newIndices = isChecked
        ? [...prevState, index]
        : prevState.filter(i => i !== index);
      return newIndices;
    });
  };

  const handleCommentChange = (index, comment) => {
    setComment(prevComments => ({
      ...prevComments,
      [`Booking${index + 1}`]: comment,
    }));
  };

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

  var handleClick = async () => {
    const templateCabs = tripData?.cabs?.filter((id, i) => {
      return selectedItems.cabs?.some((selectedCab) => selectedCab === id?.id);
    });
    const templateFlights = tripData?.flights?.filter((id, i) => {
      return selectedItems.flights?.some(
        (selectedCab) => selectedCab === id?.id
      );
    });

    const templateHotels = tripData?.hotels?.filter((id, i) => {
      return selectedItems.hotels?.some(
        (selectedCab) => selectedCab === id?.id
      );
    });
    const templateBus = tripData?.bus?.filter((id, i) => {
      return selectedItems.buses?.some((selectedCab) => selectedCab === id?.id);
    });
    const anySelected = Object.values(selectedItems).some(
      (items) => items.length > 0
    );
    setIsAnySelected(anySelected);
    if (!anySelected) {
      return false;
    }
    setPaymentLoading(true);
    var finalTravDetails = {
      ...travellerDetails,
      ...tripData.data.travellerDetails,
    };
    var notbus = checked
      ? tripData?.bus
          ?.filter((hotel) => busNotSubmittedIds.includes(hotel.id))
          .map((data) => data.id)
      : [];
    if (userAccountDetails.accountType !== 'PostPaid') {
      await actions.makeTripPayment(tripData.data?.name, totalCheckedPrice);
      const finalBookingPrice=bookingPrice-totalCheckedPrice
      setBookingPrice(finalBookingPrice)
    }
   
    await actions.updateBookingStatus(id, bookingIndex, comment);
    const templateData = {
      flights: templateFlights,
      hotels: templateHotels,
      cabs: templateCabs,
      bus: templateBus,
      travellerDetails: tripData.data.travellerDetails,
    };
    await actions.editAdminTrips(
      id,
      tripData,
      finalTravDetails,
      selectedItems.hotels,
      // submittedHotels,
      // submittedFlights,
      selectedItems.flights,
      requestIds,
      selectedItems.cabs,
      // submittedCabs,
      tripData.data?.name,
      selectedItems.buses,
      // submittedBus,
      notbus,
      comment,
      templateData
    );
    setPaymentLoading(false);
    showToast();
    setSelectedItems({
      flights: [],
      hotels: [],
      cabs: [],
      buses: [],
    });
  };
  var handleManagerClick = async status => {
    setApporvalLoading(true);
    var flightArray = tripData?.data?.flights.filter(
      flight => flight.requestStatus === 'Not Requested',
    );
    var hotelArray = tripData?.data?.hotels.filter(
      hotel => hotel.requestStatus === 'Not Requested',
    );
    var cabArray = tripData?.data?.cabs?.filter(
      cab => cab.requestStatus === 'Not Requested',
    );
    var busArray =
      tripData?.data?.bus?.filter(
        bus => bus.requestStatus === 'Not Requested',
      ) ?? [];

    const tripbookingPrice =
      tripData?.flights
        ?.filter(flight => flightArray.some(id => id.id === flight.id))
        .reduce((sum, obj) =>  sum +
        (obj?.data?.totalFare +
          obj?.data?.finalFlightServiceCharge +
          obj?.data?.gstInFinalserviceCharge), 0) +
      tripData?.hotels
        ?.filter(flight => hotelArray.some(id => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.hotelTotalPrice, 0) +
      tripData?.cabs
        ?.filter(flight => cabArray.some(id => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.cabTotalPrice, 0) +
      tripData?.bus
        ?.filter(flight => busArray.some(id => id.id === flight.id))
        .reduce((sum, obj) => sum + obj?.data?.busTotalPrice, 0);
    let book = [
      {
        flights: flightArray,
        hotels: hotelArray,
        cabs: cabArray,
        bus: busArray,
        comment: managerComment,
        bookingPrice: tripbookingPrice,
        bookingStatus: 'pending',
        submissionStatus: 'Not Submitted',
        adminComment: '',
      },
    ];
    const templateData = {
      flights: tripData?.flights?.filter((flight) =>
        flightArray.some((id) => id.id === flight.id)
      ),
      hotels: tripData?.hotels?.filter((flight) =>
        hotelArray.some((id) => id.id === flight.id)
      ),
      cabs: tripData?.cabs?.filter((flight) =>
        cabArray.some((id) => id.id === flight.id)
      ),
      bus: tripData?.bus?.filter((flight) =>
        busArray.some((id) => id.id === flight.id)
      ),
      travellerDetails: tripData.data.travellerDetails,
    };
    await actions.addBookings(id, book);

    var req = await actions.sendApproval(
      userId,
      userAccountDetails?.manager?.userId,
      id,
      travellerDetails,
      price,
      managerComment,
      status,
    );
    if (status !== 'Skipped') {
      await actions.sendBookingApprovalEmail({
        id: userId,
        userName: userAccountDetails.firstName + userAccountDetails.lastName,
        userEmail: userAccountDetails.email,
        managerEmail: userAccountDetails.manager.email,
        managerName: userAccountDetails.manager.name,
        tripName: tripData.data.name,
        templateData: templateData,
      });
    }
    setApporvalLoading(false);
    setTraveller(true);
    await getTripData();
    setRequestData(req.reqData);
    setRequestId(req.reqId);
    setApprovalError(false)
    setMandatoryError("")
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
    {status: 'Submitted', color: '#ffa500'},
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
    {status: 'Skipped', color: '#FF0000'},
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
    setHotelFinalPrice(hotel.data);
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
    await actions.setRes();
    actions.switchComponent('cab');
    await actions.getLastDoc();
  };
  const handleBuses = async () => {
    navigate('Home');
    actions.setSelectedTripId(id);
    await actions.setRes();
    actions.switchComponent('bus');
  };
  const NotFilledData = () => {
    const notFlightsData = tripData?.data?.flights
      .filter(
        item =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData.data.travellerDetails
          ),
      )
      ?.map(flight => flight.id);
    const notHotelsData = tripData?.data?.hotels
      .filter(
        item =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData.data.travellerDetails
          ),
      )
      ?.map(hotel => hotel.id);
    const notCabsData = tripData?.data?.cabs
      ?.filter(
        item =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData?.data?.travellerDetails
          ),
      )
      ?.map(cab => cab.id);
    const notBusData = tripData?.data?.bus
      .filter(
        item =>
          !(
            tripData?.data?.travellerDetails &&
            item.id in tripData?.data?.travellerDetails
          ),
      )
      ?.map(bus => bus.id);

    const filterdFlights = tripData?.flights?.filter(flight =>
      notFlightsData.includes(flight.id),
    );
    const filterdHotels = tripData?.hotels?.filter(hotel =>
      notHotelsData.includes(hotel.id),
    );
    const filterdCabs = tripData?.cabs?.filter(cab =>
      notCabsData.includes(cab.id),
    );
    const filterdBuses = tripData?.bus?.filter(bus =>
      notBusData.includes(bus.id),
    );
    return (
      <>
        {filterdFlights?.map((flight, i) => {
          const flightName =
            flight?.data?.flightNew?.segments?.[0]?.airlineName;
            const ArrDate = flight?.data?.flight?.Segments?.[0]?.[0]?.Origin?.DepTime;
          return (
            <View style={styles.notFilledDataContainer}>
              <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={2}
              />
              <Text style={[styles.subTitle, {flex: 1}]}>
                <Text style={[styles.title, {fontSize: responsiveHeight(1.6)}]}>
                  {flightName}
                </Text>{' '}
                Flight {moment(ArrDate).format('MMMM D, h:mm a')},
                {flight?.data?.adults} Adults, {flight?.data?.child} Child,{' '}
                {flight?.data?.infant} Infant
              </Text>
            </View>
          );
        })}
        {filterdHotels?.map((hotel, i) => {
          const hotelName =
            hotel?.data?.hotelInfo?.HotelInfoResult?.HotelDetails?.HotelName;
          const hotelDate = hotel?.data?.hotelSearchQuery?.checkInDate;
          return (
            <View style={styles.notFilledDataContainer} key={hotelName}>
              <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={2}
              />
              <Text style={[styles.subTitle, {flex: 1}]}>
                <Text style={[styles.title, {fontSize: responsiveHeight(1.6)}]}>
                  {hotelName}
                </Text>{' '}
                Hotel,
                {moment(hotelDate.seconds * 1000).format('MMMM D, h:mm a')},
                {hotel?.data?.hotelSearchQuery?.hotelRoomArr?.[0]?.adults} Adults,{' '}
                {hotel?.data?.hotelSearchQuery?.hotelRoomArr?.[0]?.child} Child
              </Text>
            </View>
          );
        })}
        {filterdCabs?.map((cab, i) => {
          const cabName = cab?.data?.cabCity;
          const cabDate = cab?.data?.cabStartDate?.seconds * 1000;
          return (
            <View style={styles.notFilledDataContainer}>
              <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={2}
              />
              <Text style={[styles.subTitle, {flex: 1}]}>
                <Text style={[styles.title, {fontSize: responsiveHeight(1.6)}]}>
                  {cabName}
                </Text>{' '}
                Cab, {moment(cabDate).format('MMMM D')},{' '}
                {cab?.data?.selectedTime}
              </Text>
            </View>
          );
        })}
        {filterdBuses?.map((bus, i) => {
          const TravelName = bus?.data?.bus?.TravelName;
          const busDate = bus?.data?.bus?.ArrivalTime;
          const passengers = bus?.data?.passengers;
          return (
            <View style={styles.notFilledDataContainer} key={TravelName}>
              <IconSwitcher
                componentName="Octicons"
                iconName="dot-fill"
                iconsize={2}
              />
              <Text style={[styles.subTitle, {flex: 1}]}>
                <Text style={[styles.title, {fontSize: responsiveHeight(1.6)}]}>
                  {TravelName}
                </Text>{' '}
                Bus, {moment(busDate).format('MMMM D, h:mm a')}, {passengers}{' '}
                Passengers
              </Text>
            </View>
          );
        })}
      </>
    );
  };
  var onBtnClick = async () => {
    const busTravellers = tripData?.data?.bus.every(
      bus =>
        tripData?.data?.travellerDetails &&
        bus.id in tripData?.data?.travellerDetails,
    );
    const cabTravellers = tripData?.data?.cabs.every(
      cab =>
        tripData?.data?.travellerDetails &&
        cab.id in tripData?.data?.travellerDetails,
    );
    const flightTravellers = tripData?.data?.flights.every(
      flight =>
        tripData?.data?.travellerDetails &&
        flight.id in tripData?.data?.travellerDetails,
    );
    const hotelTravellers = tripData?.data?.hotels.every(
      hotel =>
        tripData?.data?.travellerDetails &&
        hotel.id in tripData?.data?.travellerDetails,
    );
    if (busTravellers && cabTravellers && flightTravellers && hotelTravellers) {
      setTraveller(true);
      setTripId(
        tripData?.flights.length > 0
          ? tripData?.flights?.[0]?.id
          : tripData?.hotels.length > 0
          ? tripData.hotels?.[0].id
          : tripData?.cabs.length > 0
          ? tripData?.cabs?.[0].id
          : tripData?.bus.length > 0
          ? tripData?.bus?.[0].id
          : 0,
      );
      var adults =
        tripData?.hotels?.[0]?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
          (acc, obj) => {
            acc.adults += parseInt(obj.adults, 10);
            acc.child += parseInt(obj.child, 10);
            return acc;
          },
          {adults: 0, child: 0},
        );

      setTravellerCount(
        tripData?.flights.length > 0
          ? {
              adults: Number(tripData?.flights?.[0]?.data?.adults),
              child: Number(tripData?.flights?.[0]?.data?.child),
              infant: Number(tripData?.flights?.[0]?.data?.infant),
            }
          : tripData?.hotels.length > 0
          ? adults
          : tripData?.bus?.length > 0
          ? {
              adults: Number(tripData?.bus?.[0]?.data.passengers),
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
      setRequestId(tripData?.requestData?.[0]?.id);
      setRequestData(tripData?.requestData?.[0]?.data);
    } else {
      setIsAddedAlltravellers(true);
    }
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
  const renderItem = ({item, index}) => {
    var airlinename = item.data.flightNew.segments?.[0].airlineName;
    var airline = flightsLogosData?.filter(a => {
      return airlinename.toLowerCase() === a.id;
    });
    var flightArr = [item.data.flight].map((flight, f) => {
      return {
        ...actions.modifyFlightObject(flight),
      };
    });
    var isInternational =
      item.data.flightNew.segments?.[0].destCountryCode !== 'IN' ||
      item.data.flightNew.segments?.[0].originCountryCode !== 'IN';
    return (
      <View>
        {index === 0 ? (
          <Text style={[styles.hotelCardTitle, {textAlign: 'center'}]}>
            Flights
          </Text>
        ) : null}
        <>
          <FCard airline={airline} flightArr={flightArr} flightData={item} />
          <TravDetails id={item.id} isInternational={isInternational} />
        </>
      </View>
    );
  };

  const hotelrenderItem = ({item, index}) => {
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
    } ${checkOutDate.getDate()} ${checkOutDate.getFullYear()}`;
    var adults = item?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
      (acc, obj) => {
        acc.adults += parseInt(obj.adults, 10);
        acc.child += parseInt(obj.child, 10);
        return acc;
      },
      {adults: 0, child: 0},
    );
    return (
      <>
        {index === 0 ? (
          <Text
            style={[
              styles.hotelCardTitle,
              {textAlign: 'center', marginBottom: responsiveHeight(0.5)},
            ]}>
            Hotels
          </Text>
        ) : null}
        <HCard
          hotel={item}
          formattedDate1={formattedCheckInDate}
          endDate={formattedCheckOutDate}
          adults={adults}
          recheck={false}
        />
        <TravDetails id={item.id} />
      </>
    );
  };

  const cabRenderItem = ({item, index}) => {
    var cabSDate = new Date(item.data.cabStartDate.seconds * 1000)
      ?.toString()
      ?.slice(4, 10);

    var cabEDate = item.data.cabEndDate
      ? new Date(item.data.cabEndDate.seconds * 1000)?.toString()?.slice(4, 10)
      : '';
    return (
      <View style={{flex: 1}}>
        {index === 0 ? (
          <Text style={[styles.hotelCardTitle, {textAlign: 'center'}]}>
            Cabs
          </Text>
        ) : null}

        <CCard
          item={item.data.cab}
          startDate={cabSDate}
          endDate={cabEDate}
          data={item.data}
        />
        <TravDetails id={item.id} />
      </View>
    );
  };

  const busRenderItem = ({item, index}) => {
    var cabSDate = item?.data?.bus?.DepartureTime
      ? new Date(item?.data?.bus?.DepartureTime)?.toString()?.slice(4, 10)
      : '';
    var cabEDate = item?.data?.bus?.ArrivalTime
      ? new Date(item?.data?.bus?.ArrivalTime)?.toString()?.slice(4, 10)
      : '';
    return (
      <>
        {index === 0 ? (
          <Text style={[styles.hotelCardTitle, {textAlign: 'center'}]}>
            Bus
          </Text>
        ) : null}

        <BCard
          item={item.data.bus}
          startDate={cabSDate}
          endDate={cabEDate}
          bookingBus={item.data}
        />
        <TravDetails id={item.id} />
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

  const getFileExtension = contentType => {
    switch (contentType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'application/pdf':
        return '.pdf';
      default:
        return '';
    }
  };

  const fetchContentType = async url => {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      return contentType;
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  };

  const downloadFile = async url => {
    const {config, fs} = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir; // this is the Downloads directory.
    const expensesDir = `${DownloadDir}/expenses`;

    const contentType = await fetchContentType(url);
    const ext = getFileExtension(contentType);

    try {
      const exists = await fs.exists(expensesDir);
      if (!exists) {
        await fs.mkdir(expensesDir);
      }
    } catch (err) {
      console.error('Error creating expenses directory:', err);
      Alert.alert('Error', 'Failed to create expenses directory.');
      return;
    }

    const options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${expensesDir}/expense_Receipt${ext}`, // Save to specific path with specific filename and extension
        description: 'Downloading file.',
        title: `Downloading Expense Receipt${ext}`,
        mime: contentType,
        mediaScannable: true,
        notificationOpenOnClick: true,
      },
    };

    try {
      const response = await config(options).fetch('GET', url);

      if (Platform.OS === 'android') {
        // Open the downloaded file with appropriate mime type
        RNFetchBlob.android.actionViewIntent(response.path(), contentType);
      }

      Alert.alert('Success', `File Downloaded Successfully`);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', `File Download Failed: ${error.message}`);
    }
  };

  const checkPermission = async url => {
    if (Platform.OS === 'ios') {
      downloadFile(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download files',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(url);
        } else {
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const downloadDoc = async hotelStatus => {
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
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          let imageUri = response.uri || response.assets?.[0]?.uri;
          setReceipt(imageUri);
        }
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
  const openAllTimeStamps = () => {
    setAllTimeStamp(true);
  };
  const closeAllTimeStamps = () => {
    setAllTimeStamp(false);
  };
  // const finalCost = tripData?.flights?.filter(flight => !flightsIds.includes(flight.id))
  // .reduce((accumulator, flightData) => {
  //   const price = flightData?.data[0]?.finalPrice ?? flightData?.data?.finalPrice ?? 0;
  //   return accumulator + price;
  // }, 0) || 0;
  const price1 =
    tripData?.flights
      ?.filter(flight => requestData?.flights.includes(flight.id))
      .map(
        flightData =>
          flightData?.data?.[0]?.finalPrice ?? flightData?.data?.finalPrice,
      ) || 0;
  const price2 =
    tripData?.hotels
      ?.filter(hotel => requestData?.hotels.includes(hotel.id))
      .map(item => item?.data?.hotelTotalPrice) || 0;
  const price3 =
    tripData?.cabs
      ?.filter(cab => requestData?.cabs.includes(cab.id))
      .map(item => item?.data?.cabTotalPrice) || 0;
  const price4 =
    tripData?.bus
      ?.filter(bus => requestData?.bus.includes(bus.id))
      .map(item => item?.data?.busTotalPrice) || 0;
  const allPrices = [price1, price2, price3, price4];
  const finalCost = allPrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  const notReqprice1 =
    tripData?.flights
      ?.filter(flight => !flightsIds.includes(flight.id))
      .map(
        flightData =>
          flightData?.data?.finalPrice,
      ) || 0;
  const notReqprice2 =
    tripData?.hotels
      ?.filter(hotel => !hotelIds.includes(hotel.id))
      .map(item => item?.data?.hotelTotalPrice) || 0;
  const notReqprice3 =
    tripData?.cabs
      ?.filter(cab => !cabsIds.includes(cab.id))
      .map(item => item?.data?.cabTotalPrice) || 0;
  const notReqprice4 =
    tripData?.bus
      ?.filter(bus => !busIds.includes(bus.id))
      .map(item => item?.data?.busTotalPrice) || 0;
  const notReqallPrices = [
    notReqprice1,
    notReqprice2,
    notReqprice3,
    notReqprice4,
  ];
  const notReqfinalCost = notReqallPrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  const getStatusColour = color => {
    return reqStatuses.find(c => c.status === color) || null;
  };

  const getBookingStatusColour = color => {
    return statuses.find(c => c.status === color) || null;
  };
  const bookingMessage =
    bookingIndex
      .map((ele, index) => {
        return `Booking#${ele + 1}${
          index < bookingIndex.length - 1 ? ',' : ''
        }`;
      })
      .join(' ') + ' Submitted';
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Booking Status',
      text2: bookingMessage,
      position: 'bottom',
      text1Style: {
        fontSize: responsiveHeight(1.8),
      },
      text2Style: {
        fontSize: responsiveHeight(1.6),
      },
    });
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
  var anyNotSubmitted = check.some(book => book === true);
  return tripDataLoading || approvalLoading ? (
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
            <View style={[styles.tripDetailsHeader, {alignSelf: 'flex-start'}]}>
              <Text style={styles.tripName}>{tripData.data?.name}</Text>
              <Text style={styles.tripDateTitle}>
                {`created on: `}
                <Text style={styles.tripDate}>{`${newdate}`}</Text>
              </Text>
            </View>
            {/* bookingStatus */}

            {
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
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}>
                          <Text style={[, {fontSize: responsiveHeight(1.6)}]}>
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
                        </View>
                      ) : null}
                    </>
                  );
                })}
              </View>
            }

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
                            hotelData?.[0]?.date?.seconds * 1000,
                          );

                          const updatedAt = hotelData?.[0]?.updatedAt?.seconds;
                          var hotelUpdatedDate = new Date(updatedAt * 1000);
                          var hotelPrice = 0;
                          var hotelStatus = tripData?.data?.hotels?.filter(
                            f => f.id === hotel.id,
                          );
                          var color = statuses.filter(status => {
                            return status?.status === hotelStatus?.[0]?.status;
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
                              .Images?.[0];
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
                              status?.status === hotelReq?.[0]?.requestStatus
                            );
                          });
                          var originalDate = hotelData?.[0]?.updatedAt
                            ? new Date(hotelData?.[0]?.updatedAt?.seconds * 1000)
                            : new Date(hotelTimeStamp);
                          var threeHoursAfter = new Date(
                            originalDate.getTime() + 3 * 60 * 60 * 1000,
                          );
                          var currentTime = new Date();
                          var isTimeReCheck =
                            hotelData?.[0]?.status === 'Not Submitted'
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
                                    backgroundColor: hotelStatus?.[0]
                                      && getFlightStatusStyle(hotelStatus?.[0].status)
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
                                          backgroundColor: reqColor?.[0]
                                            ? reqColor?.[0].color
                                            : '#808080',
                                        },
                                      ]}>
                                      <Text style={styles.bookingStatusText}>
                                        {hotelReq?.[0]?.requestStatus}
                                      </Text>
                                    </View>
                                  </View>
                                  {hotelStatus?.[0]?.status ? (
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
                                            backgroundColor: color?.[0]
                                              ? color?.[0].color
                                              : '#808080',
                                          },
                                        ]}>
                                        <Text style={styles.bookingStatusText}>
                                          {hotelStatus?.[0]?.status}
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
                                            backgroundColor: color?.[0]
                                              ? color?.[0].color
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
                                  <View
                                    style={[
                                      styles.hotelTotalPriceContainer,
                                      {justifyContent: 'space-between'},
                                    ]}>
                                    <View
                                      style={styles.hotelTotalPriceContainer}>
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
                                    <TouchableOpacity
                                      onPress={() => {
                                        openAllTimeStamps();
                                          setTimeStampData(hotelReq?.[0]);
                                      }}>
                                      <IconSwitcher
                                        componentName="MaterialIcons"
                                        iconName="access-alarm"
                                        color={colors.black}
                                        iconsize={3}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  {hotelStatus?.[0]?.downloadURL ? (
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
                                  {hotelReq?.[0]?.requestStatus ===
                                    'Not Requested' &&
                                  hotelStatus?.[0]?.status === 'Not Submitted' ? (
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
                                  ) : null}
                                </View>
                                <TravellerDetailsBtn
                                  adults={adults?.adults}
                                  eachTripData={hotel}
                                  tripId={id}
                                  child={adults?.child}
                                  status={hotelStatus?.[0]?.status}
                                />
                                 {hotelStatus?.[0]?.note && (
                                <Text>
                                  Note:{hotelStatus?.[0]?.note}
                                </Text>
                              )}
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
                            aflightArr?.[0]?.segments?.[0]?.depTimeDate -
                            bflightArr?.[0]?.segments?.[0]?.depTimeDate
                          );
                        })
                        .map((flight, f) => {
                          var flightStatus = tripData.data.flights.filter(
                            f => f.id === flight.id,
                          );
                          price =price +
                          flight?.data?.totalFare +
                          flight?.data?.gstInFinalserviceCharge +
                          flight?.data?.finalFlightServiceCharge;
                          var hotelTimeStamp = new Date(
                            flightStatus?.[0]?.date?.seconds * 1000,
                          );
                          var fightData = tripData?.data?.flights.filter(
                            f => f.id === flight.id,
                          );
                          const updatedAt = flightStatus?.[0]?.updatedAt?.seconds;
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
                              status?.status === flightReq?.[0]?.requestStatus
                            );
                          });
                          var isInternational =
                            flight.data.flightNew.segments?.[0]
                              .destCountryCode !== 'IN' ||
                            flight.data.flightNew.segments?.[0]
                              .originCountryCode !== 'IN';
                          return (
                            <TripDetailsFlightCard
                                key={`flight-${flight.id}`}
                                flightGrp={[flight.data.flight]}
                                index={f}
                                flightBooking={flight.data}
                                flightStatus={flightStatus?.[0]}
                                flightReq={flightReq}
                                timeStamp={hotelTimeStamp}
                                updatedAt={flightUpdatedDate}
                                reqColor={reqColor}
                                tripId={id}
                                flightId={flight.id}
                                tripsPage={true}
                                downloadUrl={
                                  flightStatus?.[0]?.downloadURL
                                    ? flightStatus?.[0].downloadURL
                                    : undefined
                                }
                                flight={flight}
                                isInternational={isInternational}
                                totalFlight={fightData}
                              />
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
                      <CabCard
                        key={id}
                        item={cab.data.cab}
                        tripsPage={true}
                        startDate={cab.data.cabStartDate}
                        endDate={cab.data.cabEndDate}
                        cabData={cabReq?.[0] ? cabReq?.[0] : null}
                        tripsCabType={cab.data.cabType}
                        cabTotal={cab.data}
                        tripId={id}
                        countCab={cab?.data?.cabCount}
                        totalCab={cab}
                      />
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
                    <BusRenderData
                      key={id}
                      item={bus}
                      tripsPage={true}
                      bookingBus={busData.data}
                      busData={busDataa && busDataa?.[0]}
                      tripId={id}
                      totalBus={busData}
                    />
                  );
                })}
              </>
            ) : null}

            {tripData?.otherBookings ? (
              <>
                <View style={styles.addingHotelBtnContainer}>
                  <Text style={styles.flightCardTitle}>Other Bookings</Text>
                </View>
                {tripData?.otherBookings?.map(other => {
                   price = price + other.data.overallBookingPrice;
                   const otherM = tripData?.data?.otherBookings?.filter(
                    (otherMain) => {
                      return otherMain.id === other.id;
                    }
                  );
                  var color = statuses.filter(status => {
                    return status?.status === otherM?.[0].status;
                  });
                  var reqColor = reqStatuses.filter(status => {
                    return status?.status === otherM?.[0].requestStatus;
                  });
                  return (
                    <View
                      style={[
                        styles.hotelCard,
                        {
                          gap: 5,
                          paddingVertical: responsiveHeight(1.3),
                          paddingHorizontal: 0,
                        },
                      ]} key={other?.data?.bookingDetails}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingLeft: responsiveHeight(1.5),
                        }}>
                        <IconSwitcher
                          componentName="FontAwesome5"
                          iconName="globe"
                          iconsize={4}
                        />
                        <Text
                          style={[
                            styles.hotelCardTitle,
                            {textAlign: 'center', flex: 1},
                          ]}>
                          {other?.data?.bookingType}
                        </Text>
                        <View style={[styles.hotelDates, {marginRight: 0}]}>
                          <Text style={styles.hotelBookedDate}>
                            {other?.data?.bookingDate}
                          </Text>
                        </View>
                      </View>
                      <View style={{paddingHorizontal: responsiveHeight(1.3)}}>
                        <>
                          {/* <Text style={styles.title}>Description :</Text> */}
                          <Text style={styles.subTitle}>
                            {other?.data?.bookingDetails}
                          </Text>
                        </>
                        <View
                          style={[
                            styles.hotelPriceMainContainer,
                            {
                              borderTopWidth: responsiveHeight(0.18),
                              borderBottomWidth: responsiveHeight(0.18),
                            },
                          ]}>
                          <View style={styles.bookingStatusTitlesMainContainer}>
                            <Text
                              style={
                                styles.bookingStatusTitles
                              }>{`Approval Status : `}</Text>
                            <View
                              style={[
                                styles.bookingStatusTextContainer,
                                {
                                  backgroundColor: reqColor?.[0]
                                    ? reqColor?.[0].color
                                    : '#808080',
                                },
                              ]}>
                              <Text style={styles.bookingStatusText}>
                                {otherM?.[0].requestStatus}
                              </Text>
                            </View>
                          </View>
                          <>
                            <View
                              style={styles.bookingStatusTitlesMainContainer}>
                              <Text
                                style={
                                  styles.bookingStatusTitles
                                }>{`Booking Status : `}</Text>
                              <View
                                style={[
                                  styles.bookingStatusTextContainer,
                                  {
                                    backgroundColor: color?.[0]
                                      ? color?.[0].color
                                      : '#808080',
                                  },
                                ]}>
                                <Text style={styles.bookingStatusText}>
                                  {otherM?.[0].status}
                                </Text>
                              </View>
                            </View>
                          </>

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
                                  other?.data?.overallBookingPrice
                              ).toLocaleString('en-IN')}`}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  setOtherPriceInfo(true);
                                  setOtherPrice({
                                    total: other?.data?.overallBookingPrice,
                                    price: other?.data?.bookingCost,
                                    service: other?.data?.bookingService,
                                    gst: other?.data?.bookingGst,
                                  });
                                }}>
                                <IconSwitcher
                                  componentName="Entypo"
                                  iconName="info-with-circle"
                                  color={colors.black}
                                  iconsize={1.8}
                                />
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                            onPress={() => {
                              setAllOtherTimeData(otherM?.[0]);
                              setAllOtherTime(true);
                            }}
                            >
                              <IconSwitcher
                                componentName="MaterialIcons"
                                iconName="access-alarm"
                                color={colors.black}
                                iconsize={3}
                              />
                            </TouchableOpacity>
                          </View>

                        </View>
                      </View>
                    <View style={{paddingHorizontal: responsiveHeight(1.3),marginTop:responsiveHeight(1)}}>
                    {otherM?.[0]?.downloadURL && (
                            <TouchableOpacity
                              style={styles.voucherContainer}
                              onPress={() =>
                                downloadDoc(otherM?.[0]?.downloadURL)
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
                    {otherM?.[0]?.note && (
          <Text>Note:{otherM?.[0]?.note}</Text>
        )}
                    </View>
                    // <></>
                  );
                })}
              </>
            ) : null}

            {/* not required right Now */}
            {/* <>
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
                                checkPermission(expense.data.file)
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
            </> */}
          </View>
        </ScrollView>

        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceTitle}>Total price:</Text>
          <Text style={styles.totalPrice}>{`₹ ${Math.ceil(price).toLocaleString(
            'en-IN',
          )}`}</Text>
             {tripData?.data?.flights?.some(
              (flight) => flight?.status === "Not Submitted"
            ) ||
            tripData?.data?.hotels?.some(
              (hotel) => hotel.status === "Not Submitted"
            ) ||
            tripData?.data?.cabs?.some(
              (cab) => cab.status === "Not Submitted"
            ) ||
            tripData?.data?.bus?.some(
              (bus) => bus.status === "Not Submitted"
            ) ? (
              <>
                {tripData?.data?.flights.every((flight) => {
                  const matchingFlight = tripData?.data?.flights.find(
                    (f) => f.id === flight.id
                  );

                  if (!matchingFlight) return false;

                  const flightTimeStamp = matchingFlight?.updatedAt
                    ? new Date(matchingFlight.updatedAt.seconds * 1000)
                    : new Date(matchingFlight?.date?.seconds * 1000);

                  const threeHoursAfter = new Date(
                    flightTimeStamp.getTime() + 3 * 60 * 60 * 1000
                  );

                  const currentTime = new Date();

                  const isTimeReCheck =
                    matchingFlight?.status === "Submitted" ||
                    matchingFlight?.status === "Booked"||
                     matchingFlight?.status === "Cancelled"
                      ? true
                      : currentTime < threeHoursAfter;
                  return isTimeReCheck;
                }) &&
                tripData?.data?.hotels.every((hotel) => {
                  const matchingHotel = tripData?.data?.hotels.find(
                    (h) => h.id === hotel.id
                  );

                  if (!matchingHotel) return false;

                  const hotelTimeStamp = matchingHotel?.updatedAt
                    ? new Date(matchingHotel.updatedAt.seconds * 1000)
                    : new Date(matchingHotel?.date?.seconds * 1000);

                  const threeHoursAfter = new Date(
                    hotelTimeStamp.getTime() + 3 * 60 * 60 * 1000
                  );

                  const currentTime = new Date();

                  const isTimeReCheck =
                    matchingHotel?.status === "Submitted" ||
                    matchingHotel?.status === "Booked"||
                    matchingHotel?.status === "Cancelled"
                      ? true
                      : currentTime < threeHoursAfter;
                  return isTimeReCheck;
                }) ? (
                  <TouchableOpacity
                    style={styles.proceedToBookingBtn}
                    onPress={onBtnClick}>
                    <Text style={styles.proceedToBookingBtnTitle}>
                      Proceed to Booking
                    </Text>
                  </TouchableOpacity>
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
                &#8377; {`${Math.ceil(hotelFinalPrice?.hotelFinalPrice)} `}
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
                + &#8377;{Math.ceil(hotelFinalPrice.hotelServiceCharge)}
              </Text>
            </View>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={styles.popUproomserviceChargesTitle}>GST</Text>
              <Text
                style={[
                  styles.popUproomserviceChargesTitle,
                  {color: colors.highlight},
                ]}>
                + &#8377;{Math.ceil(hotelFinalPrice?.calculateGstFromService)}
              </Text>
            </View>
            <View style={styles.popUpHotelPriceDescriptionContaioner}>
              <Text style={[styles.totalPrice, {color: colors.primary}]}>
                Total price:
              </Text>
              <Text style={styles.totalPrice}>
                &#8377;{' '}
                {`${Math.ceil(hotelTotalPrice).toLocaleString('en-IN')} `}
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

        <PopUp
          value={traveller}
          handlePopUpClose={() => {
            setTraveller(!traveller);
            handleSelectedTab('travellers');
            setViewComments(false);
            setBookingNumber(0);
          }}
          PopUpheight={{height: responsiveHeight(100)}}>
          <View>
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
                  Trip Summary
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
                  Submit and Approval
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
                  Submit for Booking
                </Text>
              </TouchableOpacity>
            </View>

            {selectedTab === 'travellers' ? (
              <>
                <View style={styles.approvalMainContainer}>
                  <View style={styles.approvalSubContainer}>
                    

                   
                    {tripData?.requestData?.length > 0 ? (
                      <>
                        {tripData?.requestData?.map((request, index) => {
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
                                  setBookingNumber(index);
                                }}>
                                {request.data.flights?.length > 0 ? (
                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeApprovalRequestDataTitle
                                        : styles.approvalRequestDataTitle
                                    }>
                                    {request.data.flights.length}&nbsp;
                                    {request.data.flights.length > 1
                                      ? 'Flights'
                                      : 'Flight'}
                                  </Text>
                                ) : null}
                                {request.data.hotels?.length > 0 ? (
                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeApprovalRequestDataTitle
                                        : styles.approvalRequestDataTitle
                                    }>
                                    {request.data.hotels.length}&nbsp;
                                    {request.data.hotels.length > 1
                                      ? 'Hotels'
                                      : 'Hotel'}
                                  </Text>
                                ) : null}
                                {request.data.cabs?.length > 0 ? (
                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeApprovalRequestDataTitle
                                        : styles.approvalRequestDataTitle
                                    }>
                                    {request.data.cabs.length}&nbsp;
                                    {request.data.cabs.length > 1
                                      ? 'Cabs'
                                      : 'Cab'}
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
                     {
                      <>
                        {tripData?.hotels?.filter(
                          hotel => !hotelIds.includes(hotel.id),
                        )?.length > 0 ||
                        tripData?.flights?.filter(
                          hotel => !flightsIds.includes(hotel.id),
                        )?.length > 0 ||
                        tripData?.cabs?.filter(
                          hotel => !cabsIds.includes(hotel.id),
                        )?.length > 0 ||
                        tripData?.bus?.filter(
                          hotel => !busIds.includes(hotel.id),
                        )?.length > 0 ? (
                          <TouchableOpacity
                            style={
                              !requestData && !requestId
                                ? styles.activeApprovalNotRequestDataContainer
                                : styles.approvalNotRequestDataContainer
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
                            <Text
                            style={
                              !requestData && !requestId
                                ? [styles.activeReqTitle,{fontFamily:fonts.title}]
                                : [styles.reqTitle,{fontFamily:fonts.title}]
                            }>
                            Click here to Select
                          </Text>
                          </TouchableOpacity>
                        ) : null}
                      </>
                    }
                  </View>

                  <View
                    style={{
                      width: '82%',
                      paddingHorizontal: responsiveWidth(2),
                    }}>
                    {tripData?.requestData?.length > 0 &&
                    requestData &&
                    requestId ? (
                      <>
                        {/* Requested */}

                        <View style={{marginBottom: responsiveHeight(1)}}>
                          <View style={{gap: responsiveHeight(0.5)}}>
                            <Text style={styles.title}>{`Booking#${
                              bookingNumber + 1
                            }`}</Text>
                            <View
                              style={styles.bookingStatusTitlesMainContainer}>
                              <Text
                                style={
                                  styles.subTitle
                                }>{`Approval Status : `}</Text>
                              <View
                                style={[
                                  styles.bookingStatusTextContainer,
                                  {
                                    backgroundColor: getStatusColour(
                                      requestData?.status,
                                    ).color,
                                  },
                                ]}>
                                <Text style={styles.bookingStatusText}>
                                  {requestData?.status}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={styles.bookingStatusTitlesMainContainer}>
                              <Text
                                style={
                                  styles.subTitle
                                }>{`Booking Status : `}</Text>
                              <View
                                style={[
                                  styles.bookingStatusTextContainer,
                                  {
                                    backgroundColor: getBookingStatusColour(
                                      tripData?.data?.bookings[bookingNumber]
                                        ?.submissionStatus,
                                    ).color,
                                  },
                                ]}>
                                <Text style={styles.bookingStatusText}>
                                  {
                                    tripData?.data?.bookings[bookingNumber]
                                      ?.submissionStatus
                                  }
                                </Text>
                              </View>
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
                                {Math.ceil(
                                  tripData.flights
                                    .filter((flight) =>
                                      requestData?.flights?.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) => sum +(obj?.data?.totalFare +
                                        obj?.data?.finalFlightServiceCharge +
                                        obj?.data?.gstInFinalserviceCharge),
                                      0
                                    ) +
                                    tripData.hotels
                                      .filter((flight) =>
                                        requestData?.hotels?.includes(flight.id)
                                      )
                                      .reduce(
                                        (sum, obj) =>
                                          sum + obj?.data?.hotelTotalPrice,
                                        0
                                      ) +
                                    tripData.cabs
                                      .filter((flight) =>
                                        requestData?.cabs?.includes(flight.id)
                                      )
                                      .reduce(
                                        (sum, obj) =>
                                          sum + obj?.data?.cabTotalPrice,
                                        0
                                      ) +
                                    tripData.bus
                                      .filter((flight) =>
                                        requestData?.bus?.includes(flight.id)
                                      )
                                      .reduce(
                                        (sum, obj) =>
                                          sum + obj?.data?.busTotalPrice,
                                        0
                                      )
                                )}
                              </Text>
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: responsiveHeight(1),
                            flexWrap: 'wrap',
                            marginBottom: responsiveHeight(1),
                          }}>
                          {tripData?.hotels?.filter(hotel =>
                            requestData?.hotels.includes(hotel.id),
                          )?.length > 0 ? (
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
                                Hotels -{' '}
                                {
                                  tripData?.hotels?.filter(hotel =>
                                    requestData?.hotels.includes(hotel.id),
                                  )?.length
                                }
                              </Text>
                            </View>
                          ) : null}
                          {tripData?.flights?.filter(hotel =>
                            requestData?.flights.includes(hotel.id),
                          )?.length > 0 ? (
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
                                Flights -{' '}
                                {
                                  tripData?.flights?.filter(hotel =>
                                    requestData?.flights.includes(hotel.id),
                                  )?.length
                                }
                              </Text>
                            </View>
                          ) : null}

                          {tripData?.cabs?.filter(cab =>
                            requestData?.cabs.includes(cab.id),
                          )?.length > 0 ? (
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
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
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]} >
                                Bus -{' '}
                                {
                                  tripData?.bus?.filter(bus =>
                                    requestData?.bus.includes(bus.id),
                                  )?.length
                                }
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {/* <View style={{gap: responsiveHeight(2)}}> */}
                        <FlatList
                          data={tripData?.flights?.filter(flight =>
                            requestData?.flights.includes(flight.id),
                          )}
                          renderItem={renderItem}
                          keyExtractor={(item, index) => index.toString()}
                        />

                        <FlatList
                          data={tripData?.hotels?.filter(hotel =>
                            requestData?.hotels.includes(hotel.id),
                          )}
                          renderItem={hotelrenderItem}
                          keyExtractor={(item, index) => index.toString()}
                        />
                        <FlatList
                          data={tripData?.cabs?.filter(cab =>
                            requestData?.cabs.includes(cab.id),
                          )}
                          renderItem={cabRenderItem}
                          keyExtractor={(item, index) => index.toString()}
                          scrollEnabled={false}
                        />
                        <FlatList
                          data={tripData?.bus?.filter(bus =>
                            requestData?.bus.includes(bus.id),
                          )}
                          renderItem={busRenderItem}
                          keyExtractor={(item, index) => index.toString()}
                        />
                        {/* </View> */}
                      </>
                    ) : (
                      <>
                        {/* not Requested */}

                        <View style={{marginBottom: responsiveHeight(1)}}>
                          {/* <Text style={styles.subTitle}>
                            Created on:
                            <Text
                              style={[
                                styles.subTitle,
                                {color: colors.highlight},
                              ]}>{` ${newdate}`}</Text>
                          </Text> */}
                          <Text style={styles.title}>
                            Total price:
                            <Text
                              style={[styles.title, {color: colors.secondary}]}>
                              {' '}
                              &#8377;{' '}
                              {/* {`${Math.ceil(notReqfinalCost).toLocaleString(
                                'en-IN',
                              )} `} */}
                               {Math.ceil(
                                tripData?.flights
                                  ?.filter(
                                    (flight) => !flightsIds?.includes(flight.id)
                                  )
                                  .reduce(
                                    (sum, obj) => sum +(obj?.data?.totalFare +
                                      obj?.data?.finalFlightServiceCharge +
                                      obj?.data?.gstInFinalserviceCharge),
                                    0
                                  ) +
                                  tripData?.hotels
                                    ?.filter(
                                      (flight) => !hotelIds.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum + obj?.data?.hotelTotalPrice,
                                      0
                                    ) +
                                  tripData?.cabs
                                    ?.filter(
                                      (flight) => !cabsIds?.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum + obj?.data?.cabTotalPrice,
                                      0
                                    ) +
                                  tripData?.bus
                                    ?.filter(
                                      (flight) => !busIds?.includes(flight.id)
                                    )
                                    .reduce(
                                      (sum, obj) =>
                                        sum + obj?.data?.busTotalPrice,
                                      0
                                    )
                              )}
                            </Text>
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: responsiveHeight(1),
                            flexWrap: 'wrap',
                            marginBottom: responsiveHeight(1),
                          }}>
                          {tripData?.hotels?.filter(
                            hotel => !hotelIds.includes(hotel.id),
                          )?.length > 0 ? (
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
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
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
                                Flights -{' '}
                                {
                                  tripData?.flights?.filter(
                                    hotel => !flightsIds.includes(hotel.id),
                                  )?.length
                                }
                              </Text>
                            </View>
                          ) : null}

                          {tripData?.cabs?.filter(
                            cab => !cabsIds.includes(cab.id),
                          )?.length > 0 ? (
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
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
                            <View style={[styles.btn,{backgroundColor:colors.white,borderWidth:1}]}>
                              <Text style={[styles.btnTitle,{color:colors.black}]}>
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

                        {/* <View style={{gap: responsiveHeight(2)}}> */}
                        <FlatList
                          data={tripData?.flights?.filter(
                            flight => !flightsIds.includes(flight.id),
                          )}
                          renderItem={renderItem}
                          keyExtractor={(item, index) => index.toString()}
                        />

                        <FlatList
                          data={tripData?.hotels?.filter(
                            hotel => !hotelIds.includes(hotel.id),
                          )}
                          renderItem={hotelrenderItem}
                          keyExtractor={(item, index) => index.toString()}
                        />

                        <FlatList
                          data={tripData?.cabs?.filter(
                            cab => !cabsIds.includes(cab.id),
                          )}
                          renderItem={cabRenderItem}
                          keyExtractor={(item, index) => index.toString()}
                          scrollEnabled={false}
                        />
                        <FlatList
                          data={tripData?.bus?.filter(
                            bus => !busIds.includes(bus.id),
                          )}
                          renderItem={busRenderItem}
                          keyExtractor={(item, index) => index.toString()}
                        />
                        {/* </View> */}
                      </>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: colors.highlightLite,
                    paddingRight: responsiveHeight(2),
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
                    {/* {approvalError && (
                      <Text style={[styles.title, {color: colors.red}]}>
                        Approval is Mandatory
                      </Text>
                    )} */}
                    <TouchableOpacity
                      style={[styles.btn]}
                      onPress={() => {
                        setSelectedTab('approval');
                      }}>
                      <Text style={[styles.subTitle, {color: colors.white}]}>
                        Next
                      </Text>
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
                    {/* <ScrollView> */}
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
                                  setViewComments(false);
                                  setMandatoryError('');
                                }}>
                                {request.data.flights?.length > 0 ? (
                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeApprovalRequestDataTitle
                                        : styles.approvalRequestDataTitle
                                    }>
                                    {request.data.flights.length}&nbsp;
                                    {request.data.flights.length > 1
                                      ? 'Flights'
                                      : 'Flight'}
                                  </Text>
                                ) : null}
                                {request.data.hotels?.length > 0 ? (
                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeApprovalRequestDataTitle
                                        : styles.approvalRequestDataTitle
                                    }>
                                    {request.data.hotels.length}&nbsp;
                                    {request.data.hotels.length > 1
                                      ? 'Hotels'
                                      : 'Hotel'}
                                  </Text>
                                ) : null}
                                {request.data.cabs?.length > 0 ? (
                                  <Text
                                    style={
                                      requestId === request.id
                                        ? styles.activeApprovalRequestDataTitle
                                        : styles.approvalRequestDataTitle
                                    }>
                                    {request.data.cabs.length}&nbsp;
                                    {request.data.cabs.length > 1
                                      ? 'Cabs'
                                      : 'Cab'}
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
                        hotel => !cabsIds.includes(hotel.id),
                      )?.length > 0 ||
                      tripData?.bus?.filter(hotel => !busIds.includes(hotel.id))
                        ?.length > 0 ? (
                        <TouchableOpacity
                        style={
                          !requestData && !requestId
                            ? styles.activeApprovalNotRequestDataContainer
                            : styles.approvalNotRequestDataContainer
                        }
                          onPress={() => {
                            setRequestData(null);
                            setRequestId(null);
                            setViewComments(false);
                            setMandatoryError('');
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
                          <Text
                            style={
                              !requestData && !requestId
                                ? [styles.activeReqTitle,{fontFamily:fonts.title}]
                                : [styles.reqTitle,{fontFamily:fonts.title}]
                            }>
                           Click here to select
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                    {/* </ScrollView> */}
                  </View>

                  <View style={{flex: 1}}>
                    {/* <ScrollView> */}
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
                            Approval request
                          </Text>
                          {
                            userAccountDetails?.manager ? (
                              <>
                                <Text
                                  style={
                                    styles.subTitle
                                  }>{`Approver Name : `}</Text>
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
                                          <View style={styles.statusContainer}>
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
                                          {userAccountDetails.approvalType ===
                                            'Mandatory' && (
                                            <Text style={styles.subTitle}>
                                              Your trip is submitted for
                                              approval
                                            </Text>
                                          )}
                                          <View style={styles.statusContainer}>
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
                                          {viewComments && (
                                            <View
                                              style={{
                                                marginTop: responsiveHeight(1),
                                              }}>
                                              <Text
                                                style={[
                                                  styles.subTitle,
                                                  {color: colors.red},
                                                ]}>
                                                *Comment :{' '}
                                                <Text style={styles.subTitle}>
                                                  {requestData?.managerComment}
                                                </Text>
                                              </Text>
                                            </View>
                                          )}
                                          <TouchableOpacity
                                            onPress={() =>
                                              setViewComments(!viewComments)
                                            }
                                            style={{alignSelf: 'center'}}>
                                            <IconSwitcher
                                              componentName="Entypo"
                                              iconName={
                                                viewComments
                                                  ? 'chevron-small-up'
                                                  : 'chevron-small-down'
                                              }
                                              iconsize={3}
                                            />
                                          </TouchableOpacity>
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
                                        onPress={() =>
                                          handleManagerClick('Pending')
                                        }>
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
                                            <Text style={styles.subTitle}>
                                              Approval is mandatory.Please send
                                              the trip for approval.
                                            </Text>
                                            <View
                                              style={{
                                                flexDirection: 'row',
                                              }}>
                                              <Text
                                                style={[
                                                  styles.subTitle,
                                                  {color: colors.red},
                                                ]}>
                                                Note:{' '}
                                              </Text>
                                              <Text style={styles.subTitle}>
                                                Trip will be booked only after
                                                approval.
                                              </Text>
                                            </View>
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
                                {/* comments */}
                                {/* <>
                                    <Text>Comments</Text>
                                    <TextInput
                                                    editable
                                                    multiline
                                                    numberOfLines={3}
                                                    placeholder='Enter name of your trip'
                                                    style={styles.multiTextContainer}
                                                    // value={defaultInput}
                                                    // onChangeText={handleInputChange}
                                                     />
                                    </> */}
                              </>
                            ) : null
                            // (
                            //   <View>
                            //     <Text>No manager assigned</Text>
                            //   </View>
                            // )
                          }
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
                            Approval request
                          </Text>
                          {Object.keys(userAccountDetails?.manager).length >
                          0 ? (
                            <>
                              <Text
                                style={
                                  styles.subTitle
                                }>{`Approver Name : `}</Text>
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
                                        <View style={styles.statusContainer}>
                                          <Text style={styles.subTitle}>
                                            Status:
                                          </Text>
                                          <Text
                                            style={
                                              requestData?.status === 'Pending'
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
                                          Your trip is submitted for approval
                                        </Text>
                                        <View style={styles.statusContainer}>
                                          <Text style={styles.subTitle}>
                                            Status:
                                          </Text>
                                          <Text
                                            style={
                                              requestData?.status === 'Pending'
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
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: responsiveHeight(1),
                                      }}>
                                      <TouchableOpacity
                                        style={styles.btn}
                                        onPress={() =>
                                          handleManagerClick('Pending')
                                        }>
                                        <Text
                                          style={[
                                            styles.subTitle,
                                            {color: colors.white},
                                          ]}>
                                          Yes
                                        </Text>
                                      </TouchableOpacity>
                                      {userAccountDetails.approvalType ===
                                        'Non Mandatory' && (
                                        <TouchableOpacity
                                          style={styles.btn}
                                          onPress={() =>
                                            handleManagerClick('Skipped')
                                          }>
                                          <Text
                                            style={[
                                              styles.subTitle,
                                              {color: colors.white},
                                            ]}>
                                            Skip
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                    {/* <Text style={styles.title}>OR</Text> */}
                                    {/* <Text style={styles.subTitle}>
                                          Continue booking without Approval
                                        </Text> */}
                                    <>
                                      {userAccountDetails.approvalType ===
                                      'Mandatory' ? (
                                        <>
                                          <Text style={styles.subTitle}>
                                            Approval is mandatory.Please send
                                            the trip for approval.
                                          </Text>
                                          <View style={{flexDirection: 'row'}}>
                                            <Text
                                              style={[
                                                styles.subTitle,
                                                {color: colors.red},
                                              ]}>
                                              Note:
                                            </Text>
                                            <Text style={styles.subTitle}>
                                              Trip will be booked only after
                                              approval.
                                            </Text>
                                          </View>
                                        </>
                                      ) : (
                                        <Text style={styles.subTitle}>
                                          Continue booking without Approval
                                        </Text>
                                      )}
                                    </>
                                    {/* comments */}
                                    <View
                                      style={{
                                        width: '100%',
                                        gap: responsiveHeight(1),
                                      }}>
                                      <Text style={[styles.title,{fontSize:responsiveHeight(1.3)}]}>Comments/special requests/(this will be
                                        viewed by the approver)</Text>
                                      <TextInput
                                        editable
                                        multiline
                                        numberOfLines={1}
                                        placeholder="Comments"
                                        style={styles.multiTextContainer}
                                        value={managerComment}
                                        onChangeText={e => setManagerComment(e)}
                                      />
                                    </View>
                                  </>
                                )}
                              </>
                            </>
                          ) : (
                            <View>
                              <Text>No Approver assigned</Text>
                              <View style={{alignSelf:'flex-start',width:'100%',flexDirection:'row',gap:responsiveHeight(1),marginTop:responsiveHeight(1)}}>
                            <TouchableOpacity style={styles.btn} onPress={()=>{navigate("Role"),setTraveller(!traveller)}}>
                                <Text style={styles.btnTitle}>Assign Approver</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.btn} onPress={() => handleManagerClick("Skipped")}>
                                <Text style={styles.btnTitle}>Skip</Text>
                              </TouchableOpacity>
                            </View>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                    {/* </ScrollView> */}
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: colors.highlightLite,
                    paddingRight: responsiveHeight(2),
                    paddingVertical: responsiveHeight(1),
                    borderRadius: responsiveHeight(1),
                    marginTop: responsiveHeight(2),
                    paddingLeft: responsiveHeight(0.5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      gap: responsiveHeight(1),
                      alignItems: 'center',
                    }}>
                    {approvalError && (
                      <Text
                        style={[styles.title, {color: colors.red, flex: 1}]}>
                        {mandatoryError}
                      </Text>
                    )}
                    <TouchableOpacity
                      style={[styles.btn]}
                      onPress={() => {
                        setSelectedTab('travellers');
                        setRequestData(tripData?.requestData?.[0]?.data);
                        setRequestId(tripData?.requestData?.[0]?.id);
                        setBookingNumber(0);
                      }}>
                      <Text style={[styles.subTitle, {color: colors.white}]}>
                        Previous
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn]}
                      onPress={() => {
                        // if (userAccountDetails.approvalType !== 'Mandatory') {
                        //   setSelectedTab('payment');
                        // } else if (
                        //   requestData?.status !== undefined &&
                        //   userAccountDetails.approvalType === 'Mandatory'
                        // ) {
                        //   setSelectedTab('payment');
                        // } else {
                        //   setApprovalError(true);
                        // }
                        if (
                          requestData?.status !== 'Pending' &&
                          requestData?.status !== 'Skipped'&&requestData?.status !== 'Approved'
                        ) {
                          setApprovalError(true);
                          setMandatoryError(errorMessage);
                        } else {
                          setSelectedTab('payment');
                        }
                        const total = tripData?.data?.bookings?.reduce((total, book) => {
                          if (book.submissionStatus !== "Submitted") {
                            return total + Math.round(book.bookingPrice);
                          }
                          return total;
                        }, 0);
                        setBookingPrice(total)
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
                      {userAccountDetails?.accountType === 'PrePaid' ? (
                        <Text
                          style={[
                            styles.title,
                            {fontSize: responsiveHeight(2)},
                          ]}>
                          Complete the payment
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.title,
                            {fontSize: responsiveHeight(2)},
                          ]}>
                          Submit the trip for booking.
                        </Text>
                      )}
                      {userAccountDetails?.accountType === 'PrePaid' && (
                        <Text
                          style={[
                            styles.subTitle,
                            {fontSize: responsiveHeight(1.7)},
                          ]}>
                          Select the trips you want to complete the payment
                        </Text>
                      )}
                    </View>

                    <View style={{marginTop: responsiveHeight(1)}}>
                      {userAccountDetails.approvalType === 'Mandatory' && (
                        <Text
                          style={[
                            styles.subTitle,
                            {fontSize: responsiveHeight(1.7)},
                          ]}>
                          <Text style={{color: colors.red}}>Note: </Text>
                          Trip will be booked only after approval. 
                        </Text>
                      )}
                    </View>
                    <>
                      {tripData?.data?.bookings?.map((book, i) => {
                        return (
                          <View
                            style={
                              book.submissionStatus === 'Submitted'
                                ? styles.isActivePaymentCard
                                : styles.paymentCard
                            } key={book.bookingPrice}>
                            <View style={{flexDirection: 'row'}}>
                              <View>
                                {book.submissionStatus === 'Submitted' ? (
                                  <IconSwitcher
                                    componentName="MaterialIcons"
                                    iconName={'check-box'}
                                    color={colors.gray}
                                    iconsize={2.5}
                                  />
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleCheckboxChange(book, i);
                                    }}
                                    disabled={
                                      book.submissionStatus === 'Submitted'
                                    }>
                                    <IconSwitcher
                                      componentName="MaterialIcons"
                                      iconName={
                                        check[i]
                                          ? 'check-box'
                                          : 'check-box-outline-blank'
                                      }
                                      color={
                                        check[i]
                                          ? colors.facebook
                                          : colors.black
                                      }
                                      iconsize={2.5}
                                    />
                                  </TouchableOpacity>
                                )}
                              </View>
                              <View
                                style={styles.paymentCheckBoxTitleConatiner}>
                                <Text style={styles.title}>
                                  Booking {i + 1}
                                </Text>
                              </View>
                            </View>
                            {book.flights.length > 0 && (
                              <Text style={styles.subTitle}>
                                {book.flights.length} Flights,
                              </Text>
                            )}
                            {book.hotels.length > 0 && (
                              <Text style={styles.subTitle}>
                                {book.hotels.length} Hotels,
                              </Text>
                            )}
                            {book.cabs.length > 0 && (
                              <Text style={styles.subTitle}>
                                {book.cabs.length} Cabs,
                              </Text>
                            )}
                            {book.bus.length > 0 && (
                              <Text style={styles.subTitle}>
                                {book.bus.length} Buses
                              </Text>
                            )}
                            <View>
                              {book.submissionStatus === 'Submitted' ? (
                                <>
                                  <TouchableOpacity
                                    style={{
                                      alignSelf: 'center',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                    onPress={() => handleviewPaymentComment(i)}>
                                    <Text>
                                      {viewpaymentComments[i]
                                        ? 'Close Comment'
                                        : 'View Comment'}
                                    </Text>
                                    <IconSwitcher
                                      componentName="Entypo"
                                      iconName={
                                        viewpaymentComments[i]
                                          ? 'chevron-small-up'
                                          : 'chevron-small-down'
                                      }
                                      iconsize={3}
                                    />
                                  </TouchableOpacity>
                                  {viewpaymentComments[i] && (
                                    <>
                                      <Text>Comments :</Text>
                                      <Text>{book.adminComment}</Text>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                <Text style={styles.subTitle}>* This will be viewed by Tripbizz team</Text>
                                <TextInput
                                  editable
                                  multiline
                                  numberOfLines={1}
                                  placeholder="Enter the Comment"
                                  style={[
                                    styles.multiTextContainer,
                                    {
                                      borderRadius: 0,
                                      fontSize: responsiveHeight(1.6),
                                      marginTop:responsiveHeight(1)
                                    },
                                  ]}
                                  // value={}
                                  onChangeText={e => handleCommentChange(i, e)}
                                />
                                </>
                              )}
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-end',
                              }}>
                              <Text
                                style={[
                                  styles.totalPrice,
                                  {fontSize: responsiveHeight(1.5)},
                                ]}>
                                Total :
                              </Text>
                              <Text
                                style={[
                                  styles.totalPrice,
                                  {fontSize: responsiveHeight(1.5)},
                                ]}>
                                {Math.ceil(book.bookingPrice).toLocaleString()}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </>
                   

                    {/* Showing Balance */}
                    <View
                      style={{
                        alignItems: 'center',
                        gap: responsiveHeight(1),
                      }}>
                      {userAccountDetails?.accountType === 'PrePaid' ? (
                        <>
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
                        </>
                      ) : null}
                      {anyNotSubmitted? (
                        <>
                          {userAccountDetails.accountType === 'PostPaid' ? (
                            <View  style={{
                              alignItems: 'center',
                              gap: responsiveHeight(2),
                              flexDirection: 'row',
                            }}>
                              <TouchableOpacity
                                onPress={() => setSelectedTab('approval')}
                                style={[
                                  styles.btn,
                                  {
                                    paddingVertical: responsiveHeight(1),
                                  }
                                ]}>
                                <Text style={styles.btnTitle}>Previous</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.btn,
                                  {
                                    paddingVertical: responsiveHeight(1),
                                  },
                                ]}
                                onPress={handleClick}>
                                {!paymentLoading ? (
                                  <Text style={[styles.btnTitle]}>
                                    Submit for Booking
                                  </Text>
                                ) : (
                                  <ActivityIndicator
                                    size={'small'}
                                    color={colors.facebook}
                                  />
                                )}
                              </TouchableOpacity>
                            </View>
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
                                    onPress={() => navigate('WalletStack')}>
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
                                    flexDirection: 'row',
                                  }}>
                                  {/* <Text
                                      style={[
                                        styles.subTitle,
                                        {fontSize: responsiveHeight(1.8)},
                                      ]}>
                                      Complete the payment
                                    </Text> */}
                                  <TouchableOpacity
                                    onPress={() => setSelectedTab('approval')}
                                    style={[
                                      styles.btn,
                                      {paddingVertical: responsiveHeight(1)},
                                    ]}>
                                    <Text style={styles.btnTitle}>
                                      Previous
                                    </Text>
                                  </TouchableOpacity>
                                  {(selectedItems.buses ||
                                    selectedItems.cabs ||
                                    selectedItems.flights ||
                                    selectedItems.hotels) && (
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
                                            // {width: responsiveHeight(15)},
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
                                  )}
                                </View>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <View>
                          <Text style={[styles.subTitle, {color: colors.red}]}>
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
             {!isAnySelected && (
                 <View style={{marginTop:responsiveHeight(1),alignItems:'center',justifyContent:'center'}}>
                   <Text style={[styles.subTitle, {color: colors.red}]}>
                    Select Any Booking to submit
                  </Text>
                 </View>
                )}
          </View>
        </PopUp>
        {/* Rechecking Hotels */}
        <PopUp
          value={openPriceReCheck}
          handlePopUpClose={() => setOpenPriceReCheck(false)}>
          {/* <View style={styles.recheckCard}> */}
          <HCard
            hotel={hotelDetails}
            formattedDate1={formatDate}
            endDate={hotelEndDate}
            adults={hotelAdults}
            recheck={false}
          />
          {/* </View> */}

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
                    hotelData?.[0]?.date?.seconds * 1000,
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
                    hotelData?.[0]?.date?.seconds * 1000,
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
                    <Text style={styles.title} key={`data_${ind+1}`}>
                      {`${ind + 1} . ${
                        flight.data.flightNew.segments?.[0].destCityName
                      } to ${flight.data.flightNew.segments?.[0].originCityName}`}
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
                  hotelData?.[0]?.date?.seconds * 1000,
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
                    hotelData?.[0]?.date?.seconds * 1000,
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

        <PopUp
          value={isAddedAlltravellers}
          handlePopUpClose={() => {
            setIsAddedAlltravellers(false);
          }}>
          <View style={{gap: responsiveHeight(1)}}>
            <Text style={[styles.title, {fontSize: responsiveHeight(1.8)}]}>
              Please add traveller details for below flights/Hotels/Cabs/Buses
            </Text>
            {NotFilledData()}
          </View>
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
              {timeStampDate?.date &&
                moment(timeStampDate?.date?.seconds * 1000).format(
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
              {timeStampDate?.manager_request_time
                ? moment(timeStampDate?.manager_request_time * 1000).format(
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
              {timeStampDate?.managerApprovedTime
                ? moment(
                    timeStampDate?.managerApprovedTime?.seconds * 1000,
                  ).format('MMMM D, h:mm a')
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
              {timeStampDate?.submitted_date
                ? moment(timeStampDate?.submitted_date?.seconds * 1000).format(
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
              {timeStampDate?.booked_date
                ? moment(timeStampDate?.booked_date?.seconds * 1000).format(
                    'MMMM D, h:mm a',
                  )
                : 'Not Booked'}
            </Text>
          </View>
        </PopUp>
        {/* otherPriceInfo */}
        <PopUp value={otherPriceInfo} handlePopUpClose={() => {
          setOtherPriceInfo(false);
        }}>
<View style={styles.priceInfo}>
          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>Price</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight}]}>
              &#8377;
              {` ${otherPrice?.price}`}
            </Text>
          </View>
          <View style={styles.horizentalLine} />
          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>Service Charges</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight,fontSize:responsiveHeight(1.8)}]}>
              + &#8377;
              {otherPrice?.service}
            </Text>
          </View>

          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>GST</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight,fontSize:responsiveHeight(1.8)}]}>
              + &#8377;
                {Math.ceil(otherPrice?.gst)}
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
              {` ${Math.ceil(otherPrice?.total).toLocaleString(
                'en-IN',
              )}`}
            </Text>
          </View>
        </View>
        </PopUp>
       {/* OtherBookingsalltimeStamps */}
        <PopUp value={allotherTime} handlePopUpClose={() => setAllOtherTime(false)}>
          <View style={styles.timeStampsContainer}>
            <IconSwitcher
              componentName="Octicons"
              iconName="dot-fill"
              iconsize={1.8}
            />
            <Text style={styles.timeStampsTitles}>Added Date :</Text>
            <Text style={styles.timeStampsTitles}>
              {allotherTimeData?.date &&
                moment(allotherTimeData?.date?.seconds * 1000).format(
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
              {allotherTimeData?.date ?
                moment(allotherTimeData?.date?.seconds * 1000).format(
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
              {allotherTimeData?.managerApprovedTime
                ? moment(
                  allotherTimeData?.managerApprovedTime?.seconds * 1000,
                  ).format('MMMM D, h:mm a')
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
              {allotherTimeData?.date ?
                moment(allotherTimeData?.date?.seconds * 1000).format(
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
              {timeStampDate?.booked_date
                ? moment(allotherTimeData?.booked_date?.seconds * 1000).format(
                    'MMMM D, h:mm a',
                  )
                : 'Not Booked'}
            </Text>
          </View>
        </PopUp>
      </View>
    )
  );
};

export default React.memo(TripDetails);
