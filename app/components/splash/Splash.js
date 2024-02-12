import { View, Text, Image,StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { splashimg } from './assets';

const Splash = ({navigation:{navigate}}) => {
    useEffect(()=>
    {
       setTimeout(() => {
        navigate("Login")
       }, 3000); 
    },[])
  return (
    <View>
      {/* <StatusBar hidden/> */}
       <Image source={splashimg}  style={{height:"100%",width:"100%"}}/>
    </View>
  )
}
export default Splash
// import { View, Text } from 'react-native'
// import React, { useState } from 'react'
// import HotelSearchInput from '../common/HotelSearchInput/HotelSearchInput'

// const Splash = () => {
//   const [d,setD]=useState("")
//   const handleData=(e)=>
//   {
//     // setD(e.nativeEvent.text)
//     console.log(e,"--------->")
//   }
//   // console.log(d,"--------->")
//   return (
//     <View>
//      <HotelSearchInput placeHolder={"Destination"} value={d} handleChange={handleData}/>
//     </View>
//   )
// }

// export default Splash