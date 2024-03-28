import { View, Text, Image,StatusBar } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { splashimg } from './assets';
import MyContext from '../../context/Context';

const Splash = ({navigation:{navigate}}) => {
    const {isLoading}=useContext(MyContext)
    useEffect(()=>
    {
       setTimeout(() => {
        navigate("Login")
       }, 3000); 
       console.log("Splash")
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

// const Splash = () => {
//     const[open,setOpen]=useState(false)
//   return (
//     <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end'}}>
//      <View style={{borderWidth:1,width:'100%'}}>
//      <Text onPress={()=>setOpen(!open)} style={{textAlign:'center'}}>Open</Text>
//      {
//         open&& <Text>
//          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
//          amet magna eu justo consectetur laoreet.
//          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
//          amet magna eu justo consectetur laoreet.
//        </Text>
//      }
//      </View>
//     </View>
//   )
// }

// export default Splash





// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, LayoutAnimation, Platform } from 'react-native';

// const Splash = () => {
//     const [open, setOpen] = useState(false);

//     const toggleOpen = () => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setOpen(!open);
//     };

//     return (
//         <View style={{ flex: 1,justifyContent:"flex-end" }}>
//             <TouchableOpacity onPress={toggleOpen} style={{ borderWidth: 1, width: '100%', padding: 10 }}>
//                 <Text style={{ textAlign: 'center' }}>{open ? 'Close' : 'Open'}</Text>
//             </TouchableOpacity>
//             {open && (
//                 <View style={{ padding: 10 }}>
//                     <Text>
//                         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
//                         amet magna eu justo consectetur laoreet.
//                         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
//                         amet magna eu justo consectetur laoreet.
//                     </Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default Splash;

//  [
//     {
//       "item": {
//         "CITYID": 145710,
//         "COUNTRY": "India",
//         "COUNTRYCODE": "IN",
//         "DESTINATION": "Hyderabad",
//         "STATEPROVINCE": "Andra Pradesh",
//         "STATEPROVINCECODE": "AP"
//       },
//       "refIndex": 45324,
//       "score": 2.220446049250313e-16
//     },
//     {
//       "item": {
//         "CITYID": 149275,
//         "COUNTRY": "Pakistan",
//         "COUNTRYCODE": "PK",
//         "DESTINATION": "Hyderabad",
//         "STATEPROVINCE": "",
//         "STATEPROVINCECODE": ""
//       },
//       "refIndex": 48888,
//       "score": 2.220446049250313e-16
//     }
//   ]