import { StyleSheet } from "react-native";
import { colors, fonts } from "../../../config/theme";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";

export const styles=StyleSheet.create({
headerMainContainer:{
    backgroundColor:colors.primary,
    // flex: .1, 
    // borderWidth: 2,
    //  borderColor: "red",
     paddingHorizontal:responsiveWidth(5),
     justifyContent:'center',
     rowGap:responsiveHeight(1),
     height:responsiveHeight(10)
},
titleContainer:{
    flexDirection: "row",
    alignItems:'centers',
    columnGap:responsiveWidth(4),
    // borderWidth:1,
},
title:{
    textAlignVertical:'center',
    color:colors.white,
    fontSize:responsiveHeight(2.2),
    fontFamily:fonts.primary

},
editButtonContainer:{
    backgroundColor: colors.highlight,
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
    borderRadius: responsiveHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
},
subTitle:{
    textAlignVertical:'center',
    color:colors.white,
    fontSize:responsiveHeight(1.7),
    fontFamily:fonts.primary  
},
hotelCard: {
    flexDirection: 'row',
    marginVertical: responsiveHeight(0.5),
    // marginHorizontal: 15,
    padding: responsiveHeight(1),
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: responsiveHeight(1.5),
    shadowColor:"#ccc",
    shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
    shadowOpacity: responsiveHeight(0.3),
    shadowRadius: responsiveHeight(3),
    elevation: responsiveHeight(0.4),
    backgroundColor:"white",
    columnGap:responsiveWidth(4)
  },
  hotelImgContainer: {
    // flex: 1,
  },
  hotelImg: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(0.5),
    
  },
  noImageContainer: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(0.5),
    backgroundColor: '#ccc',
  },
  hotelDetailsContainer: {
    flex: 2,
    rowGap:responsiveHeight(1)
    // marginLeft: 10,
    // borderWidth:1
  },
  hotelNameContainer: {
    // marginBottom: 5,
    flexDirection:"row",
    justifyContent:"space-between",
    // width:"50%",
    // borderWidth:1,
    alignItems:'center'
   
  },
  hotelName: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color:colors.primary,
    width:"60%"
  },
  hotelDetailsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth:1
    
  },
  hotelDetailsRow: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  hotelPrice: {
    fontSize: responsiveHeight(1.8),
    // marginRight: 10,
    fontFamily:fonts.primary,
    color:colors.secondary
  },
  hotelRating: {
    flexDirection: 'row',
  },
  hotelInfoButton: {
    // marginTop: 10,
    flexDirection:'row',
    columnGap:responsiveWidth(2),
    alignItems:'center'
  },
  bookingBtn:{
    // borderWidth:1,
    paddingHorizontal:responsiveWidth(4),
    paddingVertical:responsiveHeight(0.4),
    borderRadius:responsiveHeight(1),
    backgroundColor:colors.black
  },
  bookingBtnText:{
    fontSize:responsiveHeight(1.5),
    fontFamily:fonts.primary,
    color:colors.white
  },
  noImgText:{
    fontSize:responsiveHeight(1.4),
    fontFamily:fonts.textFont,
    color:colors.primary,
    textAlign:"center"
  },
  recommendedTitleContainer:{
    backgroundColor:"#a6f0a6",
    // alignItems:"center",
    // justifyContent:"center",
    paddingHorizontal:responsiveWidth(1.2),
    paddingVertical:responsiveHeight(0.3),
    borderTopLeftRadius:responsiveHeight(2),
    borderBottomLeftRadius:responsiveHeight(2)
    
  },
  recommendedTitle:{
    fontSize:responsiveHeight(1.3),
    fontFamily:fonts.primary
  },
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap:responsiveHeight(1),
    marginTop:responsiveHeight(1)
  },
  row: {
    flexDirection: 'row',
    columnGap:responsiveWidth(2),
    width:'100%',
    padding:responsiveHeight(0.3),
  },
  ratingTitle:{
    fontSize:responsiveHeight(2.3),
    fontFamily:fonts.textFont,
    color:colors.primary
  },
  priceTitle:{
    fontSize:responsiveHeight(1.8),
    color:colors.primary,
    fontFamily:fonts.textFont
  },
  filterClosingIcon:{
    alignSelf:'center'
  },
  selectedItem:{
    borderWidth:1,
    width:"100%",
    padding:responsiveHeight(1),
    borderRadius:responsiveHeight(1)
  },
  totalHotels:
  {
fontSize:responsiveHeight(2),
fontFamily:fonts.primary,color:colors.primary
  },
  applyFiltersBtnText: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.white
  },
  applyFiltersBtn: {
    alignSelf: "flex-end",
    borderWidth: 1,
    paddingHorizontal: responsiveHeight(2),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveHeight(1.2),
    backgroundColor: colors.black,
    alignItems:'center',
    justifyContent:'center'
  },
  clearFilterContainer:{
    alignSelf:"flex-end",
    borderBottomWidth:1,
    color:colors.black
  },
  clearFilterTitle:{
    fontSize:responsiveHeight(2),
    fontFamily:fonts.textFont,
    color:colors.primary
  },
  roomDetailsMainContainer:{
paddingHorizontal:responsiveWidth(3),
flex:1
  }
})