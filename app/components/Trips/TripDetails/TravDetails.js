import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { responsiveHeight } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import MyContext from '../../../context/Context'

const TravDetails = ({id}) => {
  const{tripData}=useContext(MyContext)
  return (
   <>
   <Text style={styles.header}>Traveller Details</Text>
   {
 tripData?.data?.travellerDetails[id]?.adults?.map((e, i) =>{
return(
  <View style={styles.mainContainer}>
    <Text style={[styles.title,{marginBottom:responsiveHeight(1)}]}>{`Adult`}-{i+1}</Text>
    <View>
     <Text style={styles.subTitle}>Title: <Text style={styles.title1}>{e.gender}</Text></Text>
      <Text style={styles.subTitle}>First Name: <Text style={styles.title1}>{e.firstName}</Text></Text>
      <Text style={styles.subTitle}>Last Name: <Text style={styles.title1}>{e.lastName}</Text></Text>
    </View>
  </View>
)


})
   }
{
 tripData?.data?.travellerDetails[id]?.children?.map((e, i) =>{
return(
  <View style={styles.mainContainer}>
    <Text style={[styles.title,{marginBottom:responsiveHeight(1)}]}>{`Children`}-{i+1}</Text>
    <View>
     <Text style={styles.subTitle}>Title: <Text style={styles.title1}>{e.gender}</Text></Text>
      <Text style={styles.subTitle}>First Name: <Text style={styles.title1}>{e.firstName}</Text></Text>
      <Text style={styles.subTitle}>Last Name: <Text style={styles.title1}>{e.lastName}</Text></Text>
    </View>
  </View>
)


})
   }

{
 tripData?.data?.travellerDetails[id]?.infants?.map((e, i) =>{
return(
  <View style={styles.mainContainer}>
    <Text style={[styles.title,{marginBottom:responsiveHeight(1)}]}>{`Infant`}-{i+1}</Text>
    <View>
     <Text style={styles.subTitle}>Title: <Text style={styles.title1}>{e.gender}</Text></Text>
      <Text style={styles.subTitle}>First Name: <Text style={styles.title1}>{e.firstName}</Text></Text>
      <Text style={styles.subTitle}>Last Name: <Text style={styles.title1}>{e.lastName}</Text></Text>
    </View>
  </View>
)


})
   }
   </>
  )
}
const styles=StyleSheet.create(
    {
        mainContainer:{
            marginTop:responsiveHeight(1)
        },
        title:{
            fontSize:responsiveHeight(1.5),
            fontFamily:fonts.primary,
            color:colors.primary,
            textAlign:'center'
        },
        title1:{
            fontSize:responsiveHeight(1.3),
            fontFamily:fonts.primary,
            color:colors.primary,
            textAlign:'center'
        },
        subTitle:{
            fontSize:responsiveHeight(1.5),
            fontFamily:fonts.textInput,
            color:colors.primary,
            textAlign:'center'   
        },
        header:{
          fontSize:responsiveHeight(2),
          fontFamily:fonts.secondry,
          color:colors.primary,
          textAlign:'center'
        }
    }
)
export default TravDetails




// <KeyboardAwareScrollView>
//                     <View style={styles.travellerDetailsMainContainer}>
//                       <View style={styles.travellerDetailsSubContainer}>
//                         {/* travellerDetails */}

//                         {/* <View style={styles.travellerDetailsSeperator}>
//                           {tripData?.flights?.map((flight, ind) => {
//                             const date1 = new Date(
//                               flight.data.flight.Segments[0][0].Origin.DepTime,
//                             );
//                             const monthAbbreviation1 = date1.toLocaleString(
//                               'default',
//                               {
//                                 month: 'short',
//                               },
//                             );
//                             const day1 = date1.getDate();
//                             var flightReq = tripData.data.flights.filter(
//                               hotelMain => {
//                                 return hotelMain.id === flight.id;
//                               },
//                             );
//                             var flightStatus = tripData.data.flights.filter(
//                               f => f.id === flight.id,
//                             );
//                             var color = statuses.filter(status => {
//                               return status?.status === flightStatus[0]?.status;
//                             });
//                             var reqColor = reqStatuses.filter(status => {
//                               return (
//                                 status?.status === flightReq[0]?.requestStatus
//                               );
//                             });
//                             const isSelected =
//                               selectedCard.index === ind &&
//                               selectedCard.list === 'a';
//                             return (
//                               <TouchableOpacity
//                                 style={[
//                                   styles.travelDetailsFlightCard,
//                                   {
//                                     backgroundColor: !isEdit[flight.id]
//                                       ? 'white'
//                                       : color[0]
//                                       ? color[0].color
//                                       : '#808080',
//                                   },
//                                   {
//                                     borderBottomWidth: isSelected
//                                       ? responsiveHeight(0.5)
//                                       : 0,
//                                   },
//                                 ]}
//                                 onPress={() => {
//                                   setTravellerCount({
//                                     adults: Number(flight?.data?.adults),
//                                     child: Number(flight?.data?.child),
//                                     infant: Number(flight?.data?.infant),
//                                   });
//                                   setTripId(flight.id);
//                                   handlePress(ind, 'a');
//                                 }}>
//                                 <IconSwitcher
//                                   componentName="MaterialIcons"
//                                   iconName="flight-takeoff"
//                                   color="black"
//                                   iconsize={4}
//                                 />
//                                 <View
//                                   style={{
//                                     position: 'absolute',
//                                     right: responsiveWidth(1),
//                                     top: responsiveHeight(0),
//                                   }}>
//                                   <Text>{ind + 1}</Text>
//                                 </View>
//                               </TouchableOpacity>
//                             );
//                           })}

//                           {tripData?.cabs?.map((cab, ind) => {
//                             const monthNames = [
//                               'Jan',
//                               'Feb',
//                               'Mar',
//                               'Apr',
//                               'May',
//                               'Jun',
//                               'Jul',
//                               'Aug',
//                               'Sep',
//                               'Oct',
//                               'Nov',
//                               'Dec',
//                             ];
//                             var flightStatus = tripData?.data?.cabs?.filter(
//                               f => f.id === cab.id,
//                             );
//                             var color = statuses?.filter(status => {
//                               return (
//                                 status?.status ===
//                                 (flightStatus ? flightStatus[0]?.status : '')
//                               );
//                             });
//                             const date = new Date(
//                               cab?.data?.cabStartDate.seconds * 1000,
//                             );
//                             const formattedDate1 = `${
//                               monthNames[date.getMonth()]
//                             } ${date.getDate()}`;
//                             const isSelected =
//                               selectedCard.index === ind &&
//                               selectedCard.list === 'b';
//                             return (
//                               <TouchableOpacity
//                                 style={[
//                                   styles.travelDetailsFlightCard,
//                                   {
//                                     backgroundColor: !isEdit[cab.id]
//                                       ? 'white'
//                                       : color[0]
//                                       ? color[0].color
//                                       : '#808080',
//                                   },
//                                   {
//                                     borderBottomWidth: isSelected
//                                       ? responsiveHeight(0.5)
//                                       : 0,
//                                   },
//                                 ]}
//                                 onPress={() => {
//                                   setTravellerCount({adults: 1});
//                                   setTripId(cab.id);
//                                   handlePress(ind, 'b');
//                                 }}>
//                                 <IconSwitcher
//                                   componentName="FontAwesome6"
//                                   iconName="taxi"
//                                   iconsize={2.5}
//                                 />
//                                 <View
//                                   style={{
//                                     position: 'absolute',
//                                     right: responsiveWidth(1),
//                                     top: responsiveHeight(0),
//                                   }}>
//                                   <Text>{ind + 1}</Text>
//                                 </View>
//                               </TouchableOpacity>
//                             );
//                           })}

//                           {tripData?.bus?.map((bus, ind) => {
//                             const monthNames = [
//                               'Jan',
//                               'Feb',
//                               'Mar',
//                               'Apr',
//                               'May',
//                               'Jun',
//                               'Jul',
//                               'Aug',
//                               'Sep',
//                               'Oct',
//                               'Nov',
//                               'Dec',
//                             ];
//                             var flightStatus = tripData?.data?.bus?.filter(
//                               f => f.id === bus.id,
//                             );

//                             var color = statuses?.filter(status => {
//                               return (
//                                 status?.status ===
//                                 (flightStatus ? flightStatus[0]?.status : '')
//                               );
//                             });

//                             const date = new Date(bus?.data?.bus.DepartureTime);
//                             const formattedDate1 = `${
//                               monthNames[date.getMonth()]
//                             } ${date.getDate()}`;
//                             const isSelected =
//                               selectedCard.index === ind &&
//                               selectedCard.list === 'd';
//                             return (
//                               <TouchableOpacity
//                                 style={[
//                                   styles.travelDetailsFlightCard,
//                                   {
//                                     backgroundColor: !isEdit[bus.id]
//                                       ? 'white'
//                                       : color[0]
//                                       ? color[0].color
//                                       : '#808080',
//                                   },
//                                   {
//                                     borderBottomWidth: isSelected
//                                       ? responsiveHeight(0.5)
//                                       : 0,
//                                   },
//                                 ]}
//                                 onPress={() => {
//                                   setTravellerCount({
//                                     adults: Number(bus?.data?.passengers),
//                                   });
//                                   setTripId(bus.id);
//                                   handlePress(ind, 'd');
//                                 }}>
//                                 <IconSwitcher
//                                   componentName="FontAwesome6"
//                                   iconName="bus"
//                                   iconsize={2.5}
//                                 />
//                                 <View
//                                   style={{
//                                     position: 'absolute',
//                                     right: responsiveWidth(1),
//                                     top: responsiveHeight(0),
//                                   }}>
//                                   <Text>{ind + 1}</Text>
//                                 </View>
//                               </TouchableOpacity>
//                             );
//                           })}

//                           {tripData?.hotels?.map((hotel, ind) => {
//                             const monthNames = [
//                               'Jan',
//                               'Feb',
//                               'Mar',
//                               'Apr',
//                               'May',
//                               'Jun',
//                               'Jul',
//                               'Aug',
//                               'Sep',
//                               'Oct',
//                               'Nov',
//                               'Dec',
//                             ];
//                             const date = new Date(
//                               hotel?.data?.hotelSearchQuery?.checkInDate
//                                 ?.seconds * 1000,
//                             );
//                             const formattedDate1 = `${
//                               monthNames[date.getMonth()]
//                             } ${date.getDate()}`;
//                             const date2 = new Date(
//                               hotel?.data?.hotelSearchQuery?.checkOutDate
//                                 .seconds * 1000,
//                             );
//                             const formattedDate2 = `${
//                               monthNames[date2.getMonth()]
//                             } ${date2.getDate()}`;
//                             var hotelReq = tripData?.data?.hotels.filter(
//                               hotelMain => {
//                                 return hotelMain.id === hotel.id;
//                               },
//                             );
//                             var hotelStatus = tripData?.data?.hotels?.filter(
//                               f => f.id === hotel.id,
//                             );
//                             var color = statuses.filter(status => {
//                               return status?.status === hotelStatus[0]?.status;
//                             });

//                             var reqColor = reqStatuses.filter(status => {
//                               return (
//                                 status?.status === hotelReq[0]?.requestStatus
//                               );
//                             });
//                             const isSelected =
//                               selectedCard.index === ind &&
//                               selectedCard.list === 'c';
//                             return (
//                               <TouchableOpacity
//                                 style={[
//                                   styles.travelDetailsFlightCard,
//                                   {
//                                     backgroundColor: !isEdit[hotel.id]
//                                       ? 'white'
//                                       : color[0]
//                                       ? color[0].color
//                                       : '#808080',
//                                   },
//                                   {
//                                     borderBottomWidth: isSelected
//                                       ? responsiveHeight(0.5)
//                                       : 0,
//                                   },
//                                 ]}
//                                 onPress={() => {
//                                   var adults =
//                                     hotel?.data?.hotelSearchQuery?.hotelRoomArr.reduce(
//                                       (acc, obj) => {
//                                         acc.adults += parseInt(obj.adults, 10);
//                                         acc.child += parseInt(obj.child, 10);
//                                         return acc;
//                                       },
//                                       {adults: 0, child: 0},
//                                     );
//                                   setTravellerCount(adults);
//                                   setTripId(hotel.id);
//                                   handlePress(ind, 'c');
//                                 }}>
//                                 <IconSwitcher
//                                   componentName="FontAwesome6"
//                                   iconName="hotel"
//                                   color="black"
//                                   iconsize={2.5}
//                                 />
//                                 <View
//                                   style={{
//                                     position: 'absolute',
//                                     right: responsiveWidth(1),
//                                     top: responsiveHeight(0),
//                                   }}>
//                                   <Text>{ind + 1}</Text>
//                                 </View>
//                               </TouchableOpacity>
//                             );
//                           })}
//                         </View> */}
                     

//                         {/* each traveller Details */}

//                         {/* <View
//                           style={{
//                             flex: 1,
//                           }}>
//                           <FlatList
//                             data={tripData?.flights?.filter(
//                               flight => flight.id === tripId,
//                             )}
//                             renderItem={renderItem}
//                             keyExtractor={(item, index) => index.toString()}
//                           />
//                           <FlatList
//                             data={tripData?.hotels?.filter(
//                               hotel => hotel.id === tripId,
//                             )}
//                             renderItem={hotelrenderItem}
//                             keyExtractor={(item, index) => index.toString()}
//                           />

//                           <FlatList
//                             data={tripData?.cabs?.filter(
//                               cab => !cabsIds.includes(cab.id),
//                             )}
//                             renderItem={cabRenderItem}
//                             keyExtractor={(item, index) => index.toString()}
//                           />

//                           <FlatList
//                             data={tripData?.bus?.filter(
//                               bus => bus.id === tripId,
//                             )}
//                             renderItem={busRenderItem}
//                             keyExtractor={(item, index) => index.toString()}
//                           />
//                         </View> */}
//                       </View>
//                     </View>
//                   </KeyboardAwareScrollView>