import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import * as Progress from 'react-native-progress';
import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';
import { colors, fonts } from '../../../config/theme';
import {
  DotIndicator,
} from 'react-native-indicators';

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(0);
  const [indeterminate, setIndeterminate] = React.useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      setIndeterminate(false);
      interval = setInterval(() => {
        // Set a fixed increment value to achieve slow continuous progress
        setProgress((prevProgress) =>
          Math.min(0.98, prevProgress + 0.002) // Adjust the increment value as needed
        );
      }, 100); // Adjust the interval time as needed for desired speed
    }, 3000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [])

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Loading............</Text>
        <View >
          <DotIndicator color={colors.primaryLite} size={10} />
        </View>
      </View>
      <Progress.Bar
        progress={progress}
        indeterminate={indeterminate}
        width={responsiveHeight(45)}
        height={responsiveHeight(2)}
        borderRadius={responsiveHeight(1.5)}
        borderWidth={responsiveHeight(0.2)}
        color={colors.primaryLite}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    gap: responsiveHeight(1.3)
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2)
  },
  title: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,

  },
});

export default React.memo(ProgressBar)
