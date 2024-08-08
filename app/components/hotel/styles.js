import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles=StyleSheet.create({
    mainContainer:{
        marginTop:responsiveHeight(4),
        rowGap:responsiveHeight(1.5),
        flex:1,
        paddingHorizontal: responsiveWidth(5),
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
        marginBottom:responsiveHeight(1),
        rowGap:responsiveHeight(1.5)
    },
    roomTitle:{
        fontSize:responsiveHeight(1.8),
        fontFamily:fonts.primary,
        color:colors.primary
    },
    hotelCityListCard:
    {
        // borderWidth:1,
        // borderRadius:responsiveHeight(1.5),
        // backgroundColor:colors.white,
        // overflow:'hidden',
        maxHeight:responsiveHeight(30),
    },
    errorText:{
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.primary,
        color:colors.red
    }
})