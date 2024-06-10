// import React from 'react';
// import { View, Button, Linking } from 'react-native';

// const OpenPDFScreen = () => {
//   const openPDF = () => {
//     // Replace 'path_to_your_pdf_file.pdf' with the actual path or URL to your PDF file
//     const pdfURL = 'https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/bookings%2FsXgDRG00NyNADX2kSlZAn7tzFOr2%2FY2wFVnVGem8r9W4yg3Rm%2Fhotels%2FQr7OJOMJRQVVnA5X65QB%2Fdubai%20-%20hyd%2010.6.24.pdf?alt=media&token=f85990d9-15d8-4301-8d27-e2164606e925  ';
    
//     Linking.openURL(pdfURL)
//       .catch(err => console.error('An error occurred', err));
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Open PDF" onPress={openPDF} />
//     </View>
//   );
// };

// export default OpenPDFScreen;





// import React, { useState, useRef, useEffect } from 'react';
// import {
//   TextInput,
//   Text,
//   StyleSheet,
//   Pressable,
// } from 'react-native';
// import { responsiveHeight, responsiveWidth } from '../../utils/responsiveScale';
// import { colors, fonts } from '../../config/theme';

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

//   useEffect(() => {
//     if (isEditing) {
//       inputRef.current.focus();
//     }
//   }, [isEditing]);

//   return (
//     <Pressable style={[styles.button,isEditing&&styles.buttonEditing]} onPress={handleButtonClick}>
//       {isEditing ? (
//         <TextInput
//           ref={inputRef}
//           value={inputValue}
//           onChangeText={handleInputChange}
//           onBlur={handleInputBlur}
//           style={styles.input}
//           placeholder='Destination'
//         />
//       ) : (
//         <Text style={styles.buttonText}>Origin</Text>
//       )}
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//       paddingHorizontal:responsiveWidth(4),
//       paddingVertical:responsiveHeight(1),
//       height:responsiveHeight(7),
//       justifyContent:'center',
//       borderRadius:responsiveHeight(2),
//       backgroundColor:colors.whiteSmoke,
      
//   },
//   buttonText: {
//       fontSize:responsiveHeight(2),
//       fontFamily:fonts.secondry
//   },
//   input: {
//     height:responsiveHeight(7),
//   },
//   buttonEditing: {
//     borderColor: colors.primary,
//     borderWidth: responsiveHeight(0.3),
//   },
//   title:{
//     fontSize:responsiveHeight(2),
//     fontFamily:fonts.secondry
//   }

// });

// export default ToggleButtonInput;

import { View, Text } from 'react-native'
import React from 'react'

const Pdf = () => {
  return (
    <View>
      <Text>Pdf</Text>
    </View>
  )
}

export default Pdf