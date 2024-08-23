
import { View, Text, Modal, StyleSheet, ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'
import { responsiveHeight } from '../../../utils/responsiveScale';
import IconSwitcher from '../icons/IconSwitcher';
import Toast from 'react-native-toast-message';

const PopUp = (props) => {
    const { value, handlePopUpClose,PopUpheight } = props;
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
                    <View style={[styles.subContainer,{...PopUpheight}]}>

                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={handlePopUpClose} >
                                <IconSwitcher componentName='MaterialCommunityIcons' iconName='close' iconsize={3} color='black' />
                            </TouchableOpacity>
                        </View>
                        <ScrollView keyboardShouldPersistTaps="always">
                            {props.children}
                        </ScrollView>
                    </View>
                </View>
<Toast  config={{
          custom_success: ({ text1, text2, ...rest }) => (
            <View style={styles.customToastContainer}>
              <Text style={styles.customToastText1}>{text1}</Text>
              <Text style={styles.customToastText2}>{text2}</Text>
            </View>
          )
        }}/>
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
        },
        customToastContainer: {
            height: 60,
            backgroundColor: 'lightgreen',
            padding: 15,
            borderLeftColor: 'green',
            borderLeftWidth: 5,
            justifyContent: 'center',
            zIndex: 1000, // Set the zIndex if required
          },
          customToastText1: {
            fontSize: 18, // Increase the size of text1
            fontWeight: 'bold',
          },
          customToastText2: {
            fontSize: 16, // Increase the size of text2
          },
    }
)
export default PopUp