import { StyleSheet } from "react-native"
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../utils/responsiveScale"
import { colors, fonts } from "../../config/theme"
export const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    scrollContainer: {
        flexGrow: 1,
      },
    mainContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: responsiveHeight(4.5),
        fontFamily: fonts.textFont,
        color: colors.primary,
        marginBottom: responsiveHeight(4)
    },
    inputContainer: {
        paddingHorizontal: responsiveWidth(10),
        rowGap: responsiveHeight(5)
    },
    forgotPassword: {
        textAlign: "right",
        paddingRight: responsiveWidth(10),
        marginTop: responsiveHeight(2.5),
        fontSize:responsiveFontSize(1.9),
        fontFamily:fonts.textInput,
        color:colors.black
    },
    btnContainer: {
        marginHorizontal: responsiveWidth(18),
        marginTop: responsiveHeight(2)
    },
    iconContainer1: {
        height: responsiveWidth(13),
        width: responsiveWidth(13),
        borderRadius: responsiveHeight(8),
        backgroundColor: colors.facebook,
        alignItems: "center",
        justifyContent: 'center'
    },
    iconContainer2: {
        height: responsiveWidth(13),
        width: responsiveWidth(13),
        borderRadius: responsiveHeight(8),
        backgroundColor: colors.google,
        alignItems: "center",
        justifyContent: 'center'
    },
    loginIconsMainContainer: {
        flexDirection: 'row',
        columnGap: responsiveHeight(2)
    },
    loginMethodsContainer: {
        alignItems: 'center',
        marginTop: responsiveHeight(2),
        rowGap: responsiveHeight(3)
    },
    loginmethodsTitle: {
        fontSize:responsiveFontSize(2.6),
        fontFamily:fonts.textInput,
        color:colors.black
    },
    loginPageSwitch:{
        fontSize:responsiveFontSize(1.9),
        fontFamily:fonts.textInput,
        color:colors.black
    },
    loginPageSwitchContainer:{
        flexDirection:'row',
        columnGap:responsiveWidth(1)
    },
    signupText:{
        textDecorationLine:"underline",
        color:colors.facebook
    },
    loaderContainer:{
        position:"absolute",
        height:"100%",
        width:"100%",
        alignItems:"center",
        justifyContent:'center'
    }
})