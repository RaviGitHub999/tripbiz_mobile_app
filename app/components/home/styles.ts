import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        backgroundColor: colors.primary,
        paddingHorizontal:responsiveWidth(2),
        paddingTop:responsiveHeight(5),
        // flex: 1 / 2,
        height:responsiveHeight(40)
    },
    headerText: {
        color: 'white',
        fontSize:responsiveHeight(3.5),
        fontFamily:fonts.textInput,
    },
    nav: {
        height: responsiveHeight(6),
        backgroundColor: colors.white,
        borderRadius: responsiveHeight(2),
        overflow: 'hidden',
        marginTop:responsiveHeight(2)
    },
    navItem: {
        flex: 1,
        paddingHorizontal: responsiveWidth(5.5),
        justifyContent: 'center',
        overflow:'hidden'
    },
    active: {
        backgroundColor:colors.primaryLite,
        
    },
    section: {
        marginTop:responsiveHeight(3),
        flex:0.9,
        // paddingHorizontal: responsiveWidth(5),
        backgroundColor:colors.white,
        borderRadius:responsiveHeight(2),
    },
    categoryName: {
        fontSize: responsiveFontSize(2),
        textTransform: "capitalize",
        fontFamily: fonts.primary,
        color: colors.white
    },
    headersContainer: {
        position: 'absolute',
        height: "100%",
        width: '100%',
        marginTop: "6%",
        // alignItems:'center',
        // justifyContent:'center',
        paddingHorizontal: "2%"
    },
    categoriesContainer:{
        flexDirection: 'row' ,
        alignItems:'center',
        gap:responsiveWidth(3)  
    },
    appLogo:{
        height:responsiveHeight(5),
        width:responsiveHeight(15)
    }
});
