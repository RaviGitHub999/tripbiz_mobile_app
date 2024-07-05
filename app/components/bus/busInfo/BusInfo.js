import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {colors} from '../../../config/theme';
import {styles} from './BusInfoStyles';
import Rishi from '../../wallet/Rishi';
import Select from '../../common/select/Select';
import CustomSelection from '../../common/mainComponents/customSelect/CustomSelection';
import MyContext from '../../../context/Context';
import ProgressBar from '../../common/progressBar/ProgressBar';
import {responsiveHeight, responsiveWidth} from '../../../utils/responsiveScale';
import SeatLayout from './SeatLayout';
import {useNavigation} from '@react-navigation/native';
import PopUp from '../../common/popup/PopUp';
import {TextInput} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { FlatList } from 'react-native';

const BusInfo = () => {
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [droppingPoint, setDroppingPoint] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  const [submitIsOpen, setSubmitIsOpen] = useState(false);
  var [isloading, setIsLoading] = useState(false);
  const {
    bookingBus,
    fetchingBusSeat,
    userTripStatus,
    actions,
    selectedTripId,
    selectedTrip,
    busDate,
    BusOperatorName,
    originDetails,
    destDetails,
    NoofBusPassengers
  } = useContext(MyContext);
  const date = new Date(busDate);
  var myStr = destDetails?.cityName;
  const formattedDate = `${date.toLocaleString('default', {
    month: 'long',
  })} ${date.getDate()}`;
  const combinedString = `${myStr}_${formattedDate}`;
  var [defaultInput, setDefaultInput] = useState(combinedString);
  const {goBack,navigate} = useNavigation();
  const handleDropping = val => {
    setDroppingPoint(val);
    actions.setBusBookDetails(val,"droppingPoint")
  };

  const handleBoarding = val => {
    setBoardingPoint(val);
    actions.setBusBookDetails(val,"boardingPoint")
  };

  const handleGoBack = () => {
    goBack();
  };

  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };
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

  var addtoTrip = async (id) => {
    //actions.setFlightSession(true);

    await actions.editTripById(id, bookingBus, "bus");
    //await actions.getAllTrips(userId)
    await actions.getLastDoc();
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

  const handleInputChange = e => {
    setDefaultInput(e);
  };

  const handleAddToTrip = async () => {
    setIsLoading(true);
    let newtripid = await actions.editTripBtn(
      defaultInput,
      'bus',
      bookingBus,
    );
    setIsLoading(false);
    navigate('TripDetails', {id: newtripid});
    // await actions.getLastDoc();
  };

  return (
    <>
      <ScrollView
        style={{backgroundColor: colors.white}}
        contentContainerStyle={{paddingBottom: responsiveHeight(10)}}>
        <View style={styles.mainContainer}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity
            style={styles.backIconContainer}
            onPress={handleGoBack}>
            <IconSwitcher
              componentName="AntDesign"
              iconName="arrowleft"
              color={colors.primary}
              iconsize={3.2}
            />
          </TouchableOpacity>
         <View style={{flex:1,alignItems:'center'}}>
         <Text style={[styles.titles,{color:colors.highlight}]}>
            {originDetails.cityName} to {destDetails.cityName}
          </Text>
         </View>
          </View>
          <View>
            <Text style={styles.titles}>Select Pickup and Drop Points</Text>
            <View style={styles.boardingPoint_droppingPoint_Container}>
              <View style={styles.boardingPoint_droppingPoint_subContainer}>
                <Text style={styles.subTitles}>Select Boarding Point</Text>
                <CustomSelection
                  placeHolder={'Select Boarding Point'}
                  setValue={handleBoarding}
                  value={boardingPoint}
                  data={
                    bookingBus?.busBoardingDetails?.busResult
                      ?.GetBusRouteDetailResult?.BoardingPointsDetails
                  }
                  listKey={'CityPointAddress'}
                />
              </View>

              <View style={styles.boardingPoint_droppingPoint_subContainer}>
                <Text style={styles.subTitles}>Select Boarding Point</Text>
                <CustomSelection
                  placeHolder={'Select Dropping Point'}
                  setValue={handleDropping}
                  value={droppingPoint}
                  data={
                    bookingBus?.busBoardingDetails?.busResult
                      ?.GetBusRouteDetailResult?.DroppingPointsDetails
                  }
                  listKey={'CityPointLocation'}
                />
              </View>
            </View>
          </View>
          <Text style={styles.titles}>{`Number of Adults: ${NoofBusPassengers}`}</Text>
<View style={styles.errorContainer}>
<Text style={styles.titles}>{`Select Seats`}</Text>
{bookingBus?.selectedSeat?.length < NoofBusPassengers && <Text style={styles.errorText}>(Please select {NoofBusPassengers} Seats)</Text>}
</View>
          {(bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
            ?.SeatLayoutDetails?.SeatLayout.SeatDetails).length > 0 && (
            <SeatLayout
              seatData={
                bookingBus?.busSeatLayout?.busResult?.GetBusSeatLayOutResult
                  ?.SeatLayoutDetails?.SeatLayout.SeatDetails
              }
              boardingPoint={boardingPoint}
              droppingPoint={droppingPoint}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.totalRoomPriceContainer}>
        <TouchableOpacity
          style={styles.totalRoomPriceToggleContainer}
          onPress={toggleHeight}>
          <IconSwitcher
            componentName="Ionicons"
            iconName={isExpanded ? 'chevron-down' : 'chevron-up'}
            color="black"
            iconsize={3}
          />
        </TouchableOpacity>
        <View style={styles.roomPriceContainer}>
          <Text style={styles.totalPriceText}>
            Total Price:{' '}
            <Text style={styles.totalPrice}>
              {` ₹ ${
                bookingBus.busTotalPrice
                  ? bookingBus.busTotalPrice.toLocaleString('en-IN')
                  : 0
              }`}
            </Text>
          </Text>
          {selectedTripId ? (
            <View style={styles.selectedTripContainer}>
              <Text style={styles.selectedTripTitle}>{`Do you want to add to ${
                selectedTrip?.data?.name
                  ? selectedTrip?.data?.name
                  : selectedTripId
              }`}</Text>
              <View style={styles.selectedTripBtnContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigate('TripDetails', {id: selectedTripId});
                    actions.editTripById(selectedTripId, bookingBus, 'bus');
                    actions.handleSelectedTripId();
                  }}
                  style={styles.yesBtn}>
                  <Text style={styles.yesBtnText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.yesBtn}
                  onPress={() => {
                    // actions.backToHotelResPage()
                    goBack();
                  }}>
                  <Text style={styles.yesBtnText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addtotripBtn}
              onPress={() => {
                setSubmitIsOpen(true);
                // setDefaultInput(combinedString);
              }}>
              <Text style={styles.addtotripBtnText}>Add to trip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <PopUp value={isExpanded} handlePopUpClose={toggleHeight}>
        <>
          {isExpanded && (
            <View style={{gap:responsiveHeight(1)}}>
            <View style={styles.hotelPriceContainer}>
                <Text style={styles.hotelPriceText}>Bus Name : </Text>
                <Text style={[styles.hotelPriceTP,{flex:1}]} ellipsizeMode='tail' numberOfLines={1}> {BusOperatorName}</Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={styles.hotelPriceText}>Bus Seats : </Text>
                {bookingBus?.selectedSeat?.length > 0
                    ? bookingBus?.selectedSeat?.map((ele,i)=>{
                      return <Text style={styles.hotelPriceTP}>{ele.SeatName}{i < bookingBus.selectedSeat.length - 1 && ','}</Text>
                    }):null}
              </View>
              <View style={styles.hotelPriceContainer}>
                <Text style={styles.hotelPriceText}>Bus fare</Text>
                <Text style={styles.hotelPriceTP}>&#8377;{" "}
                  {bookingBus?.selectedSeat?.length > 0
                    ? bookingBus?.selectedSeat?.reduce(
                        (total, seat) =>
                          total + seat.Price.OfferedPriceRoundedOff,
                        0,
                      )
                    : 0}
                </Text>
              </View>
              <View style={styles.dashedLine} />
              <View style={styles.hotelPriceContainer}>
                <Text style={styles.hotelPriceText}>Service Charges</Text>
                <Text style={styles.hotelPriceTP}>
                  + {bookingBus?.selectedSeat?.length > 0
                    ? bookingBus?.selectedSeat?.reduce(
                        (total, seat) =>
                          total +
                          Math.ceil(
                            (seat.Price.OfferedPriceRoundedOff * 3) / 100,
                          ),
                        0,
                      )
                    : 0}
                </Text>
              </View>
            </View>
          )}
        </>
      </PopUp>
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
              {!isloading ? (
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
                <View>
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
    </>
  );
};

export default BusInfo;

// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import IconSwitcher from "../../common/icons/IconSwitcher";
// import { colors } from "../../../config/theme";
// import { busSeating, selectedSeat, sitterSelected, sleeperBedSelected, sleeperbed } from "./assets";
// import { responsiveHeight } from "../../../utils/responsiveScale";

// const seatData = [
//   [
//     {
//       RowNo: "000",
//       ColumnNo: "000",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "001",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "002",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "003",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "004",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "005",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "006",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "007",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "008",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "000",
//       ColumnNo: "009",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//   ],
//   [
//     {
//       RowNo: "001",
//       ColumnNo: "000",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "001",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "002",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "003",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "004",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "005",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "006",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "007",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "008",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "009",
//       SeatStatus: false,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//   ],
//   [
//     {
//       RowNo: "002",
//       ColumnNo: "009",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//   ],
//   [
//     {
//       RowNo: "003",
//       ColumnNo: "000",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "001",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "002",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "003",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "004",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "005",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "006",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "007",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "008",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//     {
//       RowNo: "003",
//       ColumnNo: "009",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: false,
//     },
//   ],
//   [
//     {
//       RowNo: "001",
//       ColumnNo: "000",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "002",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "004",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "006",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "001",
//       ColumnNo: "008",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//   ],
//   [
//     {
//       RowNo: "002",
//       ColumnNo: "000",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "002",
//       ColumnNo: "002",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "002",
//       ColumnNo: "004",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "002",
//       ColumnNo: "006",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "002",
//       ColumnNo: "008",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//   ],
//   [
//     {
//       RowNo: "004",
//       ColumnNo: "000",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "004",
//       ColumnNo: "002",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "004",
//       ColumnNo: "004",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "004",
//       ColumnNo: "006",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//     {
//       RowNo: "004",
//       ColumnNo: "008",
//       SeatStatus: true,
//       IsLadiesSeat: false,
//       IsMalesSeat: false,
//       IsUpper: true,
//       Height:2
//     },
//   ],
// ];

// const App = () => {
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const toggleSeatSelection = (seat) => {
//     const isSelected = selectedSeats.some(
//       (s) =>
//         s.RowNo === seat.RowNo &&
//         s.ColumnNo === seat.ColumnNo &&
//         s.IsUpper === seat.IsUpper
//     );

//     if (seat.SeatStatus) {
//       if (isSelected) {
//         setSelectedSeats(
//           selectedSeats.filter(
//             (s) =>
//               !(
//                 s.RowNo === seat.RowNo &&
//                 s.ColumnNo === seat.ColumnNo &&
//                 s.IsUpper === seat.IsUpper
//               )
//           )

//         );
//       } else {
//         setSelectedSeats([...selectedSeats, seat]);
//       }
//     }
//   };

//   const lowerDeckData = seatData.filter(
//     (row) => !row.some((seat) => seat.IsUpper)
//   );
//   const upperDeckData = seatData.filter((row) =>
//     row.some((seat) => seat.IsUpper)
//   );

//   const shouldAddMarginAfterLowerDeckRow2 = !lowerDeckData[2]?.some((seat) =>
//     seat.ColumnNo === "009" ? seat.SeatStatus : null
//   );

//   return (
//     <ScrollView style={styles.appContainer}>
//       <Deck
//         data={lowerDeckData}
//         title="Lower Deck"
//         addMarginAfterRow={shouldAddMarginAfterLowerDeckRow2 ? 2 : null}
//         toggleSeatSelection={toggleSeatSelection}
//         selectedSeats={selectedSeats}
//         isUpperDeck={false}
//       />
//       <Deck
//         data={upperDeckData}
//         title="Upper Deck"
//         addMarginAfterRow={1}
//         toggleSeatSelection={toggleSeatSelection}
//         selectedSeats={selectedSeats}
//         isUpperDeck
//       />
//     </ScrollView>
//   );
// };

// const Deck = ({
//   data,
//   title,
//   addMarginAfterRow,
//   toggleSeatSelection,
//   selectedSeats,
//   isUpperDeck,
// }) => {
//   return (
//     <View style={[styles.deck, addMarginAfterRow && styles.deckWithMargin]}>
//       <Text style={styles.deckTitle}>{title}</Text>
//       {data.map((row, rowIndex) => (
//         <View key={rowIndex}>
//           <SeatRow
//             row={row}
//             rowIndex={rowIndex}
//             toggleSeatSelection={toggleSeatSelection}
//             selectedSeats={selectedSeats}
//             isUpperDeck={isUpperDeck}
//           />
//           {addMarginAfterRow === rowIndex && (
//             <View style={styles.rowSeparator} />
//           )}
//         </View>
//       ))}
//     </View>
//   );
// };

// const SeatRow = ({
//   row,
//   rowIndex,
//   toggleSeatSelection,
//   selectedSeats,
//   isUpperDeck,
// }) => {
//   return (
//     <View style={styles.row}>
//       {row.map((seat, columnIndex) => (
//         <Seat
//           key={`${seat.RowNo}-${seat.ColumnNo}`}
//           seat={seat}
//           rowIndex={rowIndex}
//           columnIndex={columnIndex}
//           toggleSeatSelection={toggleSeatSelection}
//           isSelected={selectedSeats.some(
//             (s) =>
//               s.RowNo === seat.RowNo &&
//               s.ColumnNo === seat.ColumnNo &&
//               s.IsUpper === seat.IsUpper
//           )}
//           isUpperDeck={isUpperDeck}
//         />
//       ))}
//     </View>
//   );
// };

// const Seat = ({
//   seat,
//   rowIndex,
//   columnIndex,
//   toggleSeatSelection,
//   isSelected,
//   isUpperDeck,
// }) => {
//   let seatContainerStyle = [styles.seatContainer];

//   return (
//     <TouchableOpacity
//       style={[...seatContainerStyle]}
//       onPress={() => toggleSeatSelection(seat)}
//     >
//       {getIconDetails(seat, isSelected)}
//     </TouchableOpacity>
//   );
// };

// const getIconDetails = (seat, isSelected) => {
//   if (!seat.SeatStatus) {
//     return (
//       <Image
//         source={sitterSelected}
//         style={{ height: responsiveHeight(3.5), width: responsiveHeight(3.5) }}
//       />
//     );
//   } else if (seat.IsLadiesSeat && seat.Height === 2) {
//     return { iconName: "female", componentName: "FontAwesome", color: "purple" };
//   } else if (seat.IsLadiesSeat) {
//     return { iconName: "female", componentName: "FontAwesome", color: "pink" };
//   } else if (seat.IsMalesSeat) {
//     return { iconName: "male", componentName: "FontAwesome", color: "blue" };
//   } else if (seat.Height === 2) {
//     return (
//       <Image
//         source={isSelected ? sleeperBedSelected : sleeperbed}
//         style={{ height: 28, width: 60 }}
//         resizeMode="contain"
//       />
//     );
//   } else {
//     return (
//       <Image
//         source={isSelected ? selectedSeat : busSeating}
//         style={{ height: responsiveHeight(3.5), width: responsiveHeight(3.5) }}
//       />
//     );
//   }
// };

// const styles = StyleSheet.create({
//   appContainer: {
//     flex: 1,
//     paddingTop: 50,
//   },
//   deck: {
//     marginBottom: 30,
//     paddingHorizontal: 10,
//   },
//   deckWithMargin: {
//     marginBottom: 60,
//   },
//   deckTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: 10,
//     justifyContent: "flex-end",
//   },
//   rowSeparator: {
//     height: 40,
//   },
//   seatContainer: {
//     margin: responsiveHeight(0.3),
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   doubleHeightSeat: {
//     height: 100,
//   },
//   seatText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   ladiesSeat: {
//     backgroundColor: "#f4cccc",
//   },
//   malesSeat: {
//     backgroundColor: "#c9daf8",
//   },
//   upperSeat: {
//     width: 100,
//     height: 70,
//   },
//   selectedSeat: {
//     backgroundColor: "#6ab04c",
//   },
// });
// export default App;
