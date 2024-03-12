import React, { useContext } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MyContext from '../../../context/Context';
import { styles } from './styles';

const TripDetails = ({ navigation }) => {
  const { actions } = useContext(MyContext);
//   const handleBackButtonPress = () => {
//     actions.setFlightBookPage(false);
//     actions.setBookingFlight([]);
//     actions.setFlightResJType(0)
// };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // handleBackButtonPress();
  //       navigation.goBack();
  //       return true;
  //     };
  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, []) 
  // );

  return (
    <View style={styles.mainContainer}>
      <Text>TripDetails</Text>
    </View>
  );
};

export default TripDetails;
