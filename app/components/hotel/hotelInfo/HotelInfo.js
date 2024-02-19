import { View, Text, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MyContext from '../../../context/Context'
import { styles } from './styles'
import ProgressBar from '../../common/progressBar/ProgressBar'
import { TouchableOpacity } from 'react-native-gesture-handler'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors } from '../../../config/theme'

const HotelInfo = ({ route: { params } }) => {
    const { ResultIndex, HotelCode, SupplierHotelCodes, } = params.hotel
    const {actions,fetchingHotelInfo,hotelInfoRes,bookingHotel,hotelStaticData,} = useContext(MyContext)
    console.log(hotelInfoRes?.hotelSearchRes?.StarRating,"star")
    useEffect(() => {
        if(!fetchingHotelInfo)
        {
            console.log("calling BookingData")
            actions.fetchHotelInfo(
                {
                    resultIndex: ResultIndex,
                    hotelCode: HotelCode,
                    categoryId:SupplierHotelCodes &&
                            SupplierHotelCodes.length > 0
                            ? SupplierHotelCodes[0].CategoryId
                            : "",
                    hotelSearchRes: params.hotel
                }
            )
        }
    }, [])
    const generatePattern = (itemCount) => {
        return Array.from({ length: itemCount }, (_, index) => index).map((ele,ind)=>
        {
          return(
            <View key={ind}>
                <IconSwitcher componentName='AntDesign' iconName='star' iconsize={2} color='#ffd700'/>
            </View>
          )
        })
         
    };
    return (
        <View style={styles.mainContainer}>
           {
            !fetchingHotelInfo?<View style={styles.progessBarContainer}><ProgressBar/></View>:
            <View>
               <View style={styles.backIconContainer}>
               <TouchableOpacity >
                    <IconSwitcher componentName='AntDesign' iconName='arrowleft' color="black" iconsize={3}/>
                </TouchableOpacity>
                </View>
                <View style={styles.hotelImgMainContainer}>
                    <View style={styles.hotelImgContainer}>
                    <Image source={{uri: hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Images[0]}} style={styles.hotelImg}/> 
                    </View>
                    <View style={styles.hotelDescriptions}>
                        <Text style={styles.hotelName}>{bookingHotel?.hotelName ? bookingHotel?.hotelName : hotelStaticData[bookingHotel?.hotelCode]?.HotelName}</Text>
                        <View style={{flexDirection:'row'}}>
                            {hotelInfoRes?.hotelSearchRes?.StarRating?generatePattern(hotelInfoRes?.hotelSearchRes?.StarRating):null}
                        </View>
                        <Text style={styles.hotelPrice}>
                        {`₹ ${hotelInfoRes.hotelSearchRes.Price.OfferedPriceRoundedOff
                    ? hotelInfoRes.hotelSearchRes.Price.OfferedPriceRoundedOff.toLocaleString(
                      "en-IN"
                    )
                    : hotelInfoRes.hotelSearchRes.Price.PublishedPriceRoundedOff.toLocaleString(
                      "en-IN"
                    )
                    }`}
                        </Text>
                    </View>
                
                </View>
            </View>
           }
               <View>
                        <Text style={styles.addressTitle}>
                        Address:
                        </Text>
                        <Text style={styles.address}>
                        {`${hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Address}`}
                        </Text>
                    </View>
        </View>
    )
}

export default HotelInfo