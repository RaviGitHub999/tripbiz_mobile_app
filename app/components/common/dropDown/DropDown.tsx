import { View, Text, TouchableOpacity } from 'react-native'
import React,{useContext, useState} from 'react'
import IconSwitcher from '../icons/IconSwitcher'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { colors } from '../../../config/theme'
import MyContext from '../../../context/Context'
interface IProps {
    length: number,
    particularState:string
}
const DropDown: React.FC<IProps> = ({ length,particularState }) => {
    const { adults, children, infants,actions } = useContext<any>(MyContext)
    const[dropDownIcon,setDropDownIcon]=useState(false)
    const[dropDownList,setDropDownList]=useState(false)
    const requiredState = (value: string) => {
        switch (value) {
            case "adults":
                return adults
            case "children":
                return children
            case "infants":
                return infants
            default:
                break;
        }
    }
    const numbers = Array.from({ length }, (_, index) => index);

    const list = numbers.map((number) => (
        <TouchableOpacity key={number} style={[requiredState(particularState)===number&&{backgroundColor:"green"},{paddingHorizontal: responsiveWidth(2.5)}]} onPress={()=>handlePress(particularState,number)}>
            <Text>{number}</Text>
        </TouchableOpacity>
    ))
    const handlePress=(a:string,b:number)=>
    {
        actions.handleDropDownState({stateName:a,stateValue:b})
        setDropDownIcon(false)
    }
    const handleDropDownIcon=()=>
    {
        setDropDownIcon(true)
        setDropDownList(!dropDownList)
    }
    return (
        <View >
            <TouchableOpacity style={{ backgroundColor: "#f4edf9", rowGap: responsiveHeight(1), borderWidth: 1, paddingHorizontal: responsiveWidth(2.5), borderRadius: responsiveHeight(1.5), paddingVertical: responsiveHeight(0.5),width:responsiveWidth(24)}} onPress={handleDropDownIcon}>
                <View>
                    <Text>{particularState}</Text>
                </View>
                <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                    <Text>{requiredState(particularState)}</Text>
                    {dropDownIcon?<IconSwitcher componentName='AntDesign' iconName='up' iconsize={2} />:<IconSwitcher componentName='AntDesign' iconName='down' iconsize={2} />}
                </View>
            </TouchableOpacity>
            <View style={dropDownIcon&&{ borderWidth: 1,position:"absolute",width:'100%',top:responsiveHeight(8),zIndex:1,backgroundColor:'white'}}>
                {dropDownIcon &&list}
            </View>
        </View>
    )
}

export default DropDown