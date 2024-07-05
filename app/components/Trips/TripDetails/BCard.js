import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors, fonts } from '../../../config/theme'

const BCard = ({item,startDate,endDate,bookingBus}) => {
  return (
    <View style={styles.mainContainer}>
         <View style={styles.routeContainer}>
          <Text style={styles.routeName}>{bookingBus?.origin?.cityName}</Text>
          <IconSwitcher
            componentName="Octicons"
            iconName="arrow-right"
            color={colors.primary}
            iconsize={2.5}
          />
          <Text style={styles.routeName}>
            {bookingBus?.destination?.cityName}
          </Text>
        </View>
       <View style={styles.travelNameContainer}>
          <IconSwitcher
            componentName="FontAwesome5"
            iconName="bus-alt"
            iconsize={2}
          />
          <View style={styles.travelNameSubContainer}>
          <Text style={styles.travelName}>{item.TravelName}</Text>
          <Text style={styles.date}>{`${startDate}${endDate ? " - " + endDate : ""}`}</Text>
          </View>
        </View>
        <Text style={[styles.travelName,{fontSize:responsiveHeight(1.3),marginTop:responsiveHeight(1)}]}>{item.BusType}</Text>
        <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPrice}> &#8377; {bookingBus.busTotalPrice}</Text>
      </View>
    </View>
  )
}

export default BCard

const styles = StyleSheet.create({
    mainContainer: {
        marginVertical: responsiveHeight(1.5),
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2),
        borderRadius: responsiveHeight(1.5),
        elevation: responsiveHeight(0.4),
        backgroundColor: colors.white,
      },
    travelNameContainer: {
        flexDirection: 'row',
        gap: responsiveHeight(1),
      },
      travelNameSubContainer:{
        flex:1,
        gap:responsiveHeight(.1)
      },
      travelName: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.secondry,
        color: colors.primary,
        flex:1
      },
      date:{
        fontSize: responsiveHeight(1.3),
        fontFamily: fonts.secondry,
        color: colors.facebook, 
        textDecorationLine: 'underline'
      },
      routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(1),
        justifyContent:'center',
        flexWrap:'wrap'
      },
      routeName: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary,
        color: colors.primaryLite,
      },
      totalPriceContainer: {
        alignSelf: 'flex-end',
      },
      totalPrice: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary,
        color: colors.secondary,
      },
})