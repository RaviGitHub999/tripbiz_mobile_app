import {StyleSheet} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../../utils/responsiveScale';
import {colors, fonts} from '../../../config/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: responsiveHeight(3),
    backgroundColor:colors.whiteSmoke
  },
  title: {
    fontSize: responsiveHeight(2.5),
    textAlign: 'center',
    fontFamily: fonts.primary,
    color: colors.black,
    marginTop: responsiveHeight(3),
  },
  addingHotelBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(0.5),
    borderWidth: responsiveHeight(0.18),
    justifyContent: 'center',
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveHeight(4),
    marginVertical: responsiveHeight(3),
    borderStyle: 'dashed',
    borderRadius: responsiveHeight(1),
    backgroundColor: colors.highlightLite,
  },
  addingHotelBtnTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textFont,
    color: colors.primary,
  },
  card:{
    // borderWidth:1,
    backgroundColor:colors.white,
    paddingHorizontal:responsiveHeight(1),
    paddingVertical:responsiveHeight(1.5),
    borderRadius:responsiveHeight(1),
    marginBottom:responsiveHeight(1),
    gap:responsiveHeight(.5),
    shadowColor: colors.black,
    shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
    shadowOpacity: responsiveHeight(0.3),
    shadowRadius: responsiveHeight(3),
    elevation: responsiveHeight(0.4),
    marginHorizontal:responsiveHeight(.5),
    marginTop:responsiveHeight(.5)
  },
  pageBtnsContainer:{
    flexDirection: 'row',
    columnGap: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(5),
  },
  scrollViewContainer:{
    paddingBottom: responsiveHeight(10)
  },
  pageBtn:
  {
borderWidth:responsiveHeight(.13),
borderColor:"#ccc",
alignItems:'center',
justifyContent:'center',
height:responsiveHeight(4),
width:responsiveHeight(4)
  },
  pageTitle:{
    fontSize:responsiveHeight(1.5),
    color:colors.primary
  },
  tripName:
  {
fontSize:responsiveHeight(2),
color:colors.primary,
fontFamily:fonts.primary
  },
  tripDatetitle:
  {
    fontSize:responsiveHeight(1.3),
    color:colors.primary,
    fontFamily:fonts.primary
  },
  tripDate:
  {
color:colors.highlight
  },
  btn:{
    backgroundColor:colors.primary ,
    paddingVertical:responsiveHeight(.5),
    paddingHorizontal:responsiveWidth(2),
    borderRadius:responsiveHeight(1)
  },
  btnTitle:{
    color:colors.white
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
  itemsContainer:{
    flexDirection: "row",
     gap: responsiveHeight(1) ,
     flexWrap:'wrap'
  }
});
