import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import IconSwitcher from '../common/icons/IconSwitcher'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import MyContext from '../../context/Context'
import ProgressBar from '../common/progressBar/ProgressBar'
import { styles } from './styles'
import FlightCard from '../flightList/FlightCard'
import { colors } from '../../config/theme'

const FlightBooking = () => {
    var [bookIndex, setBookIndex] = useState(0);
    var [segIndex, setSegIndex] = useState(0);
    var [seatSegIdx, setSeatSegIdx] = useState(0);

    var [selectSeats, setSelectSeats] = useState(false);
    var [seatData, setSeatData] = useState([]);
    var [selectedSeats, setSelectedSeats] = useState([[], []]);
    var [wingPosArr, setWingPosArr] = useState([]);

    var [fareIsOpen, setFareIsOpen] = useState(false);

    var [submitIsOpen, setSubmitIsOpen] = useState(false);


    var [activeTab, setActiveTab] = useState('tab1');
    const { actions, flightBookDataLoading, bookingFlight } = useContext(MyContext)
    if (flightBookDataLoading) {
        return (
            <View style={styles.mainContainer}>
                <ProgressBar />
            </View>
        );
    }
    return (
        <View>
            <TouchableOpacity onPress={() => {
                actions.setFlightBookPage(false);
                actions.setBookingFlight([]);
            }} style={styles.backBtnContainer}>
                <IconSwitcher componentName='AntDesign' iconName='arrowleft' color='black' iconsize={3} />
            </TouchableOpacity>
            <FlatList data={bookingFlight} renderItem={({ item, index }) => {
                return (
                    <FlightCard
                        flightGrp={[{ ...bookingFlight[index]?.flight }]}
                        index={index}
                        bookingPage={true}
                        segIndex={segIndex}
                    />
                )
            }} />
            <View style={styles.baggageAndMealsContainer}>
                {/* Baggage and Meals */}
            <Text style={styles.baggageAndMealsTitle}>Baggage and Meals</Text>
            <View style={styles.baggageDetailsContainer}>
            <Text style={styles.baggageDetailsText}>Baggage details</Text>
            <View style={styles.bookingFlightCabinAndCheckInContainer}>
               {bookingFlight[bookIndex].baggageDtls?.cabinBaggage ?<View style={styles.bookingFlightCabinAndCheckInSubContainer}>
                    <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.black} iconsize={3}/>
                    <Text style={styles.flightBaggageText}>Cabin baggage:<Text  style={styles.flightBaggageDataText}> {bookingFlight[bookIndex].baggageDtls?.cabinBaggage}</Text></Text>
                </View>:null}
               {bookingFlight[bookIndex].baggageDtls?.baggage ? <View style={styles.bookingFlightCabinAndCheckInSubContainer}>
                <IconSwitcher componentName='AntDesign' iconName='arrowright' color={colors.black} iconsize={3}/>
                <Text style={styles.flightBaggageText}>Check-in baggage:<Text style={styles.flightBaggageDataText}> {bookingFlight[bookIndex].baggageDtls?.baggage}</Text></Text>
                </View>:null}
            </View>
            <View style={styles.horizontalLine}/>
            <View style={styles.flightextrabagAndMealContainer}>
                <Text style={styles.flightextrabagAndMealTitle}>Select extra baggage</Text>
                <TouchableOpacity style={styles.selectingBtn}>
                    <Text>No excess baggage</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.horizontalLine}/>
            <View style={styles.flightextrabagAndMealContainer}>
                <Text style={styles.flightextrabagAndMealTitle}>Select add-on meal</Text>
                <TouchableOpacity>
                    <Text>No add-on meal</Text>
                </TouchableOpacity>
            </View>
            </View>
            </View>
        </View>
    )
}

export default React.memo(FlightBooking)