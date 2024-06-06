import { View, Text } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { styles } from './styles'
import IconSwitcher from '../../common/icons/IconSwitcher'
import MyContext from '../../../context/Context'
import { colors } from '../../../config/theme'
const HotelInfoRenderItems = ({room,index,selectedRoom,}) => {
    const{actions,bookingHotel}=useContext(MyContext)
    console.log("kk")

      return (
            <TouchableOpacity style={bookingHotel.selectedRoomType[selectedRoom] &&
                ((bookingHotel.selectedRoomType[selectedRoom].RoomTypeCode === room?.RoomTypeCode) && (bookingHotel.selectedRoomType[selectedRoom].LastCancellationDate === room?.LastCancellationDate) && (bookingHotel.selectedRoomType[selectedRoom].Price.OfferedPriceRoundedOff === room?.Price.OfferedPriceRoundedOff)&&(bookingHotel.selectedRoomType[selectedRoom].SequenceNo === room?.SequenceNo))
                ? [{...styles.card},{backgroundColor:colors.highlightTranslucent}]:styles.card} onPress={() => { actions.selectHotelRoomType(room, selectedRoom, index) }}>
                <View style={styles.cardMainSubContainer}>
                    <View style={styles.cardSubContainer1}>
                        <Text style={styles.roomType}>{room.RoomTypeName}</Text>
                        <View style={styles.mealsDescriptionContainer}>
                            <IconSwitcher componentName='MaterialIcons' iconName='dinner-dining' color='black' iconsize={3} />
                            <Text style={styles.inclusion}>{room.Inclusion && room.Inclusion.length > 0
                                ? actions.checkForTboMeals(room.Inclusion)
                                : "No meals"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.cardSubContainer2}>
                        <Text style={styles.roomPrice}>{`₹ ${room.Price.OfferedPriceRoundedOff
                            ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                "en-IN"
                            )
                            : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                "en-IN"
                            )
                            }`}</Text>
                        {
                            room.LastCancellationDate &&
                                actions.validCancelDate(
                                    room.LastCancellationDate
                                ) ? <View style={styles.mealsDescriptionContainer}>
                                <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
                                <Text style={styles.inclusion}>{`Free cancellation upto ${new Date(
                                    room.LastCancellationDate
                                )
                                    .toString()
                                    .slice(4, 10)}`}</Text>
                            </View> : <View style={styles.mealsDescriptionContainer}>
                                <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
                                <Text style={styles.inclusion}>Non-refundable</Text>
                            </View>
                        }

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

export default React.memo(HotelInfoRenderItems)