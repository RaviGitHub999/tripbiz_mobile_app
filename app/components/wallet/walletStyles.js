import {StyleSheet} from 'react-native';
import {responsiveHeight} from '../../utils/responsiveScale';
import {colors, fonts} from '../../config/theme';

export const walletStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: responsiveHeight(3),
    gap:responsiveHeight(2),
    marginTop:responsiveHeight(8)
  },
  profileContainer: {
    flexDirection: 'row',
    gap: responsiveHeight(1),
  },
  profileSubContainer: {
    gap: responsiveHeight(0.5),
  },
  title: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  isActive:
  {
width:responsiveHeight(25),
padding:responsiveHeight(1),
borderRadius:responsiveHeight(1)
  },
  active:
  {
    width:responsiveHeight(25),
    padding:responsiveHeight(1),
    borderRadius:responsiveHeight(1),
    backgroundColor:colors.highlight
  },
  btnContainer:
  {
gap:responsiveHeight(1)
  }
});
