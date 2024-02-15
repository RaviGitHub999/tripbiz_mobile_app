// import { View, Text, Image,StatusBar } from 'react-native'
// import React, { useEffect } from 'react'
// import { splashimg } from './assets';

// const Splash = ({navigation:{navigate}}) => {
//     useEffect(()=>
//     {
//        setTimeout(() => {
//         navigate("Login")
//        }, 3000); 
//     },[])
//   return (
//     <View>
//       {/* <StatusBar hidden/> */}
//        <Image source={splashimg}  style={{height:"100%",width:"100%"}}/>
//     </View>
//   )
// }
// export default Splash
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import FilterHeader from '../common/filterHeader/FilterHeader'

const Splash = () => {
  const[open,setOpen]=useState(false)
  const handleOpen=()=>
  {
    setOpen(!open)
  }
  return (
    <View>
      <FilterHeader handlefiltersToggleActions={handleOpen} value={open}>
        <Text>jbh</Text>
        <Text>jbh</Text>
        <Text>jbh</Text>
        <Text>jbh</Text>
        <Text>jbh</Text>
        <Text>jbh</Text>
        </FilterHeader>
    </View>
  )
}

export default Splash