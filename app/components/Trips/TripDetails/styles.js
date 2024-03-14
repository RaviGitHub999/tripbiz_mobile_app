import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        borderWidth: 3,
        borderColor: "green",
        paddingTop: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: colors.white
    },
    backNavigationContainer: {
        width: "8%",
    },
    subContainer: {
        borderWidth: 2,
        borderColor: "red",
        paddingHorizontal: responsiveWidth(2.5)
    },
    hotelCardTitle:
    {
        marginTop: responsiveHeight(1.3),
        fontSize: responsiveHeight(2.1),
        fontFamily: fonts.primary,
        color: colors.primary,
        marginBottom: responsiveHeight(1.3)
    },
    tripDetailsHeader:
    {
        marginTop: responsiveHeight(1.2),
        gap: responsiveHeight(0.5)
    },
    tripName: {
        fontSize: responsiveHeight(2.3),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    tripDateTitle: {
        fontSize: responsiveHeight(1.7),
        color: colors.primary,
        fontWeight: '500'
    },
    tripDate: {
        color: colors.highlight
    },
    hotelCard: {
        // borderWidth: 2,
        // borderColor: "gold",
        paddingVertical: responsiveHeight(2.5),
        paddingHorizontal: responsiveWidth(3),
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
        backgroundColor: colors.white,
        borderRadius: responsiveHeight(1.5)
    },
    hotelImgContainer: {
        width: "35%",
    },
    hotelImg: {
        height: responsiveHeight(13),
    },
    hotelTitle: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.primary,

    },
    hotelBookedDate: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.primary
    },
    hotelNights: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.primary,
    },
    hotelRatingContainer: {
        flexDirection: 'row'
    },
    familyDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: responsiveHeight(1)

    },
    hotelDetailsContainer: {
        flexDirection: 'row'
    },
    hotelRoomFeatures:
    {
        // borderWidth: 1,
        backgroundColor: colors.whiteSmoke,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.8),
        borderRadius: responsiveHeight(1.3),
        gap: responsiveHeight(1),
        marginTop: responsiveHeight(2)
    },
    hotelRoomFeaturesContainer1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    hotelRoomFeaturesContainer2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mealsDeatils: {
        flexDirection: "row",
        alignItems: 'center',
        gap: responsiveHeight(0.5)
    },
    roomType: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.textFont,
        color: colors.primary
    },
    foodAndCancellationTitle:
    {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.lightGray
    },
    hotelPriceMainContainer:
    {
        borderTopWidth: responsiveHeight(0.1),
        borderBottomWidth: responsiveHeight(0.1),
        borderStyle: "dotted",
        marginTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        gap: responsiveHeight(0.5)
    },
    addedHotelTimeAndDateContainer:
    {
        paddingTop: responsiveHeight(0.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addedHotelTitleContainer:
    {
        width: "90%"
    },
    addingHotelBtnContainer: {
        alignSelf: 'center',
        width: '80%',
    },
    addingHotelBtn:
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(0.5),
        borderWidth: responsiveHeight(0.18),
        justifyContent: 'center',
        paddingVertical: responsiveHeight(0.5),
        marginTop: responsiveHeight(1.7),
        borderStyle: "dashed",
        borderRadius: responsiveHeight(1),
        backgroundColor: colors.highlightLite
    },
    addingHotelBtnTitle:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textFont,
        color: colors.primary
    },
    flightCard:
    {
        borderWidth: 1,
        paddingVertical: responsiveHeight(2.5),
        paddingHorizontal: responsiveWidth(3),
    }

})