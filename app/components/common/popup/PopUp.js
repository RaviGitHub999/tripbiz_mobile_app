import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../../config/theme'
import IconSwitcher from '../icons/IconSwitcher'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'

const PopUp = () => {
    const [open, setOpen] = useState(false)
    return (
        <View style={styles.mainContainer}>
            <Text style={{ fontSize: 20 }} onPress={() => setOpen(!open)}>Open</Text>
            <Modal
                animationType="slide"
                transparent={true}
                visible={open}>
                <View style={styles.modelMainContainer}>
                    <View style={styles.blurBackground}></View>
                    <View style={styles.popUpMainContainer}>
                        <View style={styles.popUpSubContainer}>
                           <TouchableOpacity onPress={() => setOpen(!open)} style={{ alignItems: 'flex-end' }}>
                                <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                            </TouchableOpacity>
                            <View>
                                
                            </View>
                           </View>
                       
                    </View>
                </View>
            </Modal>
        </View>
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
            // alignItems:'center',
            // justifyContent:'center'
        }

    })