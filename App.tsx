import { View, Text } from 'react-native'
import React from 'react'
import AppNavigator from './app/components/common/navigation/AppNavigator'
import CustomButtonInput from './app/components/common/customButtonInput/CustomButtonInput'
import HotelDropDown from './app/components/common/hotelDropDown/HotelDropDown'
import HotelSearchInput from './app/components/common/HotelSearchInput/HotelSearchInput'
import MyProvider from './app/context/MyProvider'
import { NavigationContainer } from '@react-navigation/native'

const App = () => {
  return (
    <MyProvider>
    <NavigationContainer>
    <AppNavigator/>
    </NavigationContainer>
    </MyProvider>
  )
}

export default React.memo(App)
// import { View, Text } from 'react-native'
// import React, { useState } from 'react'
// import PopUp from './app/components/common/popup/PopUp'

// const App = () => {
//   const [open,setOpen]=useState({can:false})
//    const handleCancelPopUp=(arg: string)=>
//     {
//       if(arg==="can")
//       {
//         console.log("cli")
// setOpen({...open,can:!open.can})
//       }

//     }
//   return (
//     <PopUp value={open.can} handleCancelPopUp={()=>handleCancelPopUp("can")}/>
//   )
// }

// export default App