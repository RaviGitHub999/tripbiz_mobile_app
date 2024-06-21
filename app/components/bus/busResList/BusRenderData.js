import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {colors, fonts} from '../../../config/theme';
import PopUp from '../../common/popup/PopUp';
import MyContext from '../../../context/Context';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

const BusRenderData = ({item}) => {
  const [openBusDetails, setOpenBusDetails] = useState(false);
  const[loader,setLoader]=useState(false)
  const {actions} = useContext(MyContext);
  const{navigate}=useNavigation()
  const depdate = new Date(item.DepartureTime);
  const depformattedDate = depdate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const arrdate = new Date(item.ArrivalTime);
  const arrformattedDate = arrdate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
const add=async (bus)=>
  {
    await console.log(bus,"ravi")
  }
  const diffInMilliseconds = arrdate - depdate;
  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTimeDiff = `${String(hours).padStart(2, '0')}hrs ${String(
    minutes,
  ).padStart(2, '0')}mins`;

  const handleSeatSelection =useCallback(( bus) => {
    add(bus)
    navigate('BusInfo');
  },[]);
console.log("first")
  return (
    <>
      <View style={styles.busCard}>
        <View style={styles.travelNameContainer}>
          <IconSwitcher
            componentName="FontAwesome5"
            iconName="bus-alt"
            color={colors.black}
            iconsize={3}
          />
          <Text style={styles.travelName}>{item.TravelName}</Text>
        </View>
        <View style={styles.travelTimeContainer}>
          <View>
            <Text style={styles.time}>{`${item.DepartureTime.slice(
              11,
              16,
            )}`}</Text>
            <Text
              style={[
                styles.time,
                {color: colors.lightGray},
              ]}>{`${depformattedDate}`}</Text>
          </View>
          <View style={styles.travelHoursContainer}>
            <Text style={styles.travelTime}>{formattedTimeDiff}</Text>
          </View>
          <View style={styles.arrivalTimeContainer}>
            <Text style={styles.time}>{`${item.ArrivalTime.slice(
              11,
              16,
            )}`}</Text>
            <Text
              style={[
                styles.time,
                {color: colors.lightGray},
              ]}>{`${arrformattedDate}`}</Text>
          </View>
        </View>
        <Text style={styles.time}>{item.BusType}</Text>
        <View style={styles.totalPriceContainer}>
          <TouchableOpacity onPress={() => setOpenBusDetails(true)}>
            <Text style={styles.cancellationText}>Cancellation</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{item.AvailableSeats} Seats Left</Text>
          <Text style={styles.price}>
            &#8377;{' '}
            {item.BusPrice.PublishedPriceRoundedOff
              ? item.BusPrice.PublishedPriceRoundedOff
              : item.BusPrice.OfferedPriceRoundedOff}
          </Text>
        </View>
        {loader?<ActivityIndicator color={colors.facebook} size={20}/>:<TouchableOpacity
          style={styles.Btn}
          onPress={() => handleSeatSelection(item)}>
          <Text style={styles.btnText}>Select Seats</Text>
        </TouchableOpacity>}
      </View>
      <PopUp
        value={openBusDetails}
        handlePopUpClose={() => {
          setOpenBusDetails(false);
        }}>
        <Text
          style={[
            styles.travelName,
            {fontSize: responsiveHeight(2.2), textAlign: 'center'},
          ]}>
          Cancellation Details
        </Text>
        <View style={styles.tableHeader}>
          <Text style={styles.travelName}>Cancellation Time</Text>
          <Text style={styles.travelName}>Cancellation Charge</Text>
        </View>
        <>
          {item?.CancellationPolicies?.length > 0 &&
            item.CancellationPolicies.map((rule, ru) => {
              var fromDate = new Date(rule.FromDate);
              const fromformattedDate = fromDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              });
              var toDate = new Date(rule.ToDate);
              const toformattedDate = toDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              });
              return (
                <View key={`id_${ru + 1}`} style={styles.tableRow}>
                  <View style={styles.eachCell}>
                    <Text style={styles.cellText}>
                      From {fromDate.toLocaleTimeString()},{fromformattedDate}{' '}
                      to {toDate.toLocaleTimeString()},{toformattedDate}
                    </Text>
                  </View>
                  <View style={styles.eachCell}>
                    <Text style={styles.cellText}>
                      {rule.CancellationCharge}%
                    </Text>
                  </View>
                </View>
              );
            })}
        </>
      </PopUp>
    </>
  );
};
const styles = StyleSheet.create({
  busCard: {
    marginBottom: responsiveHeight(1.5),
    gap: responsiveHeight(0.8),
    padding: responsiveWidth(3),
    borderRadius: responsiveHeight(1.5),
    elevation: responsiveHeight(0.4),
    backgroundColor: 'white',
  },
  travelNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },
  travelName: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.secondry,
    color: colors.primary,
  },
  travelTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.textFont,
    color: colors.primary,
  },
  travelTime: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: colors.gray,
  },
  travelHoursContainer: {
    borderBottomWidth: responsiveHeight(0.18),
    paddingBottom: responsiveHeight(0.3),
    // paddingHorizontal:responsiveWidth(1),
    borderStyle: 'dashed',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: responsiveHeight(2.1),
    fontFamily: fonts.primary,
    color: colors.secondary,
  },
  cancellationText: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: '#e19604',
    textDecorationLine: 'underline',
  },
  Btn: {
    alignSelf: 'flex-end',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    backgroundColor: colors.black,
    marginTop: responsiveHeight(1),
  },
  btnText: {
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.primary,
    color: colors.white,
  },
  arrivalTimeContainer: {
    alignItems: 'flex-end',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e19604',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    marginTop: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(1),
    borderBottomWidth: responsiveHeight(0.3),
  },
  tableRow: {
    flexDirection: 'row',
    padding: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: responsiveHeight(0.1),
    borderStyle: 'dashed',
    backgroundColor: '#e1e2e6',
  },
  eachCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: responsiveHeight(1.5),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
});

export default React.memo(BusRenderData);
