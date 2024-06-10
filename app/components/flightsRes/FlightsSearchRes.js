import { View, Text, BackHandler } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MyContext from '../../context/Context';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconSwitcher from '../common/icons/IconSwitcher';
import { colors } from '../../config/theme';
import FlightList from '../flightList/FlightList';
import FlightBooking from '../FlightBooking/FlightBooking';
import ProgressBar from '../common/progressBar/ProgressBar';
import { useFocusEffect } from '@react-navigation/native';

const FlightsSearchRes = (props) => {
    const {
        searchingFlights,
        flightBookPage,
        destinationSelectedAirPort,
        departureformattedDate,
        originSelectedAirport,
        adults,
        children,
        infants,
        returnformattedDate,
        classes,
        flightResJType,
        flightResList,
        bookingFlight,
        actions,
        journeyWay
    } = useContext(MyContext);

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            props.navigation.goBack(), 
            actions.editFlightSearch()
            return true;
          };
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
          return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []) 
      );

    const travellers = adults + children + infants;
    if (bookingFlight && bookingFlight.length > 0) {
        var { totalFareSum } = actions.getTotalFares(bookingFlight);
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{`${originSelectedAirport.address.cityName} to ${destinationSelectedAirPort.address.cityName}`}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => { props.navigation.goBack(), actions.editFlightSearch() }}>
                    <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.3} />
                </TouchableOpacity>
            </View>
            <View style={styles.travellerDescription}>
                <Text style={styles.descriptionTitles}>{`${departureformattedDate}`}</Text>
                {journeyWay === "2" && <Text style={styles.descriptionTitles}>{` - ${returnformattedDate}`}</Text>}
                <Text style={styles.descriptionTitles}>{` | ${travellers} ${travellers <= 1 ? "traveller" : "travellers"} | `}</Text>
                <Text style={styles.descriptionTitles}>{classes}</Text>
            </View>
        </View>
    );
    useEffect(() => {
        const fetchData = async () => {
            await actions.flightSearch()
            await actions.handleFlightsLogos();
        };
        fetchData();
    }, []);

    console.log(flightResJType, "res");

    return (
        <View style={styles.mainContainer}>
            {!flightBookPage ? renderHeader() : null}
            <View style={styles.activeIndicatorMainContainer}>
                {searchingFlights ? (
                    <View style={styles.activeIndicator}>
                       <View style={{width:'100%'}}>
                       <ProgressBar />
                       </View>
                        </View>
                )
                    :
                    <View style={{ flex: 1 }}>
                        {
                            flightBookPage ? <FlightBooking {...props} /> : (
                                flightResJType === 0 ? <FlightList index={0} /> : <FlightList index={1} />
                            )
                        }
                        {!flightBookPage ?
                            flightResList.length > 1 &&
                                bookingFlight &&
                                bookingFlight.length > 0 ?
                                <View style={styles.selectedDomesticFlightsmainContainer}>
                                    <View style={styles.selectedDomesticEachFlights}>
                                        <View>
                                            <Text style={styles.selectedDomesticFlightTimings}>{bookingFlight[0]?.flightNew?.segments[0].depTime}</Text>
                                            <Text style={styles.selectedDomesticFlightName}>{bookingFlight[0]?.flightNew?.segments[0].originAirportCode}</Text>
                                        </View>
                                        <View style={styles.selectedDomesticFlightIconContainer}>
                                            <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={colors.primary} />
                                        </View>
                                        <View style={styles.selectedDomesticFlightArrContainer}>
                                            <Text style={styles.selectedDomesticFlightTimings}> {bookingFlight[0]?.flightNew?.segments[0].arrTime}</Text>
                                            <Text style={styles.selectedDomesticFlightName}>{bookingFlight[0]?.flightNew?.segments[0].destAirportCode}</Text>
                                        </View>
                                    </View>

                                    {bookingFlight[1] ? <View style={styles.selectedDomesticEachFlights}>
                                        <View>
                                            <Text style={styles.selectedDomesticFlightTimings}> {bookingFlight[1]?.flightNew?.segments[0].depTime}</Text>
                                            <Text style={styles.selectedDomesticFlightName}>{bookingFlight[1]?.flightNew?.segments[0].originAirportCode}</Text>
                                        </View>
                                        <View style={styles.selectedDomesticFlightIconContainer}>
                                            <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3} color={colors.primary} />
                                        </View>
                                        <View style={styles.selectedDomesticFlightArrContainer}>
                                            <Text style={styles.selectedDomesticFlightTimings}>{bookingFlight[1]?.flightNew?.segments[0].arrTime}</Text>
                                            <Text style={styles.selectedDomesticFlightName}>{bookingFlight[1]?.flightNew?.segments[0].destAirportCode}</Text>
                                        </View>
                                    </View> : null}

                                    {bookingFlight.length === 2 ? <View style={styles.selectedDomesticFlightsPriceContainer}>
                                        <Text style={styles.selectedDomesticFlightsPrice}>  {`₹ ${totalFareSum.toLocaleString("en-IN")}`}</Text>
                                        <TouchableOpacity style={styles.selectedDomesticFlightsbookBtn}
                                            onPress={() =>
                                                {
                                                actions.fetchingFlightBookData(bookingFlight)
                                            }
                                            }>
                                            <Text style={styles.selectedDomesticFlightsbookBtnTitle}>Book</Text>
                                        </TouchableOpacity>
                                    </View> : null}
                                </View> : null : null
                        }
                    </View>
                }
            </View>
        </View>
    );
}

export default React.memo(FlightsSearchRes);

