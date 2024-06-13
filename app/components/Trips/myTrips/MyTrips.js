import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from '../../../config/theme';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { styles } from './mytripsStyles';
import MyContext from '../../../context/Context';
import ProgressBar from '../../common/progressBar/ProgressBar';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/responsiveScale';
import { RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
const MyTrips = ({ navigation: { navigate } }) => {
  var { actions, userTripStatus, userId, noOfPages } = useContext(MyContext);
  var [currentPage, setCurrentPage] = useState(1);
  var [trips, setTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    setTrips(userTripStatus);
    return () => {
      setTrips([]);
    };
  }, [userTripStatus]);

  useEffect(() => {
    if (isFocused) {
      actions.getLastDoc();
    }
  }, [isFocused]);
  const getTime = seconds => {
    const timestampInSeconds = seconds;
    const date = new Date(timestampInSeconds * 1000);
    const dayOfWeek = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    var dateString = `${month} ${dayOfWeek}`;
    return dateString;
  };
  const handleClick = async () => {
    var newtripId = await actions.createTrip(userTripStatus);
    navigate("TripDetails", { id: newtripId });
  }
  if (userTripStatus.tripLoading) {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressbar}>
          <ProgressBar />
        </View>
      </View>
    );
  }
  var renderPagination = () => {
    const pagination = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(noOfPages, startPage + 4);

    if (noOfPages > 5 && currentPage > 2) {
      if (currentPage + 2 > noOfPages) {
        startPage = noOfPages - 4;
      } else {
        startPage = currentPage - 2;
      }
      endPage = Math.min(noOfPages, startPage + 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <TouchableOpacity onPress={() => handlePageChange(i)} style={currentPage === i ? [{ ...styles.pageBtn, backgroundColor: '#007bff' }] : styles.pageBtn}>
          <Text style={currentPage === i ? [{ ...styles.pageTitle, color: colors.white }] : [styles.pageTitle]}>{`${i}`}</Text>
        </TouchableOpacity>,
      );
    }
    return pagination;
  };

  const handlePageChange = async pageNumber => {
    await actions.setOffset(pageNumber * 10);
    setCurrentPage(pageNumber);
    await actions.getLastDoc();
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await actions.getLastDoc()
      setRefreshing(false);
    }, 2000);
  };
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>My Trips</Text>
      <TouchableOpacity style={styles.addingHotelBtn} onPress={handleClick}>
        <Text style={styles.addingHotelBtnTitle}>Create New Trip </Text>
        <IconSwitcher
          componentName="Feather"
          iconName="plus"
          color={colors.primary}
          iconsize={3}
        />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {trips
          ? trips?.userTrips
            ?.slice(0, 10)
            .sort((a, b) => {
              var aTime = new Date(a?.data?.date?.seconds * 1000);
              var bTime = new Date(b?.data?.date?.seconds * 1000);
              return bTime - aTime;
            })
            ?.map(trip => {
              var date = getTime(trip?.data?.date?.seconds);
              return (
                <TouchableOpacity style={styles.card} key={`${trip?.data?.date?.seconds}`} onPress={() => {
                  navigate("TripDetails", { id: trip.id });
                }}>
                  <Text style={styles.tripName}>{trip?.data?.name}</Text>
                  <Text style={styles.tripDatetitle}>{`created on: `}<Text style={styles.tripDate}>{`${date}`}</Text></Text>
                  <View style={{ flexDirection: "row", gap: responsiveHeight(1) }}>
                    {trip?.hotels?.length > 0 ? (
                      <View style={styles.btn}>
                        <Text style={styles.btnTitle}>Hotels - {trip.hotels.length}</Text>
                      </View>
                    ) : null}
                    {trip?.flights?.length > 0 ? (
                      <View style={styles.btn}>
                        <Text style={styles.btnTitle}>Flights - {trip?.flights?.length}</Text>
                      </View>
                    ) : null}
                    {trip?.cabs?.length > 0 ? (
                      <View style={styles.btn}>
                        <Text style={styles.btnTitle}>Cabs - {trip?.cabs?.length}</Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })
          : null}

        <View
          style={styles.pageBtnsContainer}>
          {currentPage > 1 && (
            <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)} style={styles.pageBtn}>
              <IconSwitcher componentName='Feather' iconName='chevrons-left' color='black' iconsize={2} />
            </TouchableOpacity>
          )}
          {renderPagination()}
          {currentPage < noOfPages && (
            <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)} style={styles.pageBtn}>
              <IconSwitcher componentName='Feather' iconName='chevrons-right' color='black' iconsize={2} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyTrips;
