import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";
export const styles = StyleSheet.create({
    mainContainer: {
        rowGap: responsiveHeight(.5),
    },
    textInputContainer: {
        borderBottomWidth: responsiveHeight(.18),
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(2),
        columnGap: responsiveWidth(1),
        borderBottomColor: colors.primary
    },
    textInputBox: {
        // width: "100%",
        fontSize: responsiveFontSize(2.3),
        fontFamily: fonts.textInput,
        flex:1
    },
    title: {
        fontSize: responsiveFontSize(2.3),
        fontFamily: fonts.textFont,
        color:colors.primary
    }
})