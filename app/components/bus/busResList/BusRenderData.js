import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {colors, fonts} from '../../../config/theme';
import PopUp from '../../common/popup/PopUp';
import MyContext from '../../../context/Context';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';
import TravellerDetailsBtn from '../../common/mainComponents/TravellerDetailsButton/TravellerDetailsBtn';
import moment from 'moment';
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
const downloadDoc = async hotelStatus => {
  try {
    await Linking.openURL(hotelStatus);
  } catch (error) {
    Alert.alert('Error', 'An error occurred while trying to open the URL');
    console.error('An error occurred', error);
  }
};
const BusRenderData = ({
  item,
  tripsPage,
  bookingBus,
  busData,
  tripId,
  totalBus,
}) => {
  const [openBusDetails, setOpenBusDetails] = useState(false);
  const [buspickupanddrop, setBusPickUpandDrop] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loader, setLoader] = useState(false);
  var [openPriceInfo, setOpenPriceInfo] = useState(false);
  const [alltimeStamp, setAllTimeStamp] = useState(false);
  const {actions, busService} = useContext(MyContext);
  const {navigate, push} = useNavigation();
  const depdate = new Date(item.DepartureTime);
  const depformattedDate = depdate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const arrdate = new Date(item.ArrivalTime);
  const arrformattedDate = arrdate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const diffInMilliseconds = arrdate - depdate;
  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTimeDiff = `${String(hours).padStart(2, '0')}hrs ${String(
    minutes,
  ).padStart(2, '0')}mins`;

  var color = statuses.filter(status => {
    return status?.status === busData?.status;
  });
  var reqColor = reqStatuses.filter(status => {
    return status?.status === busData?.requestStatus;
  });

  const handleSeatSelection = useCallback(async bus => {
    setLoader(true);
    await actions.fetchBusSeatLayout(bus);
    setLoader(false);
    push('BusInfo');
  }, []);

  const handleDelete = async () => {
    await actions.deleteTripItem(tripId, busData?.id, 'bus');
    setOpenDelete(false);
  };
  const openAllTimeStamps = () => {
    setAllTimeStamp(true);
  };
  const closeAllTimeStamps = () => {
    setAllTimeStamp(false);
  };
  return (
    <>
      <View
        style={[
          styles.busCard,
          {
            backgroundColor: busData?.status
              ? busData?.status === 'Booked'
                ? 'honeydew'
                : 'white'
              : 'white',
          },
        ]}>
        {tripsPage ? (
          <>
            <View style={styles.routeContainer}>
              <Text style={styles.routeName}>
                {bookingBus?.origin?.cityName}
              </Text>
              <IconSwitcher
                componentName="Octicons"
                iconName="arrow-right"
                color={colors.primary}
                iconsize={2.5}
              />
              <Text style={styles.routeName}>
                {bookingBus?.destination?.cityName}
              </Text>
            </View>
            <View style={styles.selectedSeatsContainer}>
              <Text style={styles.travelName}>Selected Seats :</Text>
              <View style={{flexDirection: 'row'}}>
                {bookingBus?.selectedSeat &&
                  bookingBus.selectedSeat.map((e, i) => (
                    <Text
                      key={i}
                      style={[styles.travelName, {color: colors.highlight}]}>
                      {e.SeatName}
                      {i < bookingBus.selectedSeat.length - 1 && ','}
                    </Text>
                  ))}
              </View>
            </View>
          </>
        ) : null}
        <View style={styles.travelNameContainer}>
          <IconSwitcher
            componentName="FontAwesome5"
            iconName="bus-alt"
            color={colors.black}
            iconsize={3}
          />
          <Text style={[styles.travelName, {flex: 1}]}>{item.TravelName}</Text>
        </View>
        <View style={styles.travelTimeContainer}>
          <View>
            <Text style={styles.time}>{`${item.DepartureTime.slice(
              11,
              16,
            )}`}</Text>
            <Text
              style={[
                styles.time,
                {color: colors.lightGray},
              ]}>{`${depformattedDate}`}</Text>
          </View>
          <View style={styles.travelHoursContainer}>
            <Text style={styles.travelTime}>{formattedTimeDiff}</Text>
          </View>
          <View style={styles.arrivalTimeContainer}>
            <Text style={styles.time}>{`${item.ArrivalTime.slice(
              11,
              16,
            )}`}</Text>
            <Text
              style={[
                styles.time,
                {color: colors.lightGray},
              ]}>{`${arrformattedDate}`}</Text>
          </View>
        </View>
        <Text style={styles.time}>{item.BusType}</Text>
        <View style={styles.totalPriceContainer}>
          <TouchableOpacity onPress={() => setOpenBusDetails(true)}>
            <Text style={styles.cancellationText}>Cancellation</Text>
          </TouchableOpacity>
          {!tripsPage ? (
            <Text style={styles.time}>{item.AvailableSeats} Seats Left</Text>
          ) : (
            <TouchableOpacity onPress={() => setBusPickUpandDrop(true)}>
              <IconSwitcher
                componentName="MaterialCommunityIcons"
                iconName="bus-stop"
                iconsize={4}
              />
            </TouchableOpacity>
          )}
          {tripsPage ? (
            <>
              <Text style={styles.price}>
                &#8377;{' '}
                {bookingBus?.selectedSeat.length > 0
                  ? bookingBus?.selectedSeat.reduce(
                      (total, seat) =>
                        total + seat.Price.OfferedPriceRoundedOff,
                      0,
                    )
                  : 0}
              </Text>
            </>
          ) : (
            <Text style={styles.price}>
              &#8377;{' '}
              {item.BusPrice.PublishedPriceRoundedOff
                ? item.BusPrice.PublishedPriceRoundedOff
                : item.BusPrice.OfferedPriceRoundedOff}
            </Text>
          )}
        </View>
        {!tripsPage ? (
          <>
            {loader ? (
              <View style={styles.Btn}>
                <ActivityIndicator color={colors.facebook} size={20} />
              </View>
            ) : (
              <Pressable
                style={styles.Btn}
                onPress={() => handleSeatSelection(item)}>
                <Text style={styles.btnText}>Select Seats</Text>
              </Pressable>
            )}
          </>
        ) : null}

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
                    {busData?.requestStatus}
                  </Text>
                </View>
              </View>
              <>
                {busData?.status ? (
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
                        {busData.status}
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
                      bookingBus?.busTotalPrice,
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
              {busData?.downloadURL && tripsPage ? (
                <TouchableOpacity
                  onPress={() => downloadDoc(busData?.downloadURL)}
                  style={styles.voucherContainer}
                  >
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
                    {new Date(busData?.date?.seconds * 1000)
                      .toString()
                      .slice(4, 15)}
                  </Text>
                </Text>
              </View>
              {busData?.requestStatus === 'Pending' ||
              busData?.status === 'Submitted' ||
              busData?.status === 'Booked' ||
              busData?.requestStatus === 'Approved' ? null : (
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
            adults={bookingBus && bookingBus.passengers}
            eachTripData={totalBus}
            tripId={tripId}
            status={busData?.status}
          />
        ) : null}
      </View>
      <PopUp
        value={openBusDetails}
        handlePopUpClose={() => {
          setOpenBusDetails(false);
        }}>
        <Text
          style={[
            styles.travelName,
            {fontSize: responsiveHeight(2.2), textAlign: 'center'},
          ]}>
          Cancellation Details
        </Text>
        <View style={styles.tableHeader}>
          <Text style={styles.travelName}>Cancellation Time</Text>
          <Text style={styles.travelName}>Cancellation Charge</Text>
        </View>
        <>
          {item?.CancellationPolicies?.length > 0 &&
            item.CancellationPolicies.map((rule, ru) => {
              var fromDate = new Date(rule.FromDate);
              const fromformattedDate = fromDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              });
              var toDate = new Date(rule.ToDate);
              const toformattedDate = toDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              });
              return (
                <View key={`id_${ru + 1}`} style={styles.tableRow}>
                  <View style={styles.eachCell}>
                    <Text style={styles.cellText}>
                      From {fromDate.toLocaleTimeString()},{fromformattedDate}{' '}
                      to {toDate.toLocaleTimeString()},{toformattedDate}
                    </Text>
                  </View>
                  <View style={styles.eachCell}>
                    <Text style={styles.cellText}>
                      {rule.CancellationCharge}%
                    </Text>
                  </View>
                </View>
              );
            })}
        </>
      </PopUp>

      <PopUp
        value={openPriceInfo}
        handlePopUpClose={() => {
          setOpenPriceInfo(false);
        }}>
        <View style={styles.priceInfo}>
          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>Bus Price</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight}]}>
              &#8377;
              {` ${
                bookingBus?.selectedSeat?.length > 0
                  ? bookingBus?.selectedSeat.reduce(
                      (total, seat) =>
                        total + seat.Price.OfferedPriceRoundedOff,
                      0,
                    )
                  : 0
              }`}
            </Text>
          </View>
          <View style={styles.horizentalLine} />
          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>Service Charges</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight,fontSize:responsiveHeight(1.8)}]}>
              + &#8377;
                {Math.round(bookingBus?.serviceCharge)}
            </Text>
          </View>

          <View style={styles.priceDetailsContainer}>
            <Text style={styles.priceDetailsTitle}>GST</Text>
            <Text style={[styles.priceDetails, {color: colors.highlight,fontSize:responsiveHeight(1.8)}]}>
              + &#8377;
                {Math.round(bookingBus?.GST)}
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
              {` ${Math.ceil(bookingBus?.busTotalPrice).toLocaleString(
                'en-IN',
              )}`}
            </Text>
          </View>
        </View>
      </PopUp>
      <PopUp
        value={buspickupanddrop}
        handlePopUpClose={() => {
          setBusPickUpandDrop(false);
        }}>
        <View>
          <Text style={styles.travelName}>
            Boarding Point :{' '}
            <Text style={{color: colors.highlight}}>
              {bookingBus?.boardingPointDetails}
            </Text>
          </Text>
          <Text style={styles.travelName}>
            Dropping Point :{' '}
            <Text style={{color: colors.highlight}}>
              {bookingBus?.droppingPointDetails}
            </Text>
          </Text>
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
            {busData?.date &&
              moment(busData?.date?.seconds * 1000).format('MMMM D, h:mm a')}
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
            {busData?.manager_request_time
              ? moment(busData?.manager_request_time * 1000).format(
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
            {busData?.managerApprovedTime
              ? moment(busData?.managerApprovedTime?.seconds * 1000).format(
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
            {busData?.submitted_date
              ? moment(busData?.submitted_date?.seconds * 1000).format(
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
            {busData?.booked_date
              ? moment(busData?.booked_date?.seconds * 1000).format(
                  'MMMM D, h:mm a',
                )
              : 'Not Booked'}
          </Text>
        </View>
      </PopUp>
    </>
  );
};
const styles = StyleSheet.create({
  busCard: {
    marginBottom: responsiveHeight(1.5),
    gap: responsiveHeight(0.8),
    padding: responsiveWidth(3),
    borderRadius: responsiveHeight(1.5),
    elevation: responsiveHeight(0.4),
    backgroundColor: 'white',
  },
  travelNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },
  travelName: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.secondry,
    color: colors.primary,
  },
  travelTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.textFont,
    color: colors.primary,
  },
  travelTime: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: colors.gray,
  },
  travelHoursContainer: {
    borderBottomWidth: responsiveHeight(0.18),
    paddingBottom: responsiveHeight(0.3),
    // paddingHorizontal:responsiveWidth(1),
    borderStyle: 'dashed',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: responsiveHeight(2.1),
    fontFamily: fonts.primary,
    color: colors.secondary,
  },
  cancellationText: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: '#e19604',
    textDecorationLine: 'underline',
  },
  Btn: {
    alignSelf: 'flex-end',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    backgroundColor: colors.black,
    marginTop: responsiveHeight(1),
    width: responsiveWidth(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.primary,
    color: colors.white,
  },
  arrivalTimeContainer: {
    alignItems: 'flex-end',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e19604',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    marginTop: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(1),
    borderBottomWidth: responsiveHeight(0.3),
  },
  tableRow: {
    flexDirection: 'row',
    padding: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: responsiveHeight(0.1),
    borderStyle: 'dashed',
    backgroundColor: '#e1e2e6',
  },
  eachCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(1),
    flexWrap: 'wrap',
  },
  routeName: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primaryLite,
  },
  selectedSeatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(1),
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
  bookingStatusTitles: {
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.primary,
    color: colors.lightGray,
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

export default React.memo(BusRenderData);
