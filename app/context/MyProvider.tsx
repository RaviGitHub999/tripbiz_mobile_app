
import React, { Component, ReactNode } from 'react';
import MyContext from './Context';
import Fuse from 'fuse.js';
import AirportsData from "../components/jsonData/Airports.json"
import axios from 'axios';
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
    airportDestinationData: [],
    airportDestinationLoading: boolean,
    originselected: boolean,
    destinationselected:boolean,
    flightResList:[],
    searchingFlights:boolean,
    airportDestData: [],
    airportDestLoading: false,
    originSelectedAirport: SelectedFlightObj,
    destinationSelectedAirPort: SelectedFlightObj,
    actions:{}
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
      cabinClassId:"",
      journeyWay:"",
      departureformattedDate:"",
      returnformattedDate: "",
      outbound: "",
      inbound: "",
      airportOriginData: [],
      airportOriginLoading: false,
      airportDestinationData: [],
      airportDestinationLoading: false,
      originselected: false,
      destinationselected: false,
      desRes: false,
      oriRes: false,
      flightResList:[],
      searchingFlights:false,
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
        }
    },
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
            this.setState({...this.state,[payload.name]:payload.e,airportDestinationLoading:loading,desRes:loading,airportDestinationData:[]})
        },
        handleOriginSelectedAirPort: (payload: any) => {
          return {
              ...this.state,
              originSelectedAirport:payload,
              oriRes: !this.state.oriRes,
              origin: '',
              originselected: true
          }
      },
      handleDestinationSelectedAirPort: (payload:any) => {
        return {
            ...this.state,
            destinationSelectedAirPort: payload,
            desRes: !this.state.desRes,
            destination: '',
            destinationselected: true
        }
    },
    changeOriginAirportKeyword : this.debounce(async (keyword) => {
      console.log(keyword);
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
  
            console.log("Search results", data);
  
            this.setState({
              airportOriginData: data,
              airportOriginLoading: false
            });
          } else {
            var data = await this.state.actions.airportKeywordReq(keyword, "Origin");
            console.log(data);
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
      console.log(keyword);
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
  
            console.log("Search results", data);
  
            this.setState({
              airportDestData: data,
              airportDestLoading: false
            });
          } else {
            var data = await this.state.actions.airportKeywordReq(keyword, "Dest");
            console.log(data);
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
      console.log(`Req for ${type}`, keyword);
      return axios.post(
        "https://us-central1-tripfriday-2b399.cloudfunctions.net/paymentApi/airportSearch",
        { keyword, subType: "CITY,AIRPORT", page: 0 },
        { signal: abortAirportController.signal }
      );
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

