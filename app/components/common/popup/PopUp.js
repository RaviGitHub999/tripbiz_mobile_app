import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../../config/theme'
import IconSwitcher from '../icons/IconSwitcher'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'

const PopUp = (props) => {
   const {value,handlePopUpClose}=props
   
    return (
       value? 
            <Modal
                animationType="slide"
                transparent={true}
                visible={value}>
                <View style={styles.modelMainContainer}>
                    <View style={styles.blurBackground}></View>
                    <View style={styles.popUpMainContainer}>
                        <View style={styles.popUpSubContainer}>
                           <TouchableOpacity onPress={handlePopUpClose} style={{ alignItems: 'flex-end' }}>
                                <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                            </TouchableOpacity>
                            <View style={styles.contentMainBox}>
                                <View style={styles.contentSubBox}>
                              {props.children}
                                </View>
                            </View>
                           </View>
                       
                    </View>
                </View>
            </Modal>
      :null
    )
}

export default PopUp
const styles = StyleSheet.create(
    {
        mainContainer: {
            flex: 1
        },
        modelMainContainer:
        {
            flex: 1
        },
        blurBackground:
        {
            height: "100%", 
            width: "100%", 
            backgroundColor: colors.black,
             position: "absolute",
              opacity: 0.5,
        },
        popUpMainContainer:{
            flex: 1, 
            alignItems: 'center',
             justifyContent: 'center', 
             paddingHorizontal: responsiveWidth(3),
             borderWidth:1 
        },
        popUpSubContainer:{
            backgroundColor: 'white',
             width: '100%', 
            padding:responsiveHeight(3),
            borderRadius:responsiveHeight(1.5),
            gap:responsiveHeight(1.5)
        },
        contentMainBox:{
            // borderWidth:1,
            // height:60,
            alignItems:'center',
            justifyContent:'center'  
        },
        contentSubBox:{
            // borderWidth:1,
            // height:30,
            // width:'100%',
            padding:responsiveHeight(1)
        }

    })