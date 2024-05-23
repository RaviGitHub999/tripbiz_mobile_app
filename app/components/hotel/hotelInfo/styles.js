import { StyleSheet } from "react-native";
import { colors, fonts } from "../../../config/theme";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";


export const styles = StyleSheet.create(
  {
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: responsiveWidth(4),
    },
    progressBarContainer:{
      flex: 1,
      alignItems: 'center', 
      justifyContent: 'center',
      paddingHorizontal:responsiveWidth(4)
    },
    progressbar:{
  width:'100%'
    },
    backIconContainer: {
      marginTop: responsiveHeight(1),
      backgroundColor: colors.white
    },
    hotelImg: {
      width: responsiveHeight(13),
      height: responsiveHeight(12),
      borderRadius: responsiveHeight(2)
    },
    hotelImgMainContainer:
    {
      flexDirection: "row",
      // marginTop:responsiveHeight(2)
      columnGap: responsiveWidth(1)
    },
    hotelImgContainer: {
      width: "30%",
    },
    hotelDescriptions: {
      width: "70%",
      rowGap: responsiveHeight(1),

    },
    hotelName: {
      fontSize: responsiveHeight(2),
      fontFamily: fonts.primary,
      color: colors.primary
    },
    hotelPrice: {
      color: colors.secondary,
      fontSize: responsiveHeight(2),
      fontFamily: fonts.primary
    },
    addressTitle: {
      fontSize: responsiveHeight(2),
      fontFamily: fonts.primary,
      color: colors.primary
    },
    address: {
      color: colors.gray,
      fontSize: responsiveHeight(1.6),
      fontFamily: fonts.primary
    },
    hotelDetailsContainer:
    {

      rowGap: responsiveHeight(1.5)
    },
    noImageContainer: {
      width: responsiveHeight(13),
      height: responsiveHeight(12),
      borderRadius: responsiveHeight(2),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ccc',
    },
    noImgText: {
      fontSize: responsiveHeight(1.4),
      fontFamily: fonts.textFont,
      color: colors.primary,
      textAlign: "center"
    },
    checkInAndCheckOutDatesContainer: {
      flexDirection: "row",
      backgroundColor: "#eee",
      paddingHorizontal: responsiveWidth(2),
      paddingVertical: responsiveHeight(0.8),
      borderRadius: responsiveHeight(1.5)
    },
    checkInAndCheckOutDates: {
      fontFamily: fonts.textFont,
      color: colors.primary,
      fontSize: responsiveHeight(2)
    },
    PersonsDetails: {
      fontFamily: fonts.textFont,
      color: colors.primary,
      fontSize: responsiveHeight(2)
    },
    roomDetailsContainer: {
      width: "30%",
      padding: responsiveHeight(0.6),
      borderRadius: responsiveHeight(1.2),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1
    },
    roomDetailsActiveContainer: {
      backgroundColor: colors.black,
    },
    roomDetailsTitle1: {
      fontFamily: fonts.textFont,
      color: colors.black,
      fontSize: responsiveHeight(1.6),
      paddingVertical: responsiveHeight(0.3)
    },
    roomDetailsActiveTitle1: {
      fontFamily: fonts.textFont,
      color: colors.white,
      fontSize: responsiveHeight(1.6),
      paddingVertical: responsiveHeight(0.3)
    },
    roomDetailsTitle: {
      fontFamily: fonts.primary,
      color: colors.primary,
      fontSize: responsiveHeight(2)
    },
    roomsMappedContainer: {
      flexDirection: 'row',
      gap: responsiveWidth(2),
      flexWrap: "wrap"
    },
    breakfastBtn:
    {
      borderWidth: responsiveHeight(0.15),
      paddingHorizontal: responsiveWidth(4),
      paddingVertical: responsiveHeight(0.5),
      borderRadius: responsiveHeight(1.5),
      borderStyle: 'dotted',
      borderColor: colors.black
    },
    activebreakfastBtn: {
      backgroundColor: colors.black,
      borderWidth: responsiveHeight(0),
    },
    breakfastBtnText: {
      fontSize: responsiveHeight(1.6),
      fontFamily: fonts.primary,
      color: colors.black
    },
    activebreakfastBtnText: {
      fontSize: responsiveHeight(1.6),
      fontFamily: fonts.primary,
      color: colors.white
    },
    breakfastAndRefundableButtonsContainer:
    {
      flexDirection: 'row',
      columnGap: responsiveWidth(2)
    },
    card: {
      marginVertical: responsiveHeight(1),
      paddingVertical: responsiveHeight(1),
      paddingHorizontal: responsiveWidth(2),
      borderRadius: responsiveHeight(1.5),
      backgroundColor: "#ebebeb",
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardMainSubContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    cardSubContainer1: {
      rowGap: responsiveHeight(1.2),
      width: "50%",
      justifyContent: 'center'
    },
    cardSubContainer2:
    {
      rowGap: responsiveHeight(1.2),
      alignItems: 'flex-end',
      width: "50%",
      justifyContent: 'center'
    },
    mealsDescriptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: responsiveWidth(1)
    },
    roomType: {
      fontSize: responsiveHeight(1.5),
      fontFamily: fonts.primary,
      color: colors.black
    },
    inclusion: {
      fontSize: responsiveHeight(1.5),
      fontFamily: fonts.primary,
      color: "#646464"
    },
    roomPrice: {
      fontSize: responsiveHeight(1.7),
      fontFamily: fonts.primary,
      color: colors.secondary
    },
    roomDetailsMainContainer: {
      paddingHorizontal: responsiveWidth(2),
      paddingVertical: responsiveHeight(2),
      borderRadius: responsiveHeight(2),
      backgroundColor: colors.whiteSmoke
    },
    totalRoomPriceContainer: {
      backgroundColor: 'white',
      paddingVertical: responsiveHeight(1),
      paddingHorizontal: responsiveWidth(2),
      gap: responsiveHeight(1),
      elevation: 5,
      marginTop: responsiveHeight(0.3)
    },
    totalRoomPriceToggleContainer: {
      alignSelf: 'center'
    },
    addtotripBtn: {
      backgroundColor: colors.primary,
      paddingVertical: responsiveHeight(1.1),
      paddingHorizontal: responsiveWidth(2),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: responsiveHeight(1)
    },
    addtotripBtnText: {
      fontFamily: fonts.primary,
      color: colors.white,

    },
    roomPriceContainer: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
    },
    totalPriceText: {
      fontSize: responsiveHeight(2.4),
      color: colors.primary,
      fontFamily: fonts.textFont
    },
    totalPrice: {
      fontSize: responsiveHeight(2.4),
      color: colors.secondary,
      fontFamily: fonts.textFont
    },
    hotelPriceContainer: {
      flexDirection: "row",
      justifyContent: 'space-between'
    },
    hotelPriceText: {
      fontSize: responsiveHeight(2),
      fontFamily: fonts.primary,
      color: "#646464"
    },
    hotelPriceTP: {
      fontSize: responsiveHeight(2),
      fontFamily: fonts.primary,
      color: colors.highlight
    },
    dashedLine: {
      borderBottomWidth: responsiveHeight(0.1),
      borderStyle: "dashed",
      borderColor: colors.gray
    },
    solidLine:
    {
      borderBottomWidth: responsiveHeight(0.1),
      borderColor: colors.gray,
      marginTop: responsiveHeight(1)
    },
    popUpSelectedImg: {
      height: responsiveHeight(20),
      width: "100%",
      borderRadius: responsiveHeight(2)
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
      width: '90%',
      justifyContent: 'center'
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
    addingNewTripContainer: {
      gap: responsiveHeight(1.5)
    },
    addingNewTripSubContainer: {
      gap: responsiveHeight(1)
    },
    addingNewTripBtn: {
      borderWidth: 1,
      padding: responsiveHeight(1),
      paddingHorizontal: responsiveWidth(3),
      paddingVertical: responsiveHeight(1.5),
      borderRadius: responsiveHeight(1.3),
      backgroundColor: colors.black,
      alignItems: 'center',
      alignSelf: 'center',
      width: "60%"
    },
    addingNewTripBtnText: {
      color: colors.white,
      fontSize: responsiveHeight(2),
      fontFamily: fonts.primary
    },
    multiTextContainer: {
      borderWidth: 1,
      textAlignVertical: "top",
      borderRadius: responsiveHeight(1.3),
      paddingHorizontal: responsiveWidth(3),
      fontSize: responsiveHeight(2.3)
    },
    newtriptitle: {
      fontSize: responsiveHeight(2.5),
      fontFamily: fonts.primary,
      color: colors.primary,
      // textAlign: 'center'
    },
    yesBtn: {
      borderRadius: responsiveHeight(1),
      paddingHorizontal: responsiveHeight(1),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: responsiveHeight(0.5)
    },
    yesBtnText: {
      fontSize: responsiveHeight(1.6),
      fontFamily: fonts.textFont,
      color: colors.white
    },
    selectedTripContainer:
    {
      flex: 1,
      gap: responsiveHeight(1)
    },
    selectedTripTitle:
    {
      fontSize: responsiveHeight(2),
      color: colors.primary,
      textAlign: 'center'
    },
    selectedTripBtnContainer:
    {
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-evenly'
    },
    
  },


)