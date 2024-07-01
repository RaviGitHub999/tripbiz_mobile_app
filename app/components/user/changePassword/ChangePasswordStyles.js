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
            backgroundColor:colors.whiteSmoke,
            paddingTop:responsiveHeight(3),
            gap:responsiveHeight(1),
           
        },
        maintitle:{
            fontSize:responsiveHeight(3),
            fontFamily:fonts.textFont,
            color:colors.primary,marginBottom:responsiveHeight(3)
        },
        inputContainer:{
            width:"70%",
            gap:responsiveHeight(1)
        },
        btn:{
            borderWidth:1,
            padding:responsiveHeight(1.5),
            borderRadius:responsiveHeight(1.6),
            backgroundColor:colors.primary
        },
        btnTitle:{
            fontSize:responsiveHeight(1.9),
            fontFamily:fonts.textInput,
            color:colors.white

        },
        subTitle:
        {
            fontSize:responsiveHeight(1.9),
            fontFamily:fonts.textInput,
            color:colors.primary
        },
        errorTitle:
        {
            fontSize:responsiveHeight(1.6),
            fontFamily:fonts.textFont,
            color:colors.red
        },
        back:{
            alignSelf:'flex-start',
            paddingLeft:responsiveWidth(3)
          }
    }
)