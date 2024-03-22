import { View, Text, Image,StatusBar } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { splashimg } from './assets';
import MyContext from '../../context/Context';

const Splash = ({navigation:{navigate}}) => {
    const {isLoading}=useContext(MyContext)
    useEffect(()=>
    {
       setTimeout(() => {
        navigate("Login")
       }, 3000); 
       console.log("Splash")
    },[])
  return (
    <View>
      {/* <StatusBar hidden/> */}
       <Image source={splashimg}  style={{height:"100%",width:"100%"}}/>
    </View>
  )
}
export default Splash

// import { View, Text } from 'react-native'
// import React from 'react'
// import WebView from 'react-native-webview'

// const Splash = () => {
//   return (
    
//     <WebView
//     source={{ html: '<h1>Hello, world!</h1>' }}
//   />
  
//   )
// }

// export default Splash


{/* <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={{paddingBottom:responsiveHeight(10)}}>
<View style={styles.hotelDetailsContainer}>
   <View style={styles.backIconContainer}>
       <TouchableOpacity onPress={() => { goBack() }}>
           <IconSwitcher componentName='AntDesign' iconName='arrowleft' color="black" iconsize={3} />
       </TouchableOpacity>
   </View>
   <View style={styles.hotelImgMainContainer}>
       {isImageUri(hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Images[0]) ? <View style={styles.hotelImgContainer}>
           <Image source={{ uri: hotelInfoRes.hotelInfo.HotelInfoResult.HotelDetails.Images[0] }} style={styles.hotelImg} />
       </View> :
           <View style={styles.noImageContainer}>
               <Text style={styles.noImgText}>No Image Available</Text>
           </View>
       }
       <View style={styles.hotelDescriptions}>
           <Text style={styles.hotelName}>{bookingHotel?.hotelName ? bookingHotel?.hotelName : hotelStaticData[bookingHotel?.hotelCode]?.HotelName}</Text>
           <View style={{ flexDirection: 'row' }}>
               {hotelInfoRes?.hotelSearchRes?.StarRating ? generatePattern(hotelInfoRes?.hotelSearchRes?.StarRating) : null}
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
   <View>
       <Text style={styles.addressTitle}>
           Address:
       </Text>
       <Text style={styles.address}>
           {`${hotelInfoRes.hotelInfo?.HotelInfoResult.HotelDetails.Address}`}
       </Text>
   </View>
   <View style={styles.checkInAndCheckOutDatesContainer}>
       <Text style={styles.checkInAndCheckOutDates}>{`${hotelCheckIn.toLocaleString('en-us', { month: 'long' })} ${hotelCheckIn.getDate()}, ${hotelCheckIn.getFullYear()} - ${hotelCheckOut.toLocaleString('en-us', { month: 'long' })} ${hotelCheckOut.getDate()}, ${hotelCheckOut.getFullYear()} , ${hotelNights} Nights`}</Text>
   </View>
   <View>
       <Text style={styles.PersonsDetails}>{`Adults-${hotelRoomArr[0].adults} , Children-${hotelSearchChild}`}</Text>
   </View>
   <View style={{ rowGap: responsiveHeight(1) }}>
       <Text style={styles.roomDetailsTitle}>Room Details</Text>
       <View style={styles.roomsMappedContainer}>
           {
               bookingHotel.selectedRoomType &&
               bookingHotel.selectedRoomType.map((room, r) => {
                   return (
                       <TouchableOpacity style={r === selectedRoom ? [styles.roomDetailsActiveContainer, styles.roomDetailsContainer] : styles.roomDetailsContainer} onPress={() => setSelectedRoom(r)}>
                           <Text style={r === selectedRoom ? [styles.roomDetailsActiveTitle1] : styles.roomDetailsTitle1}>{`Room ${r + 1}`}</Text>
                       </TouchableOpacity>
                   )
               })
           }
       </View>
       <View style={styles.roomDetailsMainContainer}> */}
           {/* BreakfastAndRefundableButtons */}
          //  <View style={styles.breakfastAndRefundableButtonsContainer}>
          //      <TouchableOpacity style={breakfastFilter ? [styles.breakfastBtn, styles.activebreakfastBtn] : styles.breakfastBtn} onPress={() => setBreakfastFilter((prev) => !prev)}>
          //          <Text style={breakfastFilter ? [styles.activebreakfastBtnText] : styles.breakfastBtnText}>Breakfast</Text>
          //      </TouchableOpacity>
          //      <TouchableOpacity style={cancelFilter ? [styles.breakfastBtn, styles.activebreakfastBtn] : styles.breakfastBtn} onPress={() => setCancelFilter((prev) => !prev)}>
          //          <Text style={cancelFilter ? [styles.activebreakfastBtnText] : styles.breakfastBtnText}>Refundable</Text>
          //      </TouchableOpacity>
          //  </View>


//            <FlatList
//                data={hotelInfoRes.roomResult?.GetHotelRoomResult?.HotelRoomsDetails.filter((room, r) => {
//                    if (breakfastFilter && cancelFilter) {
//                        if (
//                            actions.checkForTboMeals(room.Inclusion).includes("Breakfast") &&
//                            actions.validCancelDate(room.LastCancellationDate)
//                        ) {
//                            return true;
//                        }
//                        return false;
//                    } else if (breakfastFilter) {
//                        if (actions.checkForTboMeals(room.Inclusion).includes("Breakfast")) {
//                            return true;
//                        }
//                        return false;
//                    } else if (cancelFilter) {
//                        if (actions.validCancelDate(room.LastCancellationDate)) {
//                            return true;
//                        }
//                        return false;
//                    }
//                    return true;
//                })}
//                renderItem={renderItem}
//                keyExtractor={(item, index) => index.toString()}
//                scrollEnabled={false}
//            />
//        </View>
//    </View>
// </View>
// </ScrollView>