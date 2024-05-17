import {StyleSheet} from "react-native"
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale"
import { colors, fonts } from "../../../config/theme"
export const styles=StyleSheet.create({
    btn:{
alignItems:'center',
justifyContent:'center',
paddingVertical:responsiveHeight(1.5),
borderRadius:responsiveHeight(1.5),
backgroundColor:colors.primary,

    },
    btnText:{
        fontSize:responsiveFontSize(2),
        fontFamily:fonts.primary,
        color:"white" 
    }
})