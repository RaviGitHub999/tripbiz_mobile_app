import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles=StyleSheet.create({
    mainContainer:{
        marginTop:responsiveHeight(4),
        rowGap:responsiveHeight(1.5),
        flex:1
    },
    aligningItemsInRow:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    roomCard:{
        borderWidth:2,
        borderStyle:'dashed',
        paddingHorizontal:responsiveWidth(2),
        paddingVertical:responsiveHeight(1.5),
        borderRadius:responsiveHeight(2),
        borderColor:colors.gray,
        rowGap:responsiveHeight(1)
    },
    roomTitle:{
        fontSize:responsiveHeight(1.8),
        fontFamily:fonts.primary,
        color:colors.primary
    }
})