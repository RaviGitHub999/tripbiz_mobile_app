
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from './styles';
import { colors } from '../../config/theme'
import IconSwitcher from '../common/icons/IconSwitcher';
import ProgressBar from '../common/progressBar/ProgressBar';
import MyContext from '../../context/Context';
import FlightList from '../flightList/FlightList';
import FlightFilters from '../flightfilters/FlightFilters';

const FlightsSearchRes = (props: any) => {
    console.log("res")
    const {
        flightResult,
        searchingFlights,
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
        actions
    } = useContext<any>(MyContext);

    const travellers = adults + children + infants;

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>{`${originSelectedAirport.address.cityName} to ${destinationSelectedAirPort.address.cityName}`}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => {props.navigation.goBack(),actions.handlesearchingFlights()}}>
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

    return (
        <View style={styles.mainContainer}>
            {renderHeader()}

            {showFilters ? (
                <FlightFilters />
            ) : (
                <View style={styles.filtersHeaderContainer}>
                    <View style={styles.filtersIconContainer}>
                        <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
                        <Text style={styles.filterHeader}>{"Filters"}</Text>
                    </View>
                    <TouchableOpacity onPress={() => actions.handleFlightsFilter(true)}>
                        <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.activeIndicatorMainContainer}>
                {searchingFlights ? (
                    <View style={styles.activeIndicator}><ProgressBar /></View>
                ) : flightResult.length === 0 ? (
                    <Text style={styles.nodata}>{"No Flights Found!!"}</Text>
                ) : (
                    !showFilters && flightResJType === 0 ? <FlightList index={0} /> : <FlightList index={1} />

                )}
            </View>
        </View>
    );
};

export default React.memo(FlightsSearchRes);
