import {StyleSheet} from "react-native"
import { responsiveFontSize, responsiveHeight } from "../../../utils/responsiveScale"
import { colors, fonts } from "../../../config/theme"
export const styles=StyleSheet.create({
    btn:{
borderWidth:1,
alignItems:'center',
justifyContent:'center',
padding:responsiveHeight(1.5),
borderRadius:responsiveHeight(1.5),
backgroundColor:colors.primary
    },
    btnText:{
        fontSize:responsiveFontSize(2.5),
        fontFamily:fonts.primary,
        color:"white" 
    }
})