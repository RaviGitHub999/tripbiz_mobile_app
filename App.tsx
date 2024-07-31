import { View, Text } from 'react-native'
import React from 'react'
import AppNavigator from './app/components/common/navigation/AppNavigator'
import CustomButtonInput from './app/components/common/customButtonInput/CustomButtonInput'
import HotelDropDown from './app/components/common/hotelDropDown/HotelDropDown'
import HotelSearchInput from './app/components/common/HotelSearchInput/HotelSearchInput'
import MyProvider from './app/context/MyProvider'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

const App = () => {
  return (
    <MyProvider>
    <NavigationContainer>
    <AppNavigator/>
    </NavigationContainer>
      <Toast/>
    </MyProvider>
  )
}

export default App

// import { View, Text } from 'react-native'
// import React, { useState } from 'react'
// import TripDetailsFlightCard from './app/components/Trips/TripDetails/TripDetailsFlightCard'
// import TripDetailsInput from './app/components/Trips/TripDetails/TripDetailsInput'

// const App = () => {
//   const [text,setText]=useState("")
//   const _chageText=(e)=>
//     {
// setText(e)
//     }
//   return (
//     <View style={{flex:1,margin:10}}>
//     <TripDetailsInput placeholderName="Ravi" stateValue={text} handleonChange={(e)=>_chageText(e)}/>
//   <Text>{text}</Text>
//     </View>
//   )
// }

// export default App