import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles = StyleSheet.create(
    {
        mainContainer: {
            flex: 1,
            padding: responsiveHeight(3)
        },
        maintitle: {
            fontSize: responsiveHeight(3),
            fontFamily: fonts.textFont,
            color: colors.primary,
            textAlign: "center"
        },
        subTitle:
        {
            fontSize: responsiveHeight(2.5),
            fontFamily: fonts.textFont,
            color: colors.primary,
        },
        btn: {
            borderWidth: 1,
            paddingHorizontal: responsiveHeight(1.5),
            borderRadius: responsiveHeight(1.6),
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(1),
            paddingVertical: responsiveHeight(1),
            alignSelf: 'flex-start'
        },
        btnTitle: {
            fontSize: responsiveHeight(1.9),
            fontFamily: fonts.textFont,
            color: colors.white

        },
        subContainer:
        {
            gap: responsiveHeight(1),
            marginTop: responsiveHeight(3),
        },
        managerDetailsContainer:
        {
            gap: responsiveHeight(2)
        },
        inputContainer:
        {
            gap: responsiveHeight(1)
        },
        inPutHeaderTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.textInput,
            color: colors.primary
        },
        managerDataContainer: {
            borderWidth: responsiveHeight(0.2),
            padding: responsiveHeight(1.8),
            borderRadius: responsiveHeight(1.5),
            borderStyle: 'dotted',
            backgroundColor: colors.highlightLite
        },
        managerDataTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.textFont,
            color: colors.primary
        },
        approvalNavBar: {
            borderWidth: responsiveHeight(0.13),
            flexDirection: 'row',
            borderRadius: responsiveHeight(1.6),
            backgroundColor: colors.highlightLite,
            borderColor: colors.primaryLite,
            overflow: 'hidden'
        },
        eachNavBarContainer:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: responsiveHeight(0.8),

        },
        selectedEachNavBarContainer:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: responsiveHeight(0.8),
            backgroundColor: colors.primaryLite

        },
        eachNavBarTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary,
        },
        selectedEachNavBarTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.white,
        },
        card: {
            backgroundColor: colors.white,
            paddingVertical: responsiveHeight(1.5),
            borderRadius: responsiveHeight(2),
            marginBottom: responsiveHeight(1),
            gap: responsiveHeight(1.5),
            shadowColor: colors.black,
            shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
            shadowOpacity: responsiveHeight(0.3),
            shadowRadius: responsiveHeight(3),
            elevation: responsiveHeight(0.4),
            marginHorizontal: responsiveHeight(.5),
            marginTop: responsiveHeight(.5),
            alignItems: 'center'
        },
        cardTitle:
        {
            fontSize: responsiveHeight(1.8),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        date: {
            color: colors.highlight
        },
        tripListCount: {
            flexDirection: 'row',
            gap: responsiveHeight(1.5),
            flexWrap: "wrap"
        },
        eachTripList:
        {
            padding: responsiveHeight(1),
            borderRadius: responsiveHeight(1),
            alignItems: "center",
            justifyContent: 'center',
            backgroundColor: colors.whiteSmoke
        },
        eachTripListTitle: {
            fontSize: responsiveHeight(1.6),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        priceTitle:
        {
            fontSize: responsiveHeight(1.8),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        price: {
            color: colors.secondary
        },
        DetailsBtn: {
            borderWidth: 1,
            paddingHorizontal: responsiveHeight(1.5),
            borderRadius: responsiveHeight(1.6),
            backgroundColor: colors.primary,
            alignItems: 'center',
            paddingVertical: responsiveHeight(1),
        },
        headers: {
            alignItems: 'center',
            gap: responsiveHeight(.5)
        },
        statusTitle: {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.textInput,
            color: colors.primary
        },
        statusContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: responsiveHeight(1.5),
            paddingVertical: responsiveHeight(.3),
            borderRadius: responsiveHeight(1),
        },
        title: {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        hotelCard: {
            paddingVertical: responsiveHeight(2.5),
            paddingHorizontal: responsiveWidth(3),
            shadowColor: colors.black,
            shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
            shadowOpacity: responsiveHeight(0.3),
            shadowRadius: responsiveHeight(3),
            elevation: responsiveHeight(0.4),
            backgroundColor: colors.white,
            borderRadius: responsiveHeight(1.5),
            marginHorizontal: responsiveWidth(1),
            marginBottom: responsiveHeight(1.5)
        },
        totalPrice: {
            fontSize: responsiveHeight(2),
            color: colors.secondary,
            fontFamily: fonts.primary
        },
        NodatamsgTitleContainer:
        {
            alignItems: 'center',
            justifyContent: 'center',
        },
        NodatamsgTitle:
        {
            fontSize: responsiveHeight(2),
            color: colors.primary,
            fontFamily: fonts.primary
        },
        back:{
            alignSelf:'flex-start',
           marginLeft:responsiveWidth(-3)
          }

    }
)