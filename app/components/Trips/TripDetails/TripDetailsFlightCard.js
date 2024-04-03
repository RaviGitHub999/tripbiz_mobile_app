import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import MyContext from '../../../context/Context'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import PopUp from '../../common/popup/PopUp'
import WebView from 'react-native-webview'
import { styles } from './tripdetailsFlightCardstyles'
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
    flightId,
    tripsPage,
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
    const [openFlightPrice, setOpenFlightPrice] = useState(false)
    const [openFareRules, setOpenFareRules] = useState(false)
    const { actions, flightsLogosData, flightResList, bookingFlight, flightResJType, domesticFlight } = useContext(MyContext)
    // useEffect(()=>
    // {
    //     actions.handleFlightsLogos()
    // },[])
    var fareData = tripsPage ? actions.getTotalFares([flightBooking]) : '';
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(3), alignItems: 'center' }}>
                    <TouchableOpacity onPress={handletripsBaggageinfo}>
                        <IconSwitcher componentName='MaterialIcons' iconName='luggage' color={colors.primary} iconsize={3} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handletripsCancellationinfo}>
                        <IconSwitcher componentName='FontAwesome6' iconName='calendar-xmark' color={colors.primary} iconsize={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handletripsMealsinfo}>
                        <IconSwitcher componentName='MaterialCommunityIcons' iconName='silverware-fork-knife' color={colors.primary} iconsize={2.5} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFareRulesInfo}>
                        <IconSwitcher componentName='Entypo' iconName='info-with-circle' color={colors.primary} iconsize={2.3} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handletripsSeatinfo}>
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
                                            <View style={[styles.bookingStatusTextContainer, { backgroundColor: reqColor[0] ? reqColor[0]?.color : "#808080" }]}>
                                                <Text style={styles.bookingStatusText}>{flightStatus.status}</Text>
                                            </View>
                                        </View> : null
                                }
                            </> :

                            <View style={styles.bookingStatusTitlesMainContainer}>
                                <Text style={styles.bookingStatusTitles}>{`Booking Status : `}</Text>
                                <View style={[styles.bookingStatusTextContainer, { backgroundColor: reqColor[0] ? reqColor[0]?.color : "#808080" }]}>
                                    <Text style={styles.bookingStatusText}>Not Submitted</Text>
                                </View>
                            </View>
                    }

                    <View style={styles.bookingStatusTitlesMainContainer}>
                        <Text style={styles.bookingStatusTitles}>{`Approval Status : `}</Text>
                        <View style={[styles.bookingStatusTextContainer, { backgroundColor: reqColor[0] ? reqColor[0]?.color : "#808080" }]}>
                            <Text style={styles.bookingStatusText}>{flightReq[0]?.requestStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.hotelTotalPriceContainer}>
                        <Text style={styles.hotelTotalPrice}>{`Total Price : ₹ ${Math.ceil(flightBooking?.finalPrice)?.toLocaleString("en-IN")}`}</Text>
                        <TouchableOpacity onPress={() => {
                            setOpenFlightPrice((prev) => !prev)
                        }}>
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
    const handletripsBaggageinfo = () => {
        setTripsBaggage(true)
    }
    const handletripsBaggageinfoClose = () => {
        setTripsBaggage(false)
    }
    const handletripsCancellationinfo = () => {
        setTripsCancellation(true)
    }
    const handletripsCancellationinfoClose = () => {
        setTripsCancellation(false)
    }
    const handletripsMealsinfo = () => {
        setTripsMeals(true)
    }
    const handletripsMealsinfoClose = () => {
        setTripsMeals(false)
    }
    const handletripsSeatinfo = () => {
        setTripsSeat(true)
    }
    const handletripsSeatinfoClose = () => {
        setTripsSeat(false)
    }
    const handleFareRulesInfo = () => {
        setOpenFareRules(true)
    }
    const handleFareRulesClose = () => {
        setOpenFareRules(false)
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
            <PopUp value={tripsBaggage} handlePopUpClose={handletripsBaggageinfoClose}>
                <Text>No extra baggage</Text>
            </PopUp>

            <PopUp value={tripsCancellation} handlePopUpClose={handletripsCancellationinfoClose}>
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

            <PopUp value={tripsMeals} handlePopUpClose={handletripsMealsinfoClose}>
                <Text>No meal selected</Text>

            </PopUp>

            <PopUp value={tripsSeat} handlePopUpClose={handletripsSeatinfoClose}>

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

            <PopUp value={openFlightPrice} handlePopUpClose={() => {
                setOpenFlightPrice((prev) => !prev)
            }} >
                <View style={styles.flightPriceAndChargesContainer}>
                    {
                        tripsPage ?
                            <>
                                {
                                    [flightBooking].map((book, b) => {
                                        return (
                                            <View style={styles.flightDirectionMainContainer}>
                                                <View style={styles.flightDirectionContainer}>
                                                    <Text style={styles.airportName}>{`${book.flightNew.segments[0].originAirportCode}`}</Text>
                                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={2} />
                                                    <Text style={styles.airportName}>{`${book.flightNew.segments[0].destAirportCode}`}</Text>
                                                </View>
                                                <Text style={styles.flightPrice}>
                                                    &#8377; {`${book.flight.Fare.OfferedFare
                                                        ? Math.ceil(book.flight.Fare.OfferedFare).toLocaleString("en-IN")
                                                        : Math.ceil(book.flight.Fare.PublishedFare).toLocaleString("en-IN")
                                                        }`}
                                                </Text>

                                            </View>
                                        )
                                    })
                                }
                            </> : null
                    }
                    <View style={styles.horizontalLine} />
                    {
                        fareData?.totalBaggagePrice ?
                            <View style={styles.serviceCharges}>
                                <Text style={styles.flightCharges}>Excess baggage</Text>
                                <Text style={styles.flightChargesPrice}>+ &#8377;{` ${fareData?.totalBaggagePrice?.toLocaleString("en-IN")}`}</Text>
                            </View>
                            : null
                    }

                    {
                        fareData?.totalMealPrice ?
                            <View style={styles.serviceCharges}>
                                <Text style={styles.flightCharges}>Add-on meal</Text>
                                <Text style={styles.flightChargesPrice}>+ &#8377;{` ${fareData?.totalMealPrice?.toLocaleString("en-IN")}`}</Text>
                            </View> :
                            null
                    }

                    {
                        fareData?.totalSeatCharges ?
                            <View style={styles.serviceCharges}>
                                <Text style={styles.flightCharges}>Seat Charges</Text>
                                <Text style={styles.flightChargesPrice}>+ &#8377;{` ${fareData?.totalSeatCharges?.toLocaleString("en-IN")}`}</Text>
                            </View> :
                            null
                    }

                    <View style={styles.serviceCharges}>
                        <Text style={styles.flightCharges}>Service Charges</Text>
                        <Text style={styles.flightChargesPrice}>+ &#8377;{`${Math.ceil((fareData?.totalFareSum * domesticFlight) / 100)}`}</Text>
                    </View>
                </View>
                <View style={styles.flightPriceContainer}>
                    <Text style={styles.totalFareTitle}>Total fare</Text>
                    <Text style={styles.totalFare}>&#8377; {` ${Math.ceil(fareData?.finalPrice).toLocaleString("en-IN")}`}</Text>
                </View>
            </PopUp>
            <PopUp value={openFareRules} handlePopUpClose={handleFareRulesClose} customStyles={{ width: "100%" }}>

                {flightBooking?.fareRules ?
                    <View style={{ height: responsiveHeight(40) }}>
                        <WebView
                            source={{ html: flightBooking?.fareRules }} />
                    </View>
                    : <View style={styles.notfoundFareRuleContainer}>
                        <Text style={styles.notfoundFareRuleTitle}>Not Found Any FareRules</Text>
                    </View>}

            </PopUp>
        </View>

    )
}

export default TripDetailsFlightCard
