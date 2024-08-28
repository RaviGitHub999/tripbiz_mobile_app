import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {styles} from './RoleStyles';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {colors, fonts} from '../../../config/theme';
import ChangePasswordInput from '../changePassword/ChangePasswordInput';
import {responsiveHeight} from '../../../utils/responsiveScale';
import MyContext from '../../../context/Context';
import {BarIndicator} from 'react-native-indicators';
import PopUp from '../../common/popup/PopUp';
import HCard from '../../Trips/TripDetails/HCard';
import TravDetails from '../../Trips/TripDetails/TravDetails';
import FCard from '../../Trips/TripDetails/FCard';
import {useNavigation} from '@react-navigation/native';
import CCard from '../../Trips/TripDetails/CCard';
import BCard from '../../Trips/TripDetails/BCard';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import OCard from '../../Trips/TripDetails/OCard';
const Role = () => {
  const {
    actions,
    userAccountDetails,
    flightsLogosData,
    teamMembers,
    notifications,
    approveLoading,
  } = useContext(MyContext);
  const [openManager, setOpenManager] = useState(false);
  const [managerData, setManagerData] = useState({
    name: '',
    email: '',
  });
  const [selectedTab, setSelectedTab] = useState('Pending');
  const [tripsData, setTripsData] = useState([]);
  const [mounted, setMounted] = useState(true);
  const [openTrip, setOpenTrip] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const[approvedLoading,setApprovedLoading]=useState(false)
  const [open, setOpen] = useState(false);
  const [managerStatus, setManagerStatus] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [managerComment, setManagerComment] = useState();
  const {goBack} = useNavigation();
  const uid = auth().currentUser.uid;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleScreenPress = () => {
    Keyboard.dismiss();
  };

  const handleManagerDataChange = (value, name) => {
    setManagerData({...managerData, [name]: value});
  };

  const handleManager = () => {
    actions.editManager(managerData);
  };
  var getTripData = async () => {
    var data = await actions.getTripsForApproval(
      userAccountDetails?.approvalRequests,
    );
    setTripsData(data);
  };
  const getManagerStatus = async () => {
    try {
      const userDetails = await firestore()
        .collection('Accounts')
        .doc(uid)
        .get();

      if (userDetails.exists) {
        setManagerStatus(userDetails.data().manager.status);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching manager status: ', error);
    }
  };
  useEffect(() => {
    if (mounted) {
      getTripData();
      actions.handleFlightsLogos();
      getManagerStatus();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      getTripData();
      actions.handleFlightsLogos();
      setRefreshing(false);
    }, 2000);
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
  var handleApprove = async(trip, req)=> {
    setLoading(true);
    await actions.approveTripRequest(req, userAccountDetails?.userid);
    await actions.updateAdminTripAccepted(trip, req);
    setOpenTrip(false);
    setLoading(false);
    setTripsData();
    await getTripData();
  };
  var approveRequest = (notification, userid) => {
    setApprovedLoading(true)
    actions.editTeamMembers(notification, userid);
    setApprovedLoading(false)
  };
  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.mainContainer}>
              <TouchableOpacity style={styles.back} onPress={goBack}>
                <IconSwitcher
                  componentName="AntDesign"
                  iconName="arrowleft"
                  iconsize={3.5}
                />
              </TouchableOpacity>
              <Text style={styles.maintitle}>Roles and Approval</Text>
              <View style={styles.subContainer}>
                <Text style={styles.subTitle}>Manager</Text>
                {userAccountDetails.manager ? (
                  <View style={styles.managerDataContainer}>
                    <Text style={styles.managerDataTitle}>
                      {userAccountDetails?.manager?.name}(
                      {userAccountDetails?.manager?.email})
                    </Text>
                    <Text
                      style={[
                        styles.btnTitle,
                        {color: colors.lightGray, textAlign: 'center'},
                      ]}>
                      {managerStatus === 'pending' ? 'Pending' : 'Active'}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => setOpenManager(!openManager)}>
                    <IconSwitcher
                      componentName="Octicons"
                      iconName="plus"
                      iconsize={2}
                      color={colors.white}
                    />
                    <Text style={styles.btnTitle}>Add Manager</Text>
                  </TouchableOpacity>
                )}

                {openManager ? (
                  <View style={styles.managerDetailsContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inPutHeaderTitle}>
                        Enter the name of the manager
                      </Text>
                      <ChangePasswordInput
                        placeholderName={'Enter the name'}
                        customStyles={{fontSize: responsiveHeight(2)}}
                        stateValue={managerData.name}
                        handleonChange={e => handleManagerDataChange(e, 'name')}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inPutHeaderTitle}>
                        Enter the email of the manager
                      </Text>
                      <ChangePasswordInput
                        placeholderName={'Enter the email'}
                        customStyles={{fontSize: responsiveHeight(2)}}
                        stateValue={managerData.email}
                        handleonChange={e =>
                          handleManagerDataChange(e, 'email')
                        }
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={handleManager}>
                      <Text style={styles.btnTitle}>Send Request</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {/* team Member */}
                {teamMembers?.length > 0 || notifications?.length > 0 ? (
                  <>
                    <View style={styles.teamMembersContainer}>
                      <Text style={styles.subTitle}>Team Members</Text>
                      <TouchableOpacity onPress={handleClickOpen}>
                        <Text
                          style={[
                            styles.NodatamsgTitle,
                            {
                              color: colors.facebook,
                              textDecorationLine: 'underline',
                            },
                          ]}>
                          ({teamMembers?.length} Team Members)
                        </Text>
                      </TouchableOpacity>
                      
                    </View>
                    < >
                        {notifications?.length > 0 ? (
                          <>
                            {notifications.map(notification => {
                              return (
                                <View style={[styles.managerDataContainer,{gap:responsiveHeight(1)}]}>
                                  <Text style={[styles.title,{fontSize:responsiveHeight(1.5)}]}>
                                    Please approve manager request of{' '}
                                    {notification.name}({notification.email}).
                                    Once you approve this,{notification.name}(
                                    {notification.email}) can send their travel
                                    approval requests to you
                                  </Text>
                                  <TouchableOpacity style={styles.btn} onPress={() =>
                              approveRequest(notification, notification.userId)}>
                                 {approvedLoading?<ActivityIndicator size={'small'} color={colors.white}/>
                                 : <Text style={styles.btnTitle}>Approve</Text>}
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </>
                        ) : null}
                      </>
                  </>
                ) : null}
              </View>

              {/* Approvel */}
              <View style={{marginTop: 20, gap: 12}}>
                <Text style={styles.subTitle}>Approval</Text>
                <View style={styles.approvalNavBar}>
                  <TouchableOpacity
                    style={
                      selectedTab === 'Pending'
                        ? styles.selectedEachNavBarContainer
                        : styles.eachNavBarContainer
                    }
                    onPress={() => setSelectedTab('Pending')}>
                    <Text
                      style={
                        selectedTab === 'Pending'
                          ? styles.selectedEachNavBarTitle
                          : styles.eachNavBarTitle
                      }>
                      Pending
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      selectedTab === 'Approved'
                        ? styles.selectedEachNavBarContainer
                        : styles.eachNavBarContainer
                    }
                    onPress={() => setSelectedTab('Approved')}>
                    <Text
                      style={
                        selectedTab === 'Approved'
                          ? styles.selectedEachNavBarTitle
                          : styles.eachNavBarTitle
                      }>
                      Approved
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* ApprovalData */}
                <View>
                  {approveLoading ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: responsiveHeight(2),
                        gap: responsiveHeight(2),
                        flexWrap: 'wrap',
                      }}>
                      <BarIndicator
                        color={colors.highlight}
                        count={6}
                        size={responsiveHeight(4)}
                        style={{flex: 0}}
                      />
                      <Text style={styles.managerDataTitle}>
                        Loading Approve Request...
                      </Text>
                    </View>
                  ) : tripsData ? (
                    tripsData
                      ?.filter(a => {
                        return a?.requestDetails?.status === selectedTab;
                      })
                      ?.sort((a, b) => {
                        var aDate = new Date(
                          a?.requestDetails?.createdAt.seconds * 1000,
                        );
                        var bDate = new Date(
                          b?.requestDetails?.createdAt.seconds * 1000,
                        );
                        return bDate - aDate;
                      })
                      ?.map((trip, s) => {
                        var date = new Date(
                          trip?.tripDetails?.data?.date?.seconds * 1000,
                        ).toLocaleString();
                        let updatedDate = trip?.requestDetails?.updatedAt
                          ? new Date(
                              trip?.requestDetails?.updatedAt?.seconds * 1000,
                            ).toLocaleString()
                          : '';
                        return (
                          <View
                            style={styles.card}
                            key={trip.approvalRequest.requestId}>
                            <View style={styles.headers}>
                              <Text  style={[styles.cardTitle,{fontSize:responsiveHeight(1.6)}]}>
                                {trip?.userDetails?.firstName}(
                                  {trip?.userDetails?.email})
                              </Text>
                              <Text  style={[styles.cardTitle,{fontSize:responsiveHeight(1.4)}]}>
                                {trip?.tripDetails?.data?.name}
                              </Text>
                              <Text style={[styles.cardTitle,{fontSize:responsiveHeight(1.4)}]}>
                                Requested on:
                                <Text style={styles.date}>{`  ${date}`}</Text>
                              </Text>
                            </View>
                            <View style={styles.tripListCount}>
                              {trip?.tripDetails?.hotels?.length > 0 ? (
                                <View style={styles.eachTripList}>
                                  <Text
                                    style={
                                      styles.eachTripListTitle
                                    }>{`Hotels - ${trip?.tripDetails?.hotels.length}`}</Text>
                                </View>
                              ) : null}
                              {trip?.tripDetails?.flights?.length > 0 ? (
                                <View style={styles.eachTripList}>
                                  <Text
                                    style={
                                      styles.eachTripListTitle
                                    }>{`Flights - ${trip?.tripDetails?.flights?.length}`}</Text>
                                </View>
                              ) : null}
                              {trip?.tripDetails?.cabs?.length > 0 ? (
                                <View style={styles.eachTripList}>
                                  <Text
                                    style={
                                      styles.eachTripListTitle
                                    }>{`Cabs - ${trip?.tripDetails?.cabs?.length}`}</Text>
                                </View>
                              ) : null}
                              {trip?.tripDetails?.bus?.length > 0 ? (
                                <View style={styles.eachTripList}>
                                  <Text
                                    style={
                                      styles.eachTripListTitle
                                    }>{`Buses - ${trip?.tripDetails?.bus?.length}`}</Text>
                                </View>
                              ) : null}
                                {trip?.tripDetails?.otherBookings?.length > 0 ? (
                                <View style={styles.eachTripList}>
                                  <Text
                                    style={
                                      styles.eachTripListTitle
                                    }>{`Other - ${trip?.tripDetails?.otherBookings?.length}`}</Text>
                                </View>
                              ) : null}
                            </View>
                            <Text style={styles.priceTitle}>
                              Total price:{' '}
                              <Text style={styles.price}>
                                {' '}
                                &#8377;{' '}
                                {Math.ceil(
                                    trip?.tripDetails?.flights &&
                                      trip?.tripDetails?.flights.reduce(
                                        (sum, obj) =>
                                          sum + (obj?.data[0]?.totalFare +
                                            obj?.data[0]
                                              ?.finalFlightServiceCharge +
                                            obj?.data[0]
                                              ?.gstInFinalserviceCharge),
                                        0
                                      ) +
                                        trip?.tripDetails?.hotels.reduce(
                                          (sum, obj) =>
                                            sum + obj?.data?.hotelTotalPrice,
                                          0
                                        ) +
                                        trip?.tripDetails?.cabs.reduce(
                                          (sum, obj) =>
                                            sum + obj?.data?.cabTotalPrice,
                                          0
                                        ) +
                                        trip?.tripDetails?.bus.reduce(
                                          (sum, obj) =>
                                            sum + obj?.data?.busTotalPrice,
                                          0
                                        ) +
                                        trip?.tripDetails?.otherBookings.reduce(
                                          (sum, obj) =>
                                            sum +
                                            obj?.data?.overallBookingPrice,
                                          0
                                        )
                                  )}
                              </Text>
                            </Text>
                            <View style={styles.tripListCount}>
                              <Text style={styles.statusTitle}>Status: </Text>
                              <View
                                style={[
                                  styles.statusContainer,
                                  {
                                    backgroundColor:
                                      trip?.requestDetails?.status === 'Pending'
                                        ? 'orange'
                                        : 'green',
                                  },
                                ]}>
                                <Text
                                  style={[
                                    styles.eachTripListTitle,
                                    {color: colors.white},
                                  ]}>
                                  {trip?.requestDetails?.status}
                                </Text>
                              </View>
                            </View>
                            {updatedDate && (
                              <Text style={styles.eachTripListTitle}>
                                Approved Date:{updatedDate}
                              </Text>
                            )}
                            <TouchableOpacity
                              style={styles.DetailsBtn}
                              onPress={() => {
                                setTrip(trip);
                                setManagerComment(
                                  trip.requestDetails.managerComment
                                );
                                setOpenTrip(true);
                              }}>
                              <Text
                                style={[
                                  styles.priceTitle,
                                  {color: colors.white,fontSize:responsiveHeight(1.4)},
                                ]}>
                                View Details
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })
                  ) : (
                    <View style={styles.NodatamsgTitleContainer}>
                      <Text style={styles.NodatamsgTitle}>
                        No Data Found!!!
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <PopUp
        value={openTrip}
        handlePopUpClose={() => setOpenTrip(false)}
        customStyles={{height: Dimensions.get('screen').height / 1.5}}>
          <Text style={[styles.title,{fontSize:responsiveHeight(1.5)}]}>{`Comments: ${managerComment}`}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {trip?.tripDetails?.hotels?.map((hotel, s) => {
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
                hotel?.data?.hotelSearchQuery?.checkInDate.seconds * 1000,
              );
              const formattedDate1 = `${
                monthNames[startdate.getMonth()]
              } ${startdate.getDate()}`;
              var endDate = getDate(
                hotel?.data?.hotelSearchQuery?.checkOutDate.seconds,
              );
              const adults =
                trip?.tripDetails?.data?.travellerDetails[hotel.id]?.adults;
              const child =
                trip?.tripDetails?.data?.travellerDetails[hotel.id]?.children;
              return (
                <>
                  {s === 0 ? (
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Hotels
                    </Text>
                  ) : null}
                  <HCard
                    hotel={hotel}
                    formattedDate1={formattedDate1}
                    endDate={endDate}
                    adults={adults}
                  />
                  <TravDetails adults={adults} child={child} />
                </>
              );
            })}
          </View>

          <View>
            {trip?.tripDetails?.flights?.map((flight, s) => {
              var airlinename =
                flight?.data[0]?.flightNew.segments[0].airlineName;
              var airline = flightsLogosData?.filter(a => {
                return airlinename.toLowerCase() === a.id;
              });

              var flightArr = [flight?.data[0]?.flight].map((flight, f) => {
                return {
                  ...actions.modifyFlightObject(flight),
                };
              });
              const adults =
                trip?.tripDetails?.data?.travellerDetails[flight.id]?.adults;
              const child =
                trip?.tripDetails?.data?.travellerDetails[flight.id]?.children;
              const infants =
                trip?.tripDetails?.data?.travellerDetails[flight.id]?.infants;
              return (
                <View style={{marginTop: responsiveHeight(1)}}>
                  {s === 0 ? (
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Flights
                    </Text>
                  ) : null}
                  <>
                    <FCard
                      airline={airline}
                      flightArr={flightArr}
                      flightData={flight}
                      type="role"
                    />
                    {/* <View
                      style={{
                        alignSelf: 'flex-end',
                        marginTop: responsiveHeight(1),
                      }}>
                      <Text
                        style={[
                          styles.totalPrice,
                          {fontSize: responsiveHeight(1.5)},
                        ]}>
                        {' '}
                        &#8377; {`${flightArr[0].fare.toLocaleString('en-IN')}`}
                      </Text>
                    </View> */}
                  </>
                  {/* <View style={styles.card}>
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Traveller Details
                    </Text>
                    <View>
                      <>
                        {trip?.tripDetails?.data?.travellerDetail ? (
                          <>
                            {trip?.tripDetails?.data?.travellerDetail[
                              flight.id
                            ]?.map((trav, i) => {
                              var index = i + 1;
                              return (
                                <TravDetails
                                  type={'Traveller'}
                                  index={index}
                                  trav={trav}
                                />
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {trip?.tripDetails?.data?.travellerDetails[
                              flight.id
                            ]?.map((trav, i) => {
                              var type = 'Traveller';

                              var index = i + 1;
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
                  </View> */}
                  <TravDetails adults={adults} child={child} infant={infants} />
                </View>
              );
            })}
          </View>
          <>
            {trip?.tripDetails?.cabs &&
              trip?.tripDetails?.cabs?.map((cab, s) => {
                console.log(cab);
                var cabSDate = cab.data.cabStartDate
                  ? new Date(cab.data.cabStartDate.seconds * 1000)
                      ?.toString()
                      ?.slice(4, 10)
                  : '';
                var cabEDate = cab.data.cabEndDate
                  ? new Date(cab.data.cabEndDate.seconds * 1000)
                      ?.toString()
                      ?.slice(4, 10)
                  : '';
                const adults =
                  trip?.tripDetails?.data?.travellerDetails[cab.id]?.adults;
                return (
                  <View style={{marginTop: responsiveHeight(1)}}>
                    {s === 0 ? (
                      <Text style={[styles.title, {textAlign: 'center'}]}>
                        Cabs
                      </Text>
                    ) : null}
                    <View style={{margin: responsiveHeight(1)}}>
                      <CCard
                        item={cab.data.cab}
                        startDate={cabSDate}
                        endDate={cabEDate}
                        data={cab.data}
                      />
                    </View>
                    <TravDetails adults={adults} />
                  </View>
                );
              })}
          </>
          <>
            {trip?.tripDetails?.bus?.map((buses, s) => {
              var cabSDate = buses?.data?.bus?.DepartureTime
                ? new Date(buses?.data?.bus?.DepartureTime)
                    ?.toString()
                    ?.slice(4, 10)
                : '';
              var cabEDate = buses?.data?.bus?.ArrivalTime
                ? new Date(buses?.data?.bus?.ArrivalTime)
                    ?.toString()
                    ?.slice(4, 10)
                : '';
              const adults =
                trip?.tripDetails?.data?.travellerDetails[buses.id]?.adults;
              return (
                <View style={{marginTop: responsiveHeight(1)}}>
                  {s === 0 ? (
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Cabs
                    </Text>
                  ) : null}
                  <View style={{margin: responsiveHeight(1)}}>
                    <BCard
                      item={buses.data.bus}
                      startDate={cabSDate}
                      endDate={cabEDate}
                      bookingBus={buses.data}
                    />
                  </View>
                  <TravDetails adults={adults} />
                </View>
              );
            })}
          </>
          <>
            {trip?.tripDetails?.otherBookings&&
              trip?.tripDetails?.otherBookings?.map((other, s) => {
                return (
                  <View style={{marginTop: responsiveHeight(1)}}>
                    {s === 0 ? (
                      <Text style={[styles.title, {textAlign: 'center'}]}>
                       Other
                      </Text>
                    ) : null}
                    <View style={{margin: responsiveHeight(1)}}>
                      <OCard
                        other={other}
                        
                      />
                    </View>
                    <TravDetails adults={other?.data?.bookingTravellers} />
                  </View>
                );
              })}
          </>
          {trip?.approvalRequest?.status === 'Pending' ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: responsiveHeight(1),
              }}>
              <Text
                style={{
                  fontSize: responsiveHeight(2),
                  color: colors.primary,
                  fontFamily: fonts.primary,
                }}>
                Approve this trip:
              </Text>
              <TouchableOpacity
                style={styles.btn}
                disabled={loading}
                onPress={() => handleApprove(trip,trip?.approvalRequest)}>
                {loading ? (
                  <ActivityIndicator color={colors.facebook} />
                ) : (
                  <Text style={styles.btnTitle}>Approve</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </PopUp>

      <PopUp value={open} handlePopUpClose={handleClose}>
        <View>
          <Text style={styles.subTitle}>Team Members</Text>
          {teamMembers?.length > 0 ? (
            <>
              {teamMembers.map(teamMember => {
                return (
                  // <View
                  //   style={[
                  //     styles.managerDataContainer,
                  //     {marginTop: responsiveHeight(1)},
                  //   ]}
                  //   key={teamMember.userId}>
                  <View style={styles.teamMembersContainer}>
                    <IconSwitcher
                      componentName="Octicons"
                      iconName="dot-fill"
                      iconsize={2.5}
                    />
                    <Text style={styles.managerDataTitle}>
                      {teamMember.name}({teamMember.email})
                    </Text>
                  </View>
                  // </View>
                );
              })}
            </>
          ) : null}
        </View>
      </PopUp>
    </>
  );
};

export default Role;
