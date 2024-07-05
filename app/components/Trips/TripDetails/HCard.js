import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import MyContext from '../../../context/Context'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { styles } from './styles'
import { colors } from '../../../config/theme'
import { responsiveHeight } from '../../../utils/responsiveScale'
const HCard = (props) => {
  const { hotel, formattedDate1, endDate, adults, recheck } = props
  const { actions } = useContext(MyContext)
  return (
    <View style={styles.hotelCard}>
      <View>
        <Text style={[styles.title, { textAlign: 'center' }]}>{hotel.data.hotelInfo.HotelInfoResult.HotelDetails.HotelName}</Text>
        <Text style={[styles.subTitle, { textAlign: 'center' }]}>Adults-{adults.adults} Child-{adults.child}</Text>
        <Text style={[styles.subTitle, { textAlign: 'center', textDecorationLine: 'underline', color: colors.primaryLite }]}>{formattedDate1}-{endDate} ({hotel.data.hotelSearchQuery.hotelNights} Nights)</Text>
      </View>

      {hotel?.data?.selectedRoomType &&
        hotel?.data?.selectedRoomType.map(
          (room, f) => {
            // price = price + room.Price.OfferedPriceRoundedOff;
            // hotelPrice =
            //   hotelPrice +
            //   room.Price.OfferedPriceRoundedOff;
            return (
              <View style={styles.hotelRoomFeatures}>
                <View
                  style={
                    styles.hotelRoomFeaturesContainer1
                  }>
                  <Text style={[styles.roomType, { fontSize: responsiveHeight(1.5) }]}>
                    {room.RoomTypeName}
                  </Text>
                  {/* {recheck ? <Text
                    style={
                      [styles.hotelRoomPrice, { fontSize: responsiveHeight(1.5) }]
                    }>{`₹ ${room.Price.OfferedPriceRoundedOff
                        ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                          'en-IN',
                        )
                        : room.Price.PublishedPriceRoundedOff.toLocaleString(
                          'en-IN',
                        )
                      }`}
                  </Text> : null} */}
                </View>
                <View
                  style={
                    styles.hotelRoomFeaturesContainer2
                  }>
                  <View style={styles.mealsDeatils}>
                    <IconSwitcher
                      componentName="MaterialIcons"
                      iconName="dinner-dining"
                      color={colors.primary}
                      iconsize={1.5}
                    />
                    <Text
                      style={
                        [styles.foodAndCancellationTitle, { fontSize: responsiveHeight(1.2) }]
                      }>
                      {room.Inclusion &&
                        room.Inclusion.length > 0
                        ? actions.checkForTboMeals(
                          room.Inclusion,
                        )
                        : 'No meals'}
                    </Text>
                  </View>
                  <View style={styles.mealsDeatils}>
                    {room.LastCancellationDate &&
                      actions.validCancelDate(
                        room.LastCancellationDate,
                      ) ? (
                      <>
                        <IconSwitcher
                          componentName="MaterialCommunityIcons"
                          iconName="cancel"
                          color={colors.primary}
                          iconsize={1.5}
                        />
                        <Text
                          style={
                            [styles.foodAndCancellationTitle, { fontSize: responsiveHeight(1.2) }]
                          }>{`Free cancellation upto ${new Date(
                            room.LastCancellationDate,
                          )
                            .toString()
                            .slice(4, 10)}`}</Text>
                      </>
                    ) : (
                      <>
                        <IconSwitcher
                          componentName="MaterialCommunityIcons"
                          iconName="cancel"
                          color={colors.primary}
                          iconsize={1.5}
                        />
                        <Text
                          style={
                            styles.foodAndCancellationTitle
                          }>
                          {'Non-refundable'}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

              </View>
            );
          },
        )}
      <View style={styles.tripDetailsHeader}>
        <Text style={styles.hotelRoomPrice}>&#8377; {`${Math.ceil(hotel?.data?.hotelTotalPrice)?.toLocaleString("en-IN")}`}</Text>
      </View>
    </View>
  )
}

export default HCard