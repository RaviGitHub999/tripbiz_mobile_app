import { StyleSheet } from "react-native";
import { responsiveHeight } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles=StyleSheet.create(
    {
        mainContainer:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:"space-around",
            backgroundColor:'rgba(25, 39, 39, 0.95)',
            // backgroundColor:colors.black,
            paddingVertical:responsiveHeight(2),
            borderRadius:responsiveHeight(1),
        } ,
        btn:
        {
           backgroundColor:colors.white,
            paddingHorizontal:responsiveHeight(2),
            paddingVertical:responsiveHeight(1),borderRadius:responsiveHeight(1)
        },
        btnTitle:
        {
            fontSize:responsiveHeight(2),
            fontFamily:fonts.secondry,
            color:colors.primary
        }
    }
)