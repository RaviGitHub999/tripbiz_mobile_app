import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import IconSwitcher from '../icons/IconSwitcher'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors } from '../../../config/theme'
import MyContext from '../../../context/Context'
interface IProps {
    length: number,
    particularState: string
}
const DropDown: React.FC<IProps> = ({ length, particularState }) => {
    const { adults, children, infants, actions } = useContext<any>(MyContext)
    const [dropDownIcon, setDropDownIcon] = useState(false)
    const [dropDownList, setDropDownList] = useState(false)
    const requiredState = (value: string) => {
        switch (value) {
            case "Adults":
                return adults
            case "Children":
                return children
            case "Infants":
                return infants
            default:
                break;
        }
    }
    const numbers = Array.from({ length }, (_, index) => index);

    const list = numbers.map((number) => (
        <TouchableOpacity key={number} style={[requiredState(particularState) === number && { backgroundColor: "#86c9e8" }, { paddingHorizontal: responsiveWidth(2.5) }]} onPress={() => handlePress(particularState, number)}>
            <Text>{number}</Text>
        </TouchableOpacity>
    ))
    const handlePress = (a: string, b: number) => {
        actions.handleDropDownState({ stateName: a, stateValue: b })
        setDropDownIcon(false)
    }
    const handleDropDownIcon = () => {
        setDropDownIcon(true)
        setDropDownList(!dropDownList)
    }
    return (
        <View >
            <TouchableOpacity style={styles.mainContainer} onPress={handleDropDownIcon}>
                <View>
                   {!dropDownIcon?<Text>{particularState}</Text>:null}
                </View>
                <View style={styles.dropDownInActiveConatiner}>
                    <Text>{requiredState(particularState)}</Text>
                    {dropDownIcon&& <IconSwitcher componentName='AntDesign' iconName='down' iconsize={2} />}
                </View>
            </TouchableOpacity>
            <View style={dropDownIcon && { borderWidth: 1, width: '100%', backgroundColor: 'white', marginTop: responsiveHeight(1) }}>
                {dropDownIcon && list}
            </View>
        </View>
    )
}

export default DropDown
const styles = StyleSheet.create(
    {
        mainContainer: {
            backgroundColor: "#f6f6f6",
            rowGap: responsiveHeight(1),
            paddingHorizontal: responsiveWidth(2.5),
            borderRadius: responsiveHeight(1.5),
            paddingVertical: responsiveHeight(0.5),
            width: responsiveWidth(24),
            height:responsiveHeight(8),
            justifyContent:'center'
        },
        dropDownInActiveConatiner:{
            justifyContent: "space-between",
             flexDirection: "row", 
             alignItems: "center" 
        },
        dropDownActiveConatiner:{

        }
    }
)