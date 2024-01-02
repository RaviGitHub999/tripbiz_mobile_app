// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProvider from '../../../context/MyProvider';
import HomeScreen from '../../home/HomeScreen';
import BottomNavigation from './BottomNavigation';
import FlightsSearchRes from '../../flightsRes/FlightsSearchRes';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Login" component={Login} /> */}
          <Stack.Screen name="CustomerBottomNavigation" component={BottomNavigation} />
          <Stack.Screen name="OneWayFlights" component={FlightsSearchRes} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
};

export default AppNavigator;
