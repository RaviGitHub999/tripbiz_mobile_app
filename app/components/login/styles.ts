import { StyleSheet } from "react-native"
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../utils/responsiveScale"
import { colors, fonts } from "../../config/theme"
export const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1, 
        justifyContent: 'center', 
        paddingVertical: responsiveHeight(5), 
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    title: {
        textAlign: 'center',
        fontSize: responsiveHeight(4.5),
        fontFamily: fonts.primary,
        color: colors.primary,
        marginBottom: responsiveHeight(4)
    },
    inputContainer: {
        paddingHorizontal: responsiveWidth(10),
        rowGap: responsiveHeight(2),
        width:'100%'
    },
    forgotPassword: {
        fontSize:responsiveFontSize(1.7),
        fontFamily:fonts.textInput,
        color:colors.black,
        alignSelf:'flex-end'
    },
    btnContainer: {
        marginTop: responsiveHeight(3),
        width:"50%"
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
    },
    errorMsgContainer:{
        gap:responsiveHeight(1)
    },
    errorMsg:{
color:colors.red,
fontFamily:fonts.primary,
fontSize:responsiveHeight(1.6)
    }
})