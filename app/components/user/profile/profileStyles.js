import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';
import { colors, fonts } from '../../../config/theme';

export const styles = StyleSheet.create({
  mainContainer:
  {
    flex: 1,
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveHeight(2)
    // alignItems:'center'
  },
  title: {
    textAlign: 'center',
    fontSize: responsiveHeight(4),
    fontFamily: fonts.textFont,
    color: colors.primary
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profiledetailsTitle:
  {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textFont,
    color: colors.primary
  },
  profiledetailssubTitle:
  {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.textInput,
    color: colors.primary,
    flex: 0.7
  },
  profiledetailsMainContainer:
  {
    gap: responsiveHeight(1)
  },
  inputBoxContainer:
  {
    flex: 1,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
    padding: responsiveHeight(1),
    borderWidth: responsiveHeight(0.2),
    alignSelf: 'flex-end',
    borderRadius: responsiveHeight(1.5)
  },
  updateAndCancelBtnContainer:
  {
    flexDirection: "row",
    gap: responsiveHeight(2),
    alignSelf: 'flex-end',

  },
  btn: {
    backgroundColor: colors.primary,
    padding: responsiveHeight(1),
    borderRadius: responsiveHeight(1.5)
  },
  btnTitle: {
    color: colors.white,
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.textInput
  },
  passwordBtnContainer:
  {
    backgroundColor: colors.white,
    borderRadius: responsiveHeight(1),
    elevation: 4,
    paddingHorizontal: responsiveWidth(3),
    height:responsiveHeight(5),
    alignItems:'center',
    // justifyContent:'center',
    flexDirection:'row',
    flex:1,
    gap:responsiveHeight(1)
  
  },
  chooseFileBtn:
  {
borderWidth:responsiveHeight(0.16),
padding:responsiveHeight(0.2),
paddingHorizontal:responsiveHeight(0.6),
backgroundColor:colors.whiteSmoke,
borderRadius:responsiveHeight(0.5)
  },
  chooseFileBtnText:{
    color: colors.primary,
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.textInput
  },
  fileName:
  {
    color: colors.facebook,
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.textInput
  }


});
