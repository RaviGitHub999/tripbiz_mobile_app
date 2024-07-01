import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, ActivityIndicator } from 'react-native';
import { styles } from './RoleStyles';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors, fonts } from '../../../config/theme';
import ChangePasswordInput from '../changePassword/ChangePasswordInput';
import { responsiveHeight } from '../../../utils/responsiveScale';
import MyContext from '../../../context/Context';
import { ScrollView } from 'react-native-gesture-handler';
import {
  BarIndicator,
} from 'react-native-indicators';
import PopUp from '../../common/popup/PopUp';
import HCard from '../../Trips/TripDetails/HCard';
import TravDetails from '../../Trips/TripDetails/TravDetails';
import FCard from '../../Trips/TripDetails/FCard';
import { useNavigation } from '@react-navigation/native';
const Role = () => {
  const { actions, userAccountDetails, flightsLogosData, teamMembers, notifications, approveLoading } = useContext(MyContext)
  const [openManager, setOpenManager] = useState(false);
  const [managerData, setManagerData] = useState({
    name: '',
    email: ''
  })
  const [selectedTab, setSelectedTab] = useState("Pending")
  const [tripsData, setTripsData] = useState([]);
  const [mounted, setMounted] = useState(true);
  const [openTrip, setOpenTrip] = useState(null)
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(false)
  const{goBack}=useNavigation()
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };


  const handleManagerDataChange = (value, name) => {
    setManagerData({ ...managerData, [name]: value });
  };

  const handleManager = () => {
    actions.editManager(managerData);
  }
  var getTripData = async () => {
    var data = await actions.getTripsForApproval(
      userAccountDetails?.approvalRequests
    );
    setTripsData(data);
  };

  useEffect(() => {
    if (mounted) {
      console.log("loading")
      getTripData();
      actions.handleFlightsLogos();
    }
    return () => {
      setMounted(false);
    };
  }, []);
  var getDate = (seconds) => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const dayofyear = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    var dateString = `${month.slice(0, 3)} ${dayOfWeek} ${dayofyear}`;
    return dateString;
  };
  var handleApprove = async (req) => {
    setLoading(true)
    await actions.approveTripRequest(req, userAccountDetails?.userid)
    setOpenTrip(false)
    setLoading(false)
    setTripsData()
    await getTripData()
}
console.log(tripsData)
  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <ScrollView>
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
                    <Text style={styles.subTitle}>Team Members</Text>
                    <View>
                      {teamMembers?.length > 0 ? (
                        <>
                          {teamMembers.map(teamMember => {
                            return (
                              <View
                                style={[
                                  styles.managerDataContainer,
                                  {marginTop: responsiveHeight(1)},
                                ]}
                                key={teamMember.userId}>
                                <Text style={styles.managerDataTitle}>
                                  {teamMember.name}({teamMember.email})
                                </Text>
                              </View>
                            );
                          })}
                        </>
                      ) : null}
                    </View>
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
                  ) : tripsData.length > 0 ? (
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

                        return (
                          <View
                            style={styles.card}
                            key={trip.approvalRequest.requestId}>
                            <View style={styles.headers}>
                              <Text style={styles.cardTitle}>
                                {trip?.userDetails?.firstName}
                              </Text>
                              <Text style={styles.cardTitle}>
                                {trip?.tripDetails?.data?.name}
                              </Text>
                              <Text style={styles.cardTitle}>
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
                            </View>
                            <Text style={styles.priceTitle}>
                              Total price:{' '}
                              <Text style={styles.price}>
                                {' '}
                                &#8377;{' '}
                                {`${
                                  trip?.approvalRequest?.totalPrice
                                    ? Math.ceil(
                                        trip?.approvalRequest?.totalPrice,
                                      )
                                    : ''
                                } `}
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

                            <TouchableOpacity
                              style={styles.DetailsBtn}
                              onPress={() => {
                                setTrip(trip);
                                setOpenTrip(true);
                              }}>
                              <Text
                                style={[
                                  styles.priceTitle,
                                  {color: colors.white},
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
              var adults = hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
                (acc, obj) => {
                  acc.adults += parseInt(obj.adults, 10);
                  acc.child += parseInt(obj.child, 10);
                  return acc;
                },
                {adults: 0, child: 0},
              );
              return (
                <>
                  {s === 0 ? (
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Hotels
                    </Text>
                  ) : null}
                  <View style={styles.hotelCard}>
                    <HCard
                      hotel={hotel}
                      formattedDate1={formattedDate1}
                      endDate={endDate}
                      adults={adults}
                    />
                  </View>
                  <View style={styles.card}>
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Traveller Details
                    </Text>
                    <View>
                      <>
                        {trip?.tripDetails?.data?.travellerDetail ? (
                          <>
                            {trip?.tripDetails?.data.travellerDetail[
                              hotel.id
                            ]?.map((trav, i) => {
                              var index = i + 1;
                              return (
                                <TravDetails
                                  trav={trav}
                                  type={'Traveller'}
                                  index={index}
                                />
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {trip?.tripDetails?.data?.travellerDetails[
                              hotel.id
                            ]?.map((trav, i) => {
                              var index = i + 1;
                              return (
                                <TravDetails
                                  trav={trav}
                                  type={'Traveller'}
                                  index={index}
                                />
                              );
                            })}
                          </>
                        )}
                      </>
                    </View>
                  </View>
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

              return (
                <>
                  {s === 0 ? (
                    <Text style={[styles.title, {textAlign: 'center'}]}>
                      Flights
                    </Text>
                  ) : null}
                  <View style={styles.hotelCard}>
                    <FCard airline={airline} flightArr={flightArr} />
                    <View
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
                    </View>
                  </View>
                  <View style={styles.card}>
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
                  </View>
                </>
              );
            })}
          </View>

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
                onPress={() => handleApprove(trip?.approvalRequest)}>
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
    </>
  );
};

export default Role;
