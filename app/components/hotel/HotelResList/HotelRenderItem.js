import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import MyContext from '../../../context/Context';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { styles } from './styles';
import { responsiveHeight } from '../../../utils/responsiveScale';

const HotelRenderItem = ({ item: hotel, handleBooking }) => {
    const [imageError, setImageError] = useState(false);
    const { hotelStaticData, hotelImageList ,setidToIndex} = useContext(MyContext)
    const staticData = hotelStaticData[hotel.HotelCode];
    const img = hotelImageList?.hasOwnProperty(hotel.HotelCode) ? hotelImageList[hotel.HotelCode] : {};
    const hotelPic = img?.HotelPicture ? img?.HotelPicture : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";
    const hotelImg = hotel.HotelPicture === "https://images.cdnpath.com/Images/HotelNA.jpg" ? hotelPic : hotel?.HotelPicture;
    const ind = setidToIndex[hotel.HotelCode];
    var starRating = hotel.StarRating;
    var starRatingFull = Math.floor(starRating);
    const stars = useMemo(() => {
        const starsArray = [];
        for (let i = 0; i < starRatingFull; i++) {
            starsArray.push(<IconSwitcher componentName='AntDesign' iconName='star' color='gold' iconsize={2} />);
        }
        return starsArray;
    }, [starRatingFull]);
console.log("star")
    return (
        <View style={styles.hotelCard}>
            <View style={styles.hotelImgContainer}>
                <Image
                    source={{ uri: imageError ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : hotelImg }}
                    onError={() => setImageError(true)}
                    style={styles.hotelImg}
                />
            </View>
            <View style={styles.hotelDetailsContainer}>
                <View style={styles.hotelNameContainer}>
                    <Text style={styles.hotelName}>{hotel.HotelName ? hotel.HotelName : staticData?.HotelName}</Text>
                    {ind !== undefined ? <View style={styles.recommendedTitleContainer}><Text style={styles.recommendedTitle}>Recommended</Text></View> : null}
                </View>
                <View style={styles.hotelDetailsBox}>
                    <View style={styles.hotelDetailsRow}>
                        <Text style={styles.hotelPrice}>
                            {`${hotel.Price.OfferedPriceRoundedOff ? `₹ ${hotel.Price.OfferedPriceRoundedOff.toLocaleString("en-IN")}` : `₹ ${hotel.Price.PublishedPriceRoundedOff.toLocaleString("en-IN")}`}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {stars}
                    </View>
                    <View style={styles.hotelInfoButton}>
                        <TouchableOpacity style={styles.bookingBtn} onPress={() => handleBooking(hotel)}>
                            <Text style={styles.bookingBtnText}>Book</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default React.memo(HotelRenderItem)
