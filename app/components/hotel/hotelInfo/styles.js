import { StyleSheet } from "react-native";
import { colors, fonts } from "../../../config/theme";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";


export const styles = StyleSheet.create(
    {
        mainContainer: {
            flex: 1,
            backgroundColor: colors.white,
            borderWidth: 2,
            borderColor: 'green',
            paddingHorizontal: responsiveWidth(4),
            rowGap:responsiveHeight(1.5)
        },
        progessBarContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        backIconContainer: {
            marginTop: responsiveHeight(1),
            backgroundColor:colors.white
        },
        hotelImg: {
            width: responsiveHeight(13),
            height: responsiveHeight(12),
            borderRadius: responsiveHeight(2)
        },
        hotelImgMainContainer:
        {
            flexDirection: "row",
            marginTop:responsiveHeight(2)
        },
        hotelImgContainer: {
            width: "30%",
        },
        hotelDescriptions: {
            width: "70%",
            rowGap: responsiveHeight(1),
            
        },
        hotelName: {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        hotelPrice: {
            color: colors.secondary,
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary
        },
        addressTitle:{
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        address:{
            color: colors.gray,
            fontSize: responsiveHeight(1.6),
            fontFamily: fonts.primary  
        }
    }
)