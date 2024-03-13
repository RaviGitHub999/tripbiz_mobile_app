import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        borderWidth: 3,
        borderColor: "green",
      paddingTop: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2)
    },
    backNavigationContainer: {
        width: "8%",
    },
    subContainer:{
        borderWidth:2,
        borderColor:"red",
        paddingHorizontal:responsiveWidth(2.5)
    },
    tripDetailsHeader:
    {
marginTop:responsiveHeight(1.2),
gap:responsiveHeight(0.5)
    },
    tripName:{
        fontSize:responsiveHeight(2.3),
         fontFamily:fonts.primary,
         color:colors.primary
    },
    tripDateTitle:{
        fontSize:responsiveHeight(1.7),
        color:colors.primary,
        fontWeight:'500'
    },
    tripDate:{
        color:colors.highlight
    },
    hotelCard:{
        borderWidth:2,
        borderColor:"gold",
        flexDirection:'row',
        flexWrap:"wrap",
        // gap:responsiveHeight(1),
        paddingVertical:responsiveHeight(1.5),
        paddingHorizontal:responsiveWidth(3)
    },
    hotelImgContainer:{
        width:"35%",
    },
    hotelImg:{
        height:responsiveHeight(13),
    },
    hotelDescriptionContainer:{
        flexDirection:'row',
        // width:'65%',
        borderWidth:2,
        // // gap:responsiveHeight(1),
        // borderWidth:1,
        // flexWrap:'wrap'
    },
    hotelTitle:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.primary,
        color:colors.primary,
       
    },
    hotelBookedDataContainer:{
        // flexDirection:"row",
        // width:'100%',
        // flexWrap:'wrap',
        // // gap:responsiveWidth(2)
        // justifyContent:"space-between"
        
    },
    hotelBookedDateContainer:{
        // width:"60%",
        
    },
    hotelBookedDate:{
        width:"40%",
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.textFont,
        color:colors.primary
    },
    hotelNights:{
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.textFont,
        color:colors.primary ,
    },
    hotelTitleContainer:{
        // width:"65%",
        borderWidth:1
    },
    hotelBookedDateContainer:{
        backgroundColor:colors.highlight,
        padding:responsiveHeight(0.3),
        borderTopLeftRadius:responsiveHeight(2),
        borderBottomLeftRadius:responsiveHeight(2),
        
        
       
    }
})