import { StyleSheet } from "react-native";
import { colors, fonts } from "../../../config/theme";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
export const styles = StyleSheet.create({
    mainConatiner:{
        flex:1
    },
    card: {
        borderRadius: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(1),
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
        padding: responsiveHeight(1.5),
        paddingBottom:responsiveHeight(3),
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
    },
    flightLogoContainer: {
        height: responsiveHeight(4),
        width: responsiveHeight(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    flightLogo: {
        height: responsiveHeight(7),
        width: responsiveWidth(7),
    },
    airlineName: {
        fontSize: responsiveFontSize(2),
        fontFamily: fonts.primary,
        color: colors.black,
    },
    flightNumbers: {
        fontSize: responsiveFontSize(1.4),
        fontFamily: fonts.primary,
        color: colors.lightGray,
        // borderWidth:1,
        // paddingHorizontal:10
    },
    flightsTimingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius:responsiveHeight(1)
    },
    originContainer: {
        rowGap: responsiveHeight(0.5),
        width: '25%',
    },
    originTitle: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: fonts.primary,
        color: colors.black,
    },
    flightTimings: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: fonts.textFont,
        color: colors.black,
    },
    directionContainer: {
        width: '50%',
        // rowGap: responsiveHeight(1),
    },
    stopsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // columnGap: responsiveWidth(2),
    },
    stopsBtnText: {
        color: colors.highlight,
        fontFamily:fonts.primary,
        fontSize:responsiveHeight(1.6)
    },
    flighttotalTime: {
        fontSize: responsiveFontSize(1.8),
        textAlign: 'center',
        fontFamily: fonts.textFont,
        color: colors.black,
        letterSpacing: responsiveHeight(0.5),
    },
    destinationContainer: {
        alignItems: 'flex-end',
        rowGap: responsiveHeight(0.5),
        width: '25%',
    },
    destinationTitle: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: fonts.primary,
        color: colors.black,
    },
    bookingFlightCityNameAirportName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: responsiveHeight(2),
        flexWrap: 'wrap',
    },
    mainContainer: {
        // paddingHorizontal: responsiveWidth(3.5),
        // paddingVertical: responsiveHeight(3),
        backgroundColor: colors.white,
        borderRadius: responsiveHeight(2),
        // rowGap: responsiveHeight(2.5),
        // elevation: responsiveHeight(0.8),
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
        // marginHorizontal: responsiveWidth(3.5),
        // marginTop: responsiveHeight(2.5),
    },
    flightPriceMainContainer:
    {
        borderTopWidth: responsiveHeight(0.1),
        borderBottomWidth: responsiveHeight(0.1),
        borderStyle: "dotted",
        marginTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        gap: responsiveHeight(1.8)
    },
    addedFlightTimeAndDateContainer:
    {
        paddingTop: responsiveHeight(0.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addedFlightTitleContainer:
    {
        width: "90%"
    },
    CancellationAndDateChangeTitle: {
        fontSize: responsiveHeight(2.4),
        color: colors.primary,
        fontFamily: fonts.primary
    },
    CancellationAndDateChangesubTitle:
    {
        fontSize: responsiveHeight(2),
        color: colors.primary,
        fontFamily: fonts.primary
    },
    CancellationAndDateChangeCon: {
        backgroundColor: colors.whiteSmoke,
        borderRadius: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(1.5),
        marginTop: responsiveHeight(2)
    },
    cancel:
    {
        gap: responsiveHeight(1.5)
    },
    cancellationContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(0.6),
        flexWrap:'wrap'
    },
    dashedLine: {
        borderTopWidth: responsiveHeight(0.1),
        marginVertical: responsiveHeight(1.5),
        borderStyle: 'dashed'
    },
    flightBookingTravellerDetailsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1)
    },
    flightBookingTravellerDetailsTitle:
    {
        fontSize: responsiveHeight(1.5),
        color: colors.lightGray,
        fontFamily: fonts.primary
    },
    bookingStatusTitles:
    {
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.textInput,
        color: colors.lightGray
    },
    bookingStatusTitlesMainContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        //  marginTop:responsiveHeight(1.2)
    },
    bookingStatusTextContainer: {
        paddingHorizontal: responsiveWidth(2),
        alignItems: 'center',
        borderRadius: responsiveHeight(1),
        paddingVertical: responsiveHeight(0.3),
        justifyContent: 'center'

    },
    bookingStatusText: {
        color: colors.white,
        fontSize: responsiveHeight(1.3),
        fontFamily: fonts.primary
    },
    hotelTotalPriceContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
        alignItems: 'center',
        gap: responsiveHeight(1)
    },
    hotelTotalPrice: {
        fontSize: responsiveHeight(2.2),
        fontFamily: fonts.textFont,
        color: colors.secondary
    },
    addedHotelTimeAndDate: {
        color: colors.primary,
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.primary
    },
    hotelDeleteMsg: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textInput,
        color: colors.primary
    },
    hotelDeletingBtnsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1.8),
        paddingHorizontal: responsiveWidth(6)
    },
    hotelDeleteBtn:
    {
        borderWidth: 1,
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(0.8),
        borderRadius: responsiveHeight(1),
        backgroundColor: colors.primary
    },
    hotelDeleteBtnTitle:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textInput,
        color: colors.white
    },
    flightDirectionMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flightDirectionContainer: {
        flexDirection: "row",
        alignItems: 'center',
        gap: responsiveHeight(1)
    },
    flightPriceAndChargesContainer:
    {
        width: responsiveWidth(80),
        gap: responsiveHeight(1.2)
    },
    airportName: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textFont,
        color: colors.lightGray
    },
    flightCharges: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textFont,
        color: colors.lightGray
    },
    flightChargesPrice: {
        fontSize: responsiveHeight(2.2),
        fontFamily: fonts.primary,
        color: colors.highlight
    },
    flightPrice: {
        fontSize: responsiveHeight(2.2),
        fontFamily: fonts.primary,
        color: colors.highlight
    },
    horizontalLine: {
        borderTopWidth: responsiveHeight(0.13),
        borderStyle: 'dashed',
        borderColor: colors.gray
    },
    flightPriceContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2.8)
    },
    totalFareTitle: {
        fontSize: responsiveHeight(2.5),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    totalFare: {
        fontSize: responsiveHeight(2.5),
        fontFamily: fonts.primary,
        color: colors.secondary
    },
    serviceCharges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    notfoundFareRuleContainer:
    {
        alignItems: 'center',
        justifyContent: 'center'
    },
    notfoundFareRuleTitle:
    {
        fontSize: responsiveHeight(1.8),
        color: colors.primary,
        fontFamily: fonts.textFont
    },
    baggageTitle:
    {
        fontFamily: fonts.primary,
        color: colors.primary,
        fontSize: responsiveHeight(2)
    },
    BaggageDetails:
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(1)
    },
    BaggageDetailsMainContainer:
    {
        marginVertical: responsiveHeight(1),
        gap: responsiveHeight(0.8)
    },
    baggageTitles:
    {
        fontFamily: fonts.textInput,
        color: colors.primary,
        fontSize: responsiveHeight(2)
    },
    baggageTitlesHighlight: {
        color: colors.highlight,
    },
    selectedSeatContainer:
    {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center",
        justifyContent: 'center'
    },
    selectedSeatData: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textInput,
        color: colors.primary
    },
    renderingMainContainer:{
        rowGap: responsiveHeight(1.2) ,
        marginTop:responsiveHeight(1)
    },
    headerContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between' ,
    
    },
    flightDetailsContainer:
    {
        flexDirection: 'row',
         alignItems: 'center', 
         width: "70%", 
         flexWrap: "wrap" ,
    },
    depTimeDateContainer:{
        backgroundColor: colors.highlight, 
        padding: responsiveHeight(1), 
        borderTopLeftRadius: responsiveHeight(2), 
        borderBottomLeftRadius: responsiveHeight(2), 
        marginRight: responsiveHeight(-1.5), 
        width: "25%"
    },
    depTimeDate:{
        fontSize: responsiveHeight(1.8), 
        fontFamily: fonts.primary, 
        color: colors.primary   
    },
    originDetailsContainer:{
        width: "50%", 
        gap: responsiveHeight(0.3)  
    },
    destDetailsContainer:{
        width: '50%', 
        alignItems: 'flex-end', 
        gap: responsiveHeight(0.3) 
    },
    originCityName:{
        fontFamily: fonts.primary, 
        color: colors.lightGray, 
        fontSize: responsiveHeight(1.5)
    },
    originAirportName:{
        fontFamily: fonts.primary, 
        color: "#969696", 
        fontSize: responsiveHeight(1.5),
        textAlign:"left"
    },
    destCityName:{
        fontFamily: fonts.primary, 
        color: colors.lightGray, 
        fontSize: responsiveHeight(1.5),
        
    },
    destAirportName:
    {
        fontFamily: fonts.primary, 
        color: "#969696", fontSize: 
        responsiveHeight(1.5) ,
        textAlign:"right"
    },
    flightExpensesContainer:
    {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: responsiveHeight(3), 
        alignItems: 'center' 
    },
    subTitles:{
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.textFont,
        color:colors.primary
    },
    recheckPriceMainContainer:{
        alignItems:'center',
        marginTop:responsiveHeight(2),
        gap:responsiveHeight(1)
    },
    recheckPriceTitle: {
        fontSize: responsiveHeight(2.8),
        color: colors.primary,
        fontFamily: fonts.primary
    },
    flightDetails:
    {
        flexDirection:"row",
        alignItems:"center",
        alignSelf:'center',
        // paddingHorizontal:responsiveHeight(5),
        flexWrap:'wrap'
    },
    recheckPriceTitles:
    {
        fontSize: responsiveHeight(1.8),
        color: colors.primary,
        fontFamily: fonts.primary
    },
    recheckPriceSubTitles:
    {
        fontSize: responsiveHeight(1.8),
        color: colors.primary,
        fontFamily: fonts.textInput
    },
    recheckPrices:{
        fontSize: responsiveHeight(1.8),
        color: colors.secondary,
        fontFamily: fonts.primary   
    },
    recheckRatesContainer:{
        gap:responsiveHeight(.5)
    },
    recheckBtnContainers:
    {
flexDirection:'row',
justifyContent:'space-evenly',
width:'100%',
marginVertical:responsiveHeight(2),
alignItems:'center'

    },
    btn:{
        paddingHorizontal:responsiveWidth(3),
        paddingVertical:responsiveHeight(1.2),
        borderRadius:responsiveHeight(1),
        backgroundColor:colors.primary,
        alignItems:'center'
    },
    btnTitle:{
        fontSize: responsiveHeight(1.8),
        color: colors.white,
        fontFamily: fonts.primary   
    },
    exceedDateContainer:
    {
        marginTop:responsiveHeight(2),
        gap:responsiveHeight(1.6)
    },
    progressBarContainer:
    {
        marginVertical:responsiveHeight(2),
        gap:responsiveHeight(2)
    },
    progressBarTitle: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.secondry,
        color: colors.primary,
        textAlign:'center'
    },
    voucherContainer:
      {
        flexDirection:"row",
        alignItems:"center",
        gap:responsiveHeight(1),
        borderWidth:responsiveFontSize(0.18),
        alignSelf:'flex-start',
        padding:responsiveWidth(2),
        borderColor:colors.primary,
        borderRadius:responsiveHeight(1)
      },
      voucherTitle:
      {
        fontSize:responsiveHeight(1.8),
        fontFamily:fonts.secondry,
        textAlign:'center',
        color:colors.primary
      },
      titles: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.primary,

          },
    oldprices:
    {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.gray,
        textDecorationLine: 'line-through',
    },
    newPrice: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.gray,
    },
    timeStampsContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:responsiveWidth(2),
    },
    timeStampsTitles:
    {
        fontSize: responsiveHeight(1.6),
        fontFamily: fonts.primary,
        color: colors.primary,
        flex:1
    }

})