import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles=StyleSheet.create({
    mainContainer:
    {
        flex:1,
        paddingHorizontal: responsiveWidth(5),
        paddingTop:responsiveHeight(4),
        rowGap:responsiveHeight(1.5),
    },
    item: {
        paddingVertical: responsiveHeight(0.6),
        paddingLeft: responsiveWidth(2),
    },
    itemHovered: {
        backgroundColor: colors.facebook,
    },
    selectedItemTitle:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.secondry,
        color: colors.primary

    },
    activeSelectedItemTitle:
    {
        color: colors.white
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
    customStyle:{
        backgroundColor: colors.whiteSmoke, 
        height: responsiveHeight(6.5), 
        elevation: 0 
    },
    cityName:{
        marginVertical:responsiveHeight(0.8)
    }
})