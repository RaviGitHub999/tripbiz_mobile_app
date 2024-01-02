import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import * as Progress from 'react-native-progress';
import { StyleSheet } from 'react-native';
import { responsiveHeight } from '../../../utils/responsiveScale';
import { fonts } from '../../../config/theme';
const ProgressBar = () => {
    const [progress, setProgress] = React.useState(0);
    const [indeterminate, setIndeterminate] = React.useState(true);
  
    useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      const timer = setTimeout(() => {
        setIndeterminate(false);
        interval = setInterval(() => {
          setProgress((prevProgress) =>
            Math.min(0.9, prevProgress + Math.random() / 5)
          );
        }, 2500);
      }, 1500);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }, [])
    return (
        <View style={styles.mainContainer}>
         <Text style={styles.title}>Loading............</Text>
          <Progress.Bar
            progress={progress}
            indeterminate={indeterminate}
            width={responsiveHeight(45)}
            height={responsiveHeight(2)}
            borderRadius={responsiveHeight(1.5)}
          />
        </View>
      )
}
const styles = StyleSheet.create({

    title: {
fontSize:responsiveHeight(2.5),
fontFamily:fonts.textFont
    },
    mainContainer:{
        rowGap:responsiveHeight(1)
    }
  });
export default ProgressBar