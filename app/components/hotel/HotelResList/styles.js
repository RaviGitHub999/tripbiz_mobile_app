import { StyleSheet } from "react-native";
import { colors, fonts } from "../../../config/theme";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";

export const styles=StyleSheet.create({
headerMainContainer:{
    backgroundColor:colors.primary,
    // flex: .1, 
    // borderWidth: 2,
    //  borderColor: "red",
     paddingHorizontal:responsiveWidth(5),
     justifyContent:'center',
     rowGap:responsiveHeight(1),
     height:responsiveHeight(10)
},
titleContainer:{
    flexDirection: "row",
    alignItems:'centers',
    columnGap:responsiveWidth(4),
    // borderWidth:1,
},
title:{
    textAlignVertical:'center',
    color:colors.white,
    fontSize:responsiveHeight(2.2),
    fontFamily:fonts.primary

},
editButtonContainer:{
    backgroundColor: colors.highlight,
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
    borderRadius: responsiveHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
},
subTitle:{
    textAlignVertical:'center',
    color:colors.white,
    fontSize:responsiveHeight(1.7),
    fontFamily:fonts.primary  
}
})