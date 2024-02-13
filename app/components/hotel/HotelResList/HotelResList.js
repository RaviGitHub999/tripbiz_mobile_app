import { View, Text, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MyContext from '../../../context/Context';
import ProgressBar from '../../common/progressBar/ProgressBar';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors } from '../../../config/theme';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HotelResList = ({ navigation: { goBack } }) => {
    var {
        searchingHotels,
        hotelResList,
        actions,
        fetchingHotelInfo,
        hotelInfoRes,
        // hotelSearchName,
        hotelSearchCheckIn,
        hotelSearchCheckOut,
        hotelSearchAdults,
        hotelSearchChild,
        // hotelSearchNights,
        hotelSearchText,
        hotelRating,
        hotelStaticData,
        hotelRooms,
        recommondedHotels,
        hotelImageList,
        hotelErrorMessage,
        cityHotel,
        HotelcheckInDate,
        HotelcheckOutDate,
        selectedCheckInDate,
        selectedCheckOutDate,
        cityHotelItem,
        hotelNights
    } = useContext(MyContext);


    useEffect(() => {
        // actions.hotelSearch()
    }, [])
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        
        >
            <View style={styles.headerMainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{`${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`}</Text>
                    <TouchableOpacity style={styles.editButtonContainer} onPress={() => goBack()}>
                        <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.2} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>{`${selectedCheckInDate} - ${selectedCheckOutDate} | ${hotelRooms} ${hotelRooms > 1 ? "Rooms" : "Room"
                    } | ${hotelSearchAdults} ${hotelSearchAdults > 1 ? "Adults" : "Adult"} ${hotelSearchChild
                        ? ` | ${hotelSearchChild} ${hotelSearchChild > 1 ? "Children" : "Child"
                        } `
                        : ""
                    } | ${hotelNights} ${hotelNights > 1 ? "nights" : "night"
                    }`}</Text>
            </View>
            {/* {searchingHotels ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <ProgressBar />
                </View> :
                <View style={{ borderWidth: 1, flex: 1 }}>

                </View>
            } */}
            <View style={{borderWidth:3,borderColor:"red",padding:responsiveHeight(2),flex:1}}>
                <TextInput placeholder='Search for your favourite hotel' style={{borderWidth:1,paddingHorizontal:responsiveWidth(5),borderRadius:responsiveHeight(2),fontSize:responsiveHeight(2.1)}}/>
                <FlatList data={hotelResList} renderItem={({item})=>
            {

            }}/>
            </View>
        </KeyboardAvoidingView>
    )
}

export default HotelResList