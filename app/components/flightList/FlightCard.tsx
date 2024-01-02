
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../utils/responsiveScale'
import { colors, fonts } from '../../config/theme'
import IconSwitcher from '../common/icons/IconSwitcher'
import MyContext from '../../context/Context'

interface IProps {
  flightGrp: any,
  index: number
}
interface LogosData {
  id: string,
  url: string
}[]
const FlightCard: React.FC<IProps> = ({ flightGrp, index }) => {
    const{actions}=useContext<any>(MyContext)
    var flightArr = flightGrp.map((flight:any, f:number) => {
        return { ...actions.modifyFlightObject(flight) };
      });
  // console.log(flightArr,".................")
  let airlinename = flightArr[0].segments[0].airlineName
//   const flightSymbol = useCallback((airlineName: string): string | undefined => {
//     const logo: any = airlinelogos.find((ele: LogosData) => ele.id === airlineName?.toLowerCase());
//     return logo?.url;
//   }, [airlinelogos]);

  const handleRenderingFlightCard = ({ item }: { item: any }) => {
    var flightCode = "";
    item.flightCodes.forEach((code: string, c: number) => {
      if (c === item.flightCodes.length - 1) {
        flightCode += code;
      } else {
        flightCode += `${code}, `;
      }
    })
    return (
      <View style={styles.mainContainer}>
        <View style={styles.logoHeader} >
          {/* <View style={styles.flightLogoContainer}>{flightSymbol(airlinename) ? (
            <Image source={{ uri: flightSymbol(airlinename) }} style={styles.flightLogo} resizeMode='contain' />
          ) : <IconSwitcher componentName='FontAwesome5' iconName='plane-departure' iconsize={3} />}</View> */}
        <View style={{width:"45%",alignItems:'center'}}>
        <Text style={styles.airlineName}> {`${item.airlineName}`}</Text>
        </View>
         <View style={{width:"40%",alignItems:'center'}}>
         <Text style={styles.flightNumbers}>({flightCode})</Text>
         </View>
        </View>
        <View style={styles.flightsTimingContainer}>
          <View style={styles.originContainer}>
            <Text style={styles.flightTimings}>{item.depTime}</Text>
            <Text style={styles.originTitle}>{item.originAirportCode}</Text>
          </View>
          <View style={styles.directionContainer} >
            <TouchableOpacity style={styles.stopsBtn}>
              <Text style={styles.stopsBtnText}>{item.stopOverPts.length === 0
                ? "Direct"
                : `${item.stopOverPts.length > 1
                  ? `${item.stopOverPts.length} stops`
                  : "1 stop"
                }`}</Text>
              {item.stopOverPts.length !== 0 ? <IconSwitcher componentName='EvilIcons' iconName='chevron-up' iconsize={3.5} color={colors.highlight} /> : null}
            </TouchableOpacity>
            <View style={{ borderTopWidth: 1, borderStyle: "dashed" }}></View>
            <Text style={styles.flighttotalTime}>{item.duration}</Text>
          </View>
          <View style={styles.destinationContainer}>
            <Text style={styles.flightTimings}> {item.arrTime}</Text>
            <Text style={styles.destinationTitle}> {item.destAirportCode}</Text>
          </View>
          <View>
          </View>
        </View>
        {/* {item.arrAfterDays > 0 ? (
                        <div className="flightResults-list-flightCard-depTime-afterDays">
                          <div className="flightResults-list-flightCard-depTime-afterDays-num">{`+ ${segment.arrAfterDays}`}</div>
                          <div>{`${item.arrAfterDays > 1 ? "Days" : "Day"
                            }`}</div>
                        </div>
                      ) : null} */}
           <View style={styles.flightPricesContainer}>
            <View style={styles.luggageBagContainer}>
                <TouchableOpacity><IconSwitcher componentName='MaterialCommunityIcons' iconName='bag-suitcase-outline' color='black' iconsize={3.5} /></TouchableOpacity>
                <TouchableOpacity><IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={3.5} /></TouchableOpacity>
            </View>
             <View>
                <Text style={styles.farePrice}>{`${flightArr[0].fare.toLocaleString("en-IN")}`}</Text>
             </View>
            <TouchableOpacity style={styles.bookingButton}>
                 <Text style={styles.bookingButtonText}>Book</Text>
           </TouchableOpacity>
        </View>
      </View>
    )
  }


  return (
    <FlatList data={flightArr[0].segments} renderItem={handleRenderingFlightCard} keyExtractor={item => item.resultIndex} initialNumToRender={5}
          maxToRenderPerBatch={5} 
          windowSize={5}/>
  )
}

export default React.memo(FlightCard)
const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(3),
    backgroundColor: colors.white,
    borderRadius: responsiveHeight(2),
    rowGap: responsiveHeight(2.5),
    elevation: responsiveHeight(1),
    marginHorizontal: responsiveWidth(3.5),
    marginTop: responsiveHeight(2.5)
  },
  flightLogoContainer: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: "center",
  },
  flightLogo: {
    height: responsiveHeight(7),
    width: responsiveWidth(7),
  },
  logoHeader: {
    flexDirection: "row",
    // columnGap: responsiveWidth(3),
    alignItems: 'center',
    justifyContent:'space-between'
  },
  flightsTimingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flightPricesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  directionContainer: {
    width: "50%",
    rowGap: 4,
  },
  luggageBagContainer: {
    width: "25%",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flightRouteEachCard: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: responsiveHeight(1.5),
    backgroundColor: colors.highlightTranslucent,
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    alignContent: 'center'
  },
  horizentalLineContainer: {
    justifyContent: 'center',
    width: "50%",
    rowGap: responsiveHeight(1)
  },
  horizentalLine: {
    borderBottomWidth: responsiveWidth(.3),
    borderStyle: "dashed",
    marginTop: "15%",
    color: colors.black
  },
  eachFlighttotalTime: {
    textAlign: "center",
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.textFont,
    color: colors.black
  },
  layOver: {
    marginBottom: responsiveHeight(1.5),
    paddingHorizontal: responsiveHeight(2)
  },
  destinationContainer: {
    alignItems: 'flex-end',
    rowGap: responsiveHeight(0.5),
    width: "25%"
  },
  originContainer: {
    rowGap: responsiveHeight(0.5),
    width: "25%"
  },
  destinationTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: fonts.primary,
    color: colors.black
  },
  originTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: fonts.primary,
    color: colors.black
  },
  flightTimings: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.textFont,
    color: colors.black
  },
  layoverTitle: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: fonts.primary,
    color: colors.red
  },
  layoverTiming: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.textFont,
    color: colors.gray
  },
  modelMainContainer: {
    justifyContent: 'center',
    height: '100%',
    backgroundColor: colors.gray,
  },
  modelSubContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: responsiveWidth(3),
    marginHorizontal: responsiveWidth(2),
    borderRadius: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
    borderWidth: 1,
    borderStyle: "dashed",
    elevation: responsiveHeight(1)
  },
  crossIcon: {
    alignItems: 'flex-end',
    padding: responsiveHeight(1)
  },
  airlineName: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: fonts.primary,
    color: colors.black,
  },
  flightNumbers: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.textInput,
    color: colors.gray,
    // borderWidth:1,
    // paddingHorizontal:10
  },
  stopsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // columnGap: responsiveWidth(2),
  },
  stopsBtnText: {
    color: colors.highlight
  },
  flighttotalTime: {
    fontSize: responsiveFontSize(1.8),
    textAlign: "center",
    fontFamily: fonts.textFont,
    color: colors.black,
    letterSpacing: responsiveHeight(0.5)
  },
  farePrice: {
    color: colors.red,
    fontSize: responsiveFontSize(2),
  },
  bookingButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveHeight(3),
    borderRadius: responsiveHeight(2),
    paddingVertical: responsiveHeight(1),
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookingButtonText: {
    color: colors.white,
    fontFamily: fonts.textInput
  },
  viewAllEachCard: {
    rowGap: responsiveHeight(0.9),
    width: "30%"
  },
  viewAlliconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewAllRenderingContainer: {
    marginBottom: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: colors.gray,
    borderRadius: responsiveHeight(2),
    padding: responsiveHeight(1.3)
  },
  fareClassification: {
    fontSize: responsiveHeight(1.6),
    fontFamily: fonts.primary,
    color: colors.facebook,
  },
  luggagePopUpmodelSubcontainer:
  {
    marginHorizontal: responsiveWidth(5),
    paddingHorizontal: responsiveHeight(2),
    borderRadius: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: colors.white
  },
  cancelTableTitleCell: {
    width: "25%",
    textAlign: "center",
    textAlignVertical: 'center',
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(2),
    color: colors.black
  },
  cancelTableCell: {
    width: "25%",
    textAlign: "center",
    textAlignVertical: 'center',
    fontFamily: fonts.textFont,
    fontSize: responsiveHeight(1.5),
    color: colors.black
  },
  line: {
    borderTopWidth: 1,
    borderColor: colors.black
  },
  luaggageBagPopupContainer: {
    rowGap: responsiveHeight(1.2)
  },
  luaggageBagPopuptext: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.textFont,
    color: colors.black
  },
  MiniFareRulesRenderingContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveHeight(1),
    marginBottom: responsiveHeight(2)
  },
  solidLine: {
    borderTopWidth: 1,
    borderColor: colors.black,
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1.5)
  },
  dashedLine: {
    borderTopWidth: 1,
    borderColor: colors.black,
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(1.5),
    borderStyle: 'dashed'
  }
})