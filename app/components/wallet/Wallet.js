// import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
// import React, { useState } from 'react'
// import CustomSelect from '../common/customSelect/CustomSelect'
// import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale';
// import { colors, fonts } from '../../config/theme';

// export default function Wallet() {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [viewAll, setViewAll] = useState(false);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(0);
//   const arr=
//   [
// {
//   name:"ravi"
// },
// {
//   name:"kiran"
// },
// {
//   name:"rishi"
// },
// {
//   name:"ravi"
// },
// {
//   name:"kiran"
// },
// {
//   name:"rishi"
// },
//   ]

//   const renderItem=(item,index)=>
//     {
//       return(
//         <TouchableHighlight
//       onPress={()=>{setSelectedItem(item.name),handledropDown(),setSelectedItemIndex(index)}}
//       style={[
//         styles.item,
//         selectedItemIndex === index && styles.itemHovered,
//     ]}
//     underlayColor={colors.whiteSmoke} >
//           <Text style={[styles.selectedItemTitle,selectedItemIndex === index&&styles.activeSelectedItemTitle]}>{item.name}</Text>
//         </TouchableHighlight>
//       )
//     }
//     const handledropDown = () => {
//       setViewAll(!viewAll);
//   };
//   return (
//     <View> 
//       <CustomSelect initialName={"No_Data"} data={arr} renderData={(item,index)=>renderItem(item,index)
//       } selectedItem={selectedItem} handledropDown={handledropDown} viewAll={viewAll}/>
//     </View>
//   )
// }
// const styles=StyleSheet.create({
//   item: {
//     paddingVertical: responsiveHeight(0.6),
//     paddingLeft: responsiveWidth(2),
// },
// itemHovered: {
//     backgroundColor: colors.facebook,
// },
// selectedItemTitle:
// {
//   fontSize:responsiveHeight(2),
//   fontFamily:fonts.textInput,
//   color:colors.primary

// },
// activeSelectedItemTitle:
// {
//   color:colors.white
// }
// })
// import { View, Text, Pressable, StyleSheet } from 'react-native'
// import React, { useState } from 'react'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
// import { colors, fonts } from '../../config/theme'
// const[press,setPress]=useState(false)
// const Wallet = () => {
//  const handlePress=()=>
//     {
// setPress(!press)
//     }
//   return (
//     <View style={{paddingHorizontal:10,justifyContent:'center',flex:1}}>
//       <Pressable  style={styles.buttonContainer} onPress={()=>console.log("first")}>
//         <Text style={styles.title}>Origin</Text>
//       </Pressable >
//     </View>
//   )
// }

// const styles=StyleSheet.create(
//   {
//     title:
//     {
//       fontSize:responsiveHeight(2),
//       fontFamily:fonts.secondry
//     },
//     buttonContainer:
//     {
//       paddingHorizontal:responsiveWidth(4),
//       paddingVertical:responsiveHeight(1),
//       height:responsiveHeight(7),
//       justifyContent:'center',
//       borderRadius:responsiveHeight(2),
//       backgroundColor:colors.white
//     }
//   }
// )
// export default Wallet

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Keyboard
// } from 'react-native';

// const ToggleButtonInput = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [inputValue, setInputValue] = useState('');
//   const inputRef = useRef(null);

//   const handleButtonClick = () => {
//     setIsEditing(true);
//   };

//   const handleInputBlur = () => {
//     setIsEditing(false);
//   };

//   const handleInputChange = (text) => {
//     setInputValue(text);
//   };

//   const handleScreenPress = () => {
//     setIsEditing(false);
//     Keyboard.dismiss();
//   };

//   // useEffect(() => {
//   //   if (isEditing) {
//   //     inputRef.current.focus();
//   //   }
//   // }, [isEditing]);

//   return (
//     <TouchableWithoutFeedback onPress={handleScreenPress}>
//       <View style={styles.container}>
//         {isEditing ? (
//           <TextInput
//             // ref={inputRef}
//             value={inputValue}
//             onChangeText={handleInputChange}
//             onBlur={handleInputBlur}
//             style={styles.input}
//             autoFocus
//           />
//         ) : (
//           <TouchableOpacity onPress={handleButtonClick} style={styles.button}>
//             <Text style={styles.buttonText}>Click to Edit</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 2,
//     borderColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default ToggleButtonInput;

import { View, Text ,SafeAreaView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import ToggleButtonInput from './Pdf'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Wallet = () => {
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };
  return (
    <KeyboardAvoidingView onPress={handleScreenPress} style={{borderWidth:1,flex:1}}>
     <TouchableWithoutFeedback onPress={handleScreenPress}>
     <SafeAreaView style={{borderWidth:1,flex:1,padding:10}} >
      <Text >Custom Toggle Button/Input</Text>
      <ToggleButtonInput />
      <TouchableOpacity>
        <Text>sbnd</Text>
      </TouchableOpacity>
    </SafeAreaView >
     </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Wallet

