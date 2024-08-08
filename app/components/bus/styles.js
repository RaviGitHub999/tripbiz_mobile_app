import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles=StyleSheet.create(
    {
        mainContainer:
        {
            flex:1,
            paddingHorizontal: responsiveWidth(5),
            paddingTop:responsiveHeight(4),
            rowGap:responsiveHeight(1.5),
        },
        cityListContainer:
        {
            borderWidth:responsiveHeight(0.3),
            maxHeight:responsiveHeight(20),
            borderRadius:responsiveHeight(1),
            
        },
        containerStyle:{
            // paddingVertical:responsiveHeight(1),
            paddingHorizontal:responsiveHeight(2),
            justifyContent:'center'
        },
        cityName:{
            marginVertical:responsiveHeight(0.8)
        },
        selectedItemTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.secondry,
            color: colors.primary
        },
        loaderTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.textInput,
            color: colors.primary
        },
        errorText:{
            fontSize:responsiveHeight(1.5),
            fontFamily:fonts.primary,
            color:colors.red
        }
    }
)