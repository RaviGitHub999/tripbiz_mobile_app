import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import {colors, fonts} from '../../../config/theme';
const CCard = ({item, startDate, endDate, data}) => {
  var imgs = [
    {
      passenger: 4,
      type: 'Sedan',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/hatchback_new.png',
    },
    {
      passenger: 4,
      type: 'Indica or similar',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/sedan_new.png',
    },
    {
      passenger: 6,
      type: 'SUV (Innova/Ertiga)',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
    },
    {
      passenger: 6,
      type: 'Innova',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
    },
    {
      passenger: 6,
      type: 'Innova crysta',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
    },
    {
      passenger: 6,
      type: 'Innova Crysta',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
    },
    {
      passenger: 6,
      type: 'Ertiga',
      image:
        'https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png',
    },
  ];
  var cabImg = imgs.filter(img => img.type.trim() === item.carType.trim());
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image
          source={{uri: cabImg[0]?.image}}
          style={styles.img}
          resizeMode="contain"
        />
        <View style={styles.cabTitleContainer}>
          <Text style={styles.title}>{item.carType}</Text>
          <Text style={styles.subTitle}>{`(${item['passenger']} Seater)`}</Text>
          <Text
            style={[
              styles.subTitle,
              {color: colors.facebook, textDecorationLine: 'underline'},
            ]}>{`${startDate}${endDate && '-'}${endDate}`}</Text>
        </View>
      </View>
      <Text style={styles.subTitle}>No Of Cabs -{data.cabCount}</Text>
      <Text style={styles.subTitle}>Pick up:{data?.selectedTime}</Text>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPrice}> &#8377; {data.cabTotalPrice}</Text>
      </View>
    </View>
  );
};

export default CCard;

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: responsiveHeight(1.5),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveHeight(1.5),
    elevation: responsiveHeight(0.4),
    backgroundColor: colors.white,
  },
  container: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
  },
  img: {
    height: responsiveHeight(4),
    width: responsiveHeight(6),
  },
  cabTitleContainer: {
    width: '75%',
  },
  dateContainer: {
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    padding: responsiveHeight(0.8),
    borderTopLeftRadius: responsiveHeight(1.5),
    borderBottomLeftRadius: responsiveHeight(1.5),
    position: 'absolute',
    right: responsiveWidth(-2),
    width: '28%',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveHeight(1.6),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  subTitle: {
    fontSize: responsiveHeight(1.3),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  totalPriceContainer: {
    alignSelf: 'flex-end',
  },
  totalPrice: {
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.primary,
    color: colors.secondary,
  },
});
