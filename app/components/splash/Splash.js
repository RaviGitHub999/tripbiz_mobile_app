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