import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {responsiveHeight, responsiveWidth} from '../../../utils/responsiveScale';
import {colors, fonts} from '../../../config/theme';

const OCard = ({other}) => {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: responsiveHeight(1.5),
        }}>
        <IconSwitcher
          componentName="FontAwesome5"
          iconName="globe"
          iconsize={4}
        />
        <Text style={[styles.hotelCardTitle, {textAlign: 'center', flex: 1}]}>
          {other?.data?.bookingType}
        </Text>
        <View style={[styles.hotelDates, {marginRight: 0}]}>
          <Text style={styles.hotelBookedDate}>{other?.data?.bookingDate}</Text>
        </View>
       
      </View>
      <Text style={styles.subTitle}>{other?.data?.bookingDetails}</Text>
      <View style={{alignSelf:"flex-end"}}>
      <Text style={[styles.subTitle,{color:colors.secondary}]}>{`Total Price: ${Math.ceil(other?.data?.overallBookingPrice)}`}</Text>
      </View>
    </View>
  );
};

export default OCard;
const styles = StyleSheet.create({
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
  hotelCardTitle: {
    fontSize: responsiveHeight(2.1),
    fontFamily: fonts.primary,
    color: colors.primary,
    marginTop: responsiveHeight(1),
  },
  hotelDates: {
    marginRight: responsiveWidth(-3),
    padding: responsiveHeight(0.7),
    backgroundColor: colors.highlight,
    borderTopLeftRadius: responsiveHeight(1.5),
    borderBottomLeftRadius: responsiveHeight(1.5),
  },
  hotelBookedDate: {
    fontSize: responsiveHeight(1.7),
    fontWeight: '600',
    color: colors.primary,
  },
  subTitle:
  {
      fontSize: responsiveHeight(1.5),
      fontFamily: fonts.textFont,
      color: colors.lightGray,
        marginTop:responsiveHeight(1)
  },
});
