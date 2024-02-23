// import { View, Text, Image, TouchableOpacity, FlatList, Animated } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import MyContext from '../../../context/Context'
// import { styles } from './styles'
// import ProgressBar from '../../common/progressBar/ProgressBar'
// import IconSwitcher from '../../common/icons/IconSwitcher'
// import { colors } from '../../../config/theme'
// import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
// import { ScrollView } from 'react-native-gesture-handler'

// const HotelInfo = ({ route: { params }, navigation: { goBack } }) => {
//     const [selectedRoom, setSelectedRoom] = useState(0);
//     const [breakfastFilter, setBreakfastFilter] = useState(false);
//     const [cancelFilter, setCancelFilter] = useState(false);
//     const [heightAnim] = useState(new Animated.Value(responsiveHeight(8))); 
//     const increasedHeight = responsiveHeight(30); 
//     const initialHeight =responsiveHeight(8); 
//     const [isExpanded, setIsExpanded] = useState(false);
//     const { ResultIndex, HotelCode, SupplierHotelCodes, } = params.item
//     const { actions, fetchingHotelInfo, hotelInfoRes, bookingHotel, hotelStaticData, selectedHotelCheckInDate, selectedHotelCheckOutDate, hotelNights, hotelRoomArr, hotelSearchChild,domesticHotel } = useContext(MyContext)
//     const hotelCheckIn = new Date(selectedHotelCheckInDate)
//     const hotelCheckOut = new Date(selectedHotelCheckOutDate)
//     useEffect(() => {
//         if (!fetchingHotelInfo) {
//             console.log("calling BookingData")
           
//         }
//         actions.fetchHotelInfo(
//             {
//                 resultIndex: ResultIndex,
//                 hotelCode: HotelCode,
//                 categoryId: SupplierHotelCodes &&
//                     SupplierHotelCodes.length > 0
//                     ? SupplierHotelCodes[0].CategoryId
//                     : "",
//                 hotelSearchRes: params.item
//             }
//         )
//     }, [])
//     const toggleHeight = () => {
//         const toValue = isExpanded ? initialHeight : increasedHeight;
//         Animated.timing(heightAnim, {
//           toValue,
//           duration: 500, 
//           useNativeDriver: false,
//         }).start();
//         setIsExpanded(!isExpanded);
//       };
//     const generatePattern = (itemCount) => {
//         return Array.from({ length: itemCount }, (_, index) => index).map((ele, ind) => {
//             return (
//                 <View key={ind}>
//                     <IconSwitcher componentName='AntDesign' iconName='star' iconsize={2} color='#ffd700' />
//                 </View>
//             )
//         })

//     };
//     const isImageUri = (uri) => {
//         const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
//         return imageExtensions.some((ext) => uri.endsWith(ext));
//     };
//     const renderItem = ({ item: room, index }) => (
//         <TouchableOpacity style={styles.card} onPress={() => actions.selectHotelRoomType(room, selectedRoom, index)}>
//             <View style={styles.cardMainSubContainer}>
//                 <View style={styles.cardSubContainer1}>
//                     <Text style={styles.roomType}>{room.RoomTypeName}</Text>
//                     <View style={styles.mealsDescriptionContainer}>
//                         <IconSwitcher componentName='MaterialIcons' iconName='dinner-dining' color='black' iconsize={3} />
//                         <Text style={styles.inclusion}>{room.Inclusion && room.Inclusion.length > 0
//                             ? actions.checkForTboMeals(room.Inclusion)
//                             : "No meals"}
//                         </Text>
//                     </View>
//                 </View>
//                 <View style={styles.cardSubContainer2}>
//                     <Text style={styles.roomPrice}>{`₹ ${room.Price.OfferedPriceRoundedOff
//                         ? room.Price.OfferedPriceRoundedOff.toLocaleString(
//                             "en-IN"
//                         )
//                         : room.Price.PublishedPriceRoundedOff.toLocaleString(
//                             "en-IN"
//                         )
//                         }`}</Text>
//                     {
//                         room.LastCancellationDate &&
//                             actions.validCancelDate(
//                                 room.LastCancellationDate
//                             ) ? <View style={styles.mealsDescriptionContainer}>
//                             <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
//                             <Text style={styles.inclusion}>{`Free cancellation upto ${new Date(
//                                 room.LastCancellationDate
//                             )
//                                 .toString()
//                                 .slice(4, 10)}`}</Text>
//                         </View> : <View style={styles.mealsDescriptionContainer}>
//                             <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
//                             <Text style={styles.inclusion}>Non-refundable</Text>
//                         </View>
//                     }

//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
//     return (
//             <View style={styles.mainContainer}>
//                 {
//                     !fetchingHotelInfo ? <View style={styles.progessBarContainer}><ProgressBar /></View> :
//                       <View style={{flex:1}}>
//                          <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={{paddingBottom:responsiveHeight(10)}}>
//                          <View style={styles.hotelDetailsContainer}>
//                             <View style={styles.backIconContainer}>
//                                 <TouchableOpacity onPress={() => { goBack() }}>
//                                     <IconSwitcher componentName='AntDesign' iconName='arrowleft' color="black" iconsize={3} />
//                                 </TouchableOpacity>
//                             </View>
//                             <View style={styles.hotelImgMainContainer}>
//                                 {isImageUri(hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Images[0]) ? <View style={styles.hotelImgContainer}>
//                                     <Image source={{ uri: hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Images[0] }} style={styles.hotelImg} />
//                                 </View> :
//                                     <View style={styles.noImageContainer}>
//                                         <Text style={styles.noImgText}>No Image Available</Text>
//                                     </View>
//                                 }
//                                 <View style={styles.hotelDescriptions}>
//                                     <Text style={styles.hotelName}>{bookingHotel?.hotelName ? bookingHotel?.hotelName : hotelStaticData[bookingHotel?.hotelCode]?.HotelName}</Text>
//                                     <View style={{ flexDirection: 'row' }}>
//                                         {hotelInfoRes?.hotelSearchRes?.StarRating ? generatePattern(hotelInfoRes?.hotelSearchRes?.StarRating) : null}
//                                     </View>
//                                     <Text style={styles.hotelPrice}>
//                                         {`₹ ${hotelInfoRes.hotelSearchRes.Price.OfferedPriceRoundedOff
//                                             ? hotelInfoRes.hotelSearchRes.Price.OfferedPriceRoundedOff.toLocaleString(
//                                                 "en-IN"
//                                             )
//                                             : hotelInfoRes.hotelSearchRes.Price.PublishedPriceRoundedOff.toLocaleString(
//                                                 "en-IN"
//                                             )
//                                             }`}
//                                     </Text>
//                                 </View>

//                             </View>
//                             <View>
//                                 <Text style={styles.addressTitle}>
//                                     Address:
//                                 </Text>
//                                 <Text style={styles.address}>
//                                     {`${hotelInfoRes.hotelInfo?.HotelInfoResult.HotelDetails.Address}`}
//                                 </Text>
//                             </View>
//                             <View style={styles.checkInAndCheckOutDatesContainer}>
//                                 <Text style={styles.checkInAndCheckOutDates}>{`${hotelCheckIn.toLocaleString('en-us', { month: 'long' })} ${hotelCheckIn.getDate()}, ${hotelCheckIn.getFullYear()} - ${hotelCheckOut.toLocaleString('en-us', { month: 'long' })} ${hotelCheckOut.getDate()}, ${hotelCheckOut.getFullYear()} , ${hotelNights} Nights`}</Text>
//                             </View>
//                             <View>
//                                 <Text style={styles.PersonsDetails}>{`Adults-${hotelRoomArr[0].adults} , Children-${hotelSearchChild}`}</Text>
//                             </View>
//                             <View style={{ rowGap: responsiveHeight(1) }}>
//                                 <Text style={styles.roomDetailsTitle}>Room Details</Text>
//                                 <View style={styles.roomsMappedContainer}>
//                                     {
//                                         bookingHotel.selectedRoomType &&
//                                         bookingHotel.selectedRoomType.map((room, r) => {
//                                             return (
//                                                 <TouchableOpacity style={r === selectedRoom ? [styles.roomDetailsActiveContainer, styles.roomDetailsContainer] : styles.roomDetailsContainer} onPress={() => setSelectedRoom(r)}>
//                                                     <Text style={r === selectedRoom ? [styles.roomDetailsActiveTitle1] : styles.roomDetailsTitle1}>{`Room ${r + 1}`}</Text>
//                                                 </TouchableOpacity>
//                                             )
//                                         })
//                                     }
//                                 </View>
//                                 <View style={styles.roomDetailsMainContainer}>
//                                     {/* BreakfastAndRefundableButtons */}
//                                     <View style={styles.breakfastAndRefundableButtonsContainer}>
//                                         <TouchableOpacity style={breakfastFilter ? [styles.breakfastBtn, styles.activebreakfastBtn] : styles.breakfastBtn} onPress={() => setBreakfastFilter((prev) => !prev)}>
//                                             <Text style={breakfastFilter ? [styles.activebreakfastBtnText] : styles.breakfastBtnText}>Breakfast</Text>
//                                         </TouchableOpacity>
//                                         <TouchableOpacity style={cancelFilter ? [styles.breakfastBtn, styles.activebreakfastBtn] : styles.breakfastBtn} onPress={() => setCancelFilter((prev) => !prev)}>
//                                             <Text style={cancelFilter ? [styles.activebreakfastBtnText] : styles.breakfastBtnText}>Refundable</Text>
//                                         </TouchableOpacity>
//                                     </View>


//                                     <FlatList
//                                         data={hotelInfoRes.roomResult?.GetHotelRoomResult?.HotelRoomsDetails.filter((room, r) => {
//                                             if (breakfastFilter && cancelFilter) {
//                                                 if (
//                                                     actions.checkForTboMeals(room.Inclusion).includes("Breakfast") &&
//                                                     actions.validCancelDate(room.LastCancellationDate)
//                                                 ) {
//                                                     return true;
//                                                 }
//                                                 return false;
//                                             } else if (breakfastFilter) {
//                                                 if (actions.checkForTboMeals(room.Inclusion).includes("Breakfast")) {
//                                                     return true;
//                                                 }
//                                                 return false;
//                                             } else if (cancelFilter) {
//                                                 if (actions.validCancelDate(room.LastCancellationDate)) {
//                                                     return true;
//                                                 }
//                                                 return false;
//                                             }
//                                             return true;
//                                         })}
//                                         renderItem={renderItem}
//                                         keyExtractor={(item, index) => index.toString()}
//                                         scrollEnabled={false}
//                                     />
//                                 </View>
//                             </View>
//                         </View>
//                        </ScrollView>
//                        <Animated.View style={[styles.totalRoomPriceContainer,{
                       
//           height: heightAnim,
        
//         }]}>
//               <TouchableOpacity style={styles.totalRoomPriceToggleContainer} onPress={toggleHeight}>
//                 <IconSwitcher componentName='Ionicons' iconName={isExpanded ?"chevron-down":'chevron-up'} color='black' iconsize={3}/>
//               </TouchableOpacity>
//         {isExpanded && 
//         <View style={{height:responsiveHeight(20)}}>
//             <ScrollView style={{rowGap:responsiveHeight(1)}} >
//           {bookingHotel?.selectedRoomType &&
//               bookingHotel?.selectedRoomType?.map((room, r)=>
//               {
//                 return(
//                     <View style={styles.card}>
//                     <View style={styles.cardMainSubContainer}>
//                         <View style={styles.cardSubContainer1}>
//                             <Text style={styles.roomType}>{room.RoomTypeName}</Text>
//                             <View style={styles.mealsDescriptionContainer}>
//                                 <IconSwitcher componentName='MaterialIcons' iconName='dinner-dining' color='black' iconsize={3} />
//                                 <Text style={styles.inclusion}>{room.Inclusion && room.Inclusion.length > 0
//                                     ? actions.checkForTboMeals(room.Inclusion)
//                                     : "No meals"}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={styles.cardSubContainer2}>
//                             <Text style={styles.roomPrice}>{`₹ ${room.Price.OfferedPriceRoundedOff
//                                 ? room.Price.OfferedPriceRoundedOff.toLocaleString(
//                                     "en-IN"
//                                 )
//                                 : room.Price.PublishedPriceRoundedOff.toLocaleString(
//                                     "en-IN"
//                                 )
//                                 }`}</Text>
//                             {
//                                 room.LastCancellationDate &&
//                                     actions.validCancelDate(
//                                         room.LastCancellationDate
//                                     ) ? <View style={styles.mealsDescriptionContainer}>
//                                     <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
//                                     <Text style={styles.inclusion}>{`Free cancellation upto ${new Date(
//                                         room.LastCancellationDate
//                                     )
//                                         .toString()
//                                         .slice(4, 10)}`}</Text>
//                                 </View> : <View style={styles.mealsDescriptionContainer}>
//                                     <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
//                                     <Text style={styles.inclusion}>Non-refundable</Text>
//                                 </View>
//                             }
        
//                         </View>
//                     </View>
//                 </View>
//                 )
//               })}

//               <View style={styles.hotelPriceContainer}>
//                 <Text style={styles.hotelPriceText}>Hotel Price</Text>
//                 <Text style={styles.hotelPriceTP}>{` ₹ ${bookingHotel.hotelFinalPrice.toLocaleString("en-IN")} `}</Text>
//               </View>
//               <View style={styles.dashedLine}/>
//               <View style={styles.hotelPriceContainer}>
//                 <Text style={styles.hotelPriceText}>Service Charges</Text>
//                 <Text style={styles.hotelPriceTP}>{` + ${(bookingHotel.hotelFinalPrice * domesticHotel) / 100}`}</Text>
//               </View>
//               <View style={styles.solidLine}/>
//           </ScrollView>
//         </View>
//           }





//               <View style={styles.roomPriceContainer}>
//                 <Text style={styles.totalPriceText}>Total Price: <Text style={styles.totalPrice}>{` ₹ ${Math.ceil(bookingHotel?.hotelTotalPrice).toLocaleString("en-IN")} `}</Text></Text>
//                 <TouchableOpacity style={styles.addtotripBtn}>
//                     <Text style={styles.addtotripBtnText}>Add to trip</Text>
//                 </TouchableOpacity>
//               </View>
//         </Animated.View>
//                         </View>

//                 }

//             </View>
      
//     )
// }

// export default HotelInfo

// import { View, Text } from 'react-native'
// import React, { useContext, useEffect } from 'react'
// import MyContext from '../../../context/Context'

// const HotelInfo = ({route: { params },navigation:{goBack}}) => {
//   const { ResultIndex, HotelCode, SupplierHotelCodes, } = params.item
//   const { actions, fetchingHotelInfo, hotelInfoRes, bookingHotel, hotelStaticData, selectedHotelCheckInDate, selectedHotelCheckOutDate, hotelNights, hotelRoomArr, hotelSearchChild,domesticHotel } = useContext(MyContext)
//   useEffect(() => {
//        actions.fetchHotelInfo({
//           resultIndex: ResultIndex,
//           hotelCode: HotelCode,
//           categoryId: SupplierHotelCodes && SupplierHotelCodes.length > 0
//             ? SupplierHotelCodes[0].CategoryId
//             : "",
//           hotelSearchRes: params.item
//         });
//   }, []);
//   console.log("HotelInfo")
//   return (
//     <View>
//       <Text onPress={()=>goBack()}>HotelInfo</Text>
//     </View>
//   )
// }

// export default HotelInfo
import { View, Text, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MyContext from '../../../context/Context'

const HotelInfo = ({ route: { params }, navigation: { goBack } }) => {
  const { ResultIndex, HotelCode, SupplierHotelCodes } = params.item
  const { actions, fetchingHotelInfo } = useContext(MyContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHotelInfo = async () => {
      await actions.fetchHotelInfo({
        resultIndex: ResultIndex,
        hotelCode: HotelCode,
        categoryId: SupplierHotelCodes && SupplierHotelCodes.length > 0
          ? SupplierHotelCodes[0].CategoryId
          : "",
        hotelSearchRes: params.item
      });
      setIsLoading(false); // Once fetch is complete, set isLoading to false
    };
    fetchHotelInfo();
  }, []);

  // Render loading indicator if isLoading is true
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render HotelInfo once loading is complete
  return (
    <View>
      <Text onPress={() => goBack()}>HotelInfo</Text>
    </View>
  );
}

export default HotelInfo
