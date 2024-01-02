import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles = StyleSheet.create({
    mainConatiner: {
        flex: 1,
    },
    subContainer: {
        flex:1,
    },
    btnsContainer: {
        marginRight:responsiveWidth(5),
        borderWidth:1,
        paddingHorizontal:responsiveWidth(4),
        paddingVertical:responsiveHeight(1),
        borderRadius:responsiveHeight(3)
    },
    active:{
backgroundColor:colors.primary
    },
    activeText:{
        color:colors.white
    },
    btnContainer:{
     marginTop:responsiveHeight(3),
    },
    btnTitle:{
        fontSize:responsiveFontSize(2.1),
        fontFamily:fonts.primary,
        color:colors.lightGray
    },
    fieldsContainer:{
        marginTop:responsiveHeight(2.8),
        gap:responsiveHeight(3)
    },
    airportOriginDataContainer:{
        borderWidth:1,
        height:responsiveHeight(30),
        borderRadius:responsiveHeight(1.5),
        backgroundColor:colors.white
    },
    renderItemsContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:responsiveWidth(2.5),
        marginTop:responsiveHeight(1.5)
    },
    airportName:{
        fontSize:responsiveFontSize(1.6)
    },
    searchFlightsBtnConatainer:{
        marginBottom:responsiveHeight(5)
    }
})