import { StyleSheet } from "react-native";
import { colors, fonts } from "../../../config/theme";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";


export const styles = StyleSheet.create(
  {
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderWidth: 2,
      borderColor: 'green',
      paddingHorizontal: responsiveWidth(4),
    },
    progessBarContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
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
    card:{
      marginVertical:responsiveHeight(1),
      paddingVertical:responsiveHeight(1),
      paddingHorizontal:responsiveWidth(2),
      borderRadius:responsiveHeight(1.5),
      backgroundColor:"#ebebeb",
      alignItems:'center',
      justifyContent:'center'
    },
    cardMainSubContainer:{
      flexDirection:'row',
      justifyContent:'space-between'
    },
    cardSubContainer1:{
      rowGap:responsiveHeight(1.2),
      width:"50%",
      justifyContent:'center'
    },
    cardSubContainer2:
    {
      rowGap:responsiveHeight(1.2),
      alignItems:'flex-end',
      width:"50%",
      justifyContent:'center'
    },
    mealsDescriptionContainer:{
      flexDirection:'row',
      alignItems:'center',
      columnGap:responsiveWidth(1)
    },
    roomType:{
      fontSize:responsiveHeight(1.5),
      fontFamily:fonts.primary,
      color:colors.black
    },
    inclusion:{
      fontSize:responsiveHeight(1.5),
      fontFamily:fonts.primary,
      color:"#646464"
    },
    roomPrice:{
      fontSize:responsiveHeight(1.7),
      fontFamily:fonts.primary,
      color:colors.secondary
    },
    roomDetailsMainContainer:{
       paddingHorizontal: responsiveWidth(2), 
       paddingVertical: responsiveHeight(2),
       borderRadius:responsiveHeight(2),
       backgroundColor:colors.whiteSmoke
    },
    totalRoomPriceContainer:{
      backgroundColor:colors.white,
      position:'absolute',
      width:"100%",
      bottom:0,
    },
    totalRoomPriceToggleContainer:{
      alignSelf:'center'
    },
    addtotripBtn:{
      backgroundColor:colors.primary,
      paddingVertical:responsiveHeight(1.1),
      paddingHorizontal:responsiveWidth(2),
      alignItems:'center',
      justifyContent:'center',
      borderRadius:responsiveHeight(1)
    },
    addtotripBtnText:{
fontFamily:fonts.primary,
color:colors.white,

    },
    roomPriceContainer:{
      flexDirection:'row',
      justifyContent:"space-between",
      alignItems:'center',
      position:'absolute',
      bottom:0,
      width:'100%'
    },
    totalPriceText:{
      fontSize:responsiveHeight(2.4),
      color:colors.primary,
      fontFamily:fonts.textFont
    },
    totalPrice:{
      fontSize:responsiveHeight(2.4),
      color:colors.secondary,
      fontFamily:fonts.textFont
    },
    hotelPriceContainer:{
      flexDirection:"row",
      justifyContent:'space-between'
    },
    hotelPriceText:{
      fontSize:responsiveHeight(2),
      fontFamily:fonts.primary,
      color:"#646464"
    },
    hotelPriceTP:{
      fontSize:responsiveHeight(2),
      fontFamily:fonts.primary,
      color:colors.highlight
    },
    dashedLine:{
      borderBottomWidth:responsiveHeight(0.1),
      borderStyle:"dashed",
      borderColor:colors.gray
    },
    solidLine:
    {
      borderBottomWidth:responsiveHeight(0.1),
      borderColor:colors.gray,
      marginTop:responsiveHeight(1)
    }
  },
  
)