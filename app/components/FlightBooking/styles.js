import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../utils/responsiveScale";
import { colors, fonts } from "../../config/theme";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:responsiveWidth(4)
    },
    backBtnContainer: {
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(1.3)
    },
    bookingFlightCabinAndCheckInContainer: {
        marginTop: responsiveHeight(1.5)
    },
    bookingFlightCabinAndCheckInSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: responsiveWidth(2),
    },
    baggageAndMealsContainer: {
        marginTop: responsiveHeight(3),
        paddingHorizontal: responsiveWidth(3)
    },
    baggageDetailsContainer: {
        backgroundColor: colors.whiteSmoke,
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(1.5),
        borderRadius: responsiveHeight(1.5),
        paddingBottom: responsiveHeight(3)
    },
    horizontalLine: {
        borderTopWidth: responsiveHeight(0.2),
        borderStyle: 'dashed',
        marginVertical: responsiveHeight(2)
    },
    baggageAndMealsTitle: {
        fontSize: responsiveHeight(2.6),
        marginBottom: responsiveHeight(1.5),
        color: colors.black
    },
    baggageDetailsText: {
        fontSize: responsiveHeight(2.2),
        color: colors.black
    },
    flightextrabagAndMealTitle: {
        fontSize: responsiveHeight(2.2),
        color: colors.black
    },
    flightextrabagAndMealContainer: {
        rowGap: responsiveHeight(1.3),
    },
    selectingBtn: {
        borderWidth: 1
    },
    flightBaggageText: {
        fontSize: responsiveHeight(1.8),
        color: colors.black
    },
    flightBaggageDataText: {
        color: colors.highlight
    },
    scrollViewContainer: {
        // paddingBottom:responsiveHeight(10),
        // marginBottom:responsiveHeight(100)
    },
    cancellationAndDateChangeMainContainer: {
        marginTop: responsiveHeight(3),
        paddingHorizontal: responsiveWidth(3),
    },
    cancellationAndDateChangeTitle: {
        fontSize: responsiveHeight(2.6),
        marginBottom: responsiveHeight(1.5),
        color: colors.black,
    },
    cancellationAndDateChangeDetailsContainer: {
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(1.5),
        borderRadius: responsiveHeight(1.5),
        paddingBottom: responsiveHeight(3),
        backgroundColor: colors.whiteSmoke
    },
    totalFareContainer: {
        backgroundColor:colors.white,
        elevation:5,
        marginTop:responsiveHeight(0.6)
    },
    totalFareToggleIconContainer: {
        alignSelf: 'center',
    },
    totalFareFlightDetailsMainContainer:{
        // borderBottomWidth: responsiveHeight(0.1),
         justifyContent: 'space-between',
          marginHorizontal: responsiveWidth(3),
           gap: responsiveHeight(1),
           paddingBottom:responsiveHeight(2),
           marginTop:responsiveHeight(1)
    },
    flightDepAndArrMainContainer:
    {
        flexDirection: 'row',
         justifyContent: 'space-between'
    },
    flightDepAndArrSubContainer:{
        rowGap: responsiveHeight(0.8)
    },
    totalFareFlightEachChargeDetails:{
        flexDirection: 'row',
         justifyContent: 'space-between'
    },
    totalFareFlightDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(3.5),
        alignItems: 'center',
        paddingVertical:responsiveHeight(1),
    },
    flighttotalFareText: {
        fontSize: responsiveHeight(2.3),
        color: colors.black,
        fontFamily: fonts.primary
    },
    flightPrice: {
        fontSize: responsiveHeight(2.3),
        color: colors.secondary,
        fontFamily: fonts.primary
    },
    submitTripBtn: {
        borderWidth: 1,
        padding: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        borderRadius: responsiveHeight(1.3),
        backgroundColor: colors.black
    },
    submitTripBtnText: {
        color: colors.white,
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary
    },
    flightDepAndArrContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "35%",
    },
    flightDepAndArrText: {
        fontSize: responsiveHeight(2.3),
        color: colors.secondary,
        fontFamily: fonts.primary
    },
    cancellationAndDateChangeDetailsEachContainer: {
        flexDirection: "row",
        alignItems: 'center',
        columnGap: responsiveWidth(2)
    },
    cancellationAndDateChangeDetailsEachContainerText: {
        fontSize: responsiveHeight(1.8),
        color: colors.lightGray,
        fontFamily: fonts.textFont
    },
    flightResultsNavMainContainer: {
        flexDirection: "row",
        // alignSelf: 'center',
        paddingHorizontal: responsiveWidth(5),
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
    seatSelectionBtnContainer: {
        backgroundColor: colors.whiteSmoke,
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(3),
        marginHorizontal: responsiveHeight(1.8),
        marginTop: responsiveHeight(2),
        borderRadius: responsiveHeight(1.5),
        rowGap: responsiveHeight(1)
    },
    seatSelectionBtn: {
        backgroundColor: colors.black,
        width: responsiveWidth(20),
        height: responsiveHeight(3.5),
        borderRadius: responsiveHeight(1.5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    seatSelectionBtnTitle: {
        fontSize: responsiveHeight(1.3),
        color: colors.white,
        fontFamily: fonts.primary
    },
    selectedSeatContainer: {
        backgroundColor: colors.whiteSmoke,
        marginHorizontal: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(2),
        rowGap: responsiveHeight(0.5),
        paddingVertical: responsiveHeight(0.8),
        borderRadius: responsiveHeight(1.5)
    },
    selectedSeatTitle: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textFont,
        color: colors.primary,
    },
    seatCode: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.highlight,
    },
    flightSeatsDataCard: {
        borderRadius: responsiveHeight(2),
        backgroundColor: 'white',
        marginVertical: responsiveHeight(10),
        width: "100%"
    },
    selectedSeat: {
        fontSize: responsiveHeight(2.6),
        // fontFamily:fonts.primary,
        color: colors.black,
    },
    flightBookSelectSeatsSegNav: {
        flexDirection: 'row',
        marginHorizontal: responsiveWidth(2),
        columnGap: responsiveWidth(2),
        padding: responsiveHeight(1)
    },
    flightBookSelectSeatsSegNavItem:
    {
        borderWidth: 1,
        paddingHorizontal: responsiveHeight(1),
        paddingVertical: responsiveHeight(0.5),
        borderRadius: responsiveHeight(1.8)
    },
    flightBookSelectSeatsSegNavItemText:
    {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.primary,
    },
    flightBookSelectSeatsSegNavSelectedItem: {
        backgroundColor: colors.primary
    },
    flightBookSelectSeatsSegNavItemSelectedText: {
        color: colors.white
    },
    ExcessBagChargesTitle: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.gray
    },
    ExcessBagCharges: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.highlight
    },
    modalMainContainer: {
        flex: 1
    },
    modalOpacityLayer: {
        height: "100%",
        width: "100%",
        backgroundColor: colors.black,
        position: "absolute",
        opacity: 0.5,
    },
    modelSubContainer1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(3), 
    },
    modelSubContainer2: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2.5),
        borderRadius: responsiveHeight(1.2),

    },
    modalIcon: {
        alignItems: 'flex-end'
    },
    tripsContainer: {
        // borderWidth: 1,
        alignItems: 'center',
    },
    createNewTripBtn: {
        borderWidth: responsiveHeight(0.2),
        flexDirection: 'row',
        gap: responsiveHeight(1),
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(8),
        paddingVertical: responsiveHeight(1),
        borderStyle: 'dashed',
        backgroundColor: "#edf8f4",
        borderRadius: responsiveHeight(0.8),
        width:'90%',
        justifyContent:'center'
    },
    createNewTripBtnTitle: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    triptitles: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.primary,
        textAlign: 'center'
    },
    tripCard: {
        marginVertical: responsiveHeight(0.5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(2),
        borderRadius: responsiveHeight(1.5),
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
        width: "100%"
    },
    tripTitle: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    tripDate: {
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.textFont,
        color: colors.highlight
    },
    addingNewTripContainer:{
        gap:responsiveHeight(1.5)
    },
    addingNewTripSubContainer:{
        gap:responsiveHeight(1)
    },
    addingNewTripBtn:{
        borderWidth: 1,
        padding: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical:responsiveHeight(1.5),
        borderRadius: responsiveHeight(1.3),
        backgroundColor: colors.black,
        alignItems:'center',
        alignSelf:'center',
        width:"60%"
    },
    addingNewTripBtnText:{
        color: colors.white,
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary
    },
    multiTextContainer:{
        borderWidth: 1, 
        textAlignVertical: "top", 
        borderRadius: responsiveHeight(1.3),
        paddingHorizontal:responsiveWidth(3),
        fontSize:responsiveHeight(2.3)
    },
    newtriptitle:{
        fontSize: responsiveHeight(2.5),
        fontFamily: fonts.primary,
        color: colors.primary,
        // textAlign: 'center'
    },
    fareRuleBtn:{
        marginTop: responsiveHeight(2),
        marginHorizontal: responsiveHeight(1.8),
    },
    fareRule:{
        fontSize:responsiveHeight(2),
        fontFamily:fonts.primary,
        color:colors.facebook,
        textDecorationLine:'underline',
    },
    noteCon:{
        marginTop: responsiveHeight(2),
        marginHorizontal: responsiveHeight(1.8),
        padding:responsiveHeight(1.2),
        borderRadius:responsiveHeight(1.5),
        backgroundColor:'#ffe3d5'
    },
    imp:{
        fontSize: responsiveHeight(1.6),
        fontFamily: fonts.primary,
        color: colors.primary,  
    },
    note:{
        fontSize: responsiveHeight(1.3),
        fontFamily: fonts.textFont,
        color: colors.lightGray,
        lineHeight:responsiveHeight(2)
    },
    yesBtn:{
        borderRadius:responsiveHeight(1),
        paddingHorizontal:responsiveHeight(1),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colors.primary,
        paddingVertical:responsiveHeight(0.5)
    },
    yesBtnText:{
        fontSize:responsiveHeight(1.6),
        fontFamily:fonts.textFont,
        color:colors.white
    }
})