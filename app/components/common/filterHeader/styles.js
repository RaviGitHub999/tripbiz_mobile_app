import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles=StyleSheet.create({
    container:
    {
    backgroundColor:colors.white
    },
mainContainer:{
    paddingHorizontal:responsiveWidth(2),
    paddingVertical:responsiveHeight(1.3),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
 
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
},
filtersCountContainer:{
    position: 'absolute', 
    right: responsiveWidth(-5), 
    top: responsiveHeight(0.5), 
    borderWidth: 1, 
    height: responsiveHeight(2.5),
     width: responsiveHeight(2.5), 
     alignItems: 'center', 
     justifyContent: 'center',
      borderRadius: responsiveHeight(2),
       backgroundColor: colors.highlight
}
})