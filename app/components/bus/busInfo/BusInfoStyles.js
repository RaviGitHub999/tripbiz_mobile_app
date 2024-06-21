import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backIconContainer: {
    alignSelf: 'flex-start',
    margin: responsiveHeight(2),
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
});
