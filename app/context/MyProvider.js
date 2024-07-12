
import React, { Component, ReactNode, } from 'react';
import MyContext from './Context';
import Fuse from 'fuse.js';
import AirportsData from "../components/jsonData/Airports.json"
import HotelsData from "../components/jsonData/Hotels.json"
import CabsData from "../components/jsonData/Cabs.json"
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import convert from "xml-js";
import moment from 'moment';
import { Alert } from 'react-native';
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
const components = [
  {
    categoryName: "flights",
    iconName: "flight-takeoff",
    componentName: "MaterialIcons"
  },
  {
    categoryName: "hotel",
    iconName: "hotel",
    componentName: "FontAwesome"
  },
  {
    categoryName: "cab",
    iconName: "taxi",
    componentName: "FontAwesome5"
  },
  {
    categoryName: "bus",
    iconName: "bus-alt",
    componentName: "FontAwesome5"
  },
];
var dateObject = new Date();
var options = {
  month: "short",
  day: "numeric"
};
var newTripDateString = dateObject.toLocaleString("en-US", options);
var newTripCompleteString = "newTrip_" + newTripDateString;
let abortAirportController;
let controller;
var fuse = new Fuse(AirportsData, {
  keys: ["cityName", "name", "iataCode", "countryName"],
  includeScore: true,
  threshold: 0.2
});
var hotelFuse = new Fuse(HotelsData, {
  keys: [
    "CITYID",
    "DESTINATION",
    "STATEPROVINCE",
    "STATEPROVINCECODE",
    "COUNTRY",
    "COUNTRYCODE"
  ],
  includeScore: true,
  threshold: 0.2
});
// var cabFuse = new Fuse(CabsData, {
//   keys: ["City"],
//   includeScore: true,
//   threshold: 0.2
// });
const cityNames = CabsData.flatMap(cityData => Object.keys(cityData));
// console.log(cityNames)
// const hyderabadKeys = Object.keys(CabsData[0]["Hyderabad"]);

// console.log(hyderabadKeys);
// const hyderabadAirportToHotel = CabsData[0]["Hyderabad"]["Airport to City center Hotel"];

// console.log(hyderabadAirportToHotel);
var cabFuse = new Fuse(cityNames, {
  includeScore: true,
  threshold: 0.3
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
      bookingFlight: [],
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
      stopPts: null,
      byDuration: false,
      byCost: true,
      intStopPts1: null,
      intStopPts2: null,
      flightTravellers: 0,
      originStartTime: null,
      originEndTime: null,
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
      hotelRooms: "1",
      hotelNights: 0,
      hotelRoomArr: [{
        adults: "1",
        child: 0,
        childAge: []
      }],
      cityHotelRes: [],
      hotelSearchInputToggle: false,
      hotelResList: [],
      hotelSessionExpired: false,
      hotelSessionStarted: false,
      selectedHotel: "Destination",
      cityHotelQuery: "",
      cityHotel: "",
      countryCode: "IN",
      cityHotelItem: {},
      selectedCheckInDate: "Check-In date",
      selectedCheckOutDate: "Check-Out date",
      calenderOpen: {
        checkInCalender: false,
        checkOutCalender: false
      },
      selectedHotelCheckInDate: new Date,
      selectedHotelCheckOutDate: new Date,
      checkInTime: null,
      checkOutTime: null,
      hotelSearchAdults: 0,
      hotelSearchChild: 0,
      searchingHotels: true,
      cityHotelResBox: false,
      filterActions: false,
      hotelInfoRes: false,
      fetchingHotelInfo: true,
      idToIndex: {},
      userTripStatus: {
        userTrips: [],
        tripLoading: true,
      },
      offset: null,
      userId: "",
      isLoading: false,
      tripData: {
        id: null,
        data: null,
        hotels: null,
        flights: null
      },
      activeComponent: components[0].categoryName,
      flatListRef: React.createRef(null),
      hotelCityLoading: false,
      hotelListData: [],
      bookinghotelquery: {},
      setidToIndex: null,
      filteredData: null,
      trip: {
        flights: [],
        hotels: [],
        date: new Date(),
        name: newTripCompleteString,
        status: ""
      },
      isopen: false,
      emailNotFound: false,
      approveLoading: true,
      cabSearchRes: [],
      NoofBusPassengers: 1,
      busOriginData: [],
      busOriginLoading: false,
      busDestData: [],
      busDestLoading: false,
      busResList: [],
      actions: {
        handleBookinghotelquery: (query) => {
          this.setState({ bookinghotelquery: query })
        },
        backToHotelResPage: () => {
          this.setState({
            hotelInfoRes: false,
            bookingHotel: {}
          });
        },
        setTrips: async (value) => {
          this.setState({
            userTripStatus: value
          });
        },

        setTrip: (value) => {
          this.setState({
            trip: value
          });
        },


        switchComponent: (component) => {
          this.setState({ activeComponent: component })
          const selectedIndex = components.findIndex((item) => item.categoryName === component);
          this.state.flatListRef.current?.scrollToIndex({ animated: true, index: selectedIndex });
        },

        handleDirectFlight: () => {
          this.setState({ directflight: !this.state.directflight })
        },
        backToHotelSearchPage: () => {
          this.setState({
            searchingHotels: true,
            hotelResList: [],
            hotelSearchResult: {},
            hotelTokenId: "",
            hotelSessionStarted: false,
            hotelSessionEnded: false
          })
        },
        handleToggleHotelSearchInput: () => {
          this.setState({ cityHotelResBox: false })
        },
        handleFilterActions: () => {
          this.setState({ filterActions: !this.state.filterActions })
        },
        loginAction: async (email, password) => {
          console.log(email, password)
          try {
            const response = await auth().signInWithEmailAndPassword(email, password);
            return { user: response.user };

          } catch (error) {
            Alert.alert(
              'Error',
              error.message,
              [{ text: 'OK' }]
            );

          }
        },

        changeUserPassword: async (currentPassword, newPassword) => {
          try {
            const user = auth().currentUser;

            // Reauthenticate the user with their current password
            const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(credential);

            // Change the user's password
            await user.updatePassword(newPassword);

            return true;
          } catch (error) {
            Alert.alert(
              'Error',
              error.message,
              [{ text: 'OK' }]
            );
            // throw error;
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
          this.setState({ [action.name]: action.event })
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
            searchingFlights: true,
            origin: "",
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
        fetchHotelCityList: async () => {
          console.log(("calling.............."))
          try {
            const accountDocRef = firestore().collection("hotelAutoComplete");
            const hotelLists = [];

            const querySnapshot = await accountDocRef.get();

            querySnapshot.forEach(async (doc) => {
              doc.data().hotelList.forEach((hotel) => {
                hotelLists.push(hotel);
              });
            });
            const fuse = new Fuse(hotelLists, {
              keys: [
                "CITYID",
                "DESTINATION",
                "STATEPROVINCE",
                "STATEPROVINCECODE",
                "COUNTRY",
                "COUNTRYCODE"
              ],
              includeScore: true,
              threshold: 0.2
            });
            this.setState({
              hotelListData: fuse
            })
          } catch (error) {
            console.error("Error fetching hotel city list:", error);
          }
        },
        changeCityKeyword: this.debounce(async (keyword) => {
          if (keyword !== "") {
            try {
              var results1 = hotelFuse.search(keyword)
              if (results1.length > 0) {
                console.log(results1, "results1")
                this.setState({
                  cityHotelRes: results1,
                  hotelCityLoading: false
                });

              }
              else {
                if (this.state.hotelListData.length > 0) {
                  // const results2=this.state.hotelListData.search(keyword)
                  // console.log(results2,"results2")
                  // {
                  //   this.setState({
                  //     cityHotelRes: results2,
                  //     hotelCityLoading:false
                  //   });
                  // }
                  this.setState({
                    cityHotelRes: [],
                    hotelCityLoading: false
                  });
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
          else {
            this.setState({
              hotelCityLoading: false,
              cityHotelRes: []
            })
          }

        }, 500),
        handleChangeCityHotel: (keyword) => {
          this.setState({
            hotelCityLoading: true
          })
          this.state.actions.changeCityKeyword(keyword);
        },

        selectedHotel: (item) => {
          this.setState({
            selectedHotel: `${item.DESTINATION},${item?.STATEPROVINCE
              ? item?.STATEPROVINCE
              : item?.COUNTRY
              }`,
            cityHotel: item.CITYID,
            countryCode: item.COUNTRYCODE,
            cityHotelItem: item
          })
        },
        handleHotelRooms: (rooms) => {
          var roomsArr = [...this.state.hotelRoomArr];
          if (rooms > roomsArr.length) {
            var diff = rooms - roomsArr.length;
            for (var i = 1; i <= diff; i++) {
              roomsArr.push({ adults: 1, child: 0, childAge: [] });
            }
          } else if (rooms < roomsArr.length) {
            roomsArr = roomsArr.filter((room, r) => {
              return r < rooms;
            });
          }
          this.setState({ hotelRooms: rooms })
          this.setState({
            hotelRoomArr: roomsArr
          })
        },

        handleHotelRoomsArr: (val, type, i) => {
          var roomsArr = [...this.state.hotelRoomArr];

          if (type === "adults") {
            roomsArr[i].adults = val;
            this.setState({ hotelSearchAdults: val })
          } else if (type === "child") {
            roomsArr[i].child = val;
            this.setState({ hotelSearchChild: val })
            let childArr = [];

            for (let i = 1; i <= val; i++) {
              childArr.push({ age: 0 });
            }
            roomsArr[i].childAge = [...childArr];
          }
          this.setState({
            hotelRoomArr: roomsArr,
          })
        },
        handleChildAge: (roomsArr) => {
          this.setState({
            hotelRoomArr: roomsArr
          })
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
          const date1 = new Date(dateStr1);
          const date2 = new Date(dateStr2);

          const diffTime = Math.abs(date2 - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        },
        diffNights: (dateStr1, dateStr2) => {
          const date1 = moment.utc(dateStr1);
          const date2 = moment.utc(dateStr2);

          // Convert formatted date strings back to Date objects
          const formattedDate1 = date1.local().toDate();
          const formattedDate2 = date2.local().toDate();

          // Calculate the difference in milliseconds between the two dates
          const diffTime = Math.abs(formattedDate2 - formattedDate1);

          // Convert milliseconds to days and round down
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

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
          var totalDur = 0;
          var segments = flight?.Segments?.map((segment, sg) => {
            var seg1 = segment[0];
            var segLast = segment[segment.length - 1];

            var originCityName = seg1.Origin.Airport.CityName;
            var originAirportCode = seg1.Origin.Airport.AirportCode;
            var originAirportName = seg1.Origin.Airport.AirportName;
            var originTerminal = seg1.Origin.Airport.Terminal;
            var originCountryCode = segLast.Origin.Airport.CountryCode;

            var destCityName = segLast.Destination.Airport.CityName;
            var destAirportCode = segLast.Destination.Airport.AirportCode;
            var destAirportName = segLast.Destination.Airport.AirportName;
            var destTerminal = segLast.Destination.Airport.Terminal;
            var destCountryCode = segLast.Destination.Airport.CountryCode;

            var depTimeDate = new Date(seg1.Origin.DepTime);
            var arrTimeDate = new Date(segLast.Destination.ArrTime);

            var depTimeArr = seg1.Origin.DepTime.split("T")[1].split(":");
            var arrTimeArr = segLast.Destination.ArrTime.split("T")[1].split(":");
            var depTime = `${depTimeArr[0]}:${depTimeArr[1]}`;
            var arrTime = `${arrTimeArr[0]}:${arrTimeArr[1]}`;

            var durationSum = 0;

            var stopOverPts = [];
            var charNum = 0;


            var finalDur = 0;

            var segRoutes = [];

            var dur = 0;
            var flightCodes = [];
            segment.forEach((seg, s) => {
              var flightCode = `${seg.Airline.AirlineCode} - ${seg.Airline.FlightNumber} ${seg.Airline.FareClass}`;
              flightCodes[s] = flightCode;
              var flightDuration =
                seg.Duration !== 0 ? seg.Duration : (seg.AccumulatedDuration ? seg.AccumulatedDuration : 0);

              dur += flightDuration + seg.GroundTime;

              durationSum += flightDuration;
              if (s === segment.length - 1) {
                finalDur += seg.AccumulatedDuration;
              }
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

            var cabinClass = cabinclassMap[segment[0].CabinClass] ? cabinclassMap[segment[0].CabinClass] : '';
            var durationNum = durationSum / 60;
            var durHours = Math.floor(durationNum);

            var durMins = Math.ceil(60 * (durationNum - Math.floor(durationNum)));
            var finalSum = finalDur / 60;
            var finalHrs = Math.floor(finalSum)

            var finalsMins = Math.ceil(60 * (finalSum - Math.floor(finalSum)));
            var duration = `${durHours ? `${durHours}h ` : ""}${durMins !== 0 ? `${durMins}m` : ""
              }`;
            var finalTime = `${finalHrs ? `${finalHrs}h ` : ""}${finalsMins !== 0 ? `${finalsMins}m` : ""
              }`;
            totalDur += durHours * 60 + durMins
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
              originCountryCode,
              destCityName,
              destAirportCode,
              destAirportName,
              destTerminal,
              destCountryCode,
              duration,
              dur,
              stopOverPts,
              segRoutes,
              baggage: seg1.Baggage,
              cabinBaggage: seg1.CabinBaggage,
              cabinClass,
              finalDur,
              finalTime
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
            totalDuration,
            totalDur
          };
        },
        editFlightSearch: () => {
          this.setState({
            flightResult: {},
            flightResList: [],
            searchingFlights: true,
            flightBookPage: false,
            flightSessionExpired: false,
            bookingFlight: [],
            flightResJType: 0,
          });
          this.state.actions.setDestStartTime(null);
          this.state.actions.setDestEndTime(null);
          this.state.actions.setOriginStartTime(null);
          this.state.actions.setOriginEndTime(null);
          this.state.actions.setStopPts(null);
          this.state.actions.setAirlineName("");
          this.state.actions.setByCost(true);
          this.state.actions.setByDuration(false);
          this.state.actions.setIntDestEndTime1(null)
          this.state.actions.setIntDestEndTime2(null)
          this.state.actions.setIntDestStartTime1(null)
          this.state.actions.setIntDestStartTime2(null)
          this.state.actions.setIntOriginEndTime1(null)
          this.state.actions.setIntOriginEndTime2(null)
          this.state.actions.setIntOriginStartTime1(null)
          this.state.actions.setIntOriginStartTime2(null)
          this.state.actions.setIntStopPts1(null)
          this.state.actions.setIntStopPts2(null)
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
        isOpenViewPrices: () => {
          this.setState(prevState => ({ isopen: !prevState.isopen }));
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
              RowSeats: this.state.actions.fillUpRowSeats(seatSeg.RowSeats)
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

              var aDur = aFlight.totalDur;
              var bDur = bFlight.totalDur;

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
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].arrTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[1].arrTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[1].arrTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[0].depTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[1].depTimeDate).getHours() >=
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
                  new Date(newflightObj.segments[1].depTimeDate).getHours() >=
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
                Origin: destinationSelectedAirPort.iataCode,
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

          var flightReqs = [];
          if (flightRes?.flightResult?.Response?.Results.length === 1) {
            console.log(request);
            flightReqs.push(request);
            this.setState({
              flightReq1: request,
            });
            this.setState({
              flightReq: flightReqs,
            });
          } else {
            var req1 = request;
            var req2 = request;
            var segments1 = request.segments[0];
            var segments2 = request.segments[1];
            req1.segments = [segments1];
            req2.segments = [segments2];
            var new1 = { ...req1, segments: [segments1] };
            var new2 = { ...req2, segments: [segments2] };
            new1.journeyType = "1";
            new2.journeyType = "1";
            flightReqs.push(new1, new2);
            this.setState({
              flightReq: flightReqs,
            });
          }
          if (flightRes.flightResult?.errorMessage) {
            this.setState({
              flightResult: {},
              flightResList: [],
              searchingFlights: false,
              flightSessionStarted: true,
              flightErrorMessage: flightRes.flightResult.errorMessage,
            });
          } else {
            this.state.actions.separateFlightsByType(
              flightRes.flightResult.Response.Results
            );
            this.setState({
              flightSearchToken: flightRes.tokenId,
              searchingFlights: false,
              flightSessionStarted: true,
              flightTraceId: flightRes.flightResult.Response.TraceId,
              flightResult: flightRes.flightResult.Response,
            });
          }



          // this.state.actions.separateFlightsByType(
          //   flightRes.flightResult.Response.Results
          // );
          // this.setState({
          //   flightResult: flightRes.flightResult.Response,
          //   flightSearchToken: flightRes.tokenId,
          //   searchingFlights: false,
          //   flightSessionStarted: true,
          //   flightTraceId: flightRes.flightResult.Response.TraceId,
          //   flightResult: flightRes.flightResult.Response,
          // });
          var flightSessionTimeout = setTimeout(() => {
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
          clearTimeout(flightSessionTimeout);
        },
        getRecommondedHotelList: async () => {
          console.log('reco called');
          try {
            const accCollectionRef = firestore().collection("recomondedHotels").doc("recommondedHotelCityListJson");
            const data1 = await accCollectionRef.get();
            const recommondedHotelsData = data1.data().hotelCityList;
            const hotelObj = {};
            recommondedHotelsData.forEach((hotel) => {
              hotelObj[hotel["Hotel Code"]] = hotel;
            });
            this.setState({
              recommondedHotels: hotelObj
            });
          } catch (error) {
            console.error("Error fetching recommended hotels:", error);
          }
        },
        getHotelImages: async (cityId) => {
          try {
            const cityIds = String(cityId);
            const documentRef = firestore().collection("hotelImages").doc(cityIds);
            const doc = await documentRef.get();

            if (doc.exists) {
              console.log('called');
              const documentData = doc.data();
              const transformedData = documentData.hotelImageList.reduce((acc, entry) => {
                const hotelId = Object.keys(entry)[0];
                const hotelData = entry[hotelId];
                acc[hotelId] = hotelData;
                return acc;
              }, {});
              this.setState({
                hotelImageList: transformedData
              })
              return transformedData;
            }
          } catch (error) {
            console.error("Error fetching hotel images:", error);
          }
        },
        convertTboDateFormat: (inputDate) => {
          const date = new Date(inputDate);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const formattedDay = day < 10 ? '0' + day : day;
          const formattedMonth = month < 10 ? '0' + month : month;

          return formattedDay + '/' + formattedMonth + '/' + year;
        },
        convertXmlToJson: async (cityId) => {
          var hotelStatic = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/staticdata",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ cityId: cityId })
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          // console.log(hotelStatic)
          var jsonResult = convert.xml2json(hotelStatic.HotelData, {
            compact: true,
            spaces: 2
          });
          var jsonContent = JSON.parse(jsonResult);
          var hotelObject = {};
          Array.isArray(jsonContent?.ArrayOfBasicPropertyInfo?.BasicPropertyInfo) ?
            jsonContent.ArrayOfBasicPropertyInfo.BasicPropertyInfo.forEach(
              (hotel) => {
                var hotelCode = hotel["_attributes"]["TBOHotelCode"];
                hotelObject[hotelCode] = {
                  BrandCode: hotel["_attributes"]["BrandCode"],
                  HotelCityCode: hotel["_attributes"]["HotelCityCode"],
                  HotelName: hotel["_attributes"]["HotelName"],
                  TBOHotelCode: hotel["_attributes"]["TBOHotelCode"],
                  LocationCategoryCode:
                    hotel["_attributes"]["LocationCategoryCode"],
                  Address: hotel["Address"]
                };
              }
            ) : null
          return hotelObject;
        },

        hotelSearch: async (query) => {
          //Fields needed:  city or hotel name, check-in, nights, check-out, nationality, rooms, adults, children, star-rating
          await this.state.actions.getRecommondedHotelList()
          this.setState({
            hotelResList: [],
            hotelSearchQuery: query,
            searchingHotels: true,
            cityHotel: query.cityHotel,
            hotelSessionStarted: false,
            hotelSessionEnded: false,
            hotelSearchName: query.cityDestName,
            hotelSearchCheckIn: query.selectedHotelCheckInDate,
            hotelSearchCheckOut: query.selectedHotelCheckOutDate,
            hotelSearchAdults: query.hotelRoomArr.reduce(
              (acc, room, r) => acc + Number(room.adults),
              0
            ),
            hotelSearchChild: query.hotelRoomArr.reduce(
              (acc, room, r) => acc + Number(room.child),
              0
            ),
            hotelSearchNights: Number(query.hotelNights),
            hotelRoomArr: query.hotelRoomArr,
            hotelRooms: Number(query.hotelRooms)
          });

          let roomGuests = [];

          query.hotelRoomArr.forEach((room, r) => {
            roomGuests.push({
              NoOfAdults: Number(room.adults),
              NoOfChild: Number(room.child),
              ChildAge: room.childAge.map((child, c) => Number(child.age))
            });
          });

          var request = {
            checkInDate: this.state.actions.convertTboDateFormat(
              query.selectedHotelCheckInDate
            ),
            cityId: query.cityHotel,
            nights: query.hotelNights,
            countryCode: query.countryCode,
            noOfRooms: query.hotelRooms,
            roomGuests: [...roomGuests]
          };

          // console.log("Hotel req", request);
          // const cityId = String(query.cityHotel);
          // var accCollectionRef = db
          //   .collection("hotelImages")
          //   .doc(cityId);
          // await accCollectionRef.set({
          //   hotelImageList: []
          // })

          var hotelStatic = await Promise.all([
            fetch(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelSearchRes",
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
              .catch((err) => console.log(err)),
            this.state.actions.convertXmlToJson(request.cityId),
            //this.state.actions.convertXmlToJsonHotel({ cityId: "145710", hotelId: "00193836" })
            this.state.actions.getHotelImages(request.cityId)
          ]);

          // console.log("Result", hotelStatic);

          var hotelRes = hotelStatic[0];
          var staticdata = hotelStatic[1];
          if (hotelRes?.error) {
            console.log('error');
            this.setState({
              hotelResList: [],
              hotelErrorMessage: hotelRes?.error,
              searchingHotels: false,
              hotelSessionStarted: true
            })
          }

          const recomended = hotelRes.hotelResult?.HotelSearchResult?.HotelResults
          if (recomended) {
            const hotelIdsInObject = this.state.recommondedHotels ? Object.keys(this.state.recommondedHotels).map(ele => { return { HotelCode: ele } }) : []
            const idToIndex = hotelIdsInObject.reduce((acc, item, index) => {
              acc[item.HotelCode] = index;
              return acc;
            }, {});
            this.setState({ setidToIndex: idToIndex })
            // setidToIndex(idToIndex)
            const filteredHotels = recomended.filter(hotel => {
              const hotelstaticData = staticdata[hotel.HotelCode];
              const hotelName = hotel.HotelName ? hotel.HotelName : hotelstaticData?.HotelName;
              return hotelName?.length > 0;
            })
            // setFiltersHotelsData(filteredHotels)
            let finalData = filteredHotels.sort((a, b) => {
              const indexA = idToIndex[a.HotelCode];
              const indexB = idToIndex[b.HotelCode];

              if (indexA === undefined && indexB === undefined) {
                return 0;
              } else if (indexA === undefined) {
                return 1;
              } else if (indexB === undefined) {
                return -1;
              }
              const priceA = a.Price.OfferedPriceRoundedOff;
              const priceB = b.Price.OfferedPriceRoundedOff;
              return priceA - priceB;
            });



            this.setState({
              // hotelResList: hotelRes.hotelResult?.HotelSearchResult?.HotelResults,
              hotelResList: finalData,
              hotelTraceId: hotelRes.hotelResult?.HotelSearchResult?.TraceId,
              hotelStaticData: staticdata,
              hotelTokenId: hotelRes.tokenId,
              searchingHotels: false,
              hotelSessionStarted: true
            });

          }
          var hotelSessionTimeout = setTimeout(() => {
            this.setState(
              {
                hotelSessionStarted: false,
                hotelSessionExpired: true
              },
              () => {
                console.log("Session expired");
              }
            );
          }, 840000);
          clearTimeout(hotelSessionTimeout);
        },
        setHotelErrorMessage: () => {
          this.setState({
            hotelErrorMessage: null
          })
        },
        filterHotels: (hotelResList) => {
          // console.log(this.state.byDuration);
          var filteredArr = hotelResList;

          if (this.state.hotelRating) {
            //console.log(this.state.hotelRating);
            filteredArr = filteredArr.filter(
              (hotel) => hotel.StarRating === this.state.hotelRating
            );
          }
          if (this.state.hotelPriceStart && this.state.hotelPriceEnd) {
            //console.log(this.state.hotelPriceStart);
            filteredArr = filteredArr.filter((hotel) => {
              return (
                hotel.Price.OfferedPriceRoundedOff >=
                this.state.hotelPriceStart &&
                hotel.Price.OfferedPriceRoundedOff < this.state.hotelPriceEnd
              );
            });
          }
          if (this.state.hotelSearchText) {
            filteredArr = filteredArr.filter((hotel) => {
              const staticData = this.state.hotelStaticData[hotel.HotelCode];
              if (hotel.HotelName) {
                return hotel.HotelName.toLowerCase().includes(
                  this.state.hotelSearchText.toLowerCase()
                );
              }
              else {
                return staticData?.HotelName.toLowerCase().includes(
                  this.state.hotelSearchText.toLowerCase()
                );
              }

            });
          }
          return filteredArr;
        },
        calculateHotelFinalPrice: (selectedRoomType) => {
          let finalPrice = 0;
          selectedRoomType.forEach((room, r) => {
            finalPrice += room.Price
              ? room.Price.OfferedPriceRoundedOff
                ? Number(room.Price.OfferedPriceRoundedOff)
                : Number(room.Price.PublishedPriceRoundedOff)
              : 0;
          });

          return finalPrice
        },

        fetchHotelInfo: async (query) => {
          if (!this.state.hotelSessionExpired) {
            this.setState({
              hotelInfoRes: [],
              fetchingHotelInfo: true
            });

            var hotelInfoReq = {
              traceId:
                this.state.hotelTraceId,
              tokenId: this.state.hotelTokenId,
              resultIndex: query.resultIndex,
              hotelCode: query.hotelCode,
              categoryId: query.categoryId ? query.categoryId : null
            };

            console.log("Hotel info req", hotelInfoReq);

            var hotelInfoRes = await fetch(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelInfoRes",
              {
                method: "POST",
                // credentials: "include",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(hotelInfoReq)
              }
            )
              .then((res) => res.json())
              .catch((err) => console.log(err));

            hotelInfoRes.hotelSearchRes = query.hotelSearchRes;

            console.log("Hotel info res", hotelInfoRes);

            let roomTypes = this.state.hotelRoomArr.map((room, r) => {
              return {
                ...hotelInfoRes.roomResult?.GetHotelRoomResult
                  ?.HotelRoomsDetails[0],

                roomTypeIndex: 0
              };
            });
            var hotelImg = this.state.hotelImageList ? this.state.hotelImageList[query.hotelSearchRes.HotelCode] ? this.state.hotelImageList[query.hotelSearchRes.HotelCode].HotelPicture : hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images[0] : hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images[0]
            this.setState({
              hotelInfoRes,
              fetchingHotelInfo: false,
              bookingHotel: {
                ...hotelInfoRes,
                hotelCode: query.hotelSearchRes.HotelCode,
                hotelPrice: query.hotelSearchRes.Price.OfferedPriceRoundedOff
                  ? query.hotelSearchRes.Price.OfferedPriceRoundedOff
                  : query.hotelSearchRes.Price.PublishedPriceRoundedOff,
                hotelName: query.hotelSearchRes.HotelName,
                selectedRoomType: [...roomTypes],
                hotelFinalPrice: this.state.actions.calculateHotelFinalPrice([
                  ...roomTypes
                ]),
                hotelTotalPrice: (this.state.actions.calculateHotelFinalPrice([
                  ...roomTypes
                ]) + (this.state.actions.calculateHotelFinalPrice([
                  ...roomTypes
                ]) * this.state.domesticHotel) / 100),
                hotelSearchQuery: this.state.bookinghotelquery,
                hotelImages: hotelImg
              }
            });
          } else {
            this.setState({
              hotelSessionExpired: true,
              hotelSessionExpiredPopup: true
            });
            console.log(
              "Hotel session has expired please make a search request again!!"
            );
          }
        },

        handleGoBack: () => {
          this.setState({ fetchingHotelInfo: false })
        },
        inclusionToStr: (inclusions) => {
          var mealStr = "";

          inclusions.forEach((inc, i) => {
            mealStr += inc.toLowerCase().trim();
          });

          return mealStr;
        },
        checkIncludesDinner: (str) => {
          if (str.includes("gala")) {
            var splitStr = str.split("dinner");

            for (var i = 0; i < splitStr.length - 1; i++) {
              var galaSplit = splitStr[i].split("gala");
              var galaSplitNxt = splitStr[i + 1].split("gala");

              if (
                !(
                  galaSplit[galaSplit.length - 1] === "" || galaSplitNxt[0] === ""
                )
              ) {
                return true;
              }
            }

            return false;
          } else {
            if (str.includes("dinner")) {
              return true;
            }
            return false;
          }
        },
        setMealType: (meals) => {
          //[true,undefined,true]
          var mealNames = {
            0: "Breakfast",
            1: "Lunch",
            2: "Dinner"
          };
          var mealText = "";
          meals = meals
            .map((meal, m) => {
              if (meal) {
                return mealNames[m];
              }
              return meal;
            })
            .filter((meal) => meal);
          //
          meals.forEach((meal, m) => {
            if (m === meals.length - 1 && meals.length > 1) {
              mealText += ` and ${meal}`;
            } else if (m === meals.length - 2 || meals.length === 1) {
              mealText += meal;
            } else {
              mealText += `${meal}, `;
            }
          });
          if (mealText === "") {
            mealText = "No meals";
          }
          return mealText;
        },
        checkForTboMeals: (inclusions) => {
          var meals = this.state.actions.inclusionToStr(inclusions);

          var includedStr = "";
          var mealsStr = meals.replace(/\s/g, "").toLowerCase();
          var mealsArr = [false, false, false];

          if (
            mealsStr.includes("breakfast") ||
            mealsStr.includes("halfboard") ||
            mealsStr.includes("fullboard") ||
            mealsStr.includes("allmeals")
          ) {
            mealsArr[0] = true;
          }
          if (
            mealsStr.includes("lunch") ||
            mealsStr.includes("fullboard") ||
            mealsStr.includes("allmeals")
          ) {
            mealsArr[1] = true;
          }
          if (
            // (mealsStr.includes("dinner") ||
            this.state.actions.checkIncludesDinner(mealsStr) ||
            mealsStr.includes("halfboard") ||
            mealsStr.includes("fullboard") ||
            mealsStr.includes("allmeals")
          ) {
            mealsArr[2] = true;
          }

          includedStr = this.state.actions.setMealType(mealsArr);

          return includedStr;
        },

        validCancelDate: (date) => {
          var cancelDate = new Date(date);
          var currDate = new Date();
          if (cancelDate > currDate) {
            return true;
          }
          return false;
        },
        selectHotelRoomType: (room, selectedRoom, r) => {
          var bookingHotel = { ...this.state.bookingHotel };

          bookingHotel.selectedRoomType[selectedRoom] = {
            ...room,
            roomTypeIndex: r
          };
          bookingHotel.hotelFinalPrice =
            this.state.actions.calculateHotelFinalPrice(
              bookingHotel.selectedRoomType
            );
          bookingHotel.hotelTotalPrice = (this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ) + (this.state.actions.calculateHotelFinalPrice(
            bookingHotel.selectedRoomType
          ) * this.state.domesticHotel) / 100)

          this.setState({
            bookingHotel
          });
        },

        fetchFareRule: async (resultIndex, airlineName, fare) => {
          if (!this.state.flightSessionExpired) {
            console.log(
              `Fare rule running for ${airlineName}(${fare.toLocaleString(
                "en-IN"
              )}/-)`
            );
            var request = {
              traceId: this.state.flightTraceId,
              resultIndex
            };

            var fareRuleRes = await fetch(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightFareRule",
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
            return fareRuleRes?.fareRuleResult?.Response?.FareRules[0]?.FareRuleDetail
          } else {
            console.log(
              "Flight session expired, Please make a search request again"
            );
          }
        },

        createTrip: async () => {
          try {
            const accountDocRef = firestore().collection("Accounts").doc(this.state.userId);
            const tripcollectionRef = accountDocRef.collection("trips");
            const tripdocRef = await tripcollectionRef.add(this.state.trip);
            await firestore()
              .collection("Accounts")
              .doc(this.state.userId)
              .update({
                trips: firestore.FieldValue.arrayUnion(tripdocRef.id)
              });
            this.state.actions.setSelectedTripId(tripdocRef.id);
            return tripdocRef.id;
          } catch (error) {
            console.log(error);
          }
        },
        populateBookData: (bookingFlight, flightBookData, fareData) => {
          bookingFlight.forEach((book, bookIndex) => {
            if (flightBookData && flightBookData[bookIndex]) {
              // if(flightBookData[bookIndex].fareRules){

              // }
              book.fareRules = fareData[bookIndex]
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
            var fareReq = []
            bookingFlight.forEach((flightB, b) => {
              var request = {
                tokenId: this.state.flightSearchToken,
                traceId: this.state.flightTraceId,
                resultIndex: flightB.resultIndex
              };

              bookReqList.push(request);
              fareReq.push(this.state.actions.fetchFareRule(flightB.resultIndex, "indigo", 100),)
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
            var fareData = await Promise.all(fareReq)
            this.state.actions.populateBookData(bookingFlight, flightBookData, fareData);

            console.log("Flight booking res", flightBookData);
            this.setState({
              // flightBookData,
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
        fetchFlightBookData: (
          resultIndex,
          flight,
          baggageDtls,
          arrIndex
        ) => {
          var bookingFlight = this.state.bookingFlight
            ? [...this.state.bookingFlight]
            : [];

          var addedMeals = [];
          var addedBaggage = [];
          for (let i = 0; i < flight.Segments.length; i++) {
            const selectedMeals = [];
            const selectedBaggage = [];
            for (let j = 0; j < this.state.flightTravellers; j++) {
              const mealObj = {
                price: 0,
                mealDesc: 0,
              };
              const baggageObj = {
                price: 0,
                baggage: 0,
                text: '',
              };
              selectedMeals.push(mealObj);
              selectedBaggage.push(baggageObj);
            }

            addedMeals.push(selectedMeals);
            addedBaggage.push(selectedBaggage);
          }
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
            selectedMeals: addedMeals,
            selectedBaggage: addedBaggage,
            adults: this.state.adults,
            child: this.state.children,
            infant: this.state.infants,
            travellers: this.state.flightTravellers,
            flightRequest: this.state.flightReq[this.state.flightResJType],
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

          bookingFlight[bookIndex].selectedBaggage.forEach((bgp, b) => {
            var x = 0;
            var x = 0;
            bgp.forEach((bag) => {
              x += bag.price ? Number(bag.price) : 0;
            })
            totalFare += x;
          });
          bookingFlight[bookIndex].selectedMeals.forEach((mp, b) => {
            var x = 0;
            mp.forEach((bag) => {
              x += bag.price ? Number(bag.price) : 0;
            })
            totalFare += x;
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
          var totSum = 0
          bookingFlight.forEach((seg, s) => {
            totSum = 0
            totSum += seg.totalFare ? Number(seg.totalFare) : 0;
            totalFareSum += seg.totalFare ? Number(seg.totalFare) : 0;
            totalSeatCharges += seg.seatCharges ? Number(seg.seatCharges) : 0;
            var finalPrice = totSum + (totSum * this.state.domesticFlight) / 100
            bookingFlight[s].finalPrice = finalPrice
            if (Array.isArray(seg.selectedBaggage)) {
              seg?.selectedBaggage?.forEach((baggage, p) => {

                var x = 0;
                baggage.forEach((bag) => {
                  x += bag.price ? Number(bag.price) : 0;
                })
                totalBaggagePrice += x;
              });
            }
            if (Array.isArray(seg.selectedMeals)) {
              seg?.selectedMeals?.forEach((baggage, p) => {
                var x = 0;
                baggage.forEach((bag) => {
                  x += bag.price ? Number(bag.price) : 0;
                })
                totalMealPrice += x;
              });
            }
          });
          var finalPrice = totalFareSum + (totalFareSum * this.state.domesticFlight) / 100;
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
        getAllUsers: async () => {
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
        setAdminData: async () => {
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

            // const docCollectionRef = firestore()
            //   .collection('Accounts')
            //   .doc(admin[0].userid);
            this.setState({
              domesticFlight: Number(admin[0].domesticFlights),
              internationalFlight: Number(admin[0].internationalFlights),
              domesticHotel: Number(admin[0].domesticHotels),
              internationalHotel: Number(admin[0].internationalHotels),
              cabService: Number(admin[0].cabs),
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
        handleMeal: async (
          e,
          type,
          bookIndex,
          segIndex,
          traveller
        ) => {
          var bookingFlight = [...this.state.bookingFlight];
          if (type === "meal") {
            if (e !== "No add-on meal") {
              bookingFlight[bookIndex].selectedMeals[segIndex][traveller].price = Number(
                e.split("->")[1].split("Rs")[1].split("/")[0].trim()
              );
              bookingFlight[bookIndex].selectedMeals[segIndex][traveller].mealDesc = e
                .split("->")[0]
                .trim();
            } else {
              bookingFlight[bookIndex].selectedMeals[segIndex][traveller].price = 0;
              bookingFlight[bookIndex].selectedMeals[segIndex][traveller].mealDesc = "";
            }
          } else if (type === "baggage") {
            if (e !== "No excess baggage") {
              console.log(bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].price, "........>>>>>>>>>")
              bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].price = Number(
                e.split("at")[1].split("Rs")[1].split("/-")[0].split(" ")[1].trim()
              );
              bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].baggage = Number(
                e.split("at")[0].split("KG")[0].trim()
              );
              bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].text =
                e.split("at")[1].split("Rs")[1].split("/-")[0].split(" ").slice(2).join(' ')

            } else {
              bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].price = 0;
              bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].baggage = 0;
              bookingFlight[bookIndex].selectedBaggage[segIndex][traveller].text = ''
            }
          }
          bookingFlight[bookIndex].totalFare =
            this.state.actions.calculateTotalFlightFare(bookingFlight, bookIndex)
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

        getAllHotels: async (id, userId) => {
          try {
            const hotelCollectionRef = firestore()
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(id)
              .collection("hotels");

            const querySnapshot = await hotelCollectionRef.get();
            const hotelsArray = [];

            querySnapshot.forEach((doc) => {
              hotelsArray.push({
                id: doc.id,
                data: doc.data()
              });
            });

            return hotelsArray;
          } catch (error) {
            console.log(error);
            return [];
          }
        },
        objToArr: (obj) => {
          if (Array.isArray(obj)) {
            return obj.map((element) => this.state.actions.objToArr(element));
          } else if (typeof obj === "object" && obj !== null) {
            const keys = Object.keys(obj);
            if (keys.every((key) => !isNaN(key))) {
              return keys.map((key) => this.state.actions.objToArr(obj[key]));
            } else {
              const newObj = {};
              keys.forEach((key) => {
                newObj[key] = this.state.actions.objToArr(obj[key]);
              });
              return newObj;
            }
          }
          return obj;
        },
        getAllFlights: async (id, userId) => {
          try {
            const flightCollectionRef = firestore()
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(id)
              .collection("flights");

            const querySnapshot = await flightCollectionRef.get();
            const flightsArray = [];

            let n = 0;
            querySnapshot.forEach(async (doc) => {
              var modifiedFlightObj = await this.state.actions.objToArr(doc.data()[n])
              flightsArray.push({
                id: doc.id,
                data: modifiedFlightObj
              });
              n++;
            });

            return flightsArray;
          } catch (error) {
            console.log(error);
            return []; // or handle the error accordingly
          }
        },
        getAllCabs: async (id, userid) => {
          var cabCollectionRef = firestore()
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("cabs");
          const querysnapshot = await cabCollectionRef.get();
          var cabsArray = [];
          querysnapshot.forEach((doc) => {
            cabsArray.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          return cabsArray;
        },
        getAllBus: async (id, userid) => {
          var busCollectionRef = firestore()
          .collection("Accounts")
          .doc(userid)
          .collection("trips")
          .doc(id)
          .collection("bus");
          const querysnapshot = await busCollectionRef.get();
          var busArray = [];
          querysnapshot.forEach(async(doc) => {
            var modifiedBusObj = await this.state.actions.objToArr(doc.data());
            busArray.push({
              id: doc.id,
              data:modifiedBusObj,
            });
          });
          return busArray ;
        },
        getAllExpenses: async (tripId, userId) => {
          try {
            const cabCollectionRef = firestore()
              .collection('Accounts')
              .doc(userId)
              .collection('trips')
              .doc(tripId)
              .collection('expenses');

            const querySnapshot = await cabCollectionRef.get();
            const expenseArray = [];
            querySnapshot.forEach(doc => {
              expenseArray.push({
                id: doc.id,
                data: doc.data(),
              });
            });
            return expenseArray
          } catch (error) {
            console.error('Error fetching expenses: ', error);
          }
        },
        setUserAccountDetails: (value) => {
          this.setState({
            userAccountDetails: value
          });
        },
        setOffset: async (value) => {
          this.setState({
            offset: value
          })
        },
        getLastDoc: async () => {
          try {
            const collectionRef = firestore().collection("Accounts").doc(this.state.userId);
            const tripsCollecRef = collectionRef.collection("trips");
            const docs = [];
            if (!this.state.offset) {
              await this.state.actions.setTrips({ userTrips: docs, tripLoading: true });
              const promises = [];
              const querySnapshot = await tripsCollecRef.orderBy("date", "desc").limit(10).get();
              querySnapshot.forEach((doc) => {
                promises.push(new Promise(async (resolve) => {
                  const hotels = await this.state.actions.getAllHotels(doc.id, this.state.userId);
                  const flights = await this.state.actions.getAllFlights(doc.id, this.state.userId);
                  const cabs = await this.state.actions.getAllCabs(doc.id,this.state.userId);
                  const bus = await this.state.actions.getAllBus(doc.id,this.state.userId);
                  docs.push({
                    id: doc.id,
                    data: doc.data(),
                    hotels: hotels,
                    flights: flights,
                    cabs: cabs,
                    bus
                  });
                  resolve();
                }));
              });

              await Promise.all(promises);
              this.state.actions.setTrips({ userTrips: docs, tripLoading: false });
            } else {
              await this.state.actions.setTrips({ userTrips: docs, tripLoading: true });
              const documentsToSkip = Math.max(0, this.state.offset - 10);
              const querySnapshot = await tripsCollecRef.orderBy("date", "desc").limit(documentsToSkip + 10).get();
              const reversedDocs = [];

              querySnapshot.forEach((doc) => {
                reversedDocs.unshift(doc);
              });

              const docsToDisplay = reversedDocs.slice(0, 10);

              const promises = [];

              docsToDisplay.forEach((doc) => {
                promises.push(new Promise(async (resolve) => {
                  const hotels = await this.state.actions.getAllHotels(doc.id, this.state.userId);
                  const flights = await this.state.actions.getAllFlights(doc.id, this.state.userId);
                  const cabs    =await this.state.actions.getAllCabs(doc.id, this.state.userId);
                  const bus      =await this.state.actions.getAllBus(doc.id, this.state.userId);
                  docs.push({
                    id: doc.id,
                    data: doc.data(),
                    hotels: hotels,
                    flights: flights,
                    cabs,
                    bus
                  });
                  resolve();
                }));
              });

              await Promise.all(promises);
              this.state.actions.setTrips({ userTrips: docs, tripLoading: false });
            }
          } catch (error) {
            console.log(error);
          }
        },
        getUserById: async (id) => {
          try {
            const userCollectionRef = firestore().collection("Accounts").doc(id);
            const doc = await userCollectionRef.get();
            const userData = doc.data();
            let manager = {};

            if (userData.role !== "admin") {
              if (userData.manager && Object.keys(userData.manager).length > 0) {
                const managerCollectionRef = firestore().collection("Accounts").doc(userData.manager.userId);
                const managerDoc = await managerCollectionRef.get();
                const managerData = managerDoc.data();
                manager = { name: managerData?.firstName, email: managerData?.email, userId: userData.manager.userId };
              }
            }

            this.state.actions.setUserAccountDetails({ ...userData, manager });
            this.setState({
              userLoginStatus: {
                loggedIn: true,
                isLoading: false,
                status: "loggedIn",
                role: userData.role
              },
              notifications: userData?.notifications,
              teamMembers: userData?.teamMembers,
              noOfPages: Math.ceil(userData?.trips?.length / 10) - 1
            })
            // if (userData.role === "admin") {
            //   this.setState({
            //     role: "admin"
            //   });
            //   this.state.actions.getAllUserTrips();
            // }

            return userData.role;
          } catch (error) {
            console.log("Error", error);
          }
        },
        getRequests: async (req, userid) => {
          const reqs = [];
          await req.forEach(async (reqe) => {
            var hotelCollectionRef = firestore()
              .collection("Accounts")
              .doc(userid)
              .collection("tripRequests")
              .doc(reqe)
            try {
              const doc = await hotelCollectionRef.get();
              const sendData = doc.data();
              reqs.push({ data: sendData, id: doc.id });
            } catch (error) {
              console.error("Error getting request:", error);
            }
          })

          return reqs;
        },

        makeTripPayment: async (tripName, price) => {
          try {
            const accCollectionRef = firestore().collection("Accounts").doc(this.state.userId);
            const accSnapShot = await accCollectionRef.get();

            if (!accSnapShot.exists) {
              throw new Error("User document does not exist");
            }
            const userData = accSnapShot.data();
            const finalBalance = Number(userData.balance) - Number(price);
            const data = {
              Date: Date.now(),
              type: "Debit",
              amount: price,
              application: tripName,
              balance: finalBalance,
            };
            await accCollectionRef.update({
              balance: finalBalance,
              transactions: firestore.FieldValue.arrayUnion(data)
            });
            await this.state.actions.getUserById(this.state.userId);
            console.log("Payment successful");
          } catch (error) {
            console.error("Error making trip payment:", error);
          }
        },

        sendBookingSubmitEmail: async (userData) => {
          try {
            const response = await fetch("https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingSubmitEmail", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData),
            });
            if (!response.ok) {
              console.log(response);
            }
            var data = await response.json()
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        getTripDoc: async (id, userid) => {
          try {
            const db = firestore();
            const docCollectionRef = db.collection("Accounts").doc(userid).collection("trips").doc(id);
            const doc = await docCollectionRef.get();
            const sendData = doc.data();

            const [flights, hotels, requestData, cabs, expenses,bus] = await Promise.all([
              this.state.actions.getAllFlights(doc.id, userid),
              this.state.actions.getAllHotels(doc.id, userid),
              sendData?.requestId ? this.state.actions.getRequests(sendData?.requestId, userid) : '',
              this.state.actions.getAllCabs(doc.id, userid),
              this.state.actions.getAllExpenses(doc.id, userid),
              this.state.actions.getAllBus(doc.id, userid),
            ]);

            this.state.actions.setTripData({
              id: doc.id,
              data: sendData,
              hotels: hotels,
              flights: flights,
              cabs: cabs,
              expenses,
              requestData: requestData,
              bus,
            });

            return sendData;
          } catch (error) {
            console.error(error);
          }
        },
        editTripStatus: async (userId, tripId, adminTripId, status, hotelId, type) => {
          try {
            const db = firestore();

            if (type === "add") {
              const accountCollectionRef = db.collection("Accounts").doc(userId);
              const tripCollectionRef = accountCollectionRef.collection("trips").doc(tripId);
              const userHotelDetails = await tripCollectionRef.get();
              const userHotelArray = userHotelDetails.data().hotels;
              const userCurrHotel = userHotelArray.filter(hotel => hotel.id === hotelId);

              await tripCollectionRef.update({
                hotels: firestore.FieldValue.arrayRemove(userCurrHotel[0])
              });

              await tripCollectionRef.update({
                hotels: firestore.FieldValue.arrayUnion({ ...userCurrHotel[0], status: status })
              });

              const adminCollectionRef = db.collection("Accounts").doc(this.state.adminDetails.userid);
              const admintripCollectionRef = adminCollectionRef.collection("trips").doc(adminTripId);
              const adminHotelDetails = await admintripCollectionRef.get();
              const adminHotelArray = adminHotelDetails.data().hotels;
              const admincurrHotel = adminHotelArray.filter(hotel => hotel.id === hotelId);

              await admintripCollectionRef.update({
                hotels: firestore.FieldValue.arrayRemove(admincurrHotel[0])
              });

              if (status === "Booked" || status === "Booked,Payment Pending") {
                await admintripCollectionRef.update({
                  hotels: firestore.FieldValue.arrayUnion({ ...userCurrHotel[0], status: status, bookedAt:  Date.now() })
                });
              } else {
                await admintripCollectionRef.update({
                  hotels: firestore.FieldValue.arrayUnion({ ...userCurrHotel[0], status: status })
                });
              }
            }

            if (type === "flight") {
              var accountCollectionRef = db.collection("Accounts").doc(userId);
              var tripCollectionRef = accountCollectionRef
                .collection("trips")
                .doc(tripId);
              var userHotelDetails = await tripCollectionRef.get();
              var userFlightArray = userHotelDetails.data().flights;
              var userCurrFlight = userFlightArray.filter(flight => flight.id === hotelId);

              await tripCollectionRef.update({
                flights: firestore.FieldValue.arrayRemove(userCurrFlight[0])
              });

              await tripCollectionRef.update({
                flights: firestore.FieldValue.arrayUnion({ ...userCurrFlight[0], status: status })
              });
              var adminCollectionRef = db
                .collection("Accounts")
                .doc(this.state.adminDetails.userid);
              var admintripCollectionRef = adminCollectionRef
                .collection("trips")
                .doc(adminTripId);
              var adminFlightDetails = await admintripCollectionRef.get();
              var adminFlightArray = adminFlightDetails.data().flights;
              var flightArray = Object.values(adminFlightArray)
              var admincurrFlight = flightArray.filter((flight) => {
                return flight.id === hotelId;
              });
              await admintripCollectionRef.update({
                flights: firestore.FieldValue.arrayRemove(admincurrFlight[0])
              });

              if (status === "Booked" || status === "Booked,Payment Pending") {
                await admintripCollectionRef.update({
                  flights: firestore.FieldValue.arrayUnion({ ...userCurrFlight[0], status: status, bookedAt:  Date.now() })
                });
              }
              else {
                await admintripCollectionRef.update({
                  flights: firestore.FieldValue.arrayUnion({ ...userCurrFlight[0], status: status })
                });
              }

            }

            if (type === "cabs") {
              var accountCollectionRef = db.collection("Accounts").doc(userId);
              var tripCollectionRef = accountCollectionRef
                .collection("trips")
                .doc(tripId);
              var userCabDetails = await tripCollectionRef.get();
              var userCabsArray = userCabDetails.data().cabs;
              var userCurrCabs = userCabsArray.filter(cab => cab.id === hotelId);

              await tripCollectionRef.update({
                cabs: firestore.FieldValue.arrayRemove(userCurrCabs[0])
              });

              await tripCollectionRef.update({
                cabs: firestore.FieldValue.arrayUnion({ ...userCurrCabs[0], status: status })
              });
              var adminCollectionRef = db
                .collection("Accounts")
                .doc(this.state.adminDetails.userid);
              var admintripCollectionRef = adminCollectionRef
                .collection("trips")
                .doc(adminTripId);
              var adminCabsDetails = await admintripCollectionRef.get();
              var adminCabsArray = adminCabsDetails.data().cabs;
              var admincurrCabs = adminCabsArray.filter((cabs) => {
                return cabs.id === hotelId;
              });
              await admintripCollectionRef.update({
                cabs: firestore.FieldValue.arrayRemove(admincurrCabs[0])
              });

              if (status === "Booked" || status === "Booked,Payment Pending") {
                await admintripCollectionRef.update({
                  cabs: firestore.FieldValue.arrayUnion({ ...userCurrCabs[0], status: status, bookedAt:  Date.now() })
                });
              }
              else {
                await admintripCollectionRef.update({
                  cabs: firestore.FieldValue.arrayUnion({ ...userCurrCabs[0], status: status })
                });
              }

            }

            if (type === "bus") {
              var accountCollectionRef = db.collection("Accounts").doc(userId);
              var tripCollectionRef = accountCollectionRef
                .collection("trips")
                .doc(tripId);
              var userBusDetails = await tripCollectionRef.get();
              var userBussArray = userBusDetails.data().bus;
              var userCurrBuss = userBussArray.filter(bus => bus.id === hotelId);

              await tripCollectionRef.update({
                bus: firestore.FieldValue.arrayRemove(userCurrBuss[0])
              });

              await tripCollectionRef.update({
                bus: firestore.FieldValue.arrayUnion({ ...userCurrBuss[0], status: status })
              });
              var adminCollectionRef = db
                .collection("Accounts")
                .doc(this.state.adminDetails.userid);
              var admintripCollectionRef = adminCollectionRef
                .collection("trips")
                .doc(adminTripId);
              var adminBusDetails = await admintripCollectionRef.get();
              var adminBusArray = adminBusDetails.data().bus;
              var admincurrBus = adminBusArray.filter((bus) => {
                return bus.id === hotelId;
              });
              await admintripCollectionRef.update({
                bus: firestore.FieldValue.arrayRemove(admincurrBus[0])
              });

              if (status === "Booked" || status === "Booked,Payment Pending") {
                await admintripCollectionRef.update({
                  bus: firestore.FieldValue.arrayUnion({ ...userCurrBuss[0], status: status, bookedAt:  Date.now() })
                });
              }
              else {
                await admintripCollectionRef.update({
                  bus: firestore.FieldValue.arrayUnion({ ...userCurrBuss[0], status: status })
                });
              }

            }

            await this.state.actions.getTripDoc(tripId, this.state.userId);
          } catch (error) {
            console.error(error);
          }
        },
        addTripsToAdmin: async (tripId, data, userDetails, submittedHotels, submittedFlights,submittedCabs,submittedBus) => {
          try {

            // Reference to the admin's document in the 'Accounts' collection
            const docCollectionRef = firestore().collection("Accounts").doc(this.state.adminDetails.userid);
            const tripCollectionRef = docCollectionRef.collection("trips");

            // Get trip document data by tripId and userId
            const data1 = await this.state.actions.getTripDocById(tripId, this.state.userAccountDetails.userid);

            const hotelArray = submittedHotels?.map((hotel) => {
              return { status: "Not Submitted", id: hotel };
            });

            const flightArray = submittedFlights?.map((flight) => {
              return { status: "Not Submitted", id: flight };
            });

            const cabArray = submittedCabs?.map((cab) => {
              return { status: "Not Submitted", id: cab };
            });

            const busArray =submittedBus.length>0?
            submittedBus?.map((bus) => {
              return { status: "Not Submitted", id: bus };
            }):[]

            // Add new trip document to admin's trips collection
            const newTripDocRef = await tripCollectionRef.add({
              userDetails: this.state.userAccountDetails,
              tripId: tripId,
              tripName: data1?.name,
              hotels: hotelArray,
              flights: flightArray,
              cabs: cabArray,
              status: "Not Submitted",
              submittedDate: Date.now(),
              travellerDetails: userDetails,
              bus: busArray,
            });

            // Update admin's document with new trip ID
            await docCollectionRef.update({
              trips: firestore.FieldValue.arrayUnion(newTripDocRef.id),
            });

            // Update trip status for user's trip
            const accountCollectionRef = firestore().collection("Accounts").doc(this.state.userId);
            const tripCollectionRef1 = accountCollectionRef.collection("trips").doc(tripId);
            await tripCollectionRef1.update({
              status: "Submitted",
              travellerDetails: userDetails
            });

            // Update trip status for flights, hotels, and cabs
            if (flightArray) {
              flightArray.map((flight) => {
                return this.state.actions.editTripStatus(this.state.userId, tripId, newTripDocRef.id, "Paid and Submitted", flight.id, "flight");
              });
            }

            if (hotelArray) {
              hotelArray.map((hotel) => {
                return this.state.actions.editTripStatus(this.state.userId, tripId, newTripDocRef.id, "Paid and Submitted", hotel.id, "add");
              });
            }

            if (cabArray) {
              cabArray.map((cab) => {
                return this.state.actions.editTripStatus(this.state.userId, tripId, newTripDocRef.id, "Paid and Submitted", cab.id, "cabs");
              });
            }

            if (busArray) {
              busArray.map((bus) => {
                return this.state.actions.editTripStatus(this.state.userId, tripId, newTripDocRef.id, "Paid and Submitted", bus.id, "bus");
              });
            }

            console.log("Trip added to admin successfully");
          } catch (error) {
            console.error("Error adding trip to admin:", error);
          }
        },


        editAdminTrips: async (tripid, data, travellerDetails, submittedHotels, submittedFlights, requestIds,submittedCabs, tripName, submittedBus) => {
          try {
            const accountDocRef = firestore().collection("Accounts").doc(this.state.adminDetails.userid);
            const tripCollectionRef = accountDocRef.collection("trips");
            const tripQuery = tripCollectionRef.where("tripId", "==", tripid);
            const querySnapshot = await tripQuery.get();

            const hotelArray = submittedHotels?.map((hotel) => {
              return { status: "Not Submitted", id: hotel };
            });

            // Update trip request status for each request
            // await Promise.all(requestIds.map(async (req) => {
            //   const userDocRef = firestore().collection("Accounts").doc(this.state.userId);
            //   const tripReqcollectionRef = userDocRef.collection("tripRequests");
            //   const tripReqDoc = tripReqcollectionRef.doc(req);
            //   await tripReqDoc.update({
            //     tripStatus: "Submitted"
            //   });
            // }));

            await requestIds.forEach(async (req) => {
              const userDocRef = firestore().collection("Accounts").doc(this.state.userId);
              const tripReqcollectionRef = userDocRef.collection("tripRequests");
              const tripReqDoc = tripReqcollectionRef.doc(req);
              await tripReqDoc.update({
                tripStatus: "Submitted"
              });
            })

            const flightArray = submittedFlights?.map((flight) => {
              return { status: "Not Submitted", id: flight };
            });

            // Send booking submit email
            await this.state.actions.sendBookingSubmitEmail({
              id: this.state.userId,
              name: this.state.userAccountDetails.firstName + this.state.userAccountDetails.lastName,
              email: this.state.userAccountDetails.email,
              tripName: tripName
            });

            const cabArray = submittedCabs?.map((cab) => {
              return { status: "Not Submitted", id: cab };
            });

            const busArray = submittedBus.length>0?
            submittedBus?.map((bus) => {
              return { status: "Not Submitted", id: bus };
            }):[]

            if (!querySnapshot.empty) {
              const docRef = querySnapshot.docs[0].ref;
              const admintripdata = querySnapshot.docs[0].data();
              await docRef.update({
                hotels: [...admintripdata.hotels, ...hotelArray],
                flights: [...admintripdata.flights, ...flightArray],
                travellerDetails: travellerDetails,
                cabs: [...admintripdata.cabs, ...cabArray],
                bus: [...admintripdata.bus, ...busArray],
              });
            } else {
              await this.state.actions.addTripsToAdmin(tripid, data, travellerDetails, submittedHotels, submittedFlights,submittedCabs,submittedBus);
              return;
            }

            const accountCollectionRef = firestore().collection("Accounts").doc(this.state.userId);
            const tripCollectionRef1 = accountCollectionRef.collection("trips").doc(tripid);
            await tripCollectionRef1.update({
              status: "Submitted",
              travellerDetails: travellerDetails
            });

            if (!querySnapshot.empty) {
              if (flightArray) {
                flightArray.map((flight) => {
                  return this.state.actions.editTripStatus(this.state.userId, tripid, querySnapshot.docs[0].id, "Paid and Submitted", flight.id, "flight");
                });
              }
              if (hotelArray) {
                hotelArray.map((hotel) => {
                  return this.state.actions.editTripStatus(this.state.userId, tripid, querySnapshot.docs[0].id, "Paid and Submitted", hotel.id, "add");
                });
              }
              if (cabArray) {
                cabArray.map((cab) => {
                  return this.state.actions.editTripStatus(this.state.userId, tripid, querySnapshot.docs[0].id, "Paid and Submitted", cab.id, "cabs");
                });
              }
              if (busArray) {
                busArray.map((bus) => {
                  return this.state.actions.editTripStatus(this.state.userId, tripid, querySnapshot.docs[0].id, "Paid and Submitted", bus.id, "bus");
                });
              }
            }
            await this.state.actions.getUserById(this.state.userId);
            console.log("Admin trip edited successfully");
          } catch (error) {
            console.error("Error editing admin trip:", error);
          }
        },
        setTripData: (value) => {
          this.setState({
            tripData: value
          });
        },
        getTripDocById: async (id, userid) => {
          try {
            this.setState({
              tripDataLoading: true
            });

            const docCollectionRef = firestore()
              .collection("Accounts")
              .doc(userid)
              .collection("trips")
              .doc(id);

            const doc = await docCollectionRef.get();
            console.log(doc, "----doc");

            const sendData = doc.data();
            console.log(sendData, "sendData");

            // let requestData = [];
            // if (sendData.requestId) {
            //   requestData = await this.state.actions.getRequests(sendData.requestId, userid);
            // }

            console.log(requestData, "requestData");

            const [flights, hotels, requestData,cabs, expenses,bus] = await Promise.all([
              this.state.actions.getAllFlights(docCollectionRef.id, userid),
              this.state.actions.getAllHotels(docCollectionRef.id, userid),
              sendData.requestId ? this.state.actions.getRequests(sendData.requestId, userid) : '',
              this.state.actions.getAllCabs(docCollectionRef.id, userid),
              this.state.actions.getAllExpenses(docCollectionRef.id, userid),
              this.state.actions.getAllBus(docCollectionRef.id, userid),
            ]);

            this.state.actions.setTripData({
              id: doc.id,
              data: sendData,
              hotels: hotels,
              flights: flights,
              cabs: cabs,
              requestData: requestData,
              expenses:expenses,
              bus: bus.length > 0 ? bus : [],
            });

            this.setState({
              tripDataLoading: false
            });

            return sendData;
          } catch (error) {
            console.error(error);
          }
        },
        arrToObj: (varr) => {
          if (Array.isArray(varr)) {
            varr.forEach((cVarr, c) => {
              cVarr = this.state.actions.arrToObj(cVarr);
            });
            varr = Object.assign({}, varr);
          } else if (typeof varr === "object" && varr !== null) {
            Object.keys(varr).forEach((key, k) => {
              varr[key] = this.state.actions.arrToObj(varr[key]);
            });
            varr = Object.assign({}, varr);
          }
          return varr;
        },
        objToArr: (obj) => {
          if (Array.isArray(obj)) {
            return obj.map((element) => this.state.actions.objToArr(element));
          } else if (typeof obj === "object" && obj !== null) {
            const keys = Object.keys(obj);
            if (keys.every((key) => !isNaN(key))) {
              return keys.map((key) => this.state.actions.objToArr(obj[key]));
            } else {
              const newObj = {};
              keys.forEach((key) => {
                newObj[key] = this.state.actions.objToArr(obj[key]);
              });
              return newObj;
            }
          }
          return obj;
        },

        editTripBtn: async (name, type, data) => {
          const accountDocRef = firestore().collection("Accounts").doc(this.state.userId);
          const tripcollectionRef = accountDocRef.collection("trips");
          const newtripdocRef = await tripcollectionRef.add({
            flights: [],
            hotels: [],
            cabs: [],
            bus: [],
            date: new Date(),
            name: newTripCompleteString,
            status: "Not Submitted"
          });
          const tripDocRef = firestore().collection("Accounts").doc(this.state.userId)
            .collection("trips").doc(newtripdocRef.id);

          await tripDocRef.update({
            name: name
          });

          await firestore().collection("Accounts").doc(this.state.userId).update({
            trips: firestore.FieldValue.arrayUnion(newtripdocRef.id)
          });

          if (type === "hotels") {
            const hotelDocRef = tripDocRef.collection("hotels");
            const newDocRef = await hotelDocRef.add(data);
            await firestore().collection("Accounts").doc(this.state.userId)
              .collection("trips").doc(tripDocRef.id).update({
                hotels: firestore.FieldValue.arrayUnion({
                  id: newDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested"
                })
              });
          }

          if (type === "flights") {
            const hotelDocRef = tripDocRef.collection("flights");

            const fd = data.map((flight) => {
              return this.state.actions.arrToObj([flight])
            });

            const changedObj = data.map((flight) => {
              return this.state.actions.objToArr(flight)
            });

            console.log(changedObj, "changedObj");
            this.setState({
              bookingFlight: changedObj,
            });
            await Promise.all(await fd.map(async (flight) => {
              var docRef = await hotelDocRef.add(
                flight
              ); await firestore()
                .collection("Accounts")
                .doc(this.state.userId)
                .collection("trips")
                .doc(tripDocRef.id)
                .update({
                  flights: firestore.FieldValue.arrayUnion({ id: docRef.id, status: "Not Submitted", date: new Date(), requestStatus: "Not Requested" })
                });
            }))
          }
          if (type === "cabs") {
            const cabDocRef = tripDocRef.collection("cabs");
            const newDocRef = await cabDocRef.add(data);
            await firestore().collection("Accounts").doc(this.state.userId)
              .collection("trips").doc(tripDocRef.id).update({
                cabs: firestore.FieldValue.arrayUnion({
                  id: newDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested"
                })
              });
          }

          if (type === "bus") {
            const busDocRef = tripDocRef.collection("bus");
            var busObjData = this.state.actions.arrToObj(data);
            const newDocRef = await busDocRef.add(busObjData);
            await tripDocRef.update({
              bus: firestore.FieldValue.arrayUnion({
                id: newDocRef.id,
                status: "Not Submitted",
                date: new Date(),
                requestStatus: "Not Requested",
              }),
            });
          }

          // await this.state.actions.getTripDocById(newtripdocRef.id, this.state.userId)
          //await this.state.actions.getAllTrips(this.state.userAccountDetails.userid);
          await this.state.actions.getTripDoc(
            newtripdocRef.id,
            this.state.userId
          );
         
          return newtripdocRef.id;
        },

        editTripById: async (id, data, type) => {
          try {
            const newState = {
              searchingFlights: false,
              searchingHotels: false,
              fetchingHotelInfo: false,
              hotelInfoRes: false,
              flightResList: [],
              hotelResList: [],
              bookingFlight: [],
              bookingHotel: [],
            };
            this.setState(newState);
            this.state.actions.setFlightBookPage(false);

            const tripDocRef = firestore()
              .collection("Accounts")
              .doc(this.state.userId)
              .collection("trips")
              .doc(id);

            if (type === "hotels") {
              const hotelDocRef = tripDocRef.collection("hotels");
              const newHotelDocRef = await hotelDocRef.add(data);
              await tripDocRef.update({
                hotels: firestore.FieldValue.arrayUnion({
                  id: newHotelDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested",
                }),
              });
            }

            if (type === "flights") {
              const flightDocRef = tripDocRef.collection("flights");

              const flightData = data.map((flight) => this.state.actions.arrToObj([flight]));

              // Adding flights to the trip
              await Promise.all(
                flightData.map(async (flight) => {
                  const docRef = await flightDocRef.add(flight);
                  await tripDocRef.update({
                    flights: firestore.FieldValue.arrayUnion({
                      id: docRef.id,
                      status: "Not Submitted",
                      date: new Date(),
                      requestStatus: "Not Requested",
                    }),
                  });
                })
              );
            }

            if (type === "cabs") {
              const cabDocRef = tripDocRef.collection("cabs");
              const newDocRef = await cabDocRef.add(data);
              await tripDocRef.update({
                cabs: firestore.FieldValue.arrayUnion({
                  id: newDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested",
                }),
              });
            }

            if (type === "bus") {
              const busDocRef = tripDocRef.collection("bus");
              var busObjData = this.state.actions.arrToObj(data);
              const newDocRef = await busDocRef.add(busObjData);
              await tripDocRef.update({
                bus: firestore.FieldValue.arrayUnion({
                  id: newDocRef.id,
                  status: "Not Submitted",
                  date: new Date(),
                  requestStatus: "Not Requested",
                }),
              });
            }

            // await this.state.actions.getTripDocById(id, this.state.userId);
            await this.state.actions.getTripDoc(id, this.state.userId);
          } catch (error) {
            console.log(error,);
          }
        },

        deleteTripItem: async (tripId, itemId, itemType) => {
          try {
            this.setState({
              tripDataLoading: true
            });
            const docRef = firestore().collection('Accounts').doc(this.state.userId).collection('trips').doc(tripId);
            const docSnapshot = await docRef.get();
            const docData = docSnapshot.data();

            if (itemType === 'hotels') {
              const hotels = docData.hotels;
              const deletedHotel = hotels.filter(hotel => hotel.id === itemId);
              await docRef.update({
                hotels: firestore.FieldValue.arrayRemove(deletedHotel[0])
              });
              var hotelDoc = await docRef.collection("hotels").doc(itemId).delete();
            }

            if (itemType === 'flights') {
              console.log(("firflights"))
              const flights = docData.flights;
              const deletedFlight = flights.filter(flight => flight.id === itemId);
              await docRef.update({
                flights: firestore.FieldValue.arrayRemove(deletedFlight[0])
              });
              var flightDoc = await docRef.collection("flights").doc(itemId).delete();
            }

            if(itemType === "cabs")
              {
                const cabs = docData.cabs;
              const deletedCabs = cabs.filter(cabs => cabs.id === itemId);
              await docRef.update({
                flights: firestore.FieldValue.arrayRemove(deletedCabs[0])
              });
              var cabDoc = await docRef.collection("cabs").doc(itemId).delete();
              }

              if(itemType === "bus")
                {
                  const buses = docData.bus;
                const deletedBus = buses.filter(bus => bus.id === itemId);
                await docRef.update({
                  flights: firestore.FieldValue.arrayRemove(deletedBus[0])
                });
                var busDoc = await docRef.collection("bus").doc(itemId).delete();
                }
            this.setState({
              tripData: null,
              tripDataLoading: false
            });

            await this.state.actions.getTripDocById(tripId, this.state.userId);
          } catch (error) {
            console.error(error);
          }
        },
        setRes: async () => {
          this.setState({
            searchingFlights: true,
            searchingHotels: true,
            fetchingHotelInfo: true,
            hotelInfoRes: false,
            flightResList: [],
            hotelResList: [],
            bookingFlight: [],
            bookingHotel: [],
            cabResList: [],
            busResList: [],
            outbound: "",
            inbound: "",
            cabinClassId: "2",
            journeyWay: "1",
            searchingBus: false,
            fetchingBusSeat: false,
            NoofBusPassengers: 1,
            searchingCabs: false,
            busErrorMessage: false,
            bookingBus: false,
            // originSelectedAirport: {
            //   name: "",
            //   iataCode: "",
            //   address: {
            //     cityName: "",
            //     countryName: ""
            //   }
            // },
            //   destinationSelectedAirPort: {
            //     name: "",
            //     iataCode: "",
            //     address: {
            //       cityName: "",
            //       countryName: ""
            //     },
            // },
            // destinationSelectedAirPort:"",
            origin: null,
            destination: null,
            departure: "Departure Date",
            returnDate: "Return Date",
            adults: 1,
            children: 0,
            infants: 0,
            directflight: false,
            oneStopFlight: false,
            journeyWay: "1",
            flightResJType: 0,

          })
          this.state.actions.setFlightBookPage(false)
        },
        setSelectedTrip: async (value) => {
          this.setState({
            selectedTrip: value
          });
        },
        setSelectedTripId: async (value) => {
          try {
            // Reference to the trip document
            const docSnapshot = await firestore()
              .collection("Accounts")
              .doc(this.state.userId)
              .collection("trips")
              .doc(value)
              .get();
            const tripData = docSnapshot.data();
            const [flights, hotels] = await Promise.all([
              this.state.actions.getAllFlights(docSnapshot.id, this.state.userId),
              this.state.actions.getAllHotels(docSnapshot.id, this.state.userId)
            ]);
            this.state.actions.setSelectedTrip({
              id: docSnapshot.id,
              data: tripData,
              hotels: hotels,
              flights: flights
            });
            this.setState({
              selectedTripId: value
            });
          } catch (error) {
            console.error(error);
          }
        },

        handleSelectedTripId: () => {
          this.setState({ selectedTripId: null })
        },

        sendApproval: async (userId, managerId, tripId, travellerDetails, price) => {
          const userDocRef = firestore().collection("Accounts").doc(userId);
          const tripCollecRef = userDocRef.collection("trips").doc(tripId);
          const tripData = await tripCollecRef.get();

          const flightArray = tripData.data().flights.filter((flight) => flight.requestStatus === "Not Requested");
          const hotelArray = tripData.data().hotels.filter((hotel) => hotel.requestStatus === "Not Requested");
          const cabArray = tripData.data()?.cabs?.filter((cab) => cab.requestStatus === "Not Requested");
          const busArray = tripData.data()?.bus?.filter((bus) => bus.requestStatus === "Not Requested"??[]);

          const reqFlights = flightArray.map((flight) => flight.id);
          const reqHotels = hotelArray.map((hotel) => hotel.id);
          const reqCabs = cabArray?.length > 0 ? cabArray?.map((cab) => cab.id) : [];
          const reqBus = busArray?.length > 0 ? busArray?.map((bus) => bus.id) : [];

          const tripReqcollectionRef = userDocRef.collection("tripRequests");
          const newtripdocRef = await tripReqcollectionRef.add({
            createdAt: new Date(),
            status: "Pending",
            tripId: tripId,
            userId: userId,
            price: price,
            flights: reqFlights,
            hotels: reqHotels,
            cabs: reqCabs,
            bus:reqBus,
            tripStatus: "Not Submitted"
          });

          const managerDocRef = firestore().collection("Accounts").doc(managerId);

          await managerDocRef.update({
            approvalRequests: firestore.FieldValue.arrayUnion({
              userId: userId,
              status: "Pending",
              tripId: tripId,
              requestId: newtripdocRef.id,
              totalPrice: price,
              flights: reqFlights,
              hotels: reqHotels,
              cabs: reqCabs,
              bus: reqBus,
            })
          });

          const newTravellers = { ...tripData.data().travellerDetails, ...travellerDetails };
          await tripCollecRef.update({
            requestId: firestore.FieldValue.arrayUnion(newtripdocRef.id),
            travellerDetails: newTravellers,
            price: price
          });

          await flightArray.map(async (flight) => {
            await tripCollecRef.update({
              flights: firestore.FieldValue.arrayRemove(flight)
            });
            const newflight = { ...flight, requestStatus: "Pending" };
            await tripCollecRef.update({
              flights: firestore.FieldValue.arrayUnion(newflight)
            });
          }),

            await hotelArray.map(async (hotel) => {
              await tripCollecRef.update({
                hotels: firestore.FieldValue.arrayRemove(hotel)
              });
              const newhotel = { ...hotel, requestStatus: "Pending" };
              await tripCollecRef.update({
                hotels: firestore.FieldValue.arrayUnion(newhotel)
              });
            }),

            await cabArray.map(async (cab) => {
              await tripCollecRef.update({
                cabs: firestore.FieldValue.arrayRemove(cab)
              });
              const newCab = { ...cab, requestStatus: "Pending" };
              await tripCollecRef.update({
                cabs: firestore.FieldValue.arrayUnion(newCab)
              });
            }),

            await busArray?.map(async (bus) => {
              await tripCollecRef.update({
                bus: firestore.FieldValue.arrayRemove(bus)
              });
              const newBus = { ...bus, requestStatus: "Pending" };
              await tripCollecRef.update({
                bus: firestore.FieldValue.arrayUnion(newBus)
              });
            }),

            await Promise.all([await this.state.actions.getTripDoc(tripId, this.state.userId)])
          const reqData = {
            createdAt: new Date(),
            status: "Pending",
            tripId: tripId,
            userId: userId,
            price: price,
            flights: reqFlights,
            hotels: reqHotels,
            cabs: cabArray ,
            bus: busArray,
          };
          const reqId = newtripdocRef.id;

          return { reqId, reqData };
        },
        sendBookingApprovalEmail: async (userData) => {
          try {
            const response = await fetch("https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingApprovalEmail", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData),
            });

            if (!response.ok) {
              console.log(response);
            }

            const data = await response.json();
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        updateUserProfile: async (userid, userData) => {
          const accountDocRef = firestore().collection("Accounts").doc(userid);
          await accountDocRef.update({
            firstName: userData.firstName ? userData.firstName : '',
            lastName: userData.lastName ? userData.lastName : '',
            mobileNumber: userData.mobileNumber ? userData.mobileNumber : '',
            passportNumber: userData.passportNumber ? userData.passportNumber : '',
            GSTNo: userData.GSTNo ? userData.GSTNo : '',
            PANNo: userData.PANNo ? userData.PANNo : '',
            companyName: userData.companyName ? userData.companyName : '',
          });

          const accdata = await accountDocRef.get();
          return accdata.data();
        },
       updateTravDetails : async (travellerDetails, tripId) => {
          try {
            const tripDocRef = firestore()
              .collection('Accounts')
              .doc(this.state.userId)
              .collection('trips')
              .doc(tripId);
      
            const tripSnap = await tripDocRef.get();
            const tripData = tripSnap.data();
            const travDetails = tripData?.travellerDetails;
            const newTravDetails = {  ...travDetails,...travellerDetails, };
            
            console.log(newTravDetails);
      
            await tripDocRef.update({
              travellerDetails: newTravDetails,
            });
      
            await this.state.actions.getTripDoc(tripId, this.state.userId);
          } catch (error) {
            console.error("Error updating traveller details: ", error);
          }
        },
        editManager: async (managerData) => {
          try {
            const accountsRef = firestore().collection("Accounts");
            const userQuery = await accountsRef.where("email", "==", managerData.email).get();

            if (userQuery.empty) {
              this.setState({
                emailNotFound: true
              })
              return;
            }

            const userData = userQuery.docs.map(doc => doc.data())[0];

            const currentUserRef = accountsRef.doc(this.state.userId);
            const managerData1 = {
              status: "pending",
              userId: userData.userid,
            };

            await currentUserRef.update({
              manager: managerData1
            });

            const managerRef = accountsRef.doc(userData.userid);
            const notifications = {
              userId: this.state.userId,
              message: "You have a new manager request.",
              name: this.state.userAccountDetails.firstName,
              email: this.state.userAccountDetails.email
            };

            await managerRef.update({
              notifications: firestore.FieldValue.arrayUnion(notifications)
            });
          } catch (error) {
            console.error(error);
          }
        },

        getTripsFlights: async (flightIds, tripId, userId) => {
          try {
            const flightsArray = [];

            if (flightIds.length > 0) {
              for (const flightId of flightIds) {
                const flightDocRef = firestore()
                  .collection("Accounts")
                  .doc(userId)
                  .collection("trips")
                  .doc(tripId)
                  .collection("flights")
                  .doc(flightId);

                const querySnapshot = await flightDocRef.get();
                const sendData = querySnapshot.data();
                const modifiedFlightObj = await this.state.actions.objToArr(sendData);

                flightsArray.push({
                  id: querySnapshot.id,
                  data: modifiedFlightObj,
                });
              }
            }

            return flightsArray;
          } catch (error) {
            console.error("Error getting flights:", error);
            return [];
          }
        },

        getTripsHotels: async (hotelIds, tripId, userId) => {
          try {
            const hotelArray = [];

            if (hotelIds.length > 0) {
              for (const hotelId of hotelIds) {
                const hotelDocRef = firestore()
                  .collection("Accounts")
                  .doc(userId)
                  .collection("trips")
                  .doc(tripId)
                  .collection("hotels")
                  .doc(hotelId);

                const querySnapshot = await hotelDocRef.get();
                const sendData = querySnapshot.data();

                hotelArray.push({
                  id: querySnapshot.id,
                  data: sendData,
                });
              }
            }

            return hotelArray;
          } catch (error) {
            console.error("Error getting hotels:", error);
            return [];
          }
        },
  
        //   const requestData = [];
        //           this.setState({
        //             approveLoading: true,
        //           }); 
        //           try {
        //             if (approvalRequests) {
        //               for (const req of approvalRequests) {
        //                 const userDataRef = firestore().collection("Accounts").doc(req.userId);
        //                 const data = await userDataRef.get();
        //                 const tripRef = userDataRef.collection("trips").doc(req.tripId);

        //                 const [flights, hotels, cabs] = await Promise.all([
        //                   await this.state.actions.getTripsFlights(req.flights, req.tripId, req.userId),
        //                   await this.state.actions.getTripsHotels(req.hotels, req.tripId, req.userId),
        //                   // actions.getTripsCabs(req.cabs, req.tripId, req.userId),
        //                 ]);

        //                 const doc = await tripRef.get();
        //                 const tripReqRef = userDataRef.collection("tripRequests").doc(req.requestId);
        //                 const reqDoc = await tripReqRef.get();

        //                 const tripDetails = {
        //                   userDetails: data.data(),
        //                   tripDetails: {
        //                     id: doc.id,
        //                     data: doc.data(),
        //                     hotels: hotels,
        //                     flights: flights,
        //                     // cabs: cabs,
        //                   },
        //                   requestDetails: reqDoc.data(),
        //                   approvalRequest: req,
        //                 };

        //                 requestData.push(tripDetails);
        //               }
        //             }

        //             this.setState({
        //               approveLoading: false,
        //             });
        //             return requestData;
        //           } catch (error) {
        //             Alert.alert(
        //               'Error',
        //               error.message,
        //               [{ text: 'OK' }]
        //             );
        //             throw error;
        //           }
        //         },
        getTripsForApproval: async (approvalRequests) => {
          this.setState({
            approveLoading: true,
          });
          const requestData = [];


          try {
            if (approvalRequests !== undefined) {
              await Promise.all(
                approvalRequests.map(async (req) => {
                  const userDataRef = firestore().collection("Accounts").doc(req.userId);
                  const userData = await userDataRef.get();
                  const tripRef = userDataRef.collection("trips").doc(req.tripId);

                  const [flights, hotels, cabs] = await Promise.all([
                    await this.state.actions.getTripsFlights(req.flights, req.tripId, req.userId),
                    await this.state.actions.getTripsHotels(req.hotels, req.tripId, req.userId),
                    // await this.state.actions.getTripsCabs(req.cabs, req.tripId, req.userId),
                  ]);

                  const tripDoc = await tripRef.get();
                  const tripReqRef = userDataRef.collection("tripRequests").doc(req.requestId);
                  const reqDoc = await tripReqRef.get();

                  const tripDetails = {
                    userDetails: userData.data(),
                    tripDetails: {
                      id: tripDoc.id,
                      data: tripDoc.data(),
                      hotels: hotels,
                      flights: flights,
                      // cabs: cabs,
                    },
                    requestDetails: reqDoc.data(),
                    approvalRequest: req,
                  };

                  requestData.push(tripDetails);
                })
              );
            }
            this.setState({
              approveLoading: false,
            });
            console.log("second")
            return requestData;
          } catch (error) {
            console.error('Error getting trips for approval: ', error);
          }

        },
        sendBookingApprovedEmail: async (userData) => {
          try {
            const response = await fetch(
              "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendBookingApporvedEmail",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
              }
            );
            if (!response.ok) {
              console.log(response);
            }
            var data = await response.json();
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },

        approveTripRequest: async (approvalRequest, managerId) => {
          try {
            const userDocRef = firestore().collection("Accounts").doc(approvalRequest.userId);
            const userDoc = await userDocRef.get();
            const userData = userDoc.data();

            const tripRef = userDocRef.collection("trips").doc(approvalRequest.tripId);
            const tripSnapshot = await tripRef.get();
            const tripData = tripSnapshot.data();

            await this.state.actions.sendBookingApprovedEmail({
              id: userData.id,
              userName: userData.firstName + userData.lastName,
              userEmail: userData.email,
              managerEmail: this.state.userAccountDetails.email,
              managerName: this.state.userAccountDetails.firstName + this.state.userAccountDetails.lastName,
              tripName: tripData.name,
            });

            if (approvalRequest.flights) {
              approvalRequest.flights.forEach(async (flightId) => {
                const flightDocRef = tripRef.collection('flights').doc(flightId);
                const flightSnapshot = await flightDocRef.get();
                if (flightSnapshot.exists) {
                  await flightDocRef.delete();
                  await tripRef.collection('flights').add({
                    ...flightSnapshot.data(),
                    requestStatus: 'Approved',
                  });
                }
              });
            }

            if (approvalRequest.hotels) {
              approvalRequest.hotels.forEach(async (hotelId) => {
                const hotelDocRef = tripRef.collection('hotels').doc(hotelId);
                const hotelSnapshot = await hotelDocRef.get();
                if (hotelSnapshot.exists) {
                  await hotelDocRef.delete();
                  await tripRef.collection('hotels').add({
                    ...hotelSnapshot.data(),
                    requestStatus: 'Approved',
                  });
                }
              });
            }

            // if (approvalRequest.cabs.length > 0) {
            //   approvalRequest.cabs.forEach(async (cabId) => {
            //     const cabDocRef = tripRef.collection('cabs').doc(cabId);
            //     const cabSnapshot = await cabDocRef.get();
            //     if (cabSnapshot.exists) {
            //       await cabDocRef.delete();
            //       await tripRef.collection('cabs').add({
            //         ...cabSnapshot.data(),
            //         requestStatus: 'Approved',
            //       });
            //     }
            //   });
            // }

            const tripReqcollectionRef = userDocRef.collection("tripRequests").doc(approvalRequest.requestId);
            const managerDocRef = firestore().collection("Accounts").doc(managerId);

            await managerDocRef.update({
              approvalRequests: firestore.FieldValue.arrayRemove(approvalRequest),
            });

            const updatedApprovalRequest = { ...approvalRequest, status: "Approved" };
            await managerDocRef.update({
              approvalRequests: firestore.FieldValue.arrayUnion(updatedApprovalRequest),
            });

            await tripReqcollectionRef.update({
              status: "Approved",
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });

          } catch (error) {
            console.error("Error approving trip request:", error);
          }
        },
        getFlightUpdatedDetails: async (searchReqs, flight) => {
          var flightRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightSearch",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(searchReqs),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          var flightSearchToken = flightRes.tokenId
          var flightTraceId = flightRes?.flightResult?.Response?.TraceId
          var data = flightRes?.flightResult?.Response?.Results[0].filter(
            (fData) => {
              if (fData[0].Segments.length > 1) {
                return (
                  fData[0].flightCodeStr === flight.flightCodeStr &&
                  fData[0].Segments[fData[0].Segments.length - 1][
                    fData[0].Segments[0].length - 1
                  ].Destination.ArrTime ===
                    flight.Segments[flight.Segments.length - 1][
                      flight.Segments[0].length - 1
                    ].Destination.ArrTime
                );
              } else {
                return (
                  fData[0].flightCodeStr === flight.flightCodeStr &&
                  fData[0].Segments[0][fData[0].Segments[0].length - 1]
                    .Destination.ArrTime ===
                    flight.Segments[0][flight.Segments[0].length - 1].Destination
                      .ArrTime
                );
              }
            }
          );
          var resIndex = data[0][0].ResultIndex

          var request = {
            tokenId: flightSearchToken,
            traceId: flightTraceId,
            resultIndex: resIndex,
          };

          var data2 = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/flightBookData",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          console.log(data2);
          var flightData = data2.fareQuoteResult.Response.Results;
          var ssrData = data2?.ssrResult?.Response;
          return { flightData, ssrData };
        },
     
        //   cityIds,
        //   searchReq,
        //   selectedRoom
        // ) => {
        //   var checkInDate = new Date(searchReq.checkInDate.seconds * 1000);
        //   let roomGuests = [];

        //   searchReq.hotelRoomArr.forEach((room, r) => {
        //     roomGuests.push({
        //       NoOfAdults: Number(room.adults),
        //       NoOfChild: Number(room.child),
        //       ChildAge: room.childAge.map((child, c) => Number(child.age)),
        //     });
        //   });

        //   var request = {
        //     checkInDate: this.state.actions.convertTboDateFormat(checkInDate),
        //     nights: searchReq.hotelNights,
        //     countryCode: searchReq.countryCode,
        //     cityIds: cityIds,
        //     hotelCodes: hotelCodes,
        //     noOfRooms: searchReq.hotelRooms,
        //     roomGuests: roomGuests,
        //   };

        //   var reqs = await fetch(
        //     "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelResults",
        //     {
        //       method: "POST",
        //       // credentials: "include",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(request),
        //     }
        //   );
        //   const res = await reqs.json();
        //   var selectedRooms = [];
        //   if (!res[0].error) {
        //     res[0].roomResult.GetHotelRoomResult.HotelRoomsDetails.forEach(
        //       (mainRoom) => {
        //         selectedRoom.forEach((room) => {
        //           if (
        //             mainRoom.RoomTypeName === room.RoomTypeName &&
        //             mainRoom.RoomTypeCode === room.RoomTypeCode &&
        //             mainRoom.LastCancellationDate === room.LastCancellationDate
        //           ) {
        //             selectedRooms.push(mainRoom);
        //           }
        //         });
        //       }
        //     );
        //   }

        //   return selectedRooms;
        // },
        getHotelUpdatedDetails: async (
          cityId,
          searchReq,
          selectedRoom,
          hotelRes
        ) => {
          var checkInDate = new Date(searchReq.checkInDate.seconds * 1000);
          let roomGuests = [];

          searchReq.hotelRoomArr.forEach((room, r) => {
            roomGuests.push({
              NoOfAdults: Number(room.adults),
              NoOfChild: Number(room.child),
              ChildAge: room.childAge.map((child, c) => Number(child.age)),
            });
          });

          var request = {
            checkInDate: this.state.actions.convertTboDateFormat(checkInDate),
            nights: searchReq.hotelNights,
            countryCode: searchReq.countryCode,
            cityId: cityId,
            noOfRooms: searchReq.hotelRooms,
            roomGuests: roomGuests,
            HotelId: hotelRes.HotelCode,
          };

          var hotelStatic = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelSearchRes",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          if (hotelStatic?.error?.ErrorCode > 0) {
            return [];
          }
          var hotelResults =
            hotelStatic.hotelResult.HotelSearchResult.HotelResults;
          var data = hotelResults.filter((hotel) => {
            return hotel.HotelCode === hotelRes.HotelCode;
          });

          if (!data && data.length === 0) {
            return [];
          }
          var infoReq = {
            traceId: hotelStatic.hotelResult.HotelSearchResult.TraceId,
            tokenId: hotelStatic.tokenId,
            resultIndex: data[0].ResultIndex,
            hotelCode: data[0].HotelCode,
            categoryId:
              data[0].SupplierHotelCodes && data[0].SupplierHotelCodes.length > 0
                ? data[0].SupplierHotelCodes[0].CategoryId
                : "",
          };

          var hotelInfoRes = await fetch(
            "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/hotelInfoRes",
            {
              method: "POST",
              // credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(infoReq),
            }
          )
            .then((res) => res.json())
            .catch((err) => console.log(err));
          var selectedRooms = [];
          hotelInfoRes.roomResult.GetHotelRoomResult.HotelRoomsDetails.forEach(
            (mainRoom) => {
              selectedRoom.forEach((room) => {
                if (
                  mainRoom.RoomTypeName === room.RoomTypeName &&
                  mainRoom.RoomTypeCode === room.RoomTypeCode &&
                  mainRoom.LastCancellationDate === room.LastCancellationDate
                ) {
                  selectedRooms.push(mainRoom);
                }
              });
            }
          );
          console.log(selectedRooms);
          return selectedRooms;
        },
        updateHotelBookingDetails: async (newPrice, hotelId, tripId) => {
          try {
            const tripsRef = firestore()
              .collection("Accounts")
              .doc(this.state.userId)
              .collection("trips")
              .doc(tripId);

            const tripSnap = await tripsRef.get();
            const tripData = tripSnap.data();

            if (!tripData || !tripData.hotels) {
              console.log('No trip data or hotels found');
              return;
            }

            const tripItem = tripData.hotels.find((hotel) => hotel.id === hotelId);
            if (!tripItem) {
              console.log('No hotel found with the given ID');
              return;
            }

            await tripsRef.update({
              hotels: firestore.FieldValue.arrayRemove(tripItem)
            });

            await tripsRef.update({
              hotels: firestore.FieldValue.arrayUnion({ ...tripItem, updatedAt: new Date() })
            });

            const itemRef = tripsRef.collection("hotels").doc(hotelId);
            const itemSnap = await itemRef.get();
            const itemData = itemSnap.data();

            if (!itemData) {
              console.log('No item data found');
              return;
            }

            const totPrice = itemData.hotelTotalPrice - itemData.hotelFinalPrice + newPrice;
            itemData.hotelTotalPrice = totPrice;
            itemData.hotelFinalPrice = newPrice;

            await itemRef.update(itemData);

            // Assuming getTripDocById is defined and properly updates the state
            await this.state.actions.getTripDocById(tripId, this.state.userId);
          } catch (error) {
            console.error('Error updating hotel booking details:', error);
          }
        },
        updateFlightBookingDetails: async (newPrice, flightId, tripId,) => {
          try {
            const tripsRef = firestore().collection("Accounts").doc(this.state.userId).collection("trips").doc(tripId);
            const tripSnap = await tripsRef.get();
            const tripData = tripSnap.data();

            const tripItem = tripData.flights.filter((flight) => flight.id === flightId);
            if (tripItem.length === 0) {
              throw new Error("Flight not found in the trip data");
            }

            console.log("added");

            await tripsRef.update({
              flights: firestore.FieldValue.arrayRemove(tripItem[0])
            });

            await tripsRef.update({
              flights: firestore.FieldValue.arrayUnion({ ...tripItem[0], updatedAt: new Date() })
            });

            const itemRef = tripsRef.collection("flights").doc(flightId);
            const itemSnap = await itemRef.get();
            const itemData = itemSnap.data();

            if (!itemData["0"]) {
              throw new Error("Flight data not found in the item data");
            }

            const updatedItemData = { ...itemData };
            updatedItemData["0"].finalPrice = updatedItemData["0"].finalPrice - updatedItemData["0"].flight.Fare.OfferedFare + newPrice;
            updatedItemData["0"].totalFare = updatedItemData["0"].totalFare - updatedItemData["0"].flight.Fare.OfferedFare + newPrice;
            updatedItemData["0"].flightNew.fare = updatedItemData["0"].flightNew.fare - updatedItemData["0"].flight.Fare.OfferedFare + newPrice;
            updatedItemData["0"].flight.Fare.OfferedFare = newPrice;
            updatedItemData["0"].flight.Fare.PublishedFare = newPrice;

            await itemRef.update(updatedItemData);

            // Assuming getTripDocById is a function imported from your actions file
            await this.state.actions.getTripDocById(tripId, this.state.userId);
          } catch (error) {
            console.error("Error updating flight booking details: ", error);
          }
        },
       
        //   id,
        //   type,
        //   file,
        //   cost,
        //   description,
        //   expenseDate
        // ) => {
        //   try {
        //     const userId = this.state.userAccountDetails.userid;
        //     const tripDocRef = firestore()
        //       .collection("Accounts")
        //       .doc(userId)
        //       .collection("trips")
        //       .doc(id);

        //     const expensesCollectionRef = tripDocRef.collection("expenses");

        //     // Add new expense document
        //     const newExpenseDocRef = await expensesCollectionRef.add({
        //       type,
        //       cost,
        //       description,
        //       expenseDate,
        //     });

        //     // Upload file to Firebase Storage
        //     const storageRef = storage().ref(`trips/${userId}/${id}/expenses/${newExpenseDocRef.id}/${file}`);
        //     await storageRef.putFile(file); // Assuming `file` contains the local URI of the image

        //     // Get the download URL
        //     const downloadURL = await storageRef.getDownloadURL();

        //     // Update the expense document with the file URL
        //     await newExpenseDocRef.update({ file: downloadURL });

        //     // Update the trip document with the new expense
        //     await tripDocRef.update({
        //       expenses: firestore.FieldValue.arrayUnion({
        //         id: newExpenseDocRef.id,
        //         date: new Date(),
        //       }),
        //     });

        //   } catch (error) {
        //     console.error(error);
        //   }
        // },


        addExpenseToTrip: async (
          id,
          type,
          file,
          cost,
          description,
          expenseDate
        ) => {
          try {
            const userId = this.state.userAccountDetails.userid;
            const tripDocRef = firestore()
              .collection("Accounts")
              .doc(userId)
              .collection("trips")
              .doc(id);

            const expensesCollectionRef = tripDocRef.collection("expenses");

            // Add new expense document
            const newExpenseDocRef = await expensesCollectionRef.add({
              type,
              cost,
              description,
              expenseDate,
            });

            // Upload file to Firebase Storage
            const fileUri = file; // Assuming `file` is the local URI as a string
            const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
            const storageRef = storage().ref(`trips/${userId}/${id}/expenses/${newExpenseDocRef.id}/${fileName}`);

            await storageRef.putFile(fileUri); // Upload the file using the local URI

            // Get the download URL
            const downloadURL = await storageRef.getDownloadURL();

            // Update the expense document with the file URL
            await newExpenseDocRef.update({ file: downloadURL });

            // Update the trip document with the new expense
            await tripDocRef.update({
              expenses: firestore.FieldValue.arrayUnion({
                id: newExpenseDocRef.id,
                date: new Date(),
              }),
            });

          } catch (error) {
            console.error(error);
          }
        },
        changeCabCityKeyword: this.debounce((query) => {
          var results = cabFuse.search(query);
          this.setState({
            cabSearchRes: results,
          });
        }, 1000),
        getCabOptionForCity: (cityName, optionName) => {
          for (let item of CabsData) {
            if (item[cityName] && item[cityName][optionName]) {
              return item[cityName][optionName];
            }
          }
          return null; // Return null if not found
        },

        // Example usage for Hyderabad and "12 hrs cab at disposal"
        // const result = getCabOptionForCity(data, "Hyderabad", "12 hrs cab at disposal");

        // console.log(result);

        fetchCabs: async (
          city,
          type,
          startDate,
          endDate,
          noOfCabs,
          nights,
          time,
        ) => {
          this.setState
            ({
              cabCity: city,
              cabType: type,
              cabStartDate: startDate,
              cabEndDate: endDate,
              searchingCabs: true,
              cabCount: noOfCabs,
              cabNights: nights,
              selectedTime: time,
            });

          const cabdata = this.state.actions.getCabOptionForCity(city, type)
          this.setState({
            cabResList: cabdata
          });
        },
        backToCabSearchPage: () => {
          this.setState({
            cabResList: [],
            searchingCabs: false,
            // cabCity: "",
            // cabType: "Select the Destination Above",
            // cabStartDate: "",
            // cabEndDate: "grgr",
            // searchingCabs: false,
            // cabCount: "1",
            // cabNights: "0",
            // selectedTime: "00:15",

          });
        },
        changeBusPassengers: (value) => {
          this.setState({ NoofBusPassengers: value });
        },
        busKeywordReq : (keyword) => {
          try {
            return axios.post(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/getBusCityList"
            );
          } catch (error) {
            console.log(error);
          }
        },
        changeOriginBusKeyword : this.debounce(async (keyword) => {
          if (keyword !== "") {
            try {
              var results = [];
              //var results = this.state.busFuse.search(keyword);
              if (results.length > 0) {
                var data = results.map((res, r) => {
                  var item = res.item;
                  return {
                    cityName: item.CityName,
                    id: item.CityId,
                  };
                });
                this.setState({
                  busOriginData: data,
                  busOriginLoading: false,
                });
              } else {
                var data = await this.state.actions.busKeywordReq(keyword);
                var fuse = new Fuse(data.data.BusCities, {
                  keys: ["CityName"],
                  includeScore: true,
                  threshold: 0.2,
                });
                var res = fuse.search(keyword);
                var resData = res.map((res, r) => {
                  var item = res.item;
                  return {
                    cityName: item.CityName,
                    id: item.CityId,
                  };
                });
                this.setState({
                  busOriginData: resData,
                  busOriginLoading: false,
                });
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            this.setState({
              airportOriginData: [],
              airportOriginLoading: false,
            });
          }
        }, 500),

        changeDestBusKeyword : this.debounce(async (keyword) => {
          if (keyword !== "") {
            try {
              var results = [];
              //var results = this.state?.busFuse?.search(keyword);
              if (results?.length > 0) {
                var data = results.map((res, r) => {
                  var item = res.item;
                  return {
                    cityName: item.CityName,
                    id: item.CityId,
                  };
                });
                this.setState({
                  busDestData: data,
                  busDestLoading: false,
                });
              } else {
                var data = await this.state.actions.busKeywordReq(keyword);
      
                var fuse = new Fuse(data.data.BusCities, {
                  keys: ["CityName"],
                  includeScore: true,
                  threshold: 0.2,
                });
                var res = fuse.search(keyword);
                var resData = res.map((res, r) => {
                  var item = res.item;
                  return {
                    cityName: item.CityName,
                    id: item.CityId,
                  };
                });
                this.setState({
                  busDestData: resData,
                  busDestLoading: false,
                });
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            this.setState({
              airportOriginData: [],
              airportOriginLoading: false,
            });
          }
        }, 500),

        handleChangeBusKeyword: (keyword, type) => {
          if (type === "origin") {
            this.setState({
              busOriginLoading: true,
            });
  
            this.state.actions.changeOriginBusKeyword(keyword);
          } else if (type === "destination") {
            this.setState({
              busDestLoading: true,
            });
            this.state.actions.changeDestBusKeyword(keyword);
          }
        },
        busSearch: async (originDetails, destDetails, outboundDate) => {
          try {
            this.setState({
              busResList: [],
              searchingBus: true,
              busSessionStarted: false,
              busSessionExpired: false,
              busDate: outboundDate,
              originDetails,
              destDetails,
            });
            var busReq = {
              DateOfJourney:
                this.state.actions.convertTboDateFormat(outboundDate),
              DestinationId: destDetails.id,
              OriginId: originDetails.id,
            };
            this.setState({
              busReq,
              originDetails,
              destDetails,
            });
  
            var busRes = await fetch(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busSearchRes",
              {
                method: "POST",
                // credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(busReq),
              }
            )
              .then((res) => res.json())
              .catch((err) => console.log(err));
            console.log(busRes);
            if (busRes?.response?.error) {
              this.setState({
                busResList: [],
                busErrorMessage: busRes?.error,
                searchingBus: false,
                busSessionStarted: true,
              });
            } else {
              this.setState({
                busResList:
                  busRes?.response?.busResult?.BusSearchResult?.BusResults,
                busTraceId: busRes?.response?.busResult?.BusSearchResult?.TraceId,
                busTokenId: busRes.tokenId,
                searchingBus: false,
                busSessionStarted: true,
              });
              // this.setState({
              //   resetBusDetails:
              //     busRes?.response?.busResult?.BusSearchResult?.BusResults,
              //   busTraceId: busRes?.response?.busResult?.BusSearchResult?.TraceId,
              //   busTokenId: busRes.tokenId,
              //   searchingBus: false,
              //   busSessionStarted: true,
              // });
            }
          } catch (error) {}
        },
        backToBusSearchPage: () => {
          this.setState({
            busResList: [],
            busTraceId: "",
            busTokenId: "",
          });
        }, 

        fetchBusSeatLayout: async (bus) => {
          this.setState({
            fetchingBusSeat: true,
            bookingBus: {},
            BusOperatorName: bus?.TravelName,
          });
          var request = {
            traceId: this.state.busTraceId,
            ResultIndex: bus.ResultIndex,
          };
          var busRes = await Promise.all([
            fetch(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busSeatLayout",
              {
                method: "POST",
                // credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
              }
            )
              .then((res) => res.json())
              .catch((err) => console.log(err)),
            fetch(
              "https://us-central1-tripfriday-2b399.cloudfunctions.net/tboApi/busBoardingPoint",
              {
                method: "POST",
                // credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
              }
            )
              .then((res) => res.json())
              .catch((err) => console.log(err)),
          ]);
  
          var busSeatLayout = busRes[0].response;
          var busBoardingDetails = busRes[1].response;
  
          this.setState({
            fetchingBusSeat: false,
            bookingBus: {
              bus,
              busBoardingDetails,
              busSeatLayout,
              busRequest: this.state.busReq,
              origin: this.state.originDetails,
              destination: this.state.destDetails,
            },
            busRes,
          });
        },
        setBusBookDetails:  (data, type) => {
          var bookingBus = { ...this.state.bookingBus };
          if (type === "seat") {
            const totPrice = data.reduce((total, seat) => {
              return (
                total +
                seat.Price.OfferedPriceRoundedOff +
                Math.ceil((seat.Price.OfferedPriceRoundedOff * 3) / 100)
              );
            }, 0);
            bookingBus.passengers = this.state.NoofBusPassengers;
            bookingBus.selectedSeat = data;
            bookingBus.busTotalPrice = totPrice;
          }
          if (type === "boardingPoint") {
            bookingBus.boardingPointDetails = data;
          }
          if (type === "droppingPoint") {
            bookingBus.droppingPointDetails = data;
          }
          this.setState({
            bookingBus,
          });
        },
      },







    }
  }
  componentDidMount = async () => {
    auth().onAuthStateChanged(async (user) => {
      if (user) {
        await this.state.actions.getUserById(user?.uid);
        this.setState({
          userId: user?.uid,
          isLoading: true,
        });
        await this.state.actions.setAdminData()
        await this.state.actions.getUserById(this.state.userId);
        await this.state.actions.getLastDoc();
        //  this.state.actions.handleFlightsLogos();
        console.log("userLogin")
      } else {
        this.setState({
          isLoading: true,
          userId: ""
        });
        console.log("userLogOut")

      }
    })
    // await this.state.actions.setAdminData()
    // this.state.actions.fetchHotelCityList();
    // await this.state.actions.getLastDoc();
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
  render() {
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

