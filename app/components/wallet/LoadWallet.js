import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {responsiveHeight} from '../../utils/responsiveScale';
import {colors, fonts} from '../../config/theme';
import IconSwitcher from '../common/icons/IconSwitcher';

const LoadWallet = ({navigation: {goBack}}) => {
  const handleBack = () => {
    goBack();
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSwitcher
            componentName="AntDesign"
            iconName="arrowleft"
            color={colors.primary}
            iconsize={3}
          />
        </TouchableOpacity>
        <Text style={[styles.title, {color: colors.primary}]}>Load Wallet</Text>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>
          This Feature is Available Only in Desktop Version
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.lightGray,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(2),
    padding: responsiveHeight(1),
  },
});
export default LoadWallet;
