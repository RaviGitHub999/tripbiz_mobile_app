// import { View, Text, Image,StatusBar } from 'react-native'
// import React, { useEffect } from 'react'
// import { splashimg } from './assets';

// const Splash = ({navigation:{navigate}}) => {
//     useEffect(()=>
//     {
//        setTimeout(() => {
//         navigate("Login")
//        }, 3000); 
//     },[])
//   return (
//     <View>
//       {/* <StatusBar hidden/> */}
//        <Image source={splashimg}  style={{height:"100%",width:"100%"}}/>
//     </View>
//   )
// }
// export default Splash

// import React, { useState } from 'react';
// import { useState } from 'react';
// import { FlatList, View, Text, ActivityIndicator } from 'react-native';

// const YourComponent = () => {
//   const [data, setData] = useState(Array.from({ length: 200 }, (_, index) => `Item ${index + 1}`));
//   const [renderedData, setRenderedData] = useState(data.slice(0, 5));
//   const [remainingData, setRemainingData] = useState(data.slice(5));
//   const [isLoading, setIsLoading] = useState(false);

//   const loadMoreItems = () => {
//     if (remainingData.length > 0) {
//       setIsLoading(true); // Set loading state to true
//       const nextBatch = remainingData.slice(0, 5);
//       setRenderedData(prevData => [...prevData, ...nextBatch]);
//       setRemainingData(prevData => prevData.slice(5));
//       setIsLoading(false); // Set loading state to false when data is loaded
//     }
//   };

//   const renderFooter = () => {
//     if (!isLoading) return null; // Don't render anything if loading is false
//     return (
//       <View style={{ paddingVertical: 20 }}>
//         <ActivityIndicator animating size="large" color="#007AFF" />
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex: 1, marginTop: 50 }}>
//       <FlatList
//         data={renderedData}
//         renderItem={({ item,index}) =>{
//           console.log(index)
//           return (
//           <View style={{ padding: 50, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
//             <Text>{item}</Text>
//           </View>
//         )}}
//         keyExtractor={(item, index) => index.toString()}
//         onEndReached={loadMoreItems}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter} 
//       />
//     </View>
//   );
// };

// export default YourComponent;






import React, { useState, useRef, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const YourComponent = () => {
 const[popup,setPopUp]=useState(false)
  const data = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
  }));

  const [renderedData, setRenderedData] = useState(data.slice(0, 20)); // Initially render 20 items
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Function to load more data when reaching the end of the list
  const loadMoreData = () => {
    setLoading(true);
    // Simulate delay for fetching data (you can replace this with your actual data fetching logic)
    setTimeout(() => {
      const endIndex = Math.min(renderedData.length + 20, data.length); // Calculate the end index for new data
      setRenderedData(prevData => [...prevData, ...data.slice(prevData.length, endIndex)]); // Append new data to renderedData
      setLoading(false);
    }, 1000);
  };

  // Function to handle reaching the end of the list
  const handleEndReached = () => {
    if (renderedData.length < data.length) { // Check if there are more items to render
      loadMoreData();
    }
  };

  // Render item component
  const renderItem = ({ item,index }) => {
    console.log("-----===>",index)
    return(
        <View style={{ padding: 10 }} key={item.id}>
          <Text>{item.name}</Text>
        </View>
      )
  };

  // Render loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };
const handleClick=()=>
{
    setPopUp(!popup)
}
  return (
   <View style={{flex:1}}>
    <TouchableOpacity  onPress={handleClick} style={{borderWidth:1,padding:10}}>
    <Text>{popup?"Open":"Close"}</Text>
    </TouchableOpacity>
    {useMemo( ()=>
    {
        return <FlatList
        ref={flatListRef}
        data={renderedData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleEndReached} // Function to handle reaching the end of the list
        onEndReachedThreshold={0.1} // Trigger when 90% scrolled to the end
        ListFooterComponent={renderFooter} // Render loading indicator
        style={{ height: Dimensions.get('window').height }} // Set FlatList height to screen height
      />
    },[renderedData])}
   
    </View>
  );
};

export default YourComponent;








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