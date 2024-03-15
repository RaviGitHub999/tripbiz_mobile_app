import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../home/HomeScreen';
import IconSwitcher from '../icons/IconSwitcher';
import { colors, fonts } from '../../../config/theme';
import { responsiveFontSize, responsiveHeight } from '../../../utils/responsiveScale';
const Demo1 = () => <></>
const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <Tab.Navigator
    screenOptions={{ headerShown: false ,tabBarActiveTintColor: colors.primaryLite,
    tabBarInactiveTintColor: 'gray',
  tabBarLabelStyle:{fontSize:responsiveFontSize(1.5),fontFamily:fonts.primary,paddingBottom: responsiveHeight(1)},
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    // paddingBottom: 8,
    // paddingTop: 8,
    height:responsiveHeight(9),
    borderTopLeftRadius:responsiveHeight(5),
    borderTopRightRadius:responsiveHeight(5)
  },
  tabBarItemStyle:{paddingTop: responsiveHeight(1)}
  
 
  }}

  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <IconSwitcher componentName='AntDesign' iconName='home' color={color} iconsize={3.2}/> 
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={Demo1}
      options={{
        tabBarLabel: 'Search',
        tabBarIcon: ({ color, size }) => (
          <IconSwitcher componentName='AntDesign' iconName='search1' color={color} iconsize={3.2}/>
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={Demo1}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <IconSwitcher componentName='AntDesign' iconName='setting' color={color} iconsize={3.2}/> 
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Demo1}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <IconSwitcher componentName='Ionicons' iconName='person' color={color} iconsize={3.2}/>
        ),
      }}
    />
  </Tab.Navigator>
  )
}

export default BottomNavigation