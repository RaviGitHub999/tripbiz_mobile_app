import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles=StyleSheet.create({
    mainContainer:{
       flex:1,
       borderWidth:2,
       alignItems:'center',
       justifyContent:'center'
    },
    backBtnContainer:{
        justifyContent:'center',
        paddingHorizontal:responsiveWidth(4),
        paddingVertical:responsiveHeight(1.3)
    },
    bookingFlightCabinAndCheckInContainer:{
marginTop:responsiveHeight(1.5)
    },
    bookingFlightCabinAndCheckInSubContainer:{
        flexDirection:'row',
        alignItems:'center',
        columnGap:responsiveWidth(2),
    },
    baggageAndMealsContainer:{
        marginTop:responsiveHeight(3),
        paddingHorizontal:responsiveWidth(3)
    },
    baggageDetailsContainer:{
        borderWidth:1,
        paddingHorizontal:responsiveWidth(4),
        paddingTop:responsiveHeight(1.5),
        borderRadius:responsiveHeight(1.5),
        paddingBottom:responsiveHeight(3)
    },
    horizontalLine:{
        borderTopWidth:1,
        borderStyle:'dashed',
        marginVertical:responsiveHeight(2)
    },
    baggageAndMealsTitle:{
        fontSize:responsiveHeight(2.6),
        marginBottom:responsiveHeight(1.5),
        color:colors.black
    },
    baggageDetailsText:{
        fontSize:responsiveHeight(2.2),
        color:colors.black
    },
    flightextrabagAndMealTitle:{
        fontSize:responsiveHeight(2.2),
        color:colors.black
    },
    flightextrabagAndMealContainer:{
        rowGap:responsiveHeight(1.3),
    },
    selectingBtn:{
        borderWidth:1
    },
    flightBaggageText:{
        fontSize:responsiveHeight(1.8),
        color:colors.black
    },
    flightBaggageDataText:{
        color:colors.highlight
    },
    scrollViewContainer:{
// paddingBottom:responsiveHeight(10),
// marginBottom:responsiveHeight(100)
    },
    cancellationAndDateChangeMainContainer:{
        marginTop:responsiveHeight(3),
        paddingHorizontal:responsiveWidth(3),
    },
    cancellationAndDateChangeTitle:{
        fontSize:responsiveHeight(2.6),
        marginBottom:responsiveHeight(1.5),
        color:colors.black,
    },
    cancellationAndDateChangeDetailsContainer:{
        borderWidth:1,
        paddingHorizontal:responsiveWidth(4),
        paddingTop:responsiveHeight(1.5),
        borderRadius:responsiveHeight(1.5),
        paddingBottom:responsiveHeight(3)  
    },
    totalFareContainer:{
        flex:0.5/2 ,
        backgroundColor:colors.white
    },
    totalFareToggleIconContainer:{
        alignSelf:'center',
    },
    totalFareFlightDetailsContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:responsiveWidth(3.5),
        flex:1,
        alignItems:'center'
    },
    flighttotalFareText:{
        fontSize:responsiveHeight(2.3),
        color:colors.black,
        fontFamily:fonts.primary
    },
    flightPrice:{
        fontSize:responsiveHeight(2.3),
        color:colors.secondary,
        fontFamily:fonts.primary
    },
    submitTripBtn:{
        borderWidth:1,
        padding:responsiveHeight(1),
        paddingHorizontal:responsiveWidth(3),
        borderRadius:responsiveHeight(1.3),
        backgroundColor:colors.black
    },
    submitTripBtnText:{
color:colors.white,
fontSize:responsiveHeight(1.5),
fontFamily:fonts.primary
    },
    flightDepAndArrContainer:{
        flexDirection:"row",
        justifyContent:'space-between',
        width:"35%",
    },
    flightDepAndArrText:{
        fontSize:responsiveHeight(2.3),
        color:colors.secondary,
        fontFamily:fonts.primary
    },
    cancellationAndDateChangeDetailsEachContainer:{
        flexDirection:"row",
        alignItems:'center',
        columnGap:responsiveWidth(2)
    },
    cancellationAndDateChangeDetailsEachContainerText:{
        fontSize:responsiveHeight(1.8),
        color:colors.lightGray,
        fontFamily:fonts.textFont
    },
    flightResultsNavMainContainer: {
        flexDirection: "row",
        alignSelf: 'center',
        columnGap: responsiveHeight(2),
        marginTop: responsiveHeight(2)
      },
      flightResultsNavItem: {
        flexDirection: "row",
        columnGap: responsiveWidth(2),
        borderWidth: 1,
        paddingHorizontal: responsiveWidth(2.5),
        alignItems: 'center',
        paddingVertical: responsiveHeight(0.3),
        borderRadius: responsiveHeight(3)
      },
      flightResultsNavSelectedItem: {
        backgroundColor: colors.black
      },
      flightResultsNavItemText: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.black
      },
      flightResultsNavSelectedItemText: {
        color: colors.white
      },
})