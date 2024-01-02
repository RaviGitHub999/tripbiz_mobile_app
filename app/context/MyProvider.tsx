
import React, { Component, ReactNode } from 'react';
import MyContext from './Context';
import Fuse from 'fuse.js';
import AirportsData from "../components/jsonData/Airports.json"
import axios from 'axios';
const cabinclassMap = {
  1: "Any cabin class",
  2: "Economy",
  3: "Premium Economy",
  4: "Business",
  5: "Premium Business class",
  6: "First"
};
interface MyProviderProps {
  children: ReactNode;
}
export interface SelectedFlightObj {
  name: string;
  iataCode: string;
  address: { cityName: string; countryName: string }
}
interface MyProviderState {
    origin: string,
    destination: string,
    departure: string,
    returnDate: string,
    adults: number,
    children: number,
    infants: number,
    classes: string,
    directflight: boolean,
    oneStopFlight: boolean,
    dateValue: Date,
    returnDateValue: Date,
    cabinClassId:string,
    journeyWay: string,
    departureformattedDate: string,
    returnformattedDate: string,
    outbound: string,
    inbound: string,
    airportOriginData: [],
    airportOriginLoading: boolean,
    desRes: boolean,
    oriRes: boolean,
    originselected: boolean,
    destinationselected:boolean,
    flightResList:[],
    searchingFlights:boolean,
    airportDestData: [],
    airportDestLoading: boolean,
    originSelectedAirport: SelectedFlightObj,
    destinationSelectedAirPort: SelectedFlightObj,
    internationalFlights: boolean,
    flightResult: any,
    flightSearchToken:string,
    flightSessionStarted: boolean,
    flightSessionExpired: boolean,
    flightResJType: number,
    showFilters:boolean,
    actions:any
}
let abortAirportController: AbortController;
var fuse = new Fuse(AirportsData, {
  keys: ["cityName", "name", "iataCode", "countryName"],
  includeScore: true,
  threshold: 0.2
});
export default class MyProvider extends Component<MyProviderProps, MyProviderState> {
  constructor(props: MyProviderProps) {
    super(props);
    this.state = {
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
      cabinClassId:"2",
      journeyWay:"1",
      departureformattedDate:"",
      returnformattedDate: "",
      outbound: "",
      inbound: "",
      airportOriginData: [],
      airportOriginLoading: false,
      originselected: false,
      destinationselected: false,
      desRes: false,
      oriRes: false,
      flightResList:[],
      searchingFlights:true,
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
    flightSearchToken:"",
    flightSessionStarted: false,
     flightSessionExpired: false,
    flightResult: {},
    flightResJType: 0,
    showFilters:false,
      actions:{
        handleDropDownState: (payload: { stateName:string; stateValue:number; }) => {
            switch (payload.stateName) {
                case "adults":
                    this.setState({adults:payload.stateValue})
                    break;
                case "children":
                    this.setState({children:payload.stateValue})
                    break;
                case "infants":
                    this.setState({infants:payload.stateValue})
                    break;
                default:
                    break;
            }
        },
        handleClass: (payload: string) => {
            this.setState({classes:payload})
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
            this.setState({cabinClassId:classId}) 
        },
        handleJourneyWay: (payload:string) => {
            this.setState({journeyWay:payload}) 
        },
        handleDepartureDateChange: (payload:any) => {
            if (payload) {

                const formattedDate = payload.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                // state.departure = formattedDate,
                this.setState({departure:formattedDate})
                    this.setState({departureformattedDate:formattedDate})
                    this.setState({dateValue:payload})
                const inputDate = new Date(payload);
                const dateString = inputDate.toISOString();
                this.setState({outbound:`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`})
            }
        },
        handleReturnDateChange: (payload: any) => {
            if (payload) {

                const formattedDate = payload.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                this.setState({returnDate:formattedDate})
                this.setState({returnformattedDate:formattedDate})
                this.setState({returnDateValue:payload})
                const inputDate = new Date(payload);
                const dateString = inputDate.toISOString();
                this.setState({inbound:`${dateString.split("").slice(0, dateString.indexOf("T") + 1).join("")}00:00:00`})
            }
        },
        handleChangeOriginTextInput: (payload: { e: string; name:string; }) => {
            const query = payload.e.trim();
            const loading1 = query !== "" ? true : false;
            this.setState({...this.state,[payload.name]:payload.e,airportOriginLoading:loading1,oriRes:loading1,airportOriginData:[]})
        },
        handleChangeDestinationTextInput: (payload: { e: string; name:string; }) => {
            const query = payload.e.trim();
            const loading = query !== "" ? true : false;
            this.setState({...this.state,[payload.name]:payload.e,airportDestLoading:loading,desRes:loading,airportDestData:[]})
        },
        handleOriginSelectedAirPort: (payload: any) => {
          this.setState({
                ...this.state,
              originSelectedAirport:payload,
              oriRes: !this.state.oriRes,
              origin: '',
              originselected: true
          })
      },
      handleDestinationSelectedAirPort: (payload:any) => {
       this.setState({
            ...this.state,
            destinationSelectedAirPort: payload,
            desRes: !this.state.desRes,
            destination: '',
            destinationselected: true
        })
    },
    handleFlightsFilter:(payload:boolean)=>
    {
      this.setState({showFilters:payload})
    },
    handlesearchingFlights:()=>
    {
this.setState({searchingFlights:true})
    },
    changeOriginAirportKeyword : this.debounce(async (keyword) => {
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
  
    changeDestAirportKeyword : this.debounce(async (keyword) => {
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
  
    airportKeywordReq :(keyword, type) => {
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
    separateFlightsByType: (results:any) => {
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
      var date1 = new Date(
        `${dateStr1.getMonth() + 1
        }/${dateStr1.getDate()}/${dateStr1.getFullYear()}`
      );
      var date2 = new Date(
        `${dateStr2.getMonth() + 1
        }/${dateStr2.getDate()}/${dateStr2.getFullYear()}`
      );

      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    modifyFlightObject: (flight:any) => {
      var totalDuration = 0;
      var segments = flight.Segments.map((segment, sg) => {
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
    flightSearch: async () => {
    const{inbound,outbound,cabinClassId,destinationSelectedAirPort,originSelectedAirport,adults,children,infants,directflight,oneStopFlight,journeyWay}=this.state
      var request = {
        adults: adults,
        child:children,
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
            Destination:destinationSelectedAirPort.iataCode,
            FlightCabinClass: cabinClassId,
            PreferredDepartureTime:outbound,
            PreferredArrivalTime:outbound
          },
          {
            Origin: originSelectedAirport.iataCode,
            Destination:destinationSelectedAirPort.iataCode,
            FlightCabinClass: cabinClassId,
            PreferredDepartureTime:inbound,
            PreferredArrivalTime:inbound
          }
        ];
      } else {
        segments = [
          {
            Origin: originSelectedAirport.iataCode,
            Destination:destinationSelectedAirPort.iataCode,
            FlightCabinClass: cabinClassId,
            PreferredDepartureTime:outbound,
            PreferredArrivalTime:outbound
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

      // console.log(flightRes);
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
  }, 
  
      }
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

  


  render(): JSX.Element {
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

