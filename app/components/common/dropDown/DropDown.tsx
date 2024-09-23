import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import IconSwitcher from '../icons/IconSwitcher'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors, fonts } from '../../../config/theme'
import MyContext from '../../../context/Context'
interface IProps {
    length: number,
    particularState: string,
    customStyles?:any,
    placeHolder?:string,
    starting?:number,
    hotel?:boolean,
    handleChange?:Function
}       
const DropDown: React.FC<IProps> = ({ length,starting, particularState,customStyles,placeHolder}) => {
    const { adults,hChild, hAdults,children, infants, actions,hotelRooms } = useContext<any>(MyContext)
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
                case "Nights":
                return children
            case "Rooms":
                return hotelRooms
                case "hAdults":
                return hAdults
                case "hChild":
                return hChild
            default:
                break;
        }
    }
    const numbers = Array.from({ length }, (_, index) => index);

    const list = numbers.map((number) => {
       let comp=starting===1?number+1:number
       return(
        <TouchableOpacity key={number} style={[requiredState(particularState) === comp&& { backgroundColor: "#86c9e8" },styles.highliteColor]} onPress={() => handlePress(particularState, starting===1?number+1:number)}>
        <Text style={requiredState(particularState) === comp?styles.activeText:styles.inActiveText}>{starting===1?number+1:number}</Text>
    </TouchableOpacity>
       )
       })
    const handlePress = (a: string, b: number) => {
        actions.handleDropDownState({ stateName: a, stateValue: b })
        setDropDownIcon(!dropDownIcon)
    }
    const handleDropDownIcon = () => {
        setDropDownIcon(!dropDownIcon)
        setDropDownList(!dropDownList)
    }
    return (
        <View >
            <TouchableOpacity style={[styles.mainContainer,customStyles&&{...customStyles}]} onPress={handleDropDownIcon}>
                <View>
                   {!dropDownIcon?<Text style={styles.placeHolder}>{placeHolder}</Text>:null}
                </View>
                <View style={styles.dropDownInActiveConatiner}>
                    <Text style={styles.listItem}>{requiredState(particularState)}</Text>
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
            rowGap: responsiveHeight(0.5),
            paddingHorizontal:responsiveHeight(2),
            borderRadius: responsiveHeight(1.5),
            paddingVertical: responsiveHeight(0.5),
            minHeight:responsiveHeight(8.5),
            justifyContent:'center'
        },
        dropDownInActiveConatiner:{
            justifyContent: "space-between",
             flexDirection: "row", 
             alignItems: "center" 
        },
        placeHolder:{
                fontSize:responsiveWidth(4.5),
                color:colors.gray,
                fontFamily:fonts.textFont,
        },
        activeText:{
            color:colors.white,
            fontFamily:fonts.primary,
            fontSize:responsiveWidth(3.5),
        },
        inActiveText:{
            color:"#505050",
            fontFamily:fonts.primary,
            fontSize:responsiveWidth(3.5),
        },
        highliteColor:{
            paddingHorizontal: responsiveWidth(3.5),
            paddingVertical:responsiveHeight(.5)
        },
        listItem:{
            color:"#505050",
            fontFamily:fonts.primary,
            fontSize:responsiveWidth(4.5), 
        }
    }
)