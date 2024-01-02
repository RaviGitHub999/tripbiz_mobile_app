import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../home/HomeScreen';
const Demo1 = () => <></>
const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={Demo1} />
      <Tab.Screen name="Settings" component={Demo1} />
      <Tab.Screen name="Profile" component={Demo1} />
    </Tab.Navigator>
  )
}

export default BottomNavigation