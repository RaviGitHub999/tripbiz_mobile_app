import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import MyContext from '../../../context/Context'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import PopUp from '../../common/popup/PopUp'
const TripDetailsFlightCard = ({
    flightGrp,
    index,
    bookingPage,
    flightBooking,
    flightStatus,
    flightReq,
    timeStamp,
    reqColor,
    tripId,
    flightId
}) => {
    var [stopDtls, setStopDtls] = useState([]);
    var [showStopDtls, setShowStopDtls] = useState(false);
    var [tripsBaggage, setTripsBaggage] = useState(false)
    var [tripsCancellation, setTripsCancellation] = useState(false)
    var [tripsMeals, setTripsMeals] = useState(false)
    var [tripsSeat, setTripsSeat] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteId, setDeleteId] = useState(false)
    const [deleteType, setDeleteType] = useState(false)
    const { actions, flightsLogosData, flightResList, bookingFlight, flightResJType, } = useContext(MyContext)
    var flightArr = flightGrp.map((flight, f) => {
        return { ...actions.modifyFlightObject(flight) };
    });
    let airlinename = flightArr[0].segments[0].airlineName;
    const flightSymbol = useCallback(
        airlineName => {
            const logo = flightsLogosData.find(
                ele => ele.id === airlineName?.toLowerCase(),
            );
            return logo?.url;
        },
        [flightsLogosData],
    );
 const handleDelete = async () => {
        await actions.deleteTripItem(tripId, deleteId, deleteType);
        setOpenDelete(false)
      }
    const handleRenderingFlightCard = ({ item }) => {
        var flightCode = '';
        item.flightCodes.forEach((code, c) => {
            if (c === item.flightCodes.length - 1) {
                flightCode += code;
            } else {
                flightCode += `${code}, `;
            }
        });
        return (
            <View style={styles.card}>

                <View style={{ rowGap: responsiveHeight(1.2) }}>
                    <View style={bookingFlight ? { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } : styles.logoHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: "80%", flexWrap: "wrap" }}>
                            <View style={styles.flightLogoContainer}>
                                {flightSymbol(airlinename) ? (
                                    <Image
                                        source={{ uri: flightSymbol(airlinename) }}
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
                            <View >
                                <Text style={styles.airlineName}> {`${item.airlineName}`}</Text>
                            </View>
                            <View >
                                <Text style={styles.flightNumbers}> ({flightCode})</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: colors.highlight, padding: responsiveHeight(1), borderTopLeftRadius: responsiveHeight(2), borderBottomLeftRadius: responsiveHeight(2), marginRight: responsiveHeight(-1.5) }}>
                            <Text style={{ fontSize: responsiveHeight(1.8), fontFamily: fonts.primary, color: colors.primary }}>{item.depTimeDate.toString().slice(4, 10)}</Text>
                        </View>
                    </View>
                    <View style={styles.flightsTimingContainer}>
                        <View style={styles.originContainer}>
                            <Text style={styles.originTitle}>{item.originAirportCode}</Text>
                            <Text style={styles.flightTimings}>{item.depTime}</Text>
                        </View>
                        <View style={styles.directionContainer}>
                            <TouchableOpacity style={styles.stopsBtn} onPress={() => handleStops(item)}>
                                <Text style={styles.stopsBtnText}>
                                    {item.stopOverPts.length === 0
                                        ? 'Direct'
                                        : `${item.stopOverPts.length > 1
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
                            <View style={{ borderTopWidth: 1, borderStyle: 'dashed' }}></View>
                            <Text style={styles.flighttotalTime}>{item.duration}</Text>
                        </View>
                        <View style={styles.destinationContainer}>
                            <Text style={styles.destinationTitle}> {item.destAirportCode}</Text>
                            <Text style={styles.flightTimings}> {item.arrTime}</Text>
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

                    <View style={styles.bookingFlightCityNameAirportName}>
                        <View style={{ width: "50%", gap: responsiveHeight(0.3) }}>
                            <Text style={{ fontFamily: fonts.primary, color: colors.lightGray, fontSize: responsiveHeight(1.5) }}>{item.originCityName}</Text>
                            <Text style={{ fontFamily: fonts.primary, color: "#969696", fontSize: responsiveHeight(1.5) }}>{item.originAirportName}</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'flex-end', gap: responsiveHeight(0.3) }}>
                            <Text style={{ fontFamily: fonts.primary, color: colors.lightGray, fontSize: responsiveHeight(1.5) }}>{item.destCityName}</Text>
                            <Text style={{ fontFamily: fonts.primary, color: "#969696", fontSize: responsiveHeight(1.5) }}  >{item.destAirportName}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.flightBookingTravellerDetailsContainer}>
                    <Text style={styles.flightBookingTravellerDetailsTitle}>{flightBooking.flightNew.fareType}</Text>
                    <Text style={styles.flightBookingTravellerDetailsTitle}>{`${flightBooking.travellers
                        } ${flightBooking.travellers > 1 ? "travellers" : "traveller"
                        }`}</Text>
                    <Text style={styles.flightBookingTravellerDetailsTitle}>{flightArr[0].segments[0].cabinClass}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
                    <TouchableOpacity onPress={handlehoteltripsBaggageinfo}>
                        <IconSwitcher componentName='MaterialIcons' iconName='luggage' color={colors.primary} iconsize={3} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlehoteltripsCancellationinfo}>
                        <IconSwitcher componentName='FontAwesome6' iconName='calendar-xmark' color={colors.primary} iconsize={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlehoteltripsMealsinfo}>
                        <IconSwitcher componentName='MaterialCommunityIcons' iconName='silverware-fork-knife' color={colors.primary} iconsize={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlehoteltripsSeatinfo}>
                        <IconSwitcher componentName='FontAwesome5' iconName='chair' color={colors.primary} iconsize={2.5} />
                    </TouchableOpacity>
                </View>

                <View style={styles.flightPriceMainContainer}>
                    {
                        flightStatus ?
                            <>
                                {
                                    flightStatus?.status ?
                                        <View style={styles.bookingStatusTitlesMainContainer}>
                                            <Text style={styles.bookingStatusTitles}>{`Booking Status : `}</Text>
                                            <View style={[styles.bookingStatusTextContainer, { backgroundColor:  reqColor[0] ? reqColor[0]?.color : "#808080" }]}>
                                                <Text style={styles.bookingStatusText}>{flightStatus.status}</Text>
                                            </View>
                                        </View> : null
                                }
                            </> :

                            <View style={styles.bookingStatusTitlesMainContainer}>
                                <Text style={styles.bookingStatusTitles}>{`Booking Status : `}</Text>
                                <View style={[styles.bookingStatusTextContainer, { backgroundColor:  reqColor[0] ? reqColor[0]?.color : "#808080" }]}>
                                    <Text style={styles.bookingStatusText}>Not Submitted</Text>
                                </View>
                            </View>
                    }

                    <View style={styles.bookingStatusTitlesMainContainer}>
                        <Text style={styles.bookingStatusTitles}>{`Approval Status : `}</Text>
                        <View style={[styles.bookingStatusTextContainer, { backgroundColor:  reqColor[0] ? reqColor[0]?.color : "#808080"}]}>
                            <Text style={styles.bookingStatusText}>{flightReq[0]?.requestStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.hotelTotalPriceContainer}>
                        <Text style={styles.hotelTotalPrice}>{`Total Price : ₹ ${Math.ceil(flightBooking?.finalPrice)?.toLocaleString("en-IN")}`}</Text>
                        <TouchableOpacity onPress={() => { }}>
                            <IconSwitcher componentName='Entypo' iconName='info-with-circle' color={colors.black} iconsize={1.8} />
                        </TouchableOpacity>
                    </View>
                    {/* <Text>{`Approval Status : `}<Text>{flightReq[0]?.requestStatus}</Text></Text>
                    <Text>{`Total Price : ₹ ${Math.ceil(flightBooking?.finalPrice)?.toLocaleString("en-IN")}`}</Text> */}
                </View>

                <View style={styles.addedFlightTimeAndDateContainer}>
                    <View style={styles.addedFlightTitleContainer}>
                        <Text style={styles.bookingStatusTitles}>{`Added Date: `}<Text style={styles.addedHotelTimeAndDate}>{`${timeStamp.toLocaleString()}`}</Text></Text>
                    </View>
                    <>
                        <TouchableOpacity onPress={() => {
                    setOpenDelete(true)
                    setDeleteType("flights")
                    setDeleteId(flightId)
                  }}>
                            <IconSwitcher componentName='MaterialIcons' iconName='delete' color={colors.red} iconsize={2.5} />
                        </TouchableOpacity>
                    </>
                </View>

            </View>

        );
    };
    const handleStops = (item) => {
        setStopDtls(item.segRoutes);
        setShowStopDtls(true);
    }
    const handleStopsClose = () => {
        setStopDtls([]);
        setShowStopDtls(false);
    }
    const handlehoteltripsBaggageinfo = () => {
        setTripsBaggage(true)
    }
    const handlehoteltripsBaggageinfoClose = () => {
        setTripsBaggage(false)
    }
    const handlehoteltripsCancellationinfo = () => {
        setTripsCancellation(true)
    }
    const handlehoteltripsCancellationinfoClose = () => {
        setTripsCancellation(false)
    }
    const handlehoteltripsMealsinfo = () => {
        setTripsMeals(true)
    }
    const handlehoteltripsMealsinfoClose = () => {
        setTripsMeals(false)
    }
    const handlehoteltripsSeatinfo = () => {
        setTripsSeat(true)
    }
    const handlehoteltripsSeatinfoClose = () => {
        setTripsSeat(false)
    }
    return (

        <View style={{ flex: 1 }}>
            <FlatList
                data={flightArr[0].segments}
                renderItem={handleRenderingFlightCard}
                keyExtractor={item => item.resultIndex}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={showStopDtls}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: "100%", width: "100%", backgroundColor: colors.black, position: "absolute", opacity: 0.5, }}></View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                        <View style={{ backgroundColor: 'white', width: '100%', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }}>
                            <TouchableOpacity onPress={handleStopsClose} style={{ alignItems: 'flex-end' }}>
                                <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                            </TouchableOpacity>
                            <View>
                                {
                                    stopDtls &&
                                    stopDtls.map((stop, s) => {
                                        return (

                                            <View>
                                                {
                                                    stop.layoverDur ?
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <IconSwitcher componentName='AntDesign' iconsize={3} iconName='arrowright' color='black' />
                                                            <Text> {`Layover for ${stop.layoverDur} in ${stop.arrCity}`}</Text>
                                                        </View>
                                                        : null
                                                }
                                                <View style={styles.flightsTimingContainer}>

                                                    <View style={styles.originContainer}>
                                                        <Text style={styles.originTitle}>{stop.depTime}</Text>
                                                        <Text style={styles.flightTimings}>{stop.originCode}</Text>
                                                    </View>
                                                    <View style={[styles.directionContainer, { justifyContent: 'center' }]}>
                                                        <View style={{ borderTopWidth: 1, borderStyle: 'dashed' }}></View>
                                                        <Text style={styles.flighttotalTime}>{stop.flightDur}</Text>
                                                    </View>
                                                    <View style={styles.destinationContainer}>
                                                        <Text style={styles.destinationTitle}> {stop.arrTime}</Text>
                                                        <Text style={styles.flightTimings}> {stop.destCode}</Text>
                                                    </View>
                                                    <View></View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <PopUp value={tripsBaggage} handlePopUpClose={handlehoteltripsBaggageinfoClose}>
                <Text>No extra baggage</Text>
            </PopUp>

            <PopUp value={tripsCancellation} handlePopUpClose={handlehoteltripsCancellationinfoClose}>
                {
                    Array.isArray(flightBooking?.flight?.MiniFareRules) ? (
                        <>
                            {
                                flightBooking?.flight?.MiniFareRules &&
                                    flightBooking?.flight?.MiniFareRules ? (
                                    <>
                                        <Text style={styles.CancellationAndDateChangeTitle}>Cancellation and date change</Text>
                                        <View style={styles.CancellationAndDateChangeCon}>
                                            <View style={styles.cancel}>
                                                <Text style={styles.CancellationAndDateChangesubTitle}>Cancellation</Text>
                                                {
                                                    flightBooking?.flight?.MiniFareRules &&
                                                    flightBooking?.flight?.MiniFareRules[0]
                                                        .map((rule, r) => {
                                                            if (rule.Type === "Cancellation") {
                                                                return (
                                                                    <View style={styles.cancellationContainer}>
                                                                        <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.lightGray} iconsize={2.5} />
                                                                        <Text>{rule.To === null ||
                                                                            rule.From === null ||
                                                                            rule.Unit === null
                                                                            ? ""
                                                                            : rule.To === ""
                                                                                ? `> ${rule.From} ${rule.Unit} of departure date`
                                                                                : rule.From === "0"
                                                                                    ? `0- ${rule.To} ${rule.Unit} of departure date`
                                                                                    : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                                                                        </Text>
                                                                        <Text style={[styles.CancellationAndDateChangesubTitle, { color: colors.highlight }]}>{rule.Details}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                            return null
                                                        }
                                                        ).filter((rule, r) => rule !== null)
                                                }



                                            </View>
                                            <View style={styles.dashedLine} />
                                            <View style={styles.cancel}>
                                                <Text style={styles.CancellationAndDateChangesubTitle}>Date change</Text>
                                                {
                                                    flightBooking?.flight?.MiniFareRules &&
                                                    flightBooking?.flight?.MiniFareRules[0]
                                                        .map((rule, r) => {
                                                            if (rule.Type === "Reissue") {
                                                                return (
                                                                    <View style={styles.cancellationContainer}>
                                                                        <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.lightGray} iconsize={2.5} />
                                                                        <Text>{rule.To === null ||
                                                                            rule.From === null ||
                                                                            rule.Unit === null
                                                                            ? ""
                                                                            : rule.To === ""
                                                                                ? `> ${rule.From} ${rule.Unit} of departure date`
                                                                                : rule.From === "0"
                                                                                    ? `0- ${rule.To} ${rule.Unit} of departure date`
                                                                                    : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                                                                        </Text>
                                                                        <Text style={[styles.CancellationAndDateChangesubTitle, { color: colors.highlight }]}>{rule.Details}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                            return null
                                                        }
                                                        ).filter((rule, r) => rule !== null)
                                                }



                                            </View>
                                        </View>
                                    </>
                                ) : null
                            }
                        </>
                    ) : null
                }




            </PopUp>

            <PopUp value={tripsMeals} handlePopUpClose={handlehoteltripsMealsinfoClose}>
                <Text>No meal selected</Text>

            </PopUp>

            <PopUp value={tripsSeat} handlePopUpClose={handlehoteltripsSeatinfoClose}>

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
        </View>

    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(1),
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
        padding: responsiveHeight(1.5),
        // Shadow properties for iOS
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
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
    airlineName: {
        fontSize: responsiveFontSize(2),
        fontFamily: fonts.primary,
        color: colors.black,
    },
    flightNumbers: {
        fontSize: responsiveFontSize(1.4),
        fontFamily: fonts.primary,
        color: colors.lightGray,
        // borderWidth:1,
        // paddingHorizontal:10
    },
    flightsTimingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    originContainer: {
        rowGap: responsiveHeight(0.5),
        width: '25%',
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
    directionContainer: {
        width: '50%',
        rowGap: 4,
    },
    stopsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // columnGap: responsiveWidth(2),
    },
    stopsBtnText: {
        color: colors.highlight,
    },
    flighttotalTime: {
        fontSize: responsiveFontSize(1.8),
        textAlign: 'center',
        fontFamily: fonts.textFont,
        color: colors.black,
        letterSpacing: responsiveHeight(0.5),
    },
    destinationContainer: {
        alignItems: 'flex-end',
        rowGap: responsiveHeight(0.5),
        width: '25%',
    },
    destinationTitle: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: fonts.primary,
        color: colors.black,
    },
    bookingFlightCityNameAirportName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: responsiveHeight(2),
        flexWrap: 'wrap',
    },
    mainContainer: {
        // paddingHorizontal: responsiveWidth(3.5),
        // paddingVertical: responsiveHeight(3),
        backgroundColor: colors.white,
        borderRadius: responsiveHeight(2),
        // rowGap: responsiveHeight(2.5),
        // elevation: responsiveHeight(0.8),
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
        // marginHorizontal: responsiveWidth(3.5),
        // marginTop: responsiveHeight(2.5),
    },
    flightPriceMainContainer:
    {
        borderTopWidth: responsiveHeight(0.1),
        borderBottomWidth: responsiveHeight(0.1),
        borderStyle: "dotted",
        marginTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        gap: responsiveHeight(1.8)
    },
    addedFlightTimeAndDateContainer:
    {
        paddingTop: responsiveHeight(0.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addedFlightTitleContainer:
    {
        width: "90%"
    },
    CancellationAndDateChangeTitle: {
        fontSize: responsiveHeight(2.4),
        color: colors.primary,
        fontFamily: fonts.primary
    },
    CancellationAndDateChangesubTitle:
    {
        fontSize: responsiveHeight(2),
        color: colors.primary,
        fontFamily: fonts.primary
    },
    CancellationAndDateChangeCon: {
        backgroundColor: colors.whiteSmoke,
        borderRadius: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(1.5),
        marginTop: responsiveHeight(2)
    },
    cancel:
    {
        gap: responsiveHeight(1.5)
    },
    cancellationContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(0.6)
    },
    dashedLine: {
        borderTopWidth: responsiveHeight(0.1),
        marginVertical: responsiveHeight(1.5),
        borderStyle: 'dashed'
    },
    flightBookingTravellerDetailsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1)
    },
    flightBookingTravellerDetailsTitle:
    {
        fontSize: responsiveHeight(1.5),
        color: colors.lightGray,
        fontFamily: fonts.primary
    },
    bookingStatusTitles:
    {
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.textInput,
        color: colors.lightGray
    },
    bookingStatusTitlesMainContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        //  marginTop:responsiveHeight(1.2)
    },
    bookingStatusTextContainer: {
        paddingHorizontal: responsiveWidth(2),
        alignItems: 'center',
        borderRadius: responsiveHeight(1),
        paddingVertical: responsiveHeight(0.3),
        justifyContent: 'center'

    },
    bookingStatusText: {
        color: colors.white,
        fontSize: responsiveHeight(1.3),
        fontFamily: fonts.primary
    },
    hotelTotalPriceContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
        alignItems: 'center',
        gap: responsiveHeight(1)
    },
    hotelTotalPrice: {
        fontSize: responsiveHeight(2.2),
        fontFamily: fonts.textFont,
        color: colors.secondary
    },
    bookingStatusTitles:
    {
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.textInput,
        color: colors.lightGray
    },
    addedHotelTimeAndDate: {
        color: colors.primary,
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.primary
    },
    hotelDeleteMsg: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textInput,
        color: colors.primary
    },
    hotelDeletingBtnsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:responsiveHeight(1.8),
        paddingHorizontal:responsiveWidth(6)
    },
    hotelDeleteBtn:
    {
borderWidth:1,
paddingHorizontal:responsiveWidth(3),
paddingVertical:responsiveHeight(0.8),
borderRadius:responsiveHeight(1),
backgroundColor:colors.primary
    },
    hotelDeleteBtnTitle:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textInput,
        color: colors.white
    }
})
export default TripDetailsFlightCard
