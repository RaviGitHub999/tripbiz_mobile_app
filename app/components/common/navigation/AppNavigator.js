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
import ChangePassword from '../../user/changePassword/ChangePassword';
import CabResList from '../../cab/cabResList/CabResList';
import BusResList from '../../bus/busResList/BusResList';
import BusInfo from '../../bus/busInfo/BusInfo';
import Role from '../../user/role/Role';
const Stack = createStackNavigator();


// const AuthNavigation=()=>
// {
//   return(
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {/* <Stack.Screen name="Splash" component={Splash} /> */}
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
//           <Stack.Screen name="ChangePassword" component={ChangePassword} />
//     </Stack.Navigator>
//   )
// }

// const MainNavigation=()=>
// {
//   return(
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//          <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
//           <Stack.Screen name="OneWayFlights" component={FlightsSearchRes} />
//           <Stack.Screen name="HotelResList" component={HotelResList} />
//           <Stack.Screen name="HotelInfo" component={HotelInfo} />
//           <Stack.Screen name="TripDetails" component={TripDetails} />
//           <Stack.Screen name='CabResList' component={CabResList} />
//           <Stack.Screen name='BusResList' component={BusResList} />
//           <Stack.Screen name='BusInfo' component={BusInfo} />
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="Role" component={Role} />
//     </Stack.Navigator>
//   )
// }


// const UserStatus=()=>
// {
//   return(
//     // <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
//     //   <ActivityIndicator size={"large"}/>
//     // </View>
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="Splash" component={Splash} />
// </Stack.Navigator>
//   )
// }

// const AppNavigator = () => {
//   const {isLoading,userId}=useContext(MyContext)
//   return !isLoading?<UserStatus/>:userId ? <MainNavigation /> : <AuthNavigation />;

// };
// export default AppNavigator

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="OneWayFlights" component={FlightsSearchRes} />
      <Stack.Screen name="HotelResList" component={HotelResList} />
      <Stack.Screen name="HotelInfo" component={HotelInfo} />
      <Stack.Screen name="TripDetails" component={TripDetails} />
      <Stack.Screen name="CabResList" component={CabResList} />
      <Stack.Screen name="BusResList" component={BusResList} />
      <Stack.Screen name="BusInfo" component={BusInfo} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Role" component={Role} />
    </Stack.Navigator>
  );
};

const UserStatus = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoading, userId } = useContext(MyContext);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimeout);
  }, []);

  if (showSplash) {
    return <UserStatus />;
  }

  if (isLoading) {
    return userId ? <MainNavigation /> : <AuthNavigation />;
  }

  return null; 
};

export default AppNavigator;
