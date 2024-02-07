
import React, { Component, ReactNode } from 'react';
import MyContext from './Context';
import Fuse from 'fuse.js';
import AirportsData from "../components/jsonData/Airports.json"
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const cabinclassMap = {
  1: "Any cabin class",
  2: "Economy",
  3: "Premium Economy",
  4: "Business",
  5: "Premium Business class",
  6: "First"
};
const seatTypeObj = {
  0: "Not set",
  1: "Window",
  2: "Aisle",
  3: "Middle",
  4: "WindowRecline",
  5: "WindowWing",
  6: "WindowExitRow",
  7: "WindowReclineWing",
  8: "WindowReclineExitRow",
  9: "WindowWingExitRow",
  10: "AisleRecline",
  11: "AisleWing",
  12: "AisleExitRow",
  13: "AisleReclineWing",
  14: "AisleReclineExitRow",
  15: "AisleWingExitRow",
  16: "MiddleRecline",
  17: "MiddleWing",
  18: "MiddleExitRow",
  19: "MiddleReclineWing",
  20: "MiddleReclineExitRow",
  21: "MiddleWingExitRow",
  22: "WindowReclineWingExitRow",
  23: "AisleReclineWingExitRow",
  24: "MiddleReclineWingExitRow",
  25: "WindowBulkhead",
  26: "WindowQuiet",
  27: "WindowBulkheadQuiet",
  28: "MiddleBulkhead",
  29: "MiddleQuiet",
  30: "MiddleBulkheadQuiet",
  31: "AisleBulkhead",
  32: "AisleQuiet",
  33: "AisleBulkheadQuiet",
  34: "CentreAisle",
  35: "CentreMiddle",
  36: "CentreAisleBulkHead",
  37: "CentreAisleQuiet",
  38: "CentreAisleBulkHeadQuiet",
  39: "CentreMiddleBulkHead",
  40: "CentreMiddleQuiet",
  41: "CentreMiddleBulkHeadQuiet",
  42: "WindowBulkHeadWing",
  43: "WindowBulkHeadExitRow",
  44: "MiddleBulkHeadWing",
  45: "MiddleBulkHeadExitRow",
  46: "AisleBulkHeadWing",
  47: "AisleBulkHeadExitRow",
  48: "NoSeatAtThisLocation",
  49: "WindowAisle",
  50: "NoSeatRow",
  51: "NoSeatRowExit",
  52: "NoSeatRowWing",
  53: "NoSeatRowWingExit",
  54: "WindowAisleRecline",
  55: "WindowAisleWing",
  56: "WindowAisleExitRow",
  57: "WindowAisleReclineWing",
  58: "WindowAisleReclineExitRow",
  59: "WindowAisleWingExitRow",
  60: "WindowAisleBulkhead",
  61: "WindowAisleBulkheadWing"
};
let abortAirportController;
var fuse = new Fuse(AirportsData, {
  keys: ["cityName", "name", "iataCode", "countryName"],
  includeScore: true,
  threshold: 0.2
});
export default class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      password: "",
      origin: "",
      destination: "",
      departure: "Departure Date",
      returnDate: "Return Date",
      adults: 1,
      children: 0,
      infants: 0,
      classes: "Economy",
      directflight: false,
      oneStopFlight: false,
      dateValue: new Date(),
      returnDateValue: new Date(),
      cabinClassId: "2",
      journeyWay: "1",
      departureformattedDate: "",
      returnformattedDate: "",
      outbound: "",
      inbound: "",
      airportOriginData: [],
      airportOriginLoading: false,
      originselected: false,
      destinationselected: false,
      desRes: false,
      oriRes: false,
      flightResList: [],
      searchingFlights: true,
      airportDestData: [],
      airportDestLoading: false,
      originSelectedAirport: {
        name: "",
        iataCode: "",
        address: {
          cityName: "",
          countryName: ""
        }
      },
      destinationSelectedAirPort: {
        name: "",
        iataCode: "",
        address: {
          cityName: "",
          countryName: ""
        },
      },
      internationalFlights: false,
      flightSearchToken: "",
      flightSessionStarted: false,
      flightSessionExpired: false,
      flightResult: {},
      flightResJType: 0,
      flightsLogosData: [],
      showFilters: false,
      airlineName: "",
      destStartTime: null,
      destEndTime: null,
      stopPts:null,
      byDuration: false,
      byCost: true,
      intStopPts1:null,
      intStopPts2:null,
      flightTravellers: 0,
      originStartTime: null,
    originEndTime: null,
    destStartTime: null,
    intOriginStartTime1: null,
    intOriginEndTime1: null,
    intOriginStartTime2: null,
    intOriginEndTime2: null,
    intDestStartTime1: null,
    intDestEndTime1: null,
    intDestStartTime2: null,
    intDestEndTime2: null,
    adminDetails: {},
    domesticFlight: 0,
    internationalFlight: 0,
    domesticHotel: 0,
    internationalHotel: 0,
      actions: {
        loginAction:async()=>
        {
          try {
            const email1="pavan@gmail.com"
            const password1='pavan@gmail'
            const response = await auth().signInWithEmailAndPassword(email1, password1);
            return {user:response.user};
          } catch (error) {
            throw error;
          }
        },
        handleDropDownState: (payload) => {
          switch (payload.stateName) {
            case "Adults":
              this.setState({ adults: payload.stateValue })
              break;
            case "Children":
              this.setState({ children: payload.stateValue })
              break;
            case "Infants":
              this.setState({ infants: payload.stateValue })
              break;
            default:
              break;
          }
        },
        handleClass: (payload) => {
          this.setState({ classes: payload })
          const classId = (() => {
            switch (payload) {
              case "Economy":
                return "2";
              case "Business":
                return "4";
              case "First":
                return "6";
              case "Premium Economy":
                return "3";
              case "Any cabin class":
                return "1";
              default:
                return "1";
            }
          })();
          this.setState({ cabinClassId: classId })
        },
        handleJourneyWay: (payload) => {
          this.setState({ journeyWay: payload })
        },
        handleDepartureDateChange: (payload) => {
          if (payload) {

            const formattedDate = payload.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            // state.departure = formattedDate,
            this.setState({ departure: formattedDate })
            this.setState({ departureformattedDate: formattedDate })
            this.setState({ dateValue: payload })
            const inputDate = new Date(payload);
            const dateString = inputDate.toISOString();
            this.setState({ outbound: `${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00` })
          }
        },
        handleReturnDateChange: (payload) => {
          if (payload) {

            const formattedDate = payload.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            this.setState({ returnDate: formattedDate })
            this.setState({ returnformattedDate: formattedDate })
            this.setState({ returnDateValue: payload })
            const inputDate = new Date(payload);
            const dateString = inputDate.toISOString();
            this.setState({ inbound: `${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00` })
          }
        },
        handleChangeOriginTextInput: (payload) => {
          const query = payload.e.trim();
          const loading1 = query !== "" ? true : false;
          this.setState({ ...this.state, [payload.name]: payload.e, airportOriginLoading: loading1, oriRes: loading1, airportOriginData: [] })
        },
        handleChangeDestinationTextInput: (payload) => {
          const query = payload.e.trim();
          const loading = query !== "" ? true : false;
          this.setState({ ...this.state, [payload.name]: payload.e, airportDestLoading: loading, desRes: loading, airportDestData: [] })
        },
        handleOriginSelectedAirPort: (payload) => {
          this.setState({
            ...this.state,
            originSelectedAirport: payload,
            oriRes: !this.state.oriRes,
            origin: '',
            originselected: true
          })
        },
        handleDestinationSelectedAirPort: (payload) => {
          this.setState({
            ...this.state,
            destinationSelectedAirPort: payload,
            desRes: !this.state.desRes,
            destination: '',
            destinationselected: true
          })
        },
        handleOnChangeText: (action) => {
         this.setState({ [action.name]: action.event})
        }
        ,
        handleFlightsFilter: (payload) => {
          this.setState({ showFilters: payload })
        },
        setFlightResJType: (value) => {
          this.setState({
            flightResJType: value
          });
        },
        handlesearchingFlights: () => {
          this.setState({
         searchingFlights: true ,
          origin:"",
          destination: "",
          departure: "Departure Date",
          returnDate: "Return Date",
          cabinClassId: "2",
          journeyWay: "1",
          departureformattedDate: "",
          returnformattedDate: "",
          })
          
        },
        handleFlightsLogos: async () => {
          const querySnapshot = await firestore().collection("airlinelogos").get();
          let updatedAirlinelogos = [];

          querySnapshot.forEach(snapshot => {
            updatedAirlinelogos.push({ id: snapshot.id, url: snapshot.data().url });
          });
          this.setState({ flightsLogosData: updatedAirlinelogos })
        },
        changeOriginAirportKeyword: this.debounce(async (keyword) => {
          // console.log(keyword);
          if (keyword !== "") {
            try {
              var results = fuse.search(keyword);

              if (results.length > 0) {
                var data = results.map((res, r) => {
                  var item = res.item;
                  return {
                    name: item.name,
                    iataCode: item.iataCode,
                    address: {
                      cityName: item.cityName,
                      countryName: item.countryName
                    }
                  };
                });

                // console.log("Search results Origin", data);

                this.setState({
                  airportOriginData: data,
                  airportOriginLoading: false
                });
              } else {
                var data = await this.state.actions.airportKeywordReq(keyword, "Origin");
                // console.log(data);
                this.setState({
                  airportOriginData: data?.data?.data,
                  airportOriginLoading: false
                });
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            if (abortAirportController) {
              abortAirportController.abort();
            }
            this.setState({
              airportOriginData: [],
              airportOriginLoading: false
            });
          }
        }, 500),

        changeDestAirportKeyword: this.debounce(async (keyword) => {
          // console.log(keyword);
          if (keyword !== "") {
            try {
              var results = fuse.search(keyword);

              if (results.length > 0) {
                var data = results.map((res, r) => {
                  var item = res.item;
                  return {
                    name: item.name,
                    iataCode: item.iataCode,
                    address: {
                      cityName: item.cityName,
                      countryName: item.countryName
                    }
                  };
                });

                // console.log("Search results Destination", data);

                this.setState({
                  airportDestData: data,
                  airportDestLoading: false
                });
              } else {
                var data = await this.state.actions.airportKeywordReq(keyword, "Dest");
                // console.log(data);
                this.setState({
                  airportDestData: data?.data?.data,
                  airportDestLoading: false
                });
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            if (abortAirportController) {
              abortAirportController.abort();
            }
            this.setState({
              airportDestData: [],
              airportDestLoading: false
            });
          }
        }, 500),

        airportKeywordReq: (keyword, type) => {
          if (abortAirportController) {
            abortAirportController.abort();
          }
          abortAirportController = new AbortController();
          // console.log(`Req for ${type}`, keyword);
          return axios.post(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/paymentApi/airportSearch",
            { keyword, subType: "CITY,AIRPORT", page: 0 },
            { signal: abortAirportController.signal }
          );
        },
        separateFlightsByType: (results) => {
          this.setState({
            flightResList: results,
            internationalFlights: results.length > 1 ? false : true
          });
        },
        diffMinutes: (dateStr1, dateStr2) => {
          var date1 = new Date(dateStr1);
          var date2 = new Date(dateStr2);

          var diff = date2 - date1;

          var diffMinutes = Math.floor(diff / 1000 / 60);

          return diffMinutes;
        },
        diffDays: (dateStr1, dateStr2) => {
          var date1 = new Date(dateStr1);
          var date2 = new Date(dateStr2);

          const diffTime = (date2 - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // console.log(date1,"diffDays")
          return diffDays;
        },
        isExitRow: (row) => {
          var firstSeat = row.Seats[0];
          var i = 1;
          while (firstSeat.noSeat && i < row.Seats.length) {
            firstSeat = row.Seats[i];
            i++;
          }
          if (
            !firstSeat.noSeat &&
            seatTypeObj[firstSeat.SeatType].includes("ExitRow")
          ) {
            return true;
          }
          return false;
        },
        modifyFlightObject: (flight) => {
          var totalDuration = 0;
          var segments = flight?.Segments?.map((segment, sg) => {
            var seg1 = segment[0];
            var segLast = segment[segment.length - 1];
  
            var originCityName = seg1.Origin.Airport.CityName;
            var originAirportCode = seg1.Origin.Airport.AirportCode;
            var originAirportName = seg1.Origin.Airport.AirportName;
            var originTerminal = seg1.Origin.Airport.Terminal;
  
            var destCityName = segLast.Destination.Airport.CityName;
            var destAirportCode = segLast.Destination.Airport.AirportCode;
            var destAirportName = segLast.Destination.Airport.AirportName;
            var destTerminal = segLast.Destination.Airport.Terminal;
  
            var depTimeDate = new Date(seg1.Origin.DepTime);
            var arrTimeDate = new Date(segLast.Destination.ArrTime);
  
            var depTimeArr = seg1.Origin.DepTime.split("T")[1].split(":");
            var arrTimeArr = segLast.Destination.ArrTime.split("T")[1].split(":");
            var depTime = `${depTimeArr[0]}:${depTimeArr[1]}`;
            var arrTime = `${arrTimeArr[0]}:${arrTimeArr[1]}`;
  
            var durationSum = 0;
  
            var stopOverPts = [];
            var charNum = 0;
  
            var segRoutes = [];
  
            var dur = 0;
            var flightCodes = [];
  
            segment.forEach((seg, s) => {
              var flightCode = `${seg.Airline.AirlineCode} - ${seg.Airline.FlightNumber} ${seg.Airline.FareClass}`;
              flightCodes[s] = flightCode;
  
              var flightDuration =
                seg.Duration !== 0 ? seg.Duration : seg.AccumulatedDuration;
  
              dur += flightDuration + seg.GroundTime;
  
              durationSum += flightDuration;
  
              if (s > 0) {
                var currDepTime = seg.Origin.DepTime;
                var prevArrTime = segment[s - 1].Destination.ArrTime;
  
                var diffMin = this.state.actions.diffMinutes(
                  prevArrTime,
                  currDepTime
                );
                durationSum += diffMin;
  
                var stopDurationNum = diffMin / 60;
                var stopDurHours = Math.floor(stopDurationNum);
                var stopDurMins = Math.ceil(
                  60 * (stopDurationNum - Math.floor(stopDurationNum))
                );
                var stopDuration = `${stopDurHours ? `${stopDurHours}h ` : ""}${stopDurMins !== 0 ? `${stopDurMins}m` : ""
                  }`;
  
                charNum += seg.Origin.Airport.CityName.length;
  
                stopOverPts.push({
                  cityName: seg.Origin.Airport.CityName,
                  stopDuration,
                  charNum
                });
              }
  
              var durNum = flightDuration / 60;
              var durHrs = Math.floor(durNum);
              var durMns = Math.ceil(60 * (durNum - Math.floor(durNum)));
              var durationStr = `${durHrs ? `${durHrs}h ` : ""}${durMns !== 0 ? `${durMns}m` : ""
                }`;
  
              var dpTimeStr = seg.Origin.DepTime;
              var arTimeStr = seg.Destination.ArrTime;
  
              var depDate = new Date(dpTimeStr);
              var arrDate = new Date(arTimeStr);
              var dpTimeArr = dpTimeStr.split("T")[1].split(":");
              var arTimeArr = arTimeStr.split("T")[1].split(":");
              var dpTime = `${dpTimeArr[0]}:${dpTimeArr[1]}`;
              var arTime = `${arTimeArr[0]}:${arTimeArr[1]}`;
  
              segRoutes.push({
                originCode: seg.Origin.Airport.AirportCode,
                destCode: seg.Destination.Airport.AirportCode,
                flightDur: durationStr,
                layoverDur: stopDuration ? stopDuration : null,
                depTime: dpTime,
                arrTime: arTime,
                arrAfterDays: this.state.actions.diffDays(depDate, arrDate),
                arrCity: seg.Origin.Airport.CityName,
                destCity: seg.Destination.Airport.CityName
              });
            });
  
            var cabinClass = cabinclassMap[segment[0].CabinClass];
            var durationNum = durationSum / 60;
            var durHours = Math.floor(durationNum);
            var durMins = Math.ceil(60 * (durationNum - Math.floor(durationNum)));
            var duration = `${durHours ? `${durHours}h ` : ""}${durMins !== 0 ? `${durMins}m` : ""
              }`;
  
            var arrAfterDays = this.state.actions.diffDays(
              depTimeDate,
              arrTimeDate
            );
  
            totalDuration += dur;
  
            return {
              airlineName: seg1.Airline.AirlineName,
              mainFlgtCode: flightCodes[0],
              flightCodes,
              arrTime,
              arrTimeDate,
              depTime,
              depTimeDate,
              arrAfterDays,
              originCityName,
              originAirportCode,
              originAirportName,
              originTerminal,
              destCityName,
              destAirportCode,
              destAirportName,
              destTerminal,
              duration,
              dur,
              stopOverPts,
              segRoutes,
              baggage: seg1.Baggage,
              cabinBaggage: seg1.CabinBaggage,
              cabinClass
            };
          });
  
          return {
            segments,
            fare: flight.Fare.OfferedFare
              ? Math.ceil(flight.Fare.OfferedFare)
              : Math.ceil(flight.Fare.PublishedFare),
            fareType: flight.FareClassification?.Type,
            fareRules: flight.MiniFareRules ? flight.MiniFareRules : [],
            resultIndex: flight.ResultIndex,
            totalDuration
          };
        },
        editFlightSearch: () => {
          this.setState({
            flightResult: {},
            flightResList: [],
            searchingFlights:true,
            flightBookPage:false
          });
        },
        setAirlineName: (value) => {
          this.setState({
            airlineName: value
          });
        },
        setStopPts: (value) => {
          this.setState({
            stopPts: value
          })
        },
        setIntStopPts1: (value) => {
          this.setState({
            intStopPts1: value
          });
        },
        setIntStopPts2: (value) => {
          this.setState({
            intStopPts2: value
          });
        },
        setOriginStartTime: (value) => {
          this.setState({
            originStartTime: value
          });
        },
        setOriginEndTime: (value) => {
          this.setState({
            originEndTime: value
          });
        },
        setDestStartTime: (value) => {
          this.setState({
            destStartTime: value
          });
        },
        setDestEndTime: (value) => {
          this.setState({
            destEndTime: value
          });
        },
        setIntDestStartTime1: (value) => {
          this.setState({
            intDestStartTime1: value
          });
        },
        setIntDestStartTime2: (value) => {
          this.setState({
            intDestStartTime2: value
          });
        },
        setIntDestEndTime1: (value) => {
          this.setState({
            intDestEndTime1: value
          });
        },
        setIntDestEndTime2: (value) => {
          this.setState({
            intDestEndTime2: value
          });
        },
        setIntOriginStartTime1: (value) => {
          this.setState({
            intOriginStartTime1: value
          });
        },
        setIntOriginStartTime2: (value) => {
          this.setState({
            intOriginStartTime2: value
          });
        },
        setIntOriginEndTime1: (value) => {
          this.setState({
            intOriginEndTime1: value
          });
        },
        setIntOriginEndTime2: (value) => {
          this.setState({
            intOriginEndTime2: value
          });
        },
        setByDuration: async (value) => {
          this.setState({
            byDuration: value
          });
        },
        setByCost: async (value) => {
          this.setState({
            byCost: value
          });
        },
        isOpenViewPrices:()=>
        {
          flightArr[0].segments.map((ele)=>
          {
            console.log(ele.ResultIndex)
          })
        },
        validSeatMap: (seatData) => {
          var valid = false;
          //console.log(seatData);
          seatData.SegmentSeat.forEach((seg, s) => {
            var firstRow = seg.RowSeats[1];
  
            if (firstRow.Seats.length === 6) {
              valid = true;
            }
          });
  
          return valid;
        },
        fillUpRowSeats: (rowSeats) => {
          var rowsNum = 0;
          var firstRow = rowSeats[1];
          rowsNum = Number(firstRow.Seats[0].RowNo) - 1;
          var rows = [];
  
          for (var i = 1; i <= rowsNum; i++) {
            rows.push({
              Seats: [
                {
                  AvailablityType: 3,
                  Code: `${i}A`,
                  RowNo: `${i}`,
                  SeatNo: "A",
                  SeatType: 0
                },
                {
                  AvailablityType: 3,
                  Code: `${i}B`,
                  RowNo: `${i}`,
                  SeatNo: "B",
                  SeatType: 0
                },
                {
                  AvailablityType: 3,
                  Code: `${i}C`,
                  RowNo: `${i}`,
                  SeatNo: "C",
                  SeatType: 0
                },
                {
                  AvailablityType: 3,
                  Code: `${i}D`,
                  RowNo: `${i}`,
                  SeatNo: "D",
                  SeatType: 0
                },
                {
                  AvailablityType: 3,
                  Code: `${i}E`,
                  RowNo: `${i}`,
                  SeatNo: "E",
                  SeatType: 0
                },
                {
                  AvailablityType: 3,
                  Code: `${i}F`,
                  RowNo: `${i}`,
                  SeatNo: "F",
                  SeatType: 0
                }
              ]
            });
          }
  
          rowSeats.shift();
  
          var seatsNo = {
            0: "A",
            1: "B",
            2: "C",
            3: "D",
            4: "E",
            5: "F"
          };
  
          rowSeats.forEach((row, r) => {
            if (row.Seats.length < 6) {
              var i = 0;
              var s = 0;
              var seats = [];
              while (s < 6) {
                if (
                  (row.Seats[i] && row.Seats[i].SeatNo !== seatsNo[s]) ||
                  !row.Seats[i]
                ) {
                  seats[s] = { noSeat: true };
                } else {
                  seats[s] = { ...row.Seats[i] };
                  i++;
                }
                s++;
              }
  
              row.Seats = [...seats];
              // console.log("Filled seats", seats);
            }
          });
          return [...rows, ...rowSeats];
        },
        fillUpSegmentSeats: (seatData) => {
          var seatDataNew = seatData.map((seatSeg, s) => {
            return {
              RowSeats:this.state.actions.fillUpRowSeats(seatSeg.RowSeats)
            };
          });
  
          return seatDataNew;
        },
        getWingPos: (rowSeats) => {
          var wingPosArr = [];
  
          rowSeats.forEach((row, r) => {
            var firstSeat = row.Seats[0];
            var i = 1;
            while (firstSeat.noSeat && i < row.Seats.length) {
              firstSeat = row.Seats[i];
              i++;
            }
  
            if (
              !firstSeat.noSeat &&
              seatTypeObj[firstSeat.SeatType].includes("Wing")
            ) {
              wingPosArr.push(firstSeat.RowNo);
            }
          });
  
          return wingPosArr;
        },
        getWingPosArr: (seatData) => {
          var wingPosArr = seatData.map((seatSeg, s) => {
            return [...this.state.actions.getWingPos(seatSeg.RowSeats)];
          });
  
          return wingPosArr;
        },
        // filterFlights: (flightArr) => {
        //   var filteredArr = flightArr;
        //   // if (this.state.byCost) {
        //   //   filteredArr.sort(
        //   //     (a, b) => a[0].Fare.PublishedFare - b[0].Fare.PublishedFare
        //   //   );
        //   // }
        //   // if (this.state.byDuration) {
        //   //   filteredArr.sort((a, b) => {
        //   //     var aFlight = this.state.actions.modifyFlightObject(a[0]);
        //   //     var bFlight = this.state.actions.modifyFlightObject(b[0]);

        //   //     var aDur = aFlight.totalDuration;
        //   //     var bDur = bFlight.totalDuration;

        //   //     return aDur - bDur;
        //   //   });
        //   // }

        //   if (this.state.airlineName) {
        //     filteredArr = filteredArr.filter((a) => {
        //       var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //       return (
        //         newflightObj.segments[0].airlineName === this.state.airlineName
        //       );
        //     });
        //   }
  
        //    if (this.state.stopPts === 0 || this.state.stopPts) {
        //     filteredArr = filteredArr.filter((a) => {
        //       var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //       return (
        //         newflightObj.segments[0].stopOverPts.length <= this.state.stopPts
        //       );
        //     });
        //   }
        //   if (this.state.originStartTime && this.state.originEndTime) {
        //     if (this.state.originEndTime.getHours() === 23) {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours() >
        //           this.state.originStartTime.getHours() &&
        //           (new Date(newflightObj.segments[0].arrTimeDate).getHours() <
        //             this.state.originEndTime.getHours() ||
        //             (new Date(newflightObj.segments[0].arrTimeDate).getHours() ===
        //               this.state.originEndTime.getHours() &&
        //               new Date(
        //                 newflightObj.segments[0].arrTimeDate
        //               ).getMinutes() < this.state.originEndTime.getMinutes()))
        //         );
        //       });
        //     } else {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours() >
        //           this.state.originStartTime.getHours() &&
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours() <
        //           this.state.originEndTime.getHours()
        //         );
        //       });
        //     }
        //   }
        //   if (this.state.destStartTime && this.state.destEndTime) {
        //     if (this.state.destEndTime.getHours() === 23) {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         console.log(
        //           new Date(newflightObj.segments[0].depTimeDate).getHours(),
        //           this.state.destStartTime.getHours()
        //         );
        //         return (
        //           new Date(newflightObj.segments[0].depTimeDate).getHours() >
        //           this.state.destStartTime.getHours() &&
        //           (new Date(newflightObj.segments[0].depTimeDate).getHours() <
        //             this.state.destEndTime.getHours() ||
        //             (new Date(newflightObj.segments[0].depTimeDate).getHours() ===
        //               this.state.destEndTime.getHours() &&
        //               new Date(
        //                 newflightObj.segments[0].depTimeDate
        //               ).getMinutes() < this.state.destEndTime.getMinutes()))
        //         );
        //       });
        //     } else {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         console.log(
        //           new Date(newflightObj.segments[0].depTimeDate).getHours(),
        //           this.state.destStartTime.getHours()
        //         );
        //         return (
        //           new Date(newflightObj.segments[0].depTimeDate).getHours() >
        //           this.state.destStartTime.getHours() &&
        //           new Date(newflightObj.segments[0].depTimeDate).getHours() <
        //           this.state.destEndTime.getHours()
        //         );
        //       });
        //     }
        //   }




          
        //   if (this.state.intDestStartTime1 && this.state.intDestEndTime1) {
        //     if (this.state.intDestEndTime1.getHours() === 23) {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[0].depTimeDate).getHours() >
        //           this.state.intDestStartTime1.getHours() &&
        //           (new Date(newflightObj.segments[0].depTimeDate).getHours() <
        //             this.state.intDestEndTime1.getHours() ||
        //             (new Date(newflightObj.segments[0].depTimeDate).getHours() ===
        //               this.state.intDestEndTime1.getHours() &&
        //               new Date(
        //                 newflightObj.segments[0].depTimeDate
        //               ).getMinutes() < this.state.intDestEndTime1.getMinutes()))
        //         );
        //       });
        //     } else {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[0].depTimeDate).getHours() >
        //           this.state.intDestStartTime1.getHours() &&
        //           new Date(newflightObj.segments[0].depTimeDate).getHours() <
        //           this.state.intDestEndTime1.getHours()
        //         );
        //       });
        //     }
        //   }
        //   if (this.state.intDestStartTime2 && this.state.intDestEndTime2) {
        //     if (this.state.intDestEndTime2.getHours() === 23) {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[1].depTimeDate).getHours() >
        //           this.state.intDestStartTime2.getHours() &&
        //           (new Date(newflightObj.segments[1].depTimeDate).getHours() <
        //             this.state.intDestEndTime2.getHours() ||
        //             (new Date(newflightObj.segments[1].depTimeDate).getHours() ===
        //               this.state.intDestEndTime2.getHours() &&
        //               new Date(
        //                 newflightObj.segments[1].depTimeDate
        //               ).getMinutes() < this.state.intDestEndTime2.getMinutes()))
        //         );
        //       });
        //     } else {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[1].depTimeDate).getHours() >
        //           this.state.intDestStartTime2.getHours() &&
        //           new Date(newflightObj.segments[1].depTimeDate).getHours() <
        //           this.state.intDestEndTime2.getHours()
        //         );
        //       });
        //     }
        //   }
        //   if (this.state.intOriginStartTime1 && this.state.intOriginEndTime1) {
        //     if (this.state.intOriginEndTime1.getHours() === 23) {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours() >
        //           this.state.intOriginStartTime1.getHours() &&
        //           (new Date(newflightObj.segments[0].arrTimeDate).getHours() <
        //             this.state.intOriginEndTime1.getHours() ||
        //             (new Date(newflightObj.segments[0].arrTimeDate).getHours() ===
        //               this.state.intOriginEndTime1.getHours() &&
        //               new Date(
        //                 newflightObj.segments[0].arrTimeDate
        //               ).getMinutes() < this.state.intOriginEndTime1.getMinutes()))
        //         );
        //       });
        //     } else {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         console.log(
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours(),
        //           this.state.intOriginStartTime1.getHours()
        //         );
        //         return (
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours() >
        //           this.state.intOriginStartTime1.getHours() &&
        //           new Date(newflightObj.segments[0].arrTimeDate).getHours() <
        //           this.state.intOriginEndTime1.getHours()
        //         );
        //       });
        //     }
        //   }
        //   if (this.state.intOriginStartTime2 && this.state.intOriginEndTime2) {
        //     if (this.state.intOriginEndTime2.getHours() === 23) {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[1].arrTimeDate).getHours() >
        //           this.state.intOriginStartTime2.getHours() &&
        //           (new Date(newflightObj.segments[1].arrTimeDate).getHours() <
        //             this.state.intOriginEndTime2.getHours() ||
        //             (new Date(newflightObj.segments[1].arrTimeDate).getHours() ===
        //               this.state.intOriginEndTime2.getHours() &&
        //               new Date(
        //                 newflightObj.segments[1].arrTimeDate
        //               ).getMinutes() < this.state.intOriginEndTime2.getMinutes()))
        //         );
        //       });
        //     } else {
        //       filteredArr = filteredArr.filter((a) => {
        //         var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //         return (
        //           new Date(newflightObj.segments[1].arrTimeDate).getHours() >
        //           this.state.intOriginStartTime2.getHours() &&
        //           new Date(newflightObj.segments[1].arrTimeDate).getHours() <
        //           this.state.intOriginEndTime2.getHours()
        //         );
        //       });
        //     }
        //   }
        //   if (this.state.intStopPts1 === 0 || this.state.intStopPts1) {
        //     filteredArr = filteredArr.filter((a) => {
        //       var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //       return (
        //         newflightObj.segments[0].stopOverPts.length <=
        //         this.state.intStopPts1
        //       );
        //     });
        //   }
        //   if (this.state.intStopPts2 === 0 || this.state.intStopPts2) {
        //     filteredArr = filteredArr.filter((a) => {
        //       var newflightObj = this.state.actions.modifyFlightObject(a[0]);
        //       return (
        //         newflightObj.segments[1].stopOverPts.length <=
        //         this.state.intStopPts2
        //       );
        //     });
        //   }
        //   return filteredArr;
        // },
        filterFlights: (flightArr) => {
          var filteredArr = flightArr;
          if (this.state.byCost) {
            filteredArr.sort(
              (a, b) => a[0].Fare.PublishedFare - b[0].Fare.PublishedFare
            );
          }
          if (this.state.byDuration) {
            filteredArr.sort((a, b) => {
              var aFlight = this.state.actions.modifyFlightObject(a[0]);
              var bFlight = this.state.actions.modifyFlightObject(b[0]);
  
              var aDur = aFlight.totalDuration;
              var bDur = bFlight.totalDuration;
  
              return aDur - bDur;
            });
          }
          if (this.state.stopPts === 0 || this.state.stopPts) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                newflightObj.segments[0].stopOverPts.length <= this.state.stopPts
              );
            });
          }
          if (this.state.airlineName) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                newflightObj.segments[0].airlineName === this.state.airlineName
              );
            });
          }
          if (this.state.originStartTime && this.state.originEndTime) {
            if (this.state.originEndTime.getHours() === 23) {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >
                  this.state.originStartTime.getHours() &&
                  (new Date(newflightObj.segments[0].depTimeDate).getHours() <
                    this.state.originEndTime.getHours() ||
                    (new Date(newflightObj.segments[0].depTimeDate).getHours() ===
                      this.state.originEndTime.getHours() &&
                      new Date(
                        newflightObj.segments[0].depTimeDate
                      ).getMinutes() < this.state.originEndTime.getMinutes()))
                );
              });
            } else {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >
                  this.state.originStartTime.getHours() &&
                  new Date(newflightObj.segments[0].depTimeDate).getHours() <
                  this.state.originEndTime.getHours()
                );
              });
            }
          }
          if (this.state.destStartTime && this.state.destEndTime) {
            if (this.state.destEndTime.getHours() === 23) {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >
                  this.state.destStartTime.getHours() &&
                  (new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                    this.state.destEndTime.getHours() ||
                    (new Date(newflightObj.segments[0].arrTimeDate).getHours() ===
                      this.state.destEndTime.getHours() &&
                      new Date(
                        newflightObj.segments[0].arrTimeDate
                      ).getMinutes() < this.state.destEndTime.getMinutes()))
                );
              });
            } else {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >
                  this.state.destStartTime.getHours() &&
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                  this.state.destEndTime.getHours()
                );
              });
            }
          }
          if (this.state.intDestStartTime1 && this.state.intDestEndTime1) {
            if (this.state.intDestEndTime1.getHours() === 23) {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >
                  this.state.intDestStartTime1.getHours() &&
                  (new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                    this.state.intDestEndTime1.getHours() ||
                    (new Date(newflightObj.segments[0].arrTimeDate).getHours() ===
                      this.state.intDestEndTime1.getHours() &&
                      new Date(
                        newflightObj.segments[0].arrTimeDate
                      ).getMinutes() < this.state.intDestEndTime1.getMinutes()))
                );
              });
            } else {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >
                  this.state.intDestStartTime1.getHours() &&
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() <
                  this.state.intDestEndTime1.getHours()
                );
              });
            }
          }
          if (this.state.intDestStartTime2 && this.state.intDestEndTime2) {
            if (this.state.intDestEndTime2.getHours() === 23) {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[1].arrTimeDate).getHours() >
                  this.state.intDestStartTime2.getHours() &&
                  (new Date(newflightObj.segments[1].arrTimeDate).getHours() <
                    this.state.intDestEndTime2.getHours() ||
                    (new Date(newflightObj.segments[1].arrTimeDate).getHours() ===
                      this.state.intDestEndTime2.getHours() &&
                      new Date(
                        newflightObj.segments[1].arrTimeDate
                      ).getMinutes() < this.state.intDestEndTime2.getMinutes()))
                );
              });
            } else {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[1].arrTimeDate).getHours() >
                  this.state.intDestStartTime2.getHours() &&
                  new Date(newflightObj.segments[1].arrTimeDate).getHours() <
                  this.state.intDestEndTime2.getHours()
                );
              });
            }
          }
          if (this.state.intOriginStartTime1 && this.state.intOriginEndTime1) {
            if (this.state.intOriginEndTime1.getHours() === 23) {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >
                  this.state.intOriginStartTime1.getHours() &&
                  (new Date(newflightObj.segments[0].depTimeDate).getHours() <
                    this.state.intOriginEndTime1.getHours() ||
                    (new Date(newflightObj.segments[0].depTimeDate).getHours() ===
                      this.state.intOriginEndTime1.getHours() &&
                      new Date(
                        newflightObj.segments[0].depTimeDate
                      ).getMinutes() < this.state.intOriginEndTime1.getMinutes()))
                );
              });
            } else {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                console.log(
                  new Date(newflightObj.segments[0].depTimeDate).getHours(),
                  this.state.intOriginStartTime1.getHours()
                );
                return (
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >
                  this.state.intOriginStartTime1.getHours() &&
                  new Date(newflightObj.segments[0].depTimeDate).getHours() <
                  this.state.intOriginEndTime1.getHours()
                );
              });
            }
          }
          if (this.state.intOriginStartTime2 && this.state.intOriginEndTime2) {
            if (this.state.intOriginEndTime2.getHours() === 23) {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[1].depTimeDate).getHours() >
                  this.state.intOriginStartTime2.getHours() &&
                  (new Date(newflightObj.segments[1].depTimeDate).getHours() <
                    this.state.intOriginEndTime2.getHours() ||
                    (new Date(newflightObj.segments[1].depTimeDate).getHours() ===
                      this.state.intOriginEndTime2.getHours() &&
                      new Date(
                        newflightObj.segments[1].depTimeDate
                      ).getMinutes() < this.state.intOriginEndTime2.getMinutes()))
                );
              });
            } else {
              filteredArr = filteredArr.filter((a) => {
                var newflightObj = this.state.actions.modifyFlightObject(a[0]);
                return (
                  new Date(newflightObj.segments[1].depTimeDate).getHours() >
                  this.state.intOriginStartTime2.getHours() &&
                  new Date(newflightObj.segments[1].depTimeDate).getHours() <
                  this.state.intOriginEndTime2.getHours()
                );
              });
            }
          }
          if (this.state.intStopPts1 === 0 || this.state.intStopPts1) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                newflightObj.segments[0].stopOverPts.length <=
                this.state.intStopPts1
              );
            });
          }
          if (this.state.intStopPts2 === 0 || this.state.intStopPts2) {
            filteredArr = filteredArr.filter((a) => {
              var newflightObj = this.state.actions.modifyFlightObject(a[0]);
              return (
                newflightObj.segments[1].stopOverPts.length <=
                this.state.intStopPts2
              );
            });
          }
          return filteredArr;
        },
        flightSearch: async () => {
          const { inbound, outbound, cabinClassId, destinationSelectedAirPort, originSelectedAirport, adults, children, infants, directflight, oneStopFlight, journeyWay } = this.state
          this.setState({ flightTravellers: adults + infants + children })
          var request = {
            adults: adults,
            child: children,
            infant: infants,
            directFlight: directflight,
            oneStopFlight: oneStopFlight,
            journeyType: journeyWay,
            preferredAirlines: null,
            sources: null
          };

          var segments = [];
          if (journeyWay === "2") {
            segments = [
              {
                Origin: originSelectedAirport.iataCode,
                Destination: destinationSelectedAirPort.iataCode,
                FlightCabinClass: cabinClassId,
                PreferredDepartureTime: outbound,
                PreferredArrivalTime: outbound
              },
              {
                Origin:destinationSelectedAirPort.iataCode,
                Destination: originSelectedAirport.iataCode,
                FlightCabinClass: cabinClassId,
                PreferredDepartureTime: inbound,
                PreferredArrivalTime: inbound
              }
            ];
          } else {
            segments = [
              {
                Origin: originSelectedAirport.iataCode,
                Destination: destinationSelectedAirPort.iataCode,
                FlightCabinClass: cabinClassId,
                PreferredDepartureTime: outbound,
                PreferredArrivalTime: outbound
              },
            ];
          }

          request.segments = segments;

          console.log("Search req", request);

          var flightRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightSearch",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(request)
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));

          console.log(flightRes);
          this.state.actions.separateFlightsByType(
            flightRes.flightResult.Response.Results
          );
          this.setState({
            flightResult: flightRes.flightResult.Response,
            flightSearchToken: flightRes.tokenId,
            searchingFlights: false,
            flightSessionStarted: true
          });
          setTimeout(() => {
            this.setState(
              {
                flightSessionStarted: false,
                flightSessionExpired: true
              },
              () => {
                console.log("Session expired");
              }
            );
          }, 840000);
        },
        populateBookData: (bookingFlight, flightBookData) => {
          bookingFlight.forEach((book, bookIndex) => {
            if (flightBookData && flightBookData[bookIndex]) {
              // if(flightBookData[bookIndex].fareRules){

              // }

              if (
                flightBookData[bookIndex].ssrResult &&
                flightBookData[bookIndex].ssrResult.Response
              ) {
                book.baggageData = flightBookData[bookIndex].ssrResult.Response
                  .Baggage
                  ? [...flightBookData[bookIndex].ssrResult.Response.Baggage]
                  : [];
                book.mealData = flightBookData[bookIndex].ssrResult.Response
                  .MealDynamic
                  ? [...flightBookData[bookIndex].ssrResult.Response.MealDynamic]
                  : [];
                book.seatData = flightBookData[bookIndex].ssrResult.Response
                  .SeatDynamic
                  ? [...flightBookData[bookIndex].ssrResult.Response.SeatDynamic]
                  : [];
              }
            }
          });
        },
        fetchingFlightBookData: async (bookingFlight) => {
          // var bookingFlight = bookingFlight
          //   ? [...bookingFlight]
          //   : [...this.state.bookingFlight];

          if (!this.state.flightSessionExpired) {
            this.setState({
              flightBookPage: true,
              flightBookDataLoading: true
            });

            var bookReqs = [];
            var bookReqList = [];

            bookingFlight.forEach((flightB, b) => {
              var request = {
                tokenId: this.state.flightSearchToken,
                traceId: this.state.flightResult.TraceId,
                resultIndex: flightB.resultIndex
              };

              bookReqList.push(request);

              bookReqs.push(
                fetch(
                  "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightBookData",
                  {
                    method: "POST",
                    // credentials: "include",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                  }
                )
                  .then((res) => res.json())
                  .catch((err) => console.log(err))
              );
            });

            console.log("Flight booking req", bookReqList);

            var flightBookData = await Promise.all(bookReqs);

            this.state.actions.populateBookData(bookingFlight, flightBookData);

            console.log("Flight booking res", flightBookData);
            this.setState({
              flightBookData,
              bookingFlight,
              flightBookDataLoading: false
            });
          } else {
            this.setState({
              flightSessionExpiredPopup: true
            });
            console.log(
              "Flight session has expired please make a search request again"
            );
          }
        },
        fetchFlightBookData:  (
          resultIndex,
          flight,
          baggageDtls,
          arrIndex
        ) => {
          var bookingFlight = this.state.bookingFlight
            ? [...this.state.bookingFlight]
            : [];

          bookingFlight[this.state.flightResJType] = {
            flight,
            flightNew: this.state.actions.modifyFlightObject(flight),
            baggageData: [],
            mealData: [],
            seatData: [],
            baggagePrice: [0, 0],
            baggageWeight: [0, 0],
            mealPrice: [0, 0],
            mealDesc: ["", ""],
            seats: [[], []],
            totalFare: flight.Fare.OfferedFare
              ? Math.ceil(flight.Fare.OfferedFare)
              : Math.ceil(flight.Fare.PublishedFare),
            baggageDtls,
            resultIndex,
            arrIndex,
            adults: this.state.adults,
            child: this.state.children,
            infant: this.state.infants,
            travellers: this.state.flightTravellers
          };

          if (
            this.state.flightResList.length > 1 &&
            this.state.flightResJType === 0
            // &&
            // bookingFlight.length <= 1
          ) {
            this.setState({
              bookingFlight,
              flightResJType: 1
            });
          } else {
            this.setState({
              bookingFlight
            });
            if (this.state.flightResList.length === 1) {
              this.state.actions.fetchingFlightBookData(bookingFlight);
            }
          }
        },
        calculateTotalFlightFare: (bookingFlight, bookIndex) => {
          var totalFare = 0;

          totalFare += bookingFlight[bookIndex].flight?.Fare?.OfferedFare
            ? Math.ceil(bookingFlight[bookIndex].flight?.Fare?.OfferedFare)
            : Math.ceil(bookingFlight[bookIndex].flight?.Fare?.PublishedFare);

          bookingFlight[bookIndex].baggagePrice.forEach((bgp, b) => {
            totalFare += bgp;
          });
          bookingFlight[bookIndex].mealPrice.forEach((mp, b) => {
            totalFare += mp;
          });
          bookingFlight[bookIndex].seats.forEach((seatSeg, sg) => {
            seatSeg.forEach((seat, s) => {
              Object.values(seat).forEach((sp, b) => {
                totalFare += sp.Price ? sp.Price : 0;
              });
            });
          });

          return totalFare;
        },
        getTotalFares: (bookingFlight) => {
          var totalFareSum = 0;
          var totalSeatCharges = 0;
          var totalBaggagePrice = 0;
          var totalMealPrice = 0;
  
          bookingFlight.forEach((seg, s) => {
            totalFareSum += seg.totalFare ? Number(seg.totalFare) : 0;
            totalSeatCharges += seg.seatCharges ? Number(seg.seatCharges) : 0;
  
            if (Array.isArray(seg.baggagePrice)) {
              seg?.baggagePrice &&
                seg?.baggagePrice?.forEach((price, p) => {
                  totalBaggagePrice += price ? Number(price) : 0;
                });
            }
            if (Array.isArray(seg.mealPrice)) {
              seg.mealPrice &&
                seg.mealPrice?.forEach((price, p) => {
                  totalMealPrice += price ? Number(price) : 0;
                });
            }
          });
          var finalPrice = totalFareSum + (totalFareSum * this.state.domesticFlight) / 100
          return {
            totalFareSum,
            totalSeatCharges,
            totalBaggagePrice,
            totalMealPrice,
            finalPrice
          };
        },
        setUsers: async (value) => {
          this.setState({
            users: value
          });
        },
        getAllUsers : async () => {
          try {
            const accountDocRef = firestore().collection('Accounts');
            const userArray = [];
            const querySnapshot = await accountDocRef.get();
      
            querySnapshot.forEach(async doc => {
              userArray.push({
                id: doc.id,
                data: doc.data()
              });
            });
      
            const userArr = userArray.filter(user => {
              return user.data.role !== 'admin';
            });
      
            this.state.actions.setUsers(userArr);
          } catch (error) {
            console.log(error);
          }
        },
        setAdminData :async () => {
          try {
            const accountsRef = firestore().collection('Accounts');
            const roleQuery = accountsRef.where('role', '==', 'admin');
            const querySnapshot = await roleQuery.get();
            const admin = [];
      
            querySnapshot.forEach(doc => {
              const data = doc.data();
              admin.push(data);
              this.setState({
                adminDetails: data
              });
            });
      
            const docCollectionRef = firestore()
              .collection('Accounts')
              .doc(admin[0].userid);
      
            this.setState({
              domesticFlight: Number(admin[0].domesticFlights),
              internationalFlight: Number(admin[0].internationalFlights),
              domesticHotel: Number(admin[0].domesticHotels),
              internationalHotel: Number(admin[0].internationalHotels)
            });
      
            await this.state.actions.getAllUsers();
      
          } catch (error) {
            console.log(error);
          }
        },
      
        handleChangeFlightBook: async (
          e,
          type,
          bookIndex,
          segIndex,
          seat,
          seatSegIdx,
          rmSeat
        ) => {
          var bookingFlight = [...this.state.bookingFlight];

          if (type === "baggage") {
            if (e !== "No excess baggage") {
              bookingFlight[bookIndex].baggagePrice[segIndex] = Number(
                e.split("at")[1].split("Rs")[1].split("/-")[0].trim()
              );
              bookingFlight[bookIndex].baggageWeight[segIndex] = Number(
                e.split("at")[0].split("KG")[0].trim()
              );
            } else {
              bookingFlight[bookIndex].baggagePrice[segIndex] = 0;
              bookingFlight[bookIndex].baggageWeight[segIndex] = 0;
            }
          } else if (type === "meal") {
            if (e !== "No add-on meal") {
              bookingFlight[bookIndex].mealPrice[segIndex] = Number(
                e.split("->")[1].split("Rs")[1].split("/")[0].trim()
              );
              bookingFlight[bookIndex].mealDesc[segIndex] = e
                .split("->")[0]
                .trim();
            } else {
              bookingFlight[bookIndex].mealPrice[segIndex] = 0;
              bookingFlight[bookIndex].mealDesc[segIndex] = "";
            }
          } else if (type === "seats") {
            if (!bookingFlight[bookIndex].seats[segIndex]) {
              bookingFlight[bookIndex].seats[segIndex] = [];
            }
            if (!bookingFlight[bookIndex].seats[segIndex][seatSegIdx]) {
              bookingFlight[bookIndex].seats[segIndex][seatSegIdx] = {};
            }

            if (rmSeat) {
              delete bookingFlight[bookIndex].seats[segIndex][seatSegIdx][rmSeat];
            }

            if (seat) {
              bookingFlight[bookIndex].seats[segIndex][seatSegIdx][seat.Code] =
                seat;
            }

            var seatCharges = 0;

            bookingFlight[bookIndex].seats.forEach((seatSeg, sg) => {
              seatSeg.forEach((seat, s) => {
                Object.values(seat).forEach((sp, b) => {
                  seatCharges += sp.Price ? sp.Price : 0;
                });
              });
            });
            bookingFlight[bookIndex].seatCharges = seatCharges;
          }

          bookingFlight[bookIndex].totalFare =
            this.state.actions.calculateTotalFlightFare(bookingFlight, bookIndex);

          this.setState({
            bookingFlight
          });
        },
        setFlightBookPage: (value) => {
          this.setState({
            flightBookPage: value
          });
        },
        setBookingFlight: (value) => {
          this.setState({
            bookingFlight: [...value]
          });
        },



      },
    }
  }
  componentDidMount= async ()=>
  {
    await this.state.actions.setAdminData()
  }
  debounce = (cb, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };
  //   fuse = new Fuse(AirportsData, {
  //     keys: ["cityName", "name", "iataCode", "countryName"],
  //     includeScore: true,
  //     threshold: 0.2
  // });
  // changeCityKeyword = this.debounce((query) => {
  //   var results = this.state.hotelFuse.search(query);
  //   console.log("Search results", results);
  //   this.setState({
  //     cityHotelRes: results
  //   });
  // }, 1000);




  render() {
    // Include actions in the context value
    const contextValue = {
      ...this.state,
    };

    return (
      <MyContext.Provider value={contextValue}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

