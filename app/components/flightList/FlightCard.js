import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/responsiveScale';
import {BarIndicator} from 'react-native-indicators';
import {colors, fonts} from '../../config/theme';
import IconSwitcher from '../common/icons/IconSwitcher';
import MyContext from '../../context/Context';
import PopUp from '../common/popup/PopUp';
import HotelResList from '../hotel/HotelResList/HotelResList';
import WebView from 'react-native-webview';
const ruleType = {
  Cancellation: 'Cancellation',
  Reissue: 'Date change',
};
const FlightCard = ({
  flightGrp,
  index,
  bookingPage,
  segIndex,
  removeFilters,
}) => {
  const {
    actions,
    flightsLogosData,
    flightName,
    flightResList,
    bookingFlight,
    flightResJType,
  } = useContext(MyContext);
  var [baggage, setBaggage] = useState(false);
  var [baggageDtls, setBaggageDtls] = useState({});
  var [stopDtls, setStopDtls] = useState([]);
  var [showStopDtls, setShowStopDtls] = useState(false);
  var [cancellation, setCancellation] = useState(false);
  var [cancelDtls, setCancelDtls] = useState([]);
  var [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [flightResJType]);
  var flightArr = flightGrp.map((flight, f) => {
    return {...actions.modifyFlightObject(flight)};
  });
  const flightSymbol = useCallback(
    airlineName => {
      const logo = flightsLogosData.find(
        ele => ele.id === airlineName?.toLowerCase(),
      );
      return logo?.url;
    },
    [flightsLogosData],
  );
  const handleBaggage = () => {
    setBaggage(true);
    setBaggageDtls({
      baggage: flightArr[0].segments[0].baggage,
      cabinBaggage: flightArr[0].segments[0].cabinBaggage,
    });
  };
  const handleBaggageClose = () => {
    setBaggage(false);
    setBaggageDtls({});
  };
  const handleStops = item => {
    setStopDtls(item.segRoutes);
    setShowStopDtls(true);
  };
  const handleStopsClose = () => {
    setStopDtls([]);
    setShowStopDtls(false);
  };
  const handleCancellation = async () => {
    setCancellation(true);
    if (flightArr[0].fareRules.length === 0) {
      var details = await actions.fetchFareRule(
        flightArr[0].resultIndex,
        flightArr[0].segments[0].airlineName,
        600,
      );
      setCancelDtls(details);
    } else {
      setCancelDtls(flightArr[0].fareRules);
    }
  };
  const handleCancellationClose = () => {
    setCancellation(false);
    setCancelDtls([]);
  };
  const toggle = () => {
    setIsOpen(prev => !prev);
    // setIsOpen((prevIndices) => {
    //   if (prevIndices.includes(index)) {
    //     return prevIndices.filter((i) => i !== index);
    //   } else {
    //     return [...prevIndices, index];
    //   }
    // });
  };
  const handleRenderingFlightCard = ({item}) => {
    // console.log(item,"first")
    var flightCode = '';
    item.flightCodes.forEach((code, c) => {
      if (c === item.flightCodes.length - 1) {
        flightCode += code;
      } else {
        flightCode += `${code}, `;
      }
    });
    return (
      <View style={{rowGap: responsiveHeight(2)}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',gap:responsiveHeight(1),alignItems:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center',flex:1,flexWrap:'wrap'}}>
          <View style={styles.flightLogoContainer}>
            {flightSymbol(item.airlineName) ? (
              <Image
                source={{uri: flightSymbol(item.airlineName)}}
                style={styles.flightLogo}
                resizeMode="contain"
              />
            ) : (
              <IconSwitcher
                componentName="FontAwesome5"
                iconName="plane-departure"
                iconsize={3}
              />
            )}
          </View>
         <View>
         <Text style={styles.airlineName}>
            {`${item.airlineName}`}
            <Text style={styles.flightNumbers}>({flightCode})</Text>
          </Text>
         </View>
        </View>
        {bookingPage ? (
            <View
              style={{
                backgroundColor: colors.highlight,
                padding: responsiveHeight(1),
                borderTopLeftRadius: responsiveHeight(2),
                borderBottomLeftRadius: responsiveHeight(2),
                maxHeight:responsiveHeight(5),
                alignItems:'center',
                justifyContent:'center'
              }}>
              <Text
                style={{
                  fontSize: responsiveHeight(1.8),
                  fontFamily: fonts.primary,
                  color: colors.primary,
                }}>
                {item.depTimeDate.toString().slice(4, 10)}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.flightsTimingContainer}>
          <View style={styles.originContainer}>
            <Text style={styles.originTitle}>{item.depTime}</Text>
            <Text style={styles.flightTimings}>{item.originAirportCode}</Text>
          </View>
          <View style={styles.directionContainer}>
            <TouchableOpacity
              style={styles.stopsBtn}
              onPress={() => handleStops(item)}>
              <Text style={styles.stopsBtnText}>
                {item.stopOverPts.length === 0
                  ? 'Direct'
                  : `${
                      item.stopOverPts.length > 1
                        ? `${item.stopOverPts.length} stops`
                        : '1 stop'
                    }`}
              </Text>
              {item.stopOverPts.length !== 0 ? (
                <IconSwitcher
                  componentName="EvilIcons"
                  iconName="chevron-up"
                  iconsize={3.5}
                  color={colors.highlight}
                />
              ) : null}
            </TouchableOpacity>
            <View style={{borderTopWidth: 1, borderStyle: 'dashed'}}></View>
            <Text style={styles.flighttotalTime}>{item.duration}</Text>
          </View>
          <View style={styles.destinationContainer}>
            <Text style={styles.destinationTitle}>{item.arrTime} </Text>
            <Text style={styles.flightTimings}>{item.destAirportCode}</Text>
          </View>
          <View>
            {/* {
              <View>
                <Text>{`+ ${item.arrAfterDays}`}</Text>
                <Text>{`${item.arrAfterDays > 1 ? "Days" : "Day"}`}</Text>
                </View>
            }  */}
          </View>
        </View>
       
        {bookingPage ? (
          <View style={styles.bookingFlightCityNameAirportName}>
            <View style={{width: '50%'}}>
              <Text
                style={{
                  fontFamily: fonts.primary,
                  color: colors.primary,
                  fontSize: responsiveHeight(1.5),
                }}>
                {item.originCityName}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.subTitle,
                  color: colors.primary,
                  fontSize: responsiveHeight(1.5),
                }}>
                {item.originAirportName}
              </Text>
            </View>
            <View style={{width: '50%', alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontFamily: fonts.primary,
                  color: colors.primary,
                  fontSize: responsiveHeight(1.5),
                }}>
                {item.destCityName}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.subTitle,
                  color: colors.primary,
                  fontSize: responsiveHeight(1.5),
                }}>
                {item.destAirportName}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  };
  const increaseFontSizeScript = `
  var style = document.createElement('style');
  style.innerHTML = 'body { font-size: 40px !important; }';
  document.head.appendChild(style);
`;
  return (
    <View
      style={
        bookingFlight &&
        bookingFlight[flightResJType]?.arrIndex === index &&
        !bookingPage
          ? {...styles.selectedCard}
          : styles.mainContainer
      }>
      <FlatList
        data={flightArr[0].segments}
        renderItem={handleRenderingFlightCard}
        keyExtractor={item => item.resultIndex}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        ListEmptyComponent={<Text>No Data!!!</Text>}
      />
      {!bookingPage ? (
        <View>
          <View style={styles.flightPricesContainer}>
            <View style={styles.luggageBagContainer}>
              <TouchableOpacity onPress={handleBaggage}>
                <IconSwitcher
                  componentName="MaterialCommunityIcons"
                  iconName="bag-suitcase-outline"
                  color="black"
                  iconsize={3.5}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancellation}>
                <IconSwitcher
                  componentName="MaterialCommunityIcons"
                  iconName="calendar-remove"
                  color="black"
                  iconsize={3.5}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={styles.farePrice}>{`₹ ${flightArr[0].fare.toLocaleString(
                'en-IN',
              )}`}</Text>
            </View>
            {!bookingPage ? (
              <TouchableOpacity
                style={styles.bookingButton}
                onPress={() => {
                  if (flightResJType === 1 && !bookingFlight.length > 0) {
                    setOpen(true);
                  } else {
                    actions.fetchFlightBookData(
                      flightArr[0].resultIndex,
                      flightGrp[0],
                      {
                        baggage: flightArr[0].segments[0].baggage,
                        cabinBaggage: flightArr[0].segments[0].cabinBaggage,
                      },
                      index,
                    );
                  }
                  removeFilters();
                }}>
                <Text style={styles.bookingButtonText}>
                  {flightResList.length > 1 ? 'Select' : 'Book'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.bookingFlightTravellerDetailsContainer}>
            <View style={styles.bookingFlightFareContainer}>
              <Text style={styles.bookingFlightFareText}>
                {bookingFlight[index].flightNew.fareType}
              </Text>
            </View>
            <Text style={styles.bookingFlightText}>
              {`${bookingFlight[index].adults} ${
                bookingFlight[index].adults > 1 ? 'Adults' : 'Adults'
              } ${
                bookingFlight[index].child > 0
                  ? `, ${bookingFlight[index].child} ${
                      bookingFlight[index].child > 1 ? 'children' : 'child'
                    }`
                  : ''
              }${
                bookingFlight[index].infant > 0
                  ? ` , ${bookingFlight[index].infant} ${
                      bookingFlight[index].infant > 1 ? 'infants' : 'infant'
                    }`
                  : ''
              }`}
            </Text>
            <Text style={styles.bookingFlightText}>
              {flightArr[0].segments[0].cabinClass}
            </Text>
          </View>
        </View>
      )}
      {flightArr.length > 1 ? (
        <TouchableOpacity style={styles.viewAllPrice} onPress={toggle}>
          <Text style={styles.viewAllPriceTitle}>View Prices</Text>
          <IconSwitcher
            componentName="Feather"
            iconName={isOpen ? 'chevron-up' : 'chevron-down'}
            iconsize={2.5}
            color={colors.black}
          />
        </TouchableOpacity>
      ) : null}
      {isOpen && (
        <View>
          {flightArr.map((flight, f) => {
            if (f > 0) {
              return (
                <View style={styles.viewPriceCard}>
                  <Text style={styles.fareType}>{`${flight.fareType}`}</Text>
                  <View style={styles.flightPricesContainer}>
                    <View style={styles.luggageBagContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setBaggage(true);
                          setBaggageDtls({
                            baggage: flight.segments[0].baggage,
                            cabinBaggage: flight.segments[0].cabinBaggage,
                          });
                        }}>
                        <IconSwitcher
                          componentName="MaterialCommunityIcons"
                          iconName="bag-suitcase-outline"
                          color="black"
                          iconsize={2.8}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          setCancellation(true);
                          if (flight.fareRules.length === 0) {
                            var details = await actions.fetchFareRule(
                              flight.resultIndex,
                              flightArr[f].segments[0].airlineName,
                              600,
                            );
                            setCancelDtls(details);
                          } else {
                            setCancelDtls(flightArr[f].fareRules);
                          }
                        }}>
                        <IconSwitcher
                          componentName="MaterialCommunityIcons"
                          iconName="calendar-remove"
                          color="black"
                          iconsize={2.8}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text
                        style={
                          styles.farePrice
                        }>{`₹ ${flight.fare.toLocaleString('en-IN')}`}</Text>
                    </View>
                    {!bookingPage ? (
                      <TouchableOpacity
                        style={styles.bookingButton}
                        onPress={() => {
                          actions.fetchFlightBookData(
                            flight.resultIndex,
                            flightGrp[f],
                            {
                              baggage: flight.segments[0].baggage,
                              cabinBaggage: flight.segments[0].cabinBaggage,
                            },
                            index,
                          );
                          removeFilters();
                        }}>
                        <Text style={styles.bookingButtonText}>
                          {flightResList.length > 1 ? 'Select' : 'Book'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            }
          })}
        </View>
      )}

      {/* {baggagePopUp} */}
      <Modal animationType="slide" transparent={true} visible={baggage}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: colors.black,
              position: 'absolute',
              opacity: 0.5,
            }}></View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '20%',
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
              }}>
              <TouchableOpacity
                onPress={handleBaggageClose}
                style={{alignItems: 'flex-end'}}>
                <IconSwitcher
                  componentName="Entypo"
                  iconName="cross"
                  iconsize={3}
                  color="black"
                />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fonts.textInput,
                    color: colors.primary,
                  }}>{`${
                  baggageDtls.baggage
                    ? `Check-In baggage: ${baggageDtls.baggage}`
                    : ''
                }${
                  baggageDtls.baggage && baggageDtls.cabinBaggage ? ' | ' : ''
                } ${
                  baggageDtls.cabinBaggage
                    ? `Cabin baggage: ${baggageDtls.cabinBaggage}`
                    : ''
                }`}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* {stopsPopUp} */}
      <Modal animationType="slide" transparent={true} visible={showStopDtls}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: colors.black,
              position: 'absolute',
              opacity: 0.5,
            }}></View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
              }}>
              <TouchableOpacity
                onPress={handleStopsClose}
                style={{alignItems: 'flex-end'}}>
                <IconSwitcher
                  componentName="Entypo"
                  iconName="cross"
                  iconsize={3}
                  color="black"
                />
              </TouchableOpacity>
              <View>
                {stopDtls &&
                  stopDtls.map((stop, s) => {
                    return (
                      <View>
                        {stop.layoverDur ? (
                          <View style={{flexDirection: 'row'}}>
                            <IconSwitcher
                              componentName="AntDesign"
                              iconsize={3}
                              iconName="arrowright"
                              color="black"
                            />
                            <Text style={styles.bookingFlightText}>
                              {' '}
                              {`Layover for ${stop.layoverDur} in ${stop.arrCity}`}
                            </Text>
                          </View>
                        ) : null}
                        <View style={styles.flightsTimingContainer}>
                          <View style={styles.originContainer}>
                            <Text style={styles.originTitle}>
                              {stop.depTime}
                            </Text>
                            <Text style={styles.flightTimings}>
                              {stop.originCode}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.directionContainer,
                              {justifyContent: 'center'},
                            ]}>
                            <View
                              style={{
                                borderTopWidth: 1,
                                borderStyle: 'dashed',
                              }}></View>
                            <Text style={styles.flighttotalTime}>
                              {stop.flightDur}
                            </Text>
                          </View>
                          <View style={styles.destinationContainer}>
                            <Text style={styles.destinationTitle}>
                              {' '}
                              {stop.arrTime}
                            </Text>
                            <Text style={styles.flightTimings}>
                              {' '}
                              {stop.destCode}
                            </Text>
                          </View>
                          <View></View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* {CancellationPopUp} */}
      <PopUp
        value={cancellation}
        handlePopUpClose={handleCancellationClose}
        customStyles={{width: '100%'}}>
        {cancelDtls.length === 0 ? (
          <View style={styles.BarIndicatorContainer}>
            <BarIndicator
              color={colors.highlight}
              count={5}
              size={responsiveFontSize(3)}
            />
          </View>
        ) : (
          <>
            {Array.isArray(cancelDtls) ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cancelTableTitleCell}>
                    Journey points
                  </Text>
                  <Text style={styles.cancelTableTitleCell}>Type</Text>
                  <Text style={styles.cancelTableTitleCell}>Range</Text>
                  <Text style={styles.cancelTableTitleCell}>Charge</Text>
                </View>
                <View style={styles.solidLine} />
                <View>
                  {cancelDtls.map((ruleBlock, ru) => {
                    return (
                      <View key={ru}>
                        {ruleBlock.map((rule, r) => {
                          return (
                            <View style={{flexDirection: 'row'}} key={r}>
                              <View style={styles.cancelTableCell}>
                                <Text style={styles.cancelTableRowTitle}>
                                  {rule.JourneyPoints}
                                </Text>
                              </View>
                              <View style={styles.cancelTableCell}>
                                <Text style={styles.cancelTableRowTitle}>
                                  {ruleType[rule.Type]}
                                </Text>
                              </View>
                              <View style={styles.cancelTableCell}>
                                <Text style={styles.cancelTableRowTitle}>
                                  {rule.To === null ||
                                  rule.From === null ||
                                  rule.Unit === null
                                    ? '-'
                                    : rule.To === ''
                                    ? `Upto ${rule.From} ${rule.Unit} from departure`
                                    : rule.From === '0'
                                    ? `After ${rule.To} ${rule.Unit} from departure`
                                    : `Between ${rule.To} & ${rule.From} ${rule.Unit} from departure`}
                                </Text>
                              </View>
                              <View style={styles.cancelTableCell}>
                                <Text style={styles.cancelTableRowTitle}>
                                  {rule.Details}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
                <View style={styles.horizentalLine} />
              </>
            ) : (
              <View style={{height: responsiveHeight(40)}}>
                <WebView
                  source={{html: cancelDtls}}
                  nestedScrollEnabled
                  injectedJavaScript={increaseFontSizeScript}
                />
              </View>
            )}
          </>
        )}
      </PopUp>
      <PopUp
        value={open}
        handlePopUpClose={() => {
          setOpen(false);
          actions.setFlightResJType(0);
        }}>
        <Text style={styles.popUpNotification}>
          Please select onward flight first
        </Text>
      </PopUp>
    </View>
  );
};

export default React.memo(FlightCard);
const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(3),
    backgroundColor: colors.white,
    borderRadius: responsiveHeight(2),
    rowGap: responsiveHeight(2.5),
    // elevation: responsiveHeight(0.8),
    shadowColor: colors.black,
    shadowOffset: {width: responsiveWidth(-0.2), height: responsiveHeight(-5)},
    shadowOpacity: responsiveHeight(0.3),
    shadowRadius: responsiveHeight(3),
    elevation: responsiveHeight(0.4),
    marginHorizontal: responsiveWidth(3.5),
    marginTop: responsiveHeight(2.5),
  },
  selectedCard: {
    backgroundColor: colors.highlightLite,
    borderWidth: 2,
    borderColor: colors.highlight,
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(3),
    borderRadius: responsiveHeight(2),
    rowGap: responsiveHeight(2.5),
    // elevation: responsiveHeight(1),
    marginHorizontal: responsiveWidth(3.5),
    marginTop: responsiveHeight(2.5),
  },
  flightLogoContainer: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flightLogo: {
    height: responsiveHeight(7),
    width: responsiveWidth(7),
  },
  logoHeader: {
    flexDirection: 'row',
    // columnGap: responsiveWidth(3),
    alignItems: 'center',
    // justifyContent: 'space-between'
    // borderWidth: 2,
  },
  flightsTimingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flightPricesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionContainer: {
    width: '50%',
    rowGap: 4,
  },
  luggageBagContainer: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flightRouteEachCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1.5),
    backgroundColor: colors.highlightTranslucent,
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    alignContent: 'center',
  },
  horizentalLineContainer: {
    justifyContent: 'center',
    width: '50%',
    rowGap: responsiveHeight(1),
  },
  horizentalLine: {
    borderBottomWidth: responsiveWidth(0.3),
    borderStyle: 'dashed',
    marginVertical: '4%',
    color: colors.black,
  },
  eachFlighttotalTime: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.textFont,
    color: colors.black,
  },
  layOver: {
    marginBottom: responsiveHeight(1.5),
    paddingHorizontal: responsiveHeight(2),
  },
  destinationContainer: {
    alignItems: 'flex-end',
    rowGap: responsiveHeight(0.5),
    width: '25%',
  },
  originContainer: {
    rowGap: responsiveHeight(0.5),
    width: '25%',
  },
  destinationTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: fonts.primary,
    color: colors.black,
  },
  originTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: fonts.primary,
    color: colors.black,
  },
  flightTimings: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.textFont,
    color: colors.black,
  },
  layoverTitle: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: fonts.primary,
    color: colors.red,
  },
  layoverTiming: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.textFont,
    color: colors.gray,
  },
  modelMainContainer: {
    justifyContent: 'center',
    height: '100%',
    backgroundColor: colors.gray,
  },
  modelSubContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: responsiveWidth(3),
    marginHorizontal: responsiveWidth(2),
    borderRadius: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
    borderWidth: 1,
    borderStyle: 'dashed',
    elevation: responsiveHeight(1),
  },
  crossIcon: {
    alignItems: 'flex-end',
    padding: responsiveHeight(1),
  },
  airlineName: {
    fontSize: responsiveWidth(4.2),
    fontFamily: fonts.primary,
    color: colors.black,
  },
  flightNumbers: {
    fontSize: responsiveWidth(3.5),
    fontFamily: fonts.textInput,
    color: colors.gray,
    // borderWidth:1,
    // paddingHorizontal:10
  },
  stopsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // columnGap: responsiveWidth(2),
  },
  stopsBtnText: {
    color: colors.highlight,
    fontSize:responsiveHeight(1.5),
    fontFamily:fonts.primary
  },
  flighttotalTime: {
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
    fontFamily: fonts.textFont,
    color: colors.black,
    letterSpacing: responsiveHeight(0.5),
  },
  farePrice: {
    color: colors.secondary,
    fontSize: responsiveWidth(4),
    fontFamily:fonts.primary
  },
  bookingButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveHeight(3),
    borderRadius: responsiveHeight(2),
    paddingVertical: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingButtonText: {
    color: colors.white,
    fontFamily: fonts.textFont,
    fontSize: responsiveHeight(1.7),
  },
  viewAllEachCard: {
    rowGap: responsiveHeight(0.9),
    width: '30%',
  },
  viewAlliconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewAllRenderingContainer: {
    marginBottom: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: responsiveHeight(2),
    padding: responsiveHeight(1.3),
  },
  fareClassification: {
    fontSize: responsiveHeight(1.6),
    fontFamily: fonts.primary,
    color: colors.facebook,
  },
  luggagePopUpmodelSubcontainer: {
    marginHorizontal: responsiveWidth(5),
    paddingHorizontal: responsiveHeight(2),
    borderRadius: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: colors.white,
  },
  cancelTableTitleCell: {
    width: '25%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.textFont,
    fontSize: responsiveHeight(1.8),
    color: colors.black,
  },
  cancelTableCell: {
    width: '25%',
    color: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveHeight(1),
  },
  cancelTableRowTitle: {
    fontFamily: fonts.textInput,
    fontSize: responsiveHeight(1.5),
    color: colors.black,
  },
  line: {
    borderTopWidth: 1,
    borderColor: colors.black,
  },
  luaggageBagPopupContainer: {
    rowGap: responsiveHeight(1.2),
  },
  luaggageBagPopuptext: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textFont,
    color: colors.black,
  },
  MiniFareRulesRenderingContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
  },
  solidLine: {
    borderTopWidth: 1,
    borderColor: colors.black,
    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveWidth(1.5),
  },
  dashedLine: {
    borderTopWidth: 1,
    borderColor: colors.black,
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1.5),
    borderStyle: 'dashed',
  },
  bookingFlightTravellerDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingFlightFareContainer: {
    paddingVertical: responsiveHeight(0.4),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveHeight(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
  },
  bookingFlightFareText: {
    fontSize: responsiveHeight(1.5),
    color: colors.white,
    fontFamily:fonts.textFont
  },
  bookingFlightText: {
    fontSize: responsiveHeight(1.8),
    color: colors.black,
    fontFamily:fonts.textFont
  },
  bookingFlightCityNameAirportName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  viewAllPrice: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    columnGap: responsiveWidth(1),
  },
  viewAllPriceTitle: {
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.textFont,
    color: colors.primary,
  },
  viewPriceCard: {
    marginBottom: responsiveHeight(2),
    padding: responsiveHeight(1.8),
    borderRadius: responsiveHeight(2),
    backgroundColor: '#f5f5f5',
    gap: responsiveHeight(0.5),
  },
  fareType: {
    fontSize: responsiveHeight(1.5),
    color: '#108bbc',
    fontFamily: fonts.primary,
  },
  BarIndicatorContainer: {
    height: responsiveHeight(5),
  },
  popUpNotification: {
    fontSize: responsiveHeight(1.8),
    color: '#fb4143',
    fontFamily: fonts.primary,
    textAlign: 'center',
  },
});
