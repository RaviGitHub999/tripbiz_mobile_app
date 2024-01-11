
// import React, { useContext } from 'react';
// import { View, Text, TouchableOpacity, FlatList } from 'react-native';
// import { styles } from './styles';
// import { colors } from '../../config/theme'
// import IconSwitcher from '../common/icons/IconSwitcher';
// import ProgressBar from '../common/progressBar/ProgressBar';
// import MyContext from '../../context/Context';
// import FlightList from '../flightList/FlightList';
// import FlightFilters from '../flightfilters/FlightFilters';
// import FlightBooking from '../FlightBooking/FlightBooking';

// const FlightsSearchRes = (props) => {
//     console.log("res")
//     const {
//         flightResult,
//         searchingFlights,
//         flightBookPage,
//         showFilters,
//         destinationSelectedAirPort,
//         departureformattedDate,
//         originSelectedAirport,
//         adults,
//         children,
//         infants,
//         returnformattedDate,
//         classes,
//         flightResJType,
//         actions
//     } = useContext(MyContext);

//     const travellers = adults + children + infants;

//     const renderHeader = () => (
//         <View style={styles.headerContainer}>
//             <View style={styles.header}>
//                 <Text style={styles.title}>{`${originSelectedAirport.address.cityName} to ${destinationSelectedAirPort.address.cityName}`}</Text>
//                 <TouchableOpacity style={styles.editButton} onPress={() => {props.navigation.goBack(),actions.handlesearchingFlights()}}>
//                     <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.3} />
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.travellerDescription}>
//                 <Text style={styles.descriptionTitles}>{`${departureformattedDate}`}</Text>
//                 {returnformattedDate.length !== 0 && <Text style={styles.descriptionTitles}>{` - ${returnformattedDate}`}</Text>}
//                 <Text style={styles.descriptionTitles}>{` | ${travellers} ${travellers <= 1 ? "traveller" : "travellers"} | `}</Text>
//                 <Text style={styles.descriptionTitles}>{classes}</Text>
//             </View>
//         </View>
//     );

//     return (
//         <View style={styles.mainContainer}>
//             {!flightBookPage?renderHeader():null}

//             {/* {showFilters ? (
//                 <FlightFilters />
//             ) : (
//                 <View style={styles.filtersHeaderContainer}>
//                     <View style={styles.filtersIconContainer}>
//                         <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
//                         <Text style={styles.filterHeader}>{"Filters"}</Text>
//                     </View>
//                     <TouchableOpacity onPress={() => actions.handleFlightsFilter(true)}>
//                         <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
//                     </TouchableOpacity>
//                 </View>
//             )} */}

//             <View style={styles.activeIndicatorMainContainer}>
//                 {searchingFlights ? (
//                     <View style={styles.activeIndicator}><ProgressBar /></View>
//                 ) : flightResult.length === 0 ? (
//                     <Text style={styles.nodata}>{"No Flights Found!!"}</Text>
//                 ) :
//                 flightBookPage?<FlightBooking/>: (
//                     !showFilters && flightResJType === 0 ? <FlightList index={0} /> : <FlightList index={1} />

//                 )
//                 // <Text>hi</Text>
//             }
//             </View>
//         </View>
//     );
// };

// export default React.memo(FlightsSearchRes);
// import { View, Text } from 'react-native';
// import React, { useContext, useEffect, useMemo } from 'react';
// import MyContext from '../../context/Context';

// const FlightsSearchRes = () => {
//     const {actions}=useContext(MyContext)
//     useEffect(()=>
//     {
//         actions.flightSearch();
//         actions.handleFlightsLogos();
//     },[])
//     console.log("FlightsSearchRes component rendering"); // Debugging log

//     const { flightTravellers } = useContext(MyContext);

//     console.log("Context values:",flightTravellers); // Debugging log

//     const memoizedComponent = useMemo(() => {

//         return (
//             <View>
//                 <Text>FlightsSearchRes</Text>
//             </View>
//         );
//     }, [flightTravellers]); // Dependencies include adults, children, and infants

//     return memoizedComponent;
// }

// export default FlightsSearchRes;
import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MyContext from '../../context/Context';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconSwitcher from '../common/icons/IconSwitcher';
import { colors } from '../../config/theme';
import FlightList from '../flightList/FlightList';
import FlightBooking from '../FlightBooking/FlightBooking';
import ProgressBar from '../common/progressBar/ProgressBar';

const FlightsSearchRes = (props) => {
    const {
        flightResult,
        searchingFlights,
        flightBookPage,
        showFilters,
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
        actions
    } = useContext(MyContext);
    const travellers = adults + children + infants;

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{`${originSelectedAirport.address.cityName} to ${destinationSelectedAirPort.address.cityName}`}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => { props.navigation.goBack(), actions.handlesearchingFlights() }}>
                    <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.3} />
                </TouchableOpacity>
            </View>
            <View style={styles.travellerDescription}>
                <Text style={styles.descriptionTitles}>{`${departureformattedDate}`}</Text>
                {returnformattedDate.length !== 0 && <Text style={styles.descriptionTitles}>{` - ${returnformattedDate}`}</Text>}
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

    console.log("res");

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}
            <View style={styles.activeIndicatorMainContainer}>
                {searchingFlights ? (
                    <View style={styles.activeIndicator}><ProgressBar /></View>
                ) : flightResult.length === 0 ? (
                    <Text style={styles.nodata}>{"No Flights Found!!"}</Text>
                ) :
                    <View style={{flex:1}}>
                        {
                            flightBookPage ? <FlightBooking /> : (
                                flightResJType === 0 ? <FlightList index={0} /> : <FlightList index={1} />
                            )
                        }
                        {
                            flightResList.length > 1 &&
                                bookingFlight &&
                                bookingFlight.length > 0 ? 
                            <View style={styles.selectedDomesticFlightsmainContainer}>
                                <View style={styles.selectedDomesticEachFlights}>
                                    <View>
                                        <Text>06:38</Text>
                                        <Text>HYD</Text>
                                    </View>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3}/>
                                    <View>
                                        <Text>04:38</Text>
                                        <Text>RJA</Text>
                                    </View>
                                </View>

                                <View style={styles.selectedDomesticEachFlights}>
                                    <View>
                                        <Text>06:38</Text>
                                        <Text>HYD</Text>
                                    </View>
                                    <IconSwitcher componentName='AntDesign' iconName='arrowright' iconsize={3}/>
                                    <View>
                                        <Text>04:38</Text>
                                        <Text>RJA</Text>
                                    </View>
                                </View>

                                <View style={styles.selectedDomesticFlightsPrice}>
                                    <Text>19,980</Text>
                                    <TouchableOpacity>
                                        <Text>Book</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> : null
                        }
                    </View>

                }
            </View>
        </View>
    );
}

export default React.memo(FlightsSearchRes);

