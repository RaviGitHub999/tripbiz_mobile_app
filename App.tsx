// import { View, Text } from 'react-native'
// import React from 'react'
// import AppNavigator from './app/components/common/navigation/AppNavigator'
// import CustomButtonInput from './app/components/common/customButtonInput/CustomButtonInput'
// import HotelDropDown from './app/components/common/hotelDropDown/HotelDropDown'
// import HotelSearchInput from './app/components/common/HotelSearchInput/HotelSearchInput'
// import MyProvider from './app/context/MyProvider'
// import { NavigationContainer } from '@react-navigation/native'

// const App = () => {
//   return (
//     <MyProvider>
//     <NavigationContainer>
//     <AppNavigator/>
//     </NavigationContainer>
//     </MyProvider>
//   )
// }

// export default React.memo(App)
import { View, Text } from 'react-native'
import React from 'react'
import PopUp from './app/components/common/popup/PopUp'

const App = () => {
  return (
    <PopUp/>
  )
}

export default App