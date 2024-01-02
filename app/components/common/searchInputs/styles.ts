import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles=StyleSheet.create(
    {
        btnMainContainer:{
            backgroundColor:"rgb(26, 246, 246)",
            justifyContent:'center',
            borderRadius:responsiveHeight(1.5),
            paddingHorizontal:responsiveWidth(5),
            height:responsiveHeight(7)
        },
        btn:{
            width:"100%",
            height:"100%",
            alignItems:"center",
            flexDirection:'row',
            justifyContent:'space-between',
        },
        btnText:{
            fontSize:responsiveFontSize(2.5)
        },
        dropDownListContainer:{
            borderWidth:1,
            height:responsiveHeight(15)
        },
        eachListItem:{
            paddingLeft:responsiveWidth(5),
            paddingVertical:responsiveHeight(0.1)
        },
        textInputContainer:{
            backgroundColor:"rgb(26, 246, 246)",
            justifyContent:'center',
            borderRadius:responsiveHeight(1.5),
            paddingHorizontal:responsiveWidth(5)
        },
        textInputFont:{
            fontSize:responsiveFontSize(2.5)
        },
        eachListText:{
            fontSize:responsiveFontSize(2),
            fontFamily:fonts.textInput,
            color:colors.primary
        },
        btnorTextInput:{
            height:responsiveHeight(7),
           justifyContent:'center',
           paddingHorizontal:responsiveWidth(5),
           borderRadius:responsiveHeight(1.5),
           backgroundColor:"rgb(26, 246, 246)",
        },
        selectedAirportContainer:{
            flex:1,
            justifyContent:'center',
            rowGap:responsiveHeight(0.5)
        }
    }
)