import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../../home/HomeScreen';
import IconSwitcher from '../icons/IconSwitcher';
import { colors, fonts } from '../../../config/theme';
import { responsiveFontSize, responsiveHeight } from '../../../utils/responsiveScale';
import Wallet from '../../wallet/Wallet';
import MyTrips from '../../Trips/myTrips/MyTrips';
import Profile from '../../user/profile/Profile';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileHome from '../../user/profile/ProfileHome';
import ChangePassword from '../../user/changePassword/ChangePassword';
import Role from '../../user/role/Role';
import ReCheck from '../recheck/ReCheck';
import Pdf from '../../wallet/Pdf';
const Stack = createStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='ProfileHome'>
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Role" component={Role} />
    </Stack.Navigator>
  )
}
const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
  //  <View style={{flex:1,backgroundColor:'white '}}>
     <Tab.Navigator
      screenOptions={{
        headerShown: false, tabBarActiveTintColor: colors.primaryLite,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: responsiveFontSize(1.5), fontFamily: fonts.primary, paddingBottom: responsiveHeight(1) },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          // paddingBottom: 8,
          // paddingTop: 8,
          height: responsiveHeight(9),
          borderTopLeftRadius: responsiveHeight(5),
          borderTopRightRadius: responsiveHeight(5),
          
        },
        tabBarItemStyle: { paddingTop: responsiveHeight(1) }
    

      }}
      initialRouteName='Home'
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSwitcher componentName='AntDesign' iconName='home' color={color} iconsize={3.2} />
          ),
        }}
      />
      <Tab.Screen
        name="MyTrips"
        component={MyTrips}
        options={{
          tabBarLabel: 'MyTrips',
          tabBarIcon: ({ color, size }) => (
            <IconSwitcher componentName='MaterialCommunityIcons' iconName='wallet-travel' color={color} iconsize={3.2} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <IconSwitcher componentName='Entypo' iconName='wallet' color={color} iconsize={3.2} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSwitcher componentName='Ionicons' iconName='person' color={color} iconsize={3.2} />
          ),
        }}
      />
    </Tab.Navigator>
  //  </View>
  )
}

export default BottomNavigation