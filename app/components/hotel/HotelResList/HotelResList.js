import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import MyContext from '../../../context/Context';
import ProgressBar from '../../common/progressBar/ProgressBar';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors } from '../../../config/theme';
import { responsiveHeight } from '../../../utils/responsiveScale';

const HotelResList = () => {
    var {
        searchingHotels,
        hotelResList,
        actions,
        fetchingHotelInfo,
        hotelInfoRes,
        hotelSearchName,
        hotelSearchCheckIn,
        hotelSearchCheckOut,
        hotelSearchAdults,
        hotelSearchChild,
        hotelSearchNights,
        hotelSearchText,
        hotelRating,
        hotelStaticData,
        hotelRooms,
        recommondedHotels,
        hotelImageList,
        hotelErrorMessage,
        cityHotel
    } = useContext(MyContext);
    return (
        <View style={{ flex: 1 }}>
            <View style={{flex:.1,borderWidth:2,borderColor:"red"}}>
<View style={{flexDirection:"row"}}>
    <Text>{hotelSearchName}</Text>
    <View style={{
        backgroundColor:colors.highlight,
        height:responsiveHeight(3.8),
        width:responsiveHeight(3.8),
        borderRadius:responsiveHeight(3),
        alignItems:'center',
        justifyContent:'center',
    }}>
    <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.3} />
    </View>
</View>
<Text>
        {`${hotelSearchCheckIn
            .toString()
            .slice(4, 10)} - ${hotelSearchCheckOut
              .toString()
              .slice(4, 10)} | ${hotelRooms} ${hotelRooms > 1 ? "Rooms" : "Room"
            } | ${hotelSearchAdults} ${hotelSearchAdults > 1 ? "Adults" : "Adult"
            }${hotelSearchChild
              ? ` | ${hotelSearchChild} ${hotelSearchChild > 1 ? "Children" : "Child"
              } `
              : ""
            }| ${hotelSearchNights} ${hotelSearchNights > 1 ? "nights" : "night"
            }`}</Text>
            </View>
            {searchingHotels ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <ProgressBar />
                </View> :
                <View style={{borderWidth:1,flex:1}}>

                </View>
            }
        </View>
    )
}

export default HotelResList