import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors, fonts } from '../../../config/theme';
import { responsiveHeight} from '../../../utils/responsiveScale';
const FCard = props => {
  const {flightArr, airline} = props;
  return (
    <View>
      <View>
        {flightArr[0].segments.map((segment, sg) => {
          var flightCode = '';
          segment.flightCodes.forEach((code, c) => {
            if (c === segment.flightCodes.length - 1) {
              flightCode += code;
            } else {
              flightCode += `${code}, `;
            }
          });

          return (
           
              <View style={{gap:responsiveHeight(1)}}>
                <View style={{flexDirection:"row",alignItems:'center',gap:responsiveHeight(.9),flexWrap:'wrap'}}>
                    {
                         airline[0] ?<Image source={{uri:airline[0]?.url}} style={{height:20,width:20}}/>:
                         <IconSwitcher componentName='MaterialIcons' iconName='flight-takeoff' color={colors.gray} iconsize={2}/>
                    }
                    <Text style={styles.flightTimings}>{`${segment.airlineName}`}</Text>
                    <Text style={styles.flightTimings}>{`( ${flightCode} )`}</Text>
                </View>
                {/* <View style={{alignSelf:'flex-end',marginBottom:responsiveHeight(1),backgroundColor:colors.highlight,padding:responsiveHeight(.5),borderRadius:responsiveHeight(1)}}>
                    <Text style={styles.flightTimings}>
                    {segment.depTimeDate.toString().slice(4, 10)}
                    </Text>
                </View> */}
                <View style={styles.flightsTimingContainer}>
                        <View style={styles.originContainer}>
                            <Text style={styles.originTitle}>{segment.originAirportCode}</Text>
                            <Text style={styles.flightTimings}>{segment.depTime}</Text>
                        </View>
                        <View style={styles.directionContainer}>
                            <View style={styles.stopsBtn} >
                                <Text style={styles.stopsBtnText}>
                                    {segment.stopOverPts.length === 0
                                        ? 'Direct'
                                        : `${segment.stopOverPts.length > 1
                                            ? `${segment.stopOverPts.length} stops`
                                            : '1 stop'
                                        }`}
                                </Text>
                                {segment.stopOverPts.length !== 0 ? (
                                    <IconSwitcher
                                        componentName="EvilIcons"
                                        iconName="chevron-up"
                                        iconsize={3.5}
                                        color={colors.highlight}
                                    />
                                ) : null}
                            </View>
                            <View style={{ borderTopWidth: responsiveHeight(.07), borderStyle: 'dashed' }}></View>
                            <Text style={styles.flighttotalTime}>{segment.duration}</Text>
                        </View>
                        <View style={styles.destinationContainer}>
                            <Text style={styles.destinationTitle}> {segment.destAirportCode}</Text>
                            <Text style={styles.flightTimings}> {segment.arrTime}</Text>
                        </View>
                        <View>
                            {/* {
                  <View>
                    <Text>{`+ ${item.arrAfterDays}`}</Text>
                    <Text>{`${item.arrAfterDays > 1 ? "Days" : "Day"}`}</Text>
                    </View>
                }  */}
                        </View>
                </View>
              </View>
          );
        })}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
   
    flightsTimingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:"#f5f5f5",
        padding:responsiveHeight(1),
        borderRadius:responsiveHeight(1)
    },
    originContainer: {
        rowGap: responsiveHeight(0.5),
        width: '25%',
    },
    originTitle: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary,
        color: colors.black,
    },
    flightTimings: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.textFont,
        color: colors.black,
    },
    directionContainer: {
        width: '50%',
        rowGap: 4,
    },
    stopsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // columnGap: responsiveWidth(2),
    },
    stopsBtnText: {
        color: colors.highlight,
        fontSize: responsiveHeight(1.3),
        fontFamily: fonts.textFont,
    },
    flighttotalTime: {
        fontSize: responsiveHeight(1.3),
        textAlign: 'center',
        fontFamily: fonts.textFont,
        color: colors.black,
        letterSpacing: responsiveHeight(0.5),
    },
    destinationContainer: {
        alignItems: 'flex-end',
        rowGap: responsiveHeight(0.5),
        width: '25%',
    },
    destinationTitle: {
        fontSize: responsiveHeight(1.5),
        fontFamily: fonts.primary,
        color: colors.black,
    },
});
export default FCard;
