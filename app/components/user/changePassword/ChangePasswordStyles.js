import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles=StyleSheet.create(
    {
        mainContainer:
        {
            flex:1,
            alignItems:'center',
            // justifyContent:'center' 
        },
        maintitle:{
            fontSize:responsiveHeight(3),
            fontFamily:fonts.textFont,
            color:colors.primary
        },
        inPut:{
            borderRadius: responsiveHeight(1),
            paddingHorizontal: responsiveWidth(3),
            height:responsiveHeight(5),
            borderWidth:1,
        }
    }
)