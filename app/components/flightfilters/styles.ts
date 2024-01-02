import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles = StyleSheet.create({
    upArrowIconmainContainer:
    {
        borderWidth: 1,
        paddingLeft: responsiveWidth(2),
    },
    upArrowIcon: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterHeader: {
        fontSize: responsiveHeight(2.8),
        color: colors.black,
        fontFamily: fonts.textFont
    },
    filtersIconContainer: {
        flexDirection: 'row',
        columnGap: responsiveHeight(1),
        alignItems: 'center'
    },
    filtersmainContainer: {
        marginTop: responsiveHeight(2),
        rowGap: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(3)
    },
    filterTitles: {
        fontSize: responsiveHeight(2.3),
        letterSpacing: responsiveWidth(0.2),
        fontFamily: fonts.textFont,
        color: colors.black
    },
    sunImges: {
        height: responsiveHeight(6),
        width: responsiveHeight(6),
    },
    mappedSunImgContainer: {
        flexDirection: 'row',
        columnGap: responsiveWidth(2),
        marginTop: responsiveHeight(1)
    },
    sunimgCardContainer: {
        // borderWidth:1,
        alignItems: "center",
        justifyContent: 'center',
        padding: responsiveHeight(1)
    },
    title: {
        fontSize: responsiveHeight(1.5)
    },
    selected: {
        backgroundColor: 'green',
    },
    flightNameBtn: {
        borderWidth: 1,
        width: "30%",
        alignItems: 'center',
        justifyContent: 'center',
        padding: responsiveHeight(0.5),
        marginRight: responsiveWidth(3),
        marginBottom: responsiveHeight(1.5),
        borderRadius: responsiveHeight(2)
    },
    flightNamesRenderContainer: {
        marginTop: responsiveHeight(2)
    },
    selectedFlightNameBtn:{
        backgroundColor:colors.gray
    },
    flightName:{
        fontSize:responsiveHeight(1.6),
        fontFamily:fonts.textFont,
    },
    selectedFlightName:{
   color:colors.white
    },
    stopsContainer:{
        rowGap:responsiveHeight(0.5),
        marginTop:responsiveHeight(2)
    }
})