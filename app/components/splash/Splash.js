import { View, Text, Image,StatusBar } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { splashimg } from './assets';
import MyContext from '../../context/Context';
import { logo2 } from '../home/assets';

const Splash = ({navigation:{navigate}}) => {
    const {isLoading}=useContext(MyContext)
    // useEffect(()=>
    // {
    //    setTimeout(() => {
    //     navigate("Login")
    //    }, 3000); 
    //    console.log("Splash")
    // },[])
  return (
    <View>
      {/* <StatusBar hidden/> */}
       <Image source={logo2}  style={{height:"100%",width:"100%"}} resizeMode='contain'/>
    </View>
  )
}
export default Splash
