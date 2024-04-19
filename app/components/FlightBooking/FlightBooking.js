import { TextInput, Modal, Text, View, FlatList, ScrollView, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, LayoutAnimation, BackHandler } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import IconSwitcher from '../common/icons/IconSwitcher'
import MyContext from '../../context/Context'
import ProgressBar from '../common/progressBar/ProgressBar'
import { styles } from './styles'
import FlightCard from '../flightList/FlightCard'
import { colors, fonts } from '../../config/theme'
import Select from '../common/select/Select'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import { WebView } from 'react-native-webview';
import PopUp from '../common/popup/PopUp'

const seatsSelect = (seatsSeg, pax, seatCode) => {
    if (!seatsSeg) {
        seatsSeg = [];
    }
    var rmSeat = null;
    if (seatsSeg.length >= pax) {
        rmSeat = seatsSeg.shift();
    }
    seatsSeg.push(seatCode);

    return { seatsSeg, rmSeat };
};


const FlightBooking = ({ navigation: { navigate } }) => {
    var [bookIndex, setBookIndex] = useState(0);
    var [segIndex, setSegIndex] = useState(0);
    var [seatSegIdx, setSeatSegIdx] = useState(0);
    var [selectSeats, setSelectSeats] = useState(false);
    var [seatData, setSeatData] = useState([]);
    var [selectedSeats, setSelectedSeats] = useState(([[], []]));
    var [wingPosArr, setWingPosArr] = useState([]);
    var [fareIsOpen, setFareIsOpen] = useState(false);
    var [submitIsOpen, setSubmitIsOpen] = useState(false);
    var [seatOpen, setSeatOpen] = useState(true);
    var [activeTab, setActiveTab] = useState('tab1');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { actions, selectedTripId, selectedTrip, flightBookDataLoading, bookingFlight, domesticFlight, internationalFlight, isInternationalRound, userTripStatus, } = useContext(MyContext)
    var { totalFareSum, totalSeatCharges, totalBaggagePrice, totalMealPrice, finalPrice } =
        actions.getTotalFares(bookingFlight);
    var myDate = bookingFlight[0].flight.Segments[0][bookingFlight[0].flight.Segments[0].length - 1].Origin.DepTime;
    var myStr = bookingFlight[0].flight.Segments[0][bookingFlight[0].flight.Segments[0].length - 1]?.Destination?.Airport?.CityName + "_trip"
    const date = new Date(myDate)
    const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
    const combinedString = `${myStr}_${formattedDate}`;
    var [defaultInput, setDefaultInput] = useState(combinedString);

    useEffect(() => {
        const backAction = () => {
            actions.setFlightBookPage(false);
            actions.setBookingFlight([]);
            actions.setFlightResJType(0);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);


    // if (flightBookDataLoading||isLoading) {
    //     return (
    //         <View style={styles.mainContainer}>
    //             <ProgressBar />
    //         </View>
    //     );
    // }
    const toggleHeight = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };
    const changeBookIndex = (value) => {
        setBookIndex(value);
        setSegIndex(0);
        setSeatSegIdx(0);
        setSelectedSeats([[], []]);
    };
    const handleSeatSelectionPopUp = () => {
        setSelectSeats(true);
        if (seatOpen) {
            setSeatData(
                actions.fillUpSegmentSeats(
                    bookingFlight[bookIndex].seatData[segIndex].SegmentSeat
                )
            );
        }
        setSeatOpen(false)
        setWingPosArr(
            actions.getWingPosArr(
                bookingFlight[bookIndex].seatData[segIndex].SegmentSeat
            )
        );
        var selectedSeats = bookingFlight[bookIndex].seats.map(
            (seg, sg) => {
                var seatSegs = seg.map((seatSeg, se) => {
                    return Object.keys(seatSeg);
                });
                return seatSegs;
            }
        );

        setSelectedSeats(selectedSeats);
    }
    const sortedTrips = userTripStatus.userTrips.slice().sort((a, b) => {
        var aTime = new Date(a?.data?.date?.seconds * 1000);
        var bTime = new Date(b?.data?.date?.seconds * 1000);
        return bTime - aTime;
    });

    var getTime = (seconds) => {
        const timestampInSeconds = seconds;
        const timestampInMilliseconds = timestampInSeconds * 1000;
        const date = new Date(timestampInMilliseconds);
        return date;
    };
    var addtoTrip = async(id) => {
        setIsLoading(true)
        setSubmitIsOpen(false)
        await actions.editTripById(id, [...bookingFlight], "flights");
        setIsLoading(false)
        
    }
    const renderItem = ({ item }) => {
        const date = getTime(item?.data?.date?.seconds);
        const dateStr = date.toString().slice(4, 10);

        return (
            <TouchableOpacity style={styles.tripCard} onPress={
                () => {

                    addtoTrip(item.id)
                    navigate("TripDetails", { id: item.id });
                }
            }>
                <Text style={styles.tripTitle}>{item.data.name}</Text>
                <Text style={styles.tripDate}>{dateStr}</Text>
            </TouchableOpacity>
        );
    };
    const handleInputChange = (e) => {
        setDefaultInput(e)
    }
    const handleAddToTrip = async () => {
        setIsLoading(true);
        setSubmitIsOpen(false);
        let newtripid = await actions.editTripBtn(defaultInput, "flights", bookingFlight);
        setIsLoading(false);
        navigate("TripDetails", { id: newtripid });
        await actions.getLastDoc();
    };
    if (isLoading) {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ProgressBar /></View>
    }
    return (
        // isLoading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ProgressBar /></View> :

        flightBookDataLoading ? <View style={styles.mainContainer}>
            <ProgressBar />
        </View> :
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.backBtnContainer} onPress={() => {
                    actions.setFlightBookPage(false);
                    actions.setBookingFlight([]);
                    actions.setFlightResJType(0);
                }}>
                    <IconSwitcher componentName='AntDesign' iconName='arrowleft' color='black' iconsize={3} />
                </TouchableOpacity>
                {/* <View style={{ flex: 2 }}> */}
                <ScrollView nestedScrollEnabled contentContainerStyle={{ paddingBottom: 20 }} style={{ backgroundColor: colors.white }} >
                    <FlatList data={bookingFlight} renderItem={({ item, index }) => {
                        return (
                            <View style={{ paddingVertical: responsiveHeight(1) }}>
                                <FlightCard
                                    flightGrp={[{ ...bookingFlight[index]?.flight }]}
                                    index={index}
                                    bookingPage={true}
                                    segIndex={segIndex}
                                />
                            </View>
                        )
                    }} />
                    {
                        bookingFlight.length > 1 ?
                            <View style={styles.flightResultsNavMainContainer}>
                                <TouchableOpacity style={[styles.flightResultsNavItem, bookIndex === 0 && styles.flightResultsNavSelectedItem]} onPress={() => changeBookIndex(0)}>
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={bookIndex === 0 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.flightResultsNavItem, bookIndex === 1 && styles.flightResultsNavSelectedItem]} onPress={() => changeBookIndex(1)}>
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[1]?.flightNew?.segments[0]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={bookIndex === 1 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, bookIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[1]?.flightNew?.segments[0]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                            </View> : bookingFlight.length === 1 &&
                                bookingFlight[0].flightNew.segments.length > 1 ? <View style={styles.flightResultsNavMainContainer}>
                                <TouchableOpacity style={[styles.flightResultsNavItem, segIndex === 0 && styles.flightResultsNavSelectedItem]} onPress={() => setSegIndex(0)}>
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={segIndex === 0 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 0 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[0]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.flightResultsNavItem, segIndex === 1 && styles.flightResultsNavSelectedItem]} onPress={() => setSegIndex(1)}>
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[1]?.originAirportCode}`}</Text>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={segIndex === 1 ? colors.white : colors.black} />
                                    <Text style={[styles.flightResultsNavItemText, segIndex === 1 && styles.flightResultsNavSelectedItemText]}>{`${bookingFlight[0]?.flightNew?.segments[1]?.destAirportCode}`}</Text>
                                </TouchableOpacity>
                            </View> : null
                    }
                    <View style={styles.baggageAndMealsContainer}>
                        {/* Baggage and Meals */}
                        <Text style={styles.baggageAndMealsTitle}>Baggage and Meals</Text>
                        <View style={styles.baggageDetailsContainer}>
                            <Text style={styles.baggageDetailsText}>Baggage details</Text>
                            <View style={styles.bookingFlightCabinAndCheckInContainer}>
                                {bookingFlight[bookIndex].baggageDtls?.cabinBaggage ? <View style={styles.bookingFlightCabinAndCheckInSubContainer}>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.black} iconsize={3} />
                                    <Text style={styles.flightBaggageText}>Cabin baggage:<Text style={styles.flightBaggageDataText}> {bookingFlight[bookIndex].baggageDtls?.cabinBaggage}</Text></Text>
                                </View> : null}
                                {bookingFlight[bookIndex].baggageDtls?.baggage ? <View style={styles.bookingFlightCabinAndCheckInSubContainer}>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.black} iconsize={3} />
                                    <Text style={styles.flightBaggageText}>Check-in baggage:<Text style={styles.flightBaggageDataText}> {bookingFlight[bookIndex].baggageDtls?.baggage}</Text></Text>
                                </View> : null}
                            </View>
                            <>
                                {
                                    bookIndex === 0 ?
                                        <>
                                            {bookingFlight[bookIndex].baggageData.length > 0 && <View style={styles.horizontalLine} />}
                                            {bookingFlight[bookIndex].baggageData &&
                                                bookingFlight[bookIndex].baggageData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                                                <Text style={styles.flightextrabagAndMealTitle}>Select extra baggage</Text>
                                                {
                                                    [...Array(bookingFlight[bookIndex].travellers
                                                    )].map((trav, index) => {
                                                        return (
                                                            <>
                                                                <Text>{index + 1 <= Number(bookingFlight[bookIndex].adults) ? 'Adult' : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? "Child" : "Infant")}
                                                                    -{index + 1 <= Number(bookingFlight[bookIndex].adults) ? index + 1 : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? index + 1 - Number(bookingFlight[bookIndex].adults) : index + 1 - (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)))}</Text>
                                                                <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"baggage"} traveller={index} />
                                                            </>
                                                        )
                                                    })
                                                }

                                            </View> : null}
                                        </>
                                        :
                                        <>
                                            {bookingFlight[bookIndex].baggageData.length > 0 && <View style={styles.horizontalLine} />}
                                            {bookingFlight[bookIndex].baggageData &&
                                                bookingFlight[bookIndex].baggageData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                                                <Text style={styles.flightextrabagAndMealTitle}>Select extra baggage</Text>
                                                {
                                                    [...Array(bookingFlight[bookIndex].travellers
                                                    )].map((trav, index) => {
                                                        return (
                                                            <>
                                                                <Text>{index + 1 <= Number(bookingFlight[bookIndex].adults) ? 'Adult' : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? "Child" : "Infant")}
                                                                    -{index + 1 <= Number(bookingFlight[bookIndex].adults) ? index + 1 : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? index + 1 - Number(bookingFlight[bookIndex].adults) : index + 1 - (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)))}</Text>
                                                                <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"baggage"} traveller={index} />
                                                            </>
                                                        )
                                                    })
                                                }

                                            </View> : null}
                                        </>
                                }
                            </>

                            <>
                                {
                                    bookIndex === 0 ?
                                        <>
                                            {bookingFlight[bookIndex].mealData.length > 0 && <View style={styles.horizontalLine} />}
                                            {bookingFlight[bookIndex].mealData &&
                                                bookingFlight[bookIndex].mealData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                                                <Text style={styles.flightextrabagAndMealTitle}>Select add-on meal</Text>
                                                {
                                                    [...Array(bookingFlight[bookIndex].travellers
                                                    )].map((trav, index) => {
                                                        return (
                                                            <>
                                                                <Text>{index + 1 <= Number(bookingFlight[bookIndex].adults) ? 'Adult' : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? "Child" : "Infant")}
                                                                    -{index + 1 <= Number(bookingFlight[bookIndex].adults) ? index + 1 : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? index + 1 - Number(bookingFlight[bookIndex].adults) : index + 1 - (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)))}</Text>
                                                                <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"meal"} traveller={index} />
                                                            </>
                                                        )
                                                    })
                                                }
                                            </View> : null}
                                        </>
                                        :
                                        <>
                                            {bookingFlight[bookIndex].mealData.length > 0 && <View style={styles.horizontalLine} />}
                                            {bookingFlight[bookIndex].mealData &&
                                                bookingFlight[bookIndex].mealData.length > 0 ? <View style={styles.flightextrabagAndMealContainer}>
                                                <Text style={styles.flightextrabagAndMealTitle}>Select add-on meal</Text>
                                                {
                                                    [...Array(bookingFlight[bookIndex].travellers
                                                    )].map((trav, index) => {
                                                        return (
                                                            <>
                                                                <Text>{index + 1 <= Number(bookingFlight[bookIndex].adults) ? 'Adult' : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? "Child" : "Infant")}
                                                                    -{index + 1 <= Number(bookingFlight[bookIndex].adults) ? index + 1 : (index + 1 <= (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)) ? index + 1 - Number(bookingFlight[bookIndex].adults) : index + 1 - (Number(bookingFlight[bookIndex].adults) + Number(bookingFlight[bookIndex].child)))}</Text>
                                                                <Select bookIndex={bookIndex} bookingFlight={bookingFlight} segIndex={segIndex} name={"meal"} traveller={index} />
                                                            </>
                                                        )
                                                    })
                                                }
                                            </View> : null}
                                        </>
                                }
                            </>





                        </View>
                    </View>


                    {
                        bookingFlight[bookIndex].seatData &&
                            bookingFlight[bookIndex].seatData[segIndex] &&
                            actions.validSeatMap(bookingFlight[bookIndex].seatData[segIndex]) ?
                            <View style={styles.seatSelectionBtnContainer}>
                                {bookingFlight[bookIndex].seats &&
                                    bookingFlight[bookIndex].seats[segIndex] &&
                                    bookingFlight[bookIndex].seats[segIndex].length > 0 ?
                                    (
                                        <View style={{ flexDirection: 'row', columnGap: responsiveHeight(1) }}>
                                            {
                                                bookingFlight[bookIndex].flightNew.segments[
                                                    segIndex
                                                ].segRoutes.map((route, r) => {
                                                    return (
                                                        <View style={{ backgroundColor: colors.white, paddingVertical: responsiveHeight(1), paddingHorizontal: responsiveWidth(2), borderRadius: responsiveHeight(2), rowGap: responsiveHeight(0.8) }}>
                                                            <View style={{ flexDirection: "row", alignItems: 'center', columnGap: responsiveWidth(1) }}>
                                                                <Text style={{ fontSize: responsiveHeight(1.8), fontFamily: fonts.textFont, color: colors.black }}>{`${route.originCode}`}</Text>
                                                                <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={2} />
                                                                <Text style={{ fontSize: responsiveHeight(1.8), fontFamily: fonts.textFont, color: colors.black }}>{`${route.destCode}`}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                {bookingFlight[bookIndex].seats &&
                                                                    bookingFlight[bookIndex].seats[segIndex] &&
                                                                    bookingFlight[bookIndex].seats[segIndex][r] &&
                                                                    Object.keys(
                                                                        bookingFlight[bookIndex].seats[segIndex][r]
                                                                    ).map((seatCode, c) => {
                                                                        if (
                                                                            c ===
                                                                            Object.keys(
                                                                                bookingFlight[bookIndex].seats[segIndex][r]
                                                                            ).length -
                                                                            1
                                                                        ) {
                                                                            return <Text style={styles.seatCode}>{seatCode}</Text>;
                                                                        }
                                                                        return <Text style={styles.seatCode}>{`${seatCode}, `}</Text>;
                                                                    })}
                                                            </View>
                                                        </View>)
                                                })}
                                        </View>
                                    ) : null}
                                <TouchableOpacity style={styles.seatSelectionBtn} onPress={handleSeatSelectionPopUp}>
                                    <Text style={styles.seatSelectionBtnTitle}>Select seats</Text>
                                </TouchableOpacity>
                            </View> : null
                    }


                    {/* Cancellation and date change */}
                    {bookingFlight[bookIndex].flight.MiniFareRules &&
                        bookingFlight[bookIndex].flight.MiniFareRules[segIndex] ? <View style={styles.cancellationAndDateChangeMainContainer}>
                        <Text style={styles.cancellationAndDateChangeTitle}>Cancellation and date change</Text>
                        <View style={styles.cancellationAndDateChangeDetailsContainer}>
                            <View>
                                <Text style={styles.baggageAndMealsTitle}>Cancellation</Text>
                                <View>
                                    <View>
                                        {bookingFlight[bookIndex].flight.MiniFareRules[segIndex] &&
                                            bookingFlight[bookIndex].flight.MiniFareRules[segIndex]
                                                .map((rule, r) => {
                                                    if (rule.Type === "Cancellation") {
                                                        return (
                                                            <View style={rule.From === null && { flexDirection: 'row' }}>
                                                                <View style={styles.cancellationAndDateChangeDetailsEachContainer} key={r}>
                                                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={3} />
                                                                    <Text style={styles.cancellationAndDateChangeDetailsEachContainerText}>{rule.To === null ||
                                                                        rule.From === null ||
                                                                        rule.Unit === null
                                                                        ? ""
                                                                        : rule.To === ""
                                                                            ? `Upto ${rule.From} ${rule.Unit} of departure date`
                                                                            : rule.From === "0"
                                                                                ? `Within ${rule.To} ${rule.Unit} of departure date`
                                                                                : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}</Text>
                                                                </View>
                                                                <Text style={[styles.flightPrice, { color: colors.highlight, fontSize: responsiveHeight(2) }]}>
                                                                    {rule.Details}
                                                                </Text>
                                                            </View>
                                                        );
                                                    }
                                                    return null;
                                                }).filter((rule, r) => rule !== null)}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.horizontalLine} />
                            <View>
                                <Text style={styles.baggageAndMealsTitle}>Date change</Text>
                                <View>
                                    {bookingFlight[bookIndex].flight.MiniFareRules[segIndex] &&
                                        bookingFlight[bookIndex].flight.MiniFareRules[segIndex]
                                            .map((rule, r) => {
                                                if (rule.Type === "Reissue") {
                                                    return (
                                                        <View style={rule.From === null && { flexDirection: 'row' }}>
                                                            <View style={styles.cancellationAndDateChangeDetailsEachContainer} key={r}>
                                                                <IconSwitcher componentName='AntDesign' iconName='arrowright' color='black' iconsize={3} />
                                                                <Text style={styles.cancellationAndDateChangeDetailsEachContainerText}>
                                                                    {rule.To === null ||
                                                                        rule.From === null ||
                                                                        rule.Unit === null
                                                                        ? ""
                                                                        : rule.To === ""
                                                                            ? `Upto ${rule.From} ${rule.Unit} of departure date`
                                                                            : rule.From === "0"
                                                                                ? `Within ${rule.To} ${rule.Unit} of departure date`
                                                                                : `Between ${rule.To} & ${rule.From} ${rule.Unit} of departure date`}
                                                                </Text>
                                                            </View>
                                                            <Text style={[styles.flightPrice, { color: colors.highlight, fontSize: responsiveHeight(2) }]}>
                                                                {rule.Details}
                                                            </Text>
                                                        </View>
                                                    );
                                                }
                                                return null;
                                            }).filter((rule, r) => rule !== null)}
                                </View>
                            </View>
                        </View>
                    </View> : null}
                    <TouchableOpacity style={styles.fareRuleBtn} onPress={() => setFareIsOpen(true)}>
                        <Text style={styles.fareRule}>Fare Rules</Text>
                    </TouchableOpacity>

                    <View style={styles.noteCon}>
                        <Text style={styles.imp}>*Important  <Text style={styles.note}>The airline fee is indicative. We do not guarantee the accuracy of this information. All fees mentioned are per passenger. Date change charges are applicable only on selecting the same airline on a new date. The difference in fares between the old and the new booking will also be payable by the user. If you require further information, please refer the Airline website for detailed fare rales for different fare types.</Text></Text>
                    </View>


                </ScrollView>
                <View style={styles.totalFareContainer}>
                    <TouchableOpacity onPress={toggleHeight} style={styles.totalFareToggleIconContainer}>
                        <IconSwitcher componentName='Ionicons' iconName={isExpanded ? "chevron-down-sharp" : 'chevron-up-sharp'} color={colors.black} iconsize={3} />
                    </TouchableOpacity>
                    {isExpanded &&
                        <View style={styles.totalFareFlightDetailsMainContainer}>
                            {
                                bookingFlight.map((book, b) => {
                                    return (
                                        <View style={styles.flightDepAndArrMainContainer}>
                                            <View style={styles.flightDepAndArrContainer} key={b}>
                                                <Text style={styles.flightDepAndArrText}>{`${book?.flightNew?.segments[0].originAirportCode}`}</Text>
                                                <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.secondary} iconsize={2.8} />
                                                <Text style={styles.flightDepAndArrText}>{`${book?.flightNew?.segments[0].destAirportCode}`}</Text>
                                            </View>
                                            <View >
                                                <Text style={[styles.flightPrice, { color: colors.highlight }]}>
                                                    {`₹ ${book.flight.Fare.OfferedFare
                                                        ? Math.ceil(
                                                            book.flight.Fare.OfferedFare
                                                        ).toLocaleString("en-IN")
                                                        : Math.ceil(
                                                            book.flight.Fare.PublishedFare
                                                        ).toLocaleString("en-IN")
                                                        }`}
                                                </Text>
                                            </View>
                                        </View>)
                                })
                            }

                            <View style={[styles.horizontalLine, { borderColor: '#c8c8c8', marginVertical: 0 }]} />

                            <View style={styles.flightDepAndArrSubContainer}>
                                {
                                    totalBaggagePrice ? <View style={styles.totalFareFlightEachChargeDetails}>
                                        <Text style={styles.ExcessBagChargesTitle}>Excess baggage</Text>
                                        <Text style={styles.ExcessBagCharges}>{`+ ₹ ${totalBaggagePrice.toLocaleString("en-IN")}`}</Text>
                                    </View> : null
                                }
                                {
                                    totalMealPrice ? <View style={styles.totalFareFlightEachChargeDetails}>
                                        <Text style={styles.ExcessBagChargesTitle}>Add-on meal</Text>
                                        <Text style={styles.ExcessBagCharges}>{`+ ₹ ${totalMealPrice.toLocaleString("en-IN")}`}</Text>
                                    </View> : null
                                }
                                {
                                    totalSeatCharges ? <View style={styles.totalFareFlightEachChargeDetails}>
                                        <Text style={styles.ExcessBagChargesTitle}>Seat Charges</Text>
                                        <Text style={styles.ExcessBagCharges}>{`+ ₹ ${totalSeatCharges?.toLocaleString("en-IN")}`}</Text>
                                    </View> : null
                                }
                                {
                                    isInternationalRound ? <View style={styles.totalFareFlightEachChargeDetails}>
                                        <Text style={styles.ExcessBagChargesTitle}>Service Charges</Text>
                                        <Text style={styles.ExcessBagCharges}>{`+ ₹ ${Math.ceil((totalFareSum * internationalFlight) / 100)}`}</Text>
                                    </View> : <View style={styles.totalFareFlightEachChargeDetails}>
                                        <Text style={styles.ExcessBagChargesTitle}>Service Charges</Text>
                                        <Text style={styles.ExcessBagCharges}>{`+ ₹ ${Math.ceil((totalFareSum * domesticFlight) / 100)}`}</Text>
                                    </View>
                                }
                            </View>

                        </View>}
                    <View style={styles.totalFareFlightDetailsContainer}>
                        <Text style={styles.flighttotalFareText}>Total fare</Text>
                        <Text style={styles.flightPrice}>{`₹ ${Math.ceil(finalPrice)?.toLocaleString("en-IN")}/-`}</Text>
                        {
                            selectedTripId ?
                                <View style={{ width: '40%' }}>
                                    <Text style={{ fontSize: responsiveHeight(2), color: colors.primary }}>{`Do you want to add to ${selectedTrip?.data?.name ? selectedTrip?.data?.name : selectedTripId}`}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                                        <TouchableOpacity onPress={
                                            () => {
                                                navigate("TripDetails", { id: selectedTripId })
                                                actions.editTripById(selectedTripId, bookingFlight, "flights");
                                                actions.handleSelectedTripId()
                                            }
                                        } style={styles.yesBtn}>
                                            <Text style={styles.yesBtnText}>yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.yesBtn} onPress={() => {
                                            actions.setFlightBookPage(false);
                                            actions.setBookingFlight([]);
                                        }}>
                                            <Text style={styles.yesBtnText}>Back</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <TouchableOpacity style={styles.submitTripBtn} onPress={() => {
                                    setSubmitIsOpen(true);
                                }}>
                                    <Text style={styles.submitTripBtnText}>Add to trip</Text>
                                </TouchableOpacity>
                        }



                    </View>
                </View>
                <Modal
                    animationType="slide"
                    visible={selectSeats}
                >
                    <View style={{ height: "100%", width: "100%", backgroundColor: colors.black, position: "absolute", opacity: 0.5, }}></View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                        <View style={styles.flightSeatsDataCard}>
                            <TouchableOpacity onPress={() => setSelectSeats(false)} style={{ alignItems: 'flex-end', margin: 10 }}>
                                <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                            </TouchableOpacity>
                            {
                                seatData.length > 1 ? (
                                    <View style={styles.flightBookSelectSeatsSegNav}>
                                        {
                                            seatData.map((seatSeg, s) => {
                                                return (
                                                    <TouchableOpacity style={seatSegIdx === s ? [styles.flightBookSelectSeatsSegNavItem, styles.flightBookSelectSeatsSegNavSelectedItem] : styles.flightBookSelectSeatsSegNavItem} onPress={() => setSeatSegIdx(s)}>
                                                        <Text style={seatSegIdx === s ? [styles.flightBookSelectSeatsSegNavItemText, styles.flightBookSelectSeatsSegNavItemSelectedText] : styles.flightBookSelectSeatsSegNavItemText}>{`${bookingFlight[bookIndex].flightNew.segments[segIndex].segRoutes[s]?.originCode} -> ${bookingFlight[bookIndex].flightNew.segments[segIndex].segRoutes[s]?.destCode}`}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ) : null
                            }
                            {bookingFlight[bookIndex].seats &&
                                bookingFlight[bookIndex].seats[segIndex] &&
                                bookingFlight[bookIndex].seats[segIndex][seatSegIdx] &&
                                Object.keys(bookingFlight[bookIndex].seats[segIndex][seatSegIdx])
                                    .length > 0 ?
                                <View style={styles.selectedSeatContainer}>
                                    <Text style={styles.selectedSeatTitle}>Selected seats</Text>
                                    <View style={{ flexDirection: "row", }}>
                                        {Object.keys(
                                            bookingFlight[bookIndex].seats[segIndex][seatSegIdx]
                                        ).map((seatCode, c) => {
                                            if (
                                                c ===
                                                Object.keys(
                                                    bookingFlight[bookIndex].seats[segIndex][seatSegIdx]
                                                ).length -
                                                1
                                            ) {
                                                return <Text style={styles.seatCode}>{seatCode}</Text>;
                                            }
                                            return <Text style={styles.seatCode}>{`${seatCode}, `}</Text>;
                                        })}
                                    </View>
                                </View>
                                : null
                            }
                            {seatData[seatSegIdx] && <FlatList data={seatData[seatSegIdx].RowSeats} renderItem={({ item: row }) => {
                                return (
                                    <>
                                        {
                                            actions.isExitRow(row) ?
                                                <View style={wingsStyles.emergencyExitMainContainer}>
                                                    <View style={wingsStyles.emergencyExitContainer}>
                                                        <IconSwitcher componentName='Feather' iconName='chevrons-left' color={colors.emergency} iconsize={3} />
                                                        <Text style={wingsStyles.emergencyText}> Emergency exit</Text>
                                                        <IconSwitcher componentName='Feather' iconName='chevrons-right' color={colors.emergency} iconsize={3} />
                                                    </View>
                                                </View> : null
                                        }

                                        <View>
                                            {wingPosArr &&
                                                wingPosArr.length > 0 &&
                                                row.Seats &&
                                                row.Seats[0] &&
                                                wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                                                <View style={!actions.isExitRow(row)
                                                    ? wingPosArr[seatSegIdx].indexOf(
                                                        row.Seats[0].RowNo
                                                    ) === 0 ?
                                                        [wingsStyles.rightWing, wingsStyles.rightWingFirst] : wingPosArr[seatSegIdx].indexOf(
                                                            row.Seats[0].RowNo
                                                        ) ===
                                                            wingPosArr[seatSegIdx].length - 1
                                                            ? [wingsStyles.rightWing, wingsStyles.rightWingLast] : wingsStyles.rightWing : wingsStyles.rightWing}></View>

                                            ) : null}
                                            <View style={{ alignSelf: 'center' }}>
                                                <FlatList
                                                    data={row?.Seats}
                                                    numColumns={6}
                                                    keyExtractor={(seat, index) => index.toString()}
                                                    renderItem={({ item, index }) => (
                                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                                                            <TouchableOpacity style={[wingsStyles.flightBookSeat, index % 6 === 2 ? wingsStyles.spaceBetween : null, item.AvailablityType === 3 ? wingsStyles.flightBookSeatReserved : item.AvailablityType === 1 ? [wingsStyles.flightBookSeat, { borderWidth: 1 }] : wingsStyles.flightBookSeat, bookingFlight[bookIndex].seats &&
                                                                bookingFlight[bookIndex].seats[segIndex] &&
                                                                bookingFlight[bookIndex].seats[segIndex][
                                                                seatSegIdx
                                                                ] &&
                                                                bookingFlight[bookIndex].seats[segIndex][
                                                                seatSegIdx
                                                                ][item.Code] ? { backgroundColor: '#0080007c' } : "",
                                                            item.Code === "NoSeat" ? { width: "100%" } : null]}
                                                                disabled={item.AvailablityType === 3 && true}
                                                                onPress={!item.noSeat && item.AvailablityType === 1
                                                                    ? () => {
                                                                        var seats = [...selectedSeats];
                                                                        if (
                                                                            seats[segIndex] &&
                                                                            seats[segIndex][seatSegIdx] &&
                                                                            seats[segIndex][
                                                                                seatSegIdx
                                                                            ].includes(item.Code)
                                                                        ) {
                                                                            seats[segIndex][seatSegIdx] = seats[
                                                                                segIndex
                                                                            ][seatSegIdx].filter(
                                                                                (seatCode, c) => {
                                                                                    return seatCode !== item.Code;
                                                                                }
                                                                            );
                                                                            actions.handleChangeFlightBook(
                                                                                null,
                                                                                "seats",
                                                                                bookIndex,
                                                                                segIndex,
                                                                                null,
                                                                                seatSegIdx,
                                                                                item.Code
                                                                            );
                                                                        } else {
                                                                            var { seatsSeg, rmSeat } =
                                                                                seatsSelect(
                                                                                    seats[segIndex][seatSegIdx],
                                                                                    Number(
                                                                                        bookingFlight[bookIndex]
                                                                                            .adults
                                                                                    ) +
                                                                                    Number(
                                                                                        bookingFlight[bookIndex]
                                                                                            .child
                                                                                    ),
                                                                                    item.Code
                                                                                );
                                                                            seats[segIndex][seatSegIdx] = [
                                                                                ...seatsSeg
                                                                            ];

                                                                            actions.handleChangeFlightBook(
                                                                                null,
                                                                                "seats",
                                                                                bookIndex,
                                                                                segIndex,
                                                                                item,
                                                                                seatSegIdx,
                                                                                rmSeat
                                                                            );
                                                                        }

                                                                        setSelectedSeats(seats);
                                                                    }
                                                                    : null}>
                                                                <Text style={{ fontSize: responsiveHeight(1.5) }}>{item.Code}</Text>
                                                            </TouchableOpacity>
                                                            {item.Price ? <View style={[index % 6 === 2 ? wingsStyles.spaceBetween : null]}>
                                                                <Text style={{ fontSize: responsiveHeight(1.5) }}>{`${item.Price.toLocaleString("en-IN")}`}</Text>
                                                            </View> : <Text></Text>}
                                                        </View>
                                                    )}
                                                />
                                            </View>
                                            {wingPosArr &&
                                                wingPosArr.length > 0 &&
                                                row.Seats &&
                                                row.Seats[0] &&
                                                wingPosArr[seatSegIdx].includes(row.Seats[0].RowNo) ? (
                                                <View style={!actions.isExitRow(row)
                                                    ? wingPosArr[seatSegIdx].indexOf(
                                                        row.Seats[0].RowNo
                                                    ) === 0 ?
                                                        [wingsStyles.leftWing, wingsStyles.leftWingFirst] : wingPosArr[seatSegIdx].indexOf(
                                                            row.Seats[0].RowNo
                                                        ) ===
                                                            wingPosArr[seatSegIdx].length - 1
                                                            ? [wingsStyles.leftWing, wingsStyles.leftWingLast] : wingsStyles.leftWing : wingsStyles.leftWing}></View>
                                            ) : null}
                                        </View>
                                    </>
                                )
                            }} />}
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={submitIsOpen}
                >
                    <View style={styles.modalMainContainer}>
                        <View style={styles.modalOpacityLayer}></View>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modelSubContainer1}>
                                <View style={styles.modelSubContainer2}>
                                    <TouchableOpacity style={styles.modalIcon} onPress={() => setSubmitIsOpen(false)}>
                                        <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                                    </TouchableOpacity>
                                    {activeTab === 'tab1' ? <View style={styles.tripsContainer}>
                                        <TouchableOpacity style={styles.createNewTripBtn} onPress={() => setActiveTab('tab2')}>
                                            <Text style={styles.createNewTripBtnTitle}>Create New Trip</Text>
                                            <IconSwitcher componentName='Entypo' iconName='plus' color={colors.black} iconsize={3} />
                                        </TouchableOpacity>
                                        <FlatList
                                            data={sortedTrips}
                                            renderItem={renderItem}
                                            keyExtractor={(item) => item.id}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View >
                                                        <Text style={styles.triptitles}>Or</Text>
                                                        <Text style={styles.triptitles}>Select an existing trip</Text>
                                                    </View>
                                                )
                                            }}
                                            ListHeaderComponentStyle={{ marginTop: responsiveHeight(1) }}

                                            style={{ height: responsiveHeight(50) }}
                                            contentContainerStyle={{ paddingHorizontal: responsiveWidth(3) }} />
                                    </View> :
                                        <View style={styles.addingNewTripContainer}>
                                            <TouchableOpacity onPress={() => setActiveTab('tab1')}>
                                                <IconSwitcher componentName='MaterialCommunityIcons' iconName='arrow-left-thin' color={colors.primary} iconsize={4} />
                                            </TouchableOpacity>
                                            <View style={styles.addingNewTripSubContainer}>
                                                <Text style={styles.newtriptitle}>Enter new trip Name</Text>
                                                <TextInput
                                                    editable
                                                    multiline
                                                    numberOfLines={3}
                                                    placeholder='Enter name of your trip'
                                                    style={styles.multiTextContainer}
                                                    value={defaultInput}
                                                    onChangeText={handleInputChange} />
                                                <TouchableOpacity style={styles.addingNewTripBtn} onPress={handleAddToTrip}>
                                                    <Text style={styles.addingNewTripBtnText}>Add to trip</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>



                                    }

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
                <PopUp value={fareIsOpen} handlePopUpClose={() => setFareIsOpen(false)} customStyles={{ width: "100%" }}>
                    <View style={{ height: responsiveHeight(40) }}>
                        <WebView
                            source={{ html: bookingFlight[bookIndex].fareRules }}
                            nestedScrollEnabled />
                    </View>
                </PopUp>
            </View>
    )
}
const wingsStyles = StyleSheet.create({
    rightWing: {
        borderRightWidth: 1,
        height: responsiveHeight(7),
        width: responsiveWidth(9),
        position: 'absolute',
        left: 0,
        top: 0
    },
    rightWingFirst: {
        borderTopWidth: responsiveHeight(0.2),
        borderTopRightRadius: responsiveHeight(1)
    },
    rightWingLast: {
        borderBottomWidth: responsiveHeight(0.2),
        borderBottomRightRadius: responsiveHeight(1)
    },
    leftWing: {
        borderLeftWidth: responsiveHeight(0.2),
        height: responsiveHeight(7),
        width: responsiveWidth(9),
        position: 'absolute',
        right: 0,
        top: 0,
    },
    leftWingFirst: {
        borderTopWidth: responsiveHeight(0.2),
        borderTopLeftRadius: responsiveHeight(1)
    },
    leftWingLast: {
        borderBottomWidth: responsiveHeight(0.2),
        borderBottomLeftRadius: responsiveHeight(1)
    },
    flightBookSeat: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        height: responsiveHeight(3.5),
        width: responsiveHeight(3.5),
        // borderWidth:responsiveHeight(0.1),
        margin: responsiveHeight(0.8),
        borderRadius: responsiveHeight(1),
        backgroundColor: colors.whiteSmoke
    },
    spaceBetween: {
        marginRight: responsiveWidth(15)
    },
    emergencyExitMainContainer: {
        paddingHorizontal: responsiveWidth(10),
        marginVertical: responsiveHeight(1)
    },
    emergencyExitContainer: {
        flexDirection: 'row',
        height: responsiveHeight(3.5),
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: '#f1dcdc'
    },
    emergencyText: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.emergency
    },
    flightBookSeatReserved: {
        backgroundColor: "#8d8d8d",
    }
})
export default React.memo(FlightBooking)
