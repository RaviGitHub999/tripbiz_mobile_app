import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MyContext from '../../context/Context'
import { FlatList } from 'react-native-gesture-handler'
import { styles } from './HotelResList/styles'
import IconSwitcher from '../common/icons/IconSwitcher'
import ProgressBar from '../common/progressBar/ProgressBar'
import { colors } from '../../config/theme'
import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
const TestingScreen = () => {
    const { searchingHotels,
        hotelResList,
        actions, hotelStaticData,
        hotelRooms,
        recommondedHotels,
        hotelImageList, hotelSearchChild, selectedCheckInDate,
        selectedCheckOutDate,
        cityHotelItem,
        hotelNights,
        hotelRoomArr } = useContext(MyContext)
    const hotelIdsInObject = recommondedHotels ? Object.keys(recommondedHotels).map(ele => { return { HotelCode: ele } }) : []
    const idToIndex = hotelIdsInObject.reduce((acc, item, index) => {
        acc[item.HotelCode] = index;
        return acc;
    }, {});
    const filteredHotels = hotelResList.filter(hotel => {
        const staticData = hotelStaticData[hotel.HotelCode];
        const hotelName = hotel.HotelName ? hotel.HotelName : staticData?.HotelName;
        return hotelName?.length > 0;
    })
    const finalData = filteredHotels.sort((a, b) => {
        // console.log(a.HotelCode)
        const indexA = idToIndex[a.HotelCode];
        const indexB = idToIndex[b.HotelCode];

        if (indexA === undefined && indexB === undefined) {
            return 0;
        } else if (indexA === undefined) {
            return 1;
        } else if (indexB === undefined) {
            return -1;
        }
        return indexA - indexB;
    });
    const isImageUri = (uri) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
        return imageExtensions.some((ext) => uri.endsWith(ext));
    };
    const renderItem = ({ item: hotel, index }) => {
        const staticData = hotelStaticData[hotel.HotelCode];
        const starRatingFull = Math.floor(hotel.StarRating);
        const rating = [];

        for (let i = 1; i <= Math.ceil(hotel.StarRating); i++) {
            if (i > starRatingFull) {
                rating.push(<IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={1.8} />);
            } else {
                rating.push(<IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={1.8} />);
            }
        }

        const img = hotelImageList?.hasOwnProperty(hotel.HotelCode) ? hotelImageList[hotel.HotelCode] : {};
        const hotelPic = img?.HotelPicture ? img?.HotelPicture : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";
        const hotelImg = hotel.HotelPicture === "https://images.cdnpath.com/Images/HotelNA.jpg" ? hotelPic : hotel?.HotelPicture;
        // console.log(hotelImg,index)
        const ind = idToIndex[hotel.HotelCode];
        return (
            <View style={styles.hotelCard}>
                <View style={styles.hotelImgContainer}>
                    {isImageUri(hotelImg) ? (
                        <Image source={{ uri: hotelImg }} style={styles.hotelImg} />
                    ) : (
                        <View style={styles.noImageContainer}>
                            <Text style={styles.noImgText}>No Image Available</Text>
                        </View>
                    )}
                </View>
                <View style={styles.hotelDetailsContainer}>
                    <View style={styles.hotelNameContainer}>
                        <Text style={styles.hotelName}>{hotel.HotelName ? hotel.HotelName : staticData?.HotelName}</Text>
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
                            <View style={styles.hotelRating}>{rating}</View>
                            <TouchableOpacity style={styles.bookingBtn}>
                                <Text style={styles.bookingBtnText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    useEffect(() => {
        if (searchingHotels) {
            console.log("fun")
            actions.hotelSearch()
        }
        console.log("useEffect")
    }, [])
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        >
            <View style={styles.headerMainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{`${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`}</Text>
                    <TouchableOpacity style={styles.editButtonContainer} onPress={() => { goBack(), actions.handleHotelBackButton() }}>
                        <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.2} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>{`${selectedCheckInDate} - ${selectedCheckOutDate} | ${hotelRooms} ${hotelRooms > 1 ? "Rooms" : "Room"
                    } | ${hotelRoomArr[0].adults} ${hotelRoomArr[0].adults > 1 ? "Adults" : "Adult"} ${hotelSearchChild
                        ? ` | ${hotelSearchChild} ${hotelSearchChild > 1 ? "Children" : "Child"
                        } `
                        : ""
                    } | ${hotelNights} ${hotelNights > 1 ? "nights" : "night"
                    }`}</Text>
            </View>

            {searchingHotels ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <ProgressBar />
                </View> : <ScrollView >
                    <View style={{ paddingHorizontal: responsiveHeight(2), paddingTop: responsiveHeight(2), flex: 1, rowGap: responsiveHeight(1) }}>
                        <TextInput placeholder='Search for your favourite hotel' style={{ borderWidth: 1, paddingHorizontal: responsiveWidth(5), borderRadius: responsiveHeight(2), fontSize: responsiveHeight(2.1) }} />
                        <FlatList
                            data={finalData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false} />
                    </View>
                </ScrollView>}
        </KeyboardAvoidingView>
    )
}

export default TestingScreen