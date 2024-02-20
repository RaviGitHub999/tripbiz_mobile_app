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


import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, Text } from 'react-native';

const Com = () => {
  const [heightAnim] = useState(new Animated.Value(100)); // Initial height of the view
  const increasedHeight = 200; // Height to increase to
  const initialHeight = 100; // Initial height of the view
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleHeight = () => {
    const toValue = isExpanded ? initialHeight : increasedHeight;
    Animated.timing(heightAnim, {
      toValue,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: false, // Make sure to set useNativeDriver to false for height animations
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        style={{
          width: 200,
          backgroundColor: 'blue',
          height: heightAnim,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Content of the animated view */}
      </Animated.View>
      <TouchableOpacity
        onPress={toggleHeight}
        style={{ marginTop: 20, backgroundColor: 'black', padding: 10 }}
      >
        {/* Increase Height Button */}
        <Text style={{ color: 'white' }}>{isExpanded ? 'Collapse' : 'Expand'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Com;



