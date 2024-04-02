// AppNavigator.js
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProvider from '../../../context/MyProvider';
import HomeScreen from '../../home/HomeScreen';
import BottomNavigation from './BottomNavigation';
import FlightsSearchRes from '../../flightsRes/FlightsSearchRes';
import Select from '../select/Select';
import Login from '../../login/Login';
import Splash from '../../splash/Splash';
import HotelResList from '../../hotel/HotelResList/HotelResList';
import HotelInfo from '../../hotel/hotelInfo/HotelInfo';
import TripDetails from '../../Trips/TripDetails/TripDetails';
import MyContext from '../../../context/Context';
import { ActivityIndicator, View } from 'react-native';
const Stack = createStackNavigator();


// const AuthNavigation=()=>
// {
//   return(
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Splash" component={Splash} />
//           <Stack.Screen name="Login" component={Login} />
//           {/* <Stack.Screen name="CustomerBottomNavigation" component={MainNavigation} /> */}
//     </Stack.Navigator>
//   )
// }

// const MainNavigation=()=>
// {
//   return(
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//          <Stack.Screen name="CustomerBottomNavigation" component={BottomNavigation} />
//           <Stack.Screen name="OneWayFlights" component={FlightsSearchRes} />
//           <Stack.Screen name="HotelResList" component={HotelResList} />
//           <Stack.Screen name="HotelInfo" component={HotelInfo} />
//           <Stack.Screen name="TripDetails" component={TripDetails} />
//     </Stack.Navigator>
//   )
// }


// const UserStatus=()=>
// {
//   return(
//     <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
//       <ActivityIndicator size={"large"}/>
//     </View>
//   )
// }

// const AppNavigator = () => {
//   const {isLoading,userId}=useContext(MyContext)
//   return !isLoading?<UserStatus/>:userId ? <MainNavigation /> : <AuthNavigation />;

// };

const AppNavigator = () => {
  return (
       <Stack.Navigator screenOptions={{ headerShown: false }}>
           {/* <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} /> */}
         <Stack.Screen name="CustomerBottomNavigation" component={BottomNavigation} />
          <Stack.Screen name="OneWayFlights" component={FlightsSearchRes} />
          <Stack.Screen name="HotelResList" component={HotelResList} />
          <Stack.Screen name="HotelInfo" component={HotelInfo} />
          <Stack.Screen name="TripDetails" component={TripDetails} />
    </Stack.Navigator> 
  )
}

export default AppNavigator

