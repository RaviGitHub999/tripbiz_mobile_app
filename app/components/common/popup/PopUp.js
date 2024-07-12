
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