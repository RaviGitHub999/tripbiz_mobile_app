import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles=StyleSheet.create({
mainContainer:{
    paddingHorizontal:responsiveWidth(2),
    paddingVertical:responsiveHeight(1.5),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    // backgroundColor:colors.white
},
filterTitleContainer:{
    flexDirection:'row',
    alignItems:'center',
    columnGap:responsiveWidth(1)
},
filterTitle:{
    fontSize:responsiveHeight(2.5),
    fontFamily:fonts.primary,
    color:colors.primary
},
childrenContainer:
{
paddingHorizontal:responsiveWidth(2)
}
})