import { View, Text, StyleSheet,TouchableWithoutFeedback,TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors } from '../../../config/theme'
import IconSwitcher from '../icons/IconSwitcher'


const CustomButtonInput = () => {
    const [toggleBtn,setToggleBtn]=useState(false)
    const handleToggle=()=>
    {
        setToggleBtn(!toggleBtn)
    }
    const handleOutsidePress=()=>
    {
        setToggleBtn(false)
    }
  return (
    <TouchableWithoutFeedback  onPress={handleOutsidePress}>
<View style={styles.container}>
    <TouchableOpacity onPress={handleToggle}>
    {
    toggleBtn?
    <View style={[styles.countBtnmainContainer]}>
        <Text>0</Text>
        <View>
           <TouchableOpacity>
           <IconSwitcher componentName='AntDesign' iconName='caretup' color={colors.gray} iconsize={1.5}/>
           </TouchableOpacity>
            <TouchableOpacity>
            <IconSwitcher componentName='AntDesign' iconName='caretdown' color={colors.gray} iconsize={1.5}/> 
            </TouchableOpacity>
        </View>
    </View>
    :
<View style={styles.mainContainer}>
<Text>Nights</Text>
<Text>0</Text>
</View>
}
    </TouchableOpacity>
</View>
    </TouchableWithoutFeedback>
  )
}

export default CustomButtonInput
const styles=StyleSheet.create(
    {
        mainContainer:{
            backgroundColor: "#f6f6f6",
            rowGap: responsiveHeight(1),
            paddingHorizontal: responsiveWidth(2.5),
            borderRadius: responsiveHeight(1.5),
            paddingVertical: responsiveHeight(0.5),
            justifyContent:'center',
            borderWidth:1,
            height:responsiveHeight(8),
        },
   container: {
    flex: 1,
  },
  countBtnmainContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: responsiveHeight(1.5),
    paddingVertical: responsiveHeight(0.5),
    borderWidth:1,
    backgroundColor: "#f6f6f6",
    alignItems:'center',
    height:responsiveHeight(8),
  }
    }
)
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';

// const ButtonComponent = () => {
//   const [clicked, setClicked] = useState(false);

//   const handleButtonClick = () => {
//     setClicked(!clicked); // Toggle the 'clicked' state between true and false
//   };

//   const handleOutsidePress = () => {
//     if (clicked) {
//       setClicked(false); // Set 'clicked' to false if tapped outside of the button
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={handleOutsidePress}>
//       <View style={styles.container}>
//         <TouchableOpacity
//           style={[styles.button, clicked && styles.clickedButton]}
//           onPress={handleButtonClick}
//         >
//           <Text style={styles.buttonText}>{clicked ? '1' : 'Button'}</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: 'black',
//     borderRadius: 5,
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   clickedButton: {
//     borderWidth: 2, // Change border width when clicked
//     borderColor: 'black', // Change border color when clicked
//   },
//   buttonText: {
//     fontSize: 16,
//     color: 'black',
//   },
// });

// export default ButtonComponent;



