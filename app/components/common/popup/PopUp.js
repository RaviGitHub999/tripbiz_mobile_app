
// import React, { useState } from 'react';
// import { View, Modal, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
// import { colors } from '../../../config/theme';
// import IconSwitcher from '../icons/IconSwitcher';
// import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';

// const PopUp = (props) => {
//     const { value, handlePopUpClose, customStyles } = props;

//     return (
//         value ?
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={value}
//                 onRequestClose={()=>
//                 {
//                     handlePopUpClose()
//                 }}
//                 >
//                     <View style={styles.modelMainContainer}>
//                         <View style={styles.blurBackground}></View>
//                         <View style={styles.popUpMainContainer}>
//                             <View style={styles.popUpSubContainer}>
//                                 <View style={{ alignItems: 'flex-end' }}>
//                                     <TouchableOpacity onPress={handlePopUpClose} >
//                                         <IconSwitcher componentName='MaterialCommunityIcons' iconName='close' iconsize={2.5} color='black' />
//                                     </TouchableOpacity>
//                                 </View>
//                                 <View style={styles.contentMainBox}>
//                                     <View style={customStyles ? customStyles : styles.contentSubBox}>
//                                         {props.children}
//                                     </View>
//                                 </View>
//                             </View>
//                         </View>
//                     </View>
//             </Modal>
//             : null
//     );
// };

// export default PopUp;

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1
//     },
//     modelMainContainer: {
//         // height: Dimensions.get("screen").height,
//         flex:1,
//         justifyContent: 'center'
//     },
//     blurBackground: {
//         height: "100%",
//         width: "100%",
//         backgroundColor: colors.black,
//         position: "absolute",
//         opacity: 0.5,
//     },
//     popUpMainContainer: {
//         alignItems: 'center',
//         paddingHorizontal: responsiveWidth(3),
//     },
//     popUpSubContainer: {
//         backgroundColor: 'white',
//         width: '100%',
//         padding: responsiveHeight(1.5),
//         borderRadius: responsiveHeight(1.5),
//         // gap:responsiveHeight(1.5),

//     },
//     contentMainBox: {
//         // borderWidth:1,
//         // height:60,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     contentSubBox: {
//         // borderWidth:1,
//         // height:30,
//         // width:'100%',
//         padding: responsiveHeight(1)
//     }
// });


import { View, Text, Modal, StyleSheet, ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'
import { responsiveHeight } from '../../../utils/responsiveScale';
import IconSwitcher from '../icons/IconSwitcher';

const PopUp = (props) => {
    const { value, handlePopUpClose, } = props;
    return (
        value ?
            <Modal
                animationType="slide"
                transparent={true}
                visible={value}
                onRequestClose={() => {
                    handlePopUpClose()
                }}
            >
                <View style={styles.mainContainer}>
                    <View style={styles.subContainer}>

                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={handlePopUpClose} >
                                <IconSwitcher componentName='MaterialCommunityIcons' iconName='close' iconsize={3} color='black' />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {props.children}
                        </ScrollView>
                    </View>
                </View>

            </Modal>
            : null
    )
}
const styles = StyleSheet.create(
    {
        mainContainer:
        {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            alignItems: "center",
            justifyContent: 'center',
            paddingHorizontal: responsiveHeight(2),

        },
        subContainer: {
            backgroundColor: 'white',
            maxHeight: "90%",
            width: "100%",
            borderRadius: responsiveHeight(2),
            padding:responsiveHeight(2),
            gap:responsiveHeight(1)
        }
    }
)
export default PopUp