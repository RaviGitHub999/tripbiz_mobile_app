import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";
export const styles = StyleSheet.create({
    mainContainer: {
        rowGap: responsiveHeight(1.5),
    },
    textInputContainer: {
        borderBottomWidth: responsiveHeight(.3),
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(2),
        columnGap: responsiveWidth(1),
        borderBottomColor: colors.primary
    },
    textInputBox: {
        width: "100%",
        fontSize: responsiveFontSize(2.3),
        fontFamily: fonts.textInput
    },
    title: {
        fontSize: responsiveFontSize(2.3),
        fontFamily: fonts.textFont
    }
})