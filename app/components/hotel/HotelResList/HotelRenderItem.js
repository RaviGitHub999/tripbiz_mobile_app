import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MyContext from '../../../context/Context';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { styles } from './styles';

const HotelRenderItem = ({item:hotel,handleBooking,idToIndex}) => 
{
    const {hotelStaticData,hotelImageList}=useContext(MyContext)
      const staticData = hotelStaticData[hotel.HotelCode];
        // const starRatingFull = Math.floor(hotel.StarRating);
        // const rating = [];

        // for (let i = 1; i <= Math.ceil(hotel.StarRating); i++) {
        //     if (i > starRatingFull) {
        //         rating.push(<IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={1.8} />);
        //     } else {
        //         rating.push(<IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={1.8} />);
        //     }
        // }
        const img = hotelImageList?.hasOwnProperty(hotel.HotelCode) ? hotelImageList[hotel.HotelCode] : {};
        const hotelPic = img?.HotelPicture ? img?.HotelPicture : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";
        const hotelImg = hotel.HotelPicture === "https://images.cdnpath.com/Images/HotelNA.jpg" ? hotelPic : hotel?.HotelPicture;
        const ind = idToIndex[hotel.HotelCode];
    //  console.log(ind)
        return (
            <View style={styles.hotelCard}>
                <View style={styles.hotelImgContainer}>
              
                    <Image
                        source={{ uri: hotelImg }}
                        style={styles.hotelImg}
                        accessibilityLabel="Description of the image for accessibility"
                    />
                </View>
                <View style={styles.hotelDetailsContainer}>
                    <View style={styles.hotelNameContainer}>
                        <Text style={styles.hotelName}>{hotel.HotelName ? hotel.HotelName : 
                        staticData?.HotelName}</Text>
                        {ind !== undefined ? <View style={styles.recommendedTitleContainer}><Text style={styles.recommendedTitle}>Recommended</Text></View> : null}
                    </View>
                    <View style={styles.hotelDetailsBox}>
                        <View style={styles.hotelDetailsRow}>
                            <Text style={styles.hotelPrice}>
                                {/* <FontAwesomeIcon icon={faRupeeSign} />{' '} */}
                                {`${hotel.Price.OfferedPriceRoundedOff ? `₹ ${hotel.Price.OfferedPriceRoundedOff.toLocaleString("en-IN")}` : `₹ ${hotel.Price.PublishedPriceRoundedOff.toLocaleString("en-IN")}`}`}
                            </Text>

                        </View>
                        <View style={styles.hotelInfoButton}>
                            {/* <View style={styles.hotelRating}>{rating}</View> */}
                            <TouchableOpacity style={styles.bookingBtn} onPress={()=>handleBooking(hotel)}>
                                <Text style={styles.bookingBtnText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>)
}

export default React.memo(HotelRenderItem)