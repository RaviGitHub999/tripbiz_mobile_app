import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles=StyleSheet.create({
    mainContainer:{
       flex:1,
       alignItems:'center',
       justifyContent:'center',
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
        backgroundColor:colors.whiteSmoke,
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
        paddingHorizontal:responsiveWidth(4),
        paddingTop:responsiveHeight(1.5),
        borderRadius:responsiveHeight(1.5),
        paddingBottom:responsiveHeight(3)  ,
       backgroundColor:colors.whiteSmoke
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
      seatSelectionBtnContainer:{
        backgroundColor:colors.whiteSmoke,
        paddingVertical:responsiveHeight(1.5),
        paddingHorizontal:responsiveWidth(3),
        marginHorizontal:responsiveHeight(1.8),
        marginTop:responsiveHeight(2),
        borderRadius:responsiveHeight(1.5),
        rowGap:responsiveHeight(1)
      },
      seatSelectionBtn:{
        backgroundColor:colors.black,
        width:responsiveWidth(20),
        height:responsiveHeight(3.5),
        borderRadius:responsiveHeight(1.5),
        alignItems:'center',
        justifyContent:'center'
      },
      seatSelectionBtnTitle:{
        fontSize:responsiveHeight(1.3),
        color:colors.white,
        fontFamily:fonts.primary
      },
      selectedSeatContainer:{
        backgroundColor:colors.whiteSmoke,
        marginHorizontal:responsiveWidth(2),
        paddingHorizontal:responsiveWidth(2),
        rowGap:responsiveHeight(0.5),
        paddingVertical:responsiveHeight(0.8),
        borderRadius:responsiveHeight(1.5)
      },
      selectedSeatTitle:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.textFont,
        color:colors.primary,
    },
    seatCode:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.primary,
        color:colors.highlight,
    },
    flightSeatsDataCard:{
        borderRadius:responsiveHeight(2), 
        backgroundColor: 'white', 
        marginVertical: responsiveHeight(10),
         width: "100%" 
    },
    selectedSeat:{
        fontSize:responsiveHeight(2.6),
        // fontFamily:fonts.primary,
        color:colors.black,
    },
    flightBookSelectSeatsSegNav:{
flexDirection:'row',
marginHorizontal:responsiveWidth(2),
columnGap:responsiveWidth(2),
padding:responsiveHeight(1)
    },
    flightBookSelectSeatsSegNavItem:
    {
borderWidth:1,
paddingHorizontal:responsiveHeight(1),
paddingVertical:responsiveHeight(0.5),
borderRadius:responsiveHeight(1.8)
    },
    flightBookSelectSeatsSegNavItemText:
    {
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.textFont,
        color:colors.primary,
    },
    flightBookSelectSeatsSegNavSelectedItem:{
backgroundColor:colors.primary
    },
    flightBookSelectSeatsSegNavItemSelectedText:{
color:colors.white
    }
})