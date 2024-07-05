import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import {colors, fonts} from '../../../config/theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: responsiveHeight(1.5),
    gap:responsiveHeight(2),
  },
  backIconContainer: {
    alignSelf: 'flex-start',
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  titles: {
    fontSize: responsiveHeight(2.1),
    fontFamily: fonts.secondry,
    color: colors.primary,
  },
  subTitles: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.secondry,
    color: colors.primary,
  },
  boardingPoint_droppingPoint_Container: {
    backgroundColor:colors.whiteSmoke,
    gap:responsiveHeight(2),
    paddingHorizontal:responsiveHeight(1.5),
    marginTop:responsiveHeight(2),
    borderRadius:responsiveHeight(2),
    paddingVertical:responsiveHeight(3)
  },
  boardingPoint_droppingPoint_subContainer:{
    gap:responsiveHeight(1.5)
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
    backgroundColor: '#edf8f4',
    borderRadius: responsiveHeight(0.8),
    width: '90%',
    justifyContent: 'center',
  },
  createNewTripBtnTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  triptitles: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
    textAlign: 'center',
  },
  addingNewTripContainer: {
    gap: responsiveHeight(1.5),
  },
  addingNewTripSubContainer: {
    gap: responsiveHeight(1),
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
    width: '60%',
  },
  addingNewTripBtnText: {
    color: colors.white,
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
  },
  multiTextContainer: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderRadius: responsiveHeight(1.3),
    paddingHorizontal: responsiveWidth(3),
    fontSize: responsiveHeight(2.3),
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
  tripCard: {
    marginVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: responsiveWidth(-0.2), height: responsiveHeight(-5)},
    shadowOpacity: responsiveHeight(0.3),
    shadowRadius: responsiveHeight(3),
    elevation: responsiveHeight(0.4),
    width: '100%',
  },
  tripTitle: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  tripDate: {
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.textFont,
    color: colors.highlight,
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
  errorContainer:{
    flex:1,
    alignItems:'center',
    flexDirection:'row',
    gap:responsiveHeight(1)
  },
  errorText:
  {
fontSize:responsiveHeight(1.5),
fontFamily:fonts.primary,
color:colors.red
  }
});
