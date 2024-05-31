import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: colors.white
    },
    backNavigationContainer: {
        width: "8%",
    },
    subContainer: {
        paddingHorizontal: responsiveWidth(2.5),
    },
    hotelCardTitle:
    {
        marginTop: responsiveHeight(1.3),
        fontSize: responsiveHeight(2.1),
        fontFamily: fonts.primary,
        color: colors.primary,
        marginBottom: responsiveHeight(1.3)
    },
    tripDetailsHeader:
    {
        marginTop: responsiveHeight(1.2),
        gap: responsiveHeight(0.5)
    },
    tripName: {
        fontSize: responsiveHeight(2.3),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    tripDateTitle: {
        fontSize: responsiveHeight(1.7),
        color: colors.primary,
        fontWeight: '500'
    },
    tripDate: {
        color: colors.highlight
    },
    hotelCard: {
        paddingVertical: responsiveHeight(2.5),
        paddingHorizontal: responsiveWidth(3),
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
        borderRadius: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(1),
        marginBottom: responsiveHeight(1.5)
    },
    hotelImgContainer: {
        width: "35%",
    },
    hotelImg: {
        height: responsiveHeight(13),
    },
    hotelTitle: {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.primary,
        color: colors.primary,

    },
    hotelBookedDate: {
        fontSize: responsiveHeight(1.7),
        fontWeight: "600",
        color: colors.primary
    },
    hotelNights: {
        fontSize: responsiveHeight(1.6),
        fontFamily: fonts.textFont,
        color: colors.primary,
    },
    hotelRatingContainer: {
        flexDirection: 'row'
    },
    familyDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: responsiveHeight(1),
        alignItems: 'center'

    },
    familyDetailsTitle:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textFont
    },
    hotelDetailsContainer: {
        flexDirection: 'row'
    },
    hotelRoomFeatures:
    {
        backgroundColor: colors.whiteSmoke,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.8),
        borderRadius: responsiveHeight(1.3),
        gap: responsiveHeight(1),
        marginTop: responsiveHeight(2)
    },
    hotelRoomFeaturesContainer1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    hotelRoomFeaturesContainer2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mealsDeatils: {
        flexDirection: "row",
        alignItems: 'center',
        gap: responsiveHeight(0.5)
    },
    roomType: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.secondry,
        color: colors.primary
    },
    foodAndCancellationTitle:
    {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary,
        color: colors.lightGray
    },
    hotelPriceMainContainer:
    {
        borderTopWidth: responsiveHeight(0.1),
        borderBottomWidth: responsiveHeight(0.1),
        borderStyle: "dotted",
        marginTop: responsiveHeight(1.7),
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        gap: responsiveHeight(2)
    },
    addedHotelTimeAndDateContainer:
    {
        paddingTop: responsiveHeight(0.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addedHotelTitleContainer:
    {
        width: "90%"
    },
    addedHotelTimeAndDate: {
        color: colors.primary,
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.primary
    },
    addingHotelBtnContainer: {
        alignSelf: 'center',
        width: '80%',
    },
    addingHotelBtn:
    {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(0.5),
        borderWidth: responsiveHeight(0.18),
        justifyContent: 'center',
        paddingVertical: responsiveHeight(0.5),
        marginTop: responsiveHeight(1.7),
        borderStyle: "dashed",
        borderRadius: responsiveHeight(1),
        backgroundColor: colors.highlightLite
    },
    addingHotelBtnTitle:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.textFont,
        color: colors.primary
    },
    flightCard:
    {
        borderWidth: 1,
        paddingVertical: responsiveHeight(2.5),
        paddingHorizontal: responsiveWidth(3),
    },
    flightCardTitle:
    {
        marginTop: responsiveHeight(1.3),
        fontSize: responsiveHeight(2.1),
        fontFamily: fonts.primary,
        color: colors.primary,
    },
    totalPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(2),
        height: responsiveHeight(9),
        elevation: responsiveHeight(0.09),
    },
    totalPriceTitle:
    {
        fontSize: responsiveHeight(2),
        color: colors.black,
        fontFamily: fonts.primary
    },
    proceedToBookingBtn:
    {
        backgroundColor: colors.primary,
        height: responsiveHeight(5),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(3),
        borderRadius: responsiveHeight(0.9)
    },
    proceedToBookingBtnTitle: {
        fontSize: responsiveHeight(1.8),
        color: colors.white,
        fontFamily: fonts.textFont
    },
    totalPrice: {
        fontSize: responsiveHeight(2),
        color: colors.secondary,
        fontFamily: fonts.primary
    },
    bookingStatusContainer: {
        marginTop: responsiveHeight(0.5)
    },
    bookingStatus: {
        fontFamily: fonts.textFont,
        fontSize: responsiveHeight(1.6),
        color: colors.lightGray
    },
    bookedHotelDatesContainer: {
        gap: responsiveHeight(2)
    },
    hotelDates: {
        marginRight: responsiveWidth(-3),
        padding: responsiveHeight(0.7),
        backgroundColor: colors.highlight,
        borderTopLeftRadius: responsiveHeight(1.5),
        borderBottomLeftRadius: responsiveHeight(1.5)
    },
    bookingStatusTitlesMainContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    bookingStatusTitles:
    {
        fontSize: responsiveHeight(1.7),
        fontFamily: fonts.primary,
        color: colors.lightGray
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
    hotelRoomPrice: {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.secondary
    },
    HotelRoomFeaturesMainCon: {
        gap: responsiveHeight(1),
    },
    PopUpHotelRoomFeatures:
    {
        backgroundColor: colors.whiteSmoke,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.8),
        borderRadius: responsiveHeight(1.3),
        gap: responsiveHeight(1),
    },
    popUpHotelPriceDescriptionMainContaioner:
    {
        marginTop: responsiveHeight(1.3),
        gap: responsiveHeight(1)
    },
    popUpHotelPriceDescriptionContaioner:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    popUproomPriceTitle:
    {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.textFont,
        color: colors.primary
    },
    popUproomserviceChargesTitle:
    {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.lightGray
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
    tripDetailsTravellerTabs: {
        flexDirection: 'row',
        borderRadius: responsiveHeight(2),
        overflow: 'hidden',
        backgroundColor: colors.highlightLite,
        width: "100%"
    },
    tripDetailsTravellerEachTab:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:colors.primaryLite,
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(1)
    },
    tripDetailsTravellerSelectedEachTab:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primaryLite,
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(1)
    },
    tabTitles:
    {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    tabTitlesSelected:
    {
        fontSize: responsiveHeight(1.8),
        fontFamily: fonts.primary,
        color: colors.white
    },
    travelDetailsFlightCard:
    {
        borderColor:colors.primaryLite,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: responsiveHeight(7),
        width: responsiveHeight(7),
        marginBottom:2
    },
    tripRouteCon: {
        flexDirection: 'row',
        alignItems: "center",
        columnGap: responsiveHeight(.5)
    },
    tripDetailsTitleContainer:
    {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:responsiveWidth(1)
    },
    tripDetailsTitle: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.primary,
        textAlign:'center'
    },
    btn:
    {
        alignSelf: 'center',
        paddingHorizontal: responsiveHeight(2),
        paddingVertical: responsiveHeight(1),
        borderRadius: responsiveHeight(1),
        backgroundColor: colors.primary
    },
    btnTitle:
    {
        fontSize: responsiveHeight(1.8),
        color: colors.white,
        fontFamily: fonts.textInput
    },
    title: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary,
        color: colors.primary
    },
    subTitle:
    {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.lightGray,

    },
    card: {
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(1),
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
        padding: responsiveHeight(1.5),
        // Shadow properties for iOS
        shadowColor: colors.black,
        shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
        shadowOpacity: responsiveHeight(0.3),
        shadowRadius: responsiveHeight(3),
        elevation: responsiveHeight(0.4),
    },
    flightTimings: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.black,
    },
    paymentMainConatainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: responsiveHeight(4)
    },
    paymentTitleContainer: {
        alignItems: 'center',
        gap: responsiveHeight(.5)
    },
    paymentCheckBoxContainer: {
        flexDirection: 'row',
        gap: responsiveHeight(2),
        alignItems: 'center'
    },
    notSubmitedContainer: {
        paddingHorizontal: responsiveHeight(1),
        paddingVertical: responsiveHeight(.5),
        borderRadius: responsiveHeight(1),
        backgroundColor: "#808080"
    },
    notSubmitedTitle:
    {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.white,
    },
    approvalRequestDataContainer: {
        borderBottomWidth: 1,
        padding: responsiveHeight(1)
    },
    activeApprovalRequestDataContainer: {
        borderBottomWidth: 1,
        padding: responsiveHeight(1),
        backgroundColor: "#a6acaf"
    },
    approvalRequestDataTitle: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.primary
    },
    activeApprovalRequestDataTitle: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.white
    },
    reqTitle: {
        fontSize: responsiveHeight(1.2),
        fontFamily: fonts.textFont,
        color: colors.primary,
    },
    activeReqTitle: {
        fontSize: responsiveHeight(1.2),
        fontFamily: fonts.textFont,
        color: colors.white,
    },
    bookedMsgContainer:
    {
        marginTop: responsiveHeight(3),
        paddingHorizontal: responsiveWidth(2),
        gap: responsiveHeight(2)
    },
    statusContainer:
    {
        flexDirection:'row',
        alignItems:'center',
        gap:responsiveWidth(1.5),
        marginTop:responsiveHeight(1)
    },
    statusTitle:
    {
        color:colors.white,
        paddingHorizontal:10,
        borderRadius:responsiveHeight(2),
        backgroundColor:'#ffa500' ,
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.textFont,
        paddingVertical:responsiveHeight(.3)
    },
    activeStatusTitle:
    {
        color:colors.white,
        paddingHorizontal:10,
        borderRadius:responsiveHeight(2),
        backgroundColor:'#008000' ,
        fontSize:responsiveHeight(1.5),
        fontFamily:fonts.textFont,
        paddingVertical:responsiveHeight(.3)

    },
    recheckPriceTitle:
    {
        fontSize:responsiveHeight(2.5),
        fontFamily:fonts.primary,
        textAlign:'center',
        color:colors.primary
    },
    recheckPriceContainer:
    {
        gap:responsiveHeight(.8),
        marginTop:responsiveHeight(2)
    },
    recheckPriceSubContainer:
    {
       gap:responsiveHeight(.8)
    },
    recheckPriceChildContainer:
    {
        gap:responsiveHeight(.5)
    },
    oldprices:
    {
        fontSize:responsiveHeight(1.8),
        fontFamily:fonts.primary,
        color:colors.gray,
        textDecorationLine:'line-through',
    },
    newPrice:{
        fontSize:responsiveHeight(1.8),
        fontFamily:fonts.primary,
        color:colors.gray,
    },
    hotelRecheckBtnContainer:
    {
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'space-evenly',
        marginTop:responsiveHeight(3)
    },
    recheckingDetails:
    {
        gap:responsiveHeight(1),
        marginTop:responsiveHeight(2)
    },
    eachRecheckingDetails:
    {
        gap:responsiveHeight(1),
    },
    progressBarContainer:
    {
        marginVertical:responsiveHeight(2),
        gap:responsiveHeight(2)
    },
    LoaderContainer:{
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal:responsiveWidth(4)
      },
      Loader:{
    width:'100%'
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
      recheckCard:
      {
        backgroundColor:'white',
        elevation:responsiveHeight(1),
        margin:responsiveHeight(.4),
        padding:responsiveHeight(1),
        borderRadius:responsiveHeight(1)
      }

})
