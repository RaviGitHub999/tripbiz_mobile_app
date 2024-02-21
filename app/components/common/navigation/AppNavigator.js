// AppNavigator.js
import React from 'react';
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
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          {/* <Stack.Screen name="Login" component={Login} /> */}
          {/* <Stack.Screen name="CustomerBottomNavigation" component={BottomNavigation} />
          <Stack.Screen name="OneWayFlights" component={FlightsSearchRes} />
          <Stack.Screen name="HotelResList" component={HotelResList} />
          <Stack.Screen name="HotelInfo" component={HotelInfo} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
};

export default AppNavigator;
