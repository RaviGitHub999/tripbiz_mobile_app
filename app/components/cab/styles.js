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
})