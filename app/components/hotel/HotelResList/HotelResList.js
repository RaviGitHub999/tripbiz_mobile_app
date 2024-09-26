
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import MyContext from '../../../context/Context'
import { styles } from './styles'
import IconSwitcher from '../../common/icons/IconSwitcher'
import ProgressBar from '../../common/progressBar/ProgressBar'
import { colors, fonts } from '../../../config/theme'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import FilterHeader from '../../common/filterHeader/FilterHeader'
import HotelRenderItem from './HotelRenderItem'
let inputText=""
const data = [
    {
        length: 1
    },
    {
        length: 2
    },
    {
        length: 3
    },
    {
        length: 4
    },
    {
        length: 5
    },
]
const priceData =
    [
        {
            price: "₹ 0 to ₹ 1500",
            priceDetails: "price1and5k",
            startingPrice: 0,
            EndingPrice: 1500

        },
        {
            price: "₹ 1500 - ₹ 2500",
            priceDetails: "price2and5k",
            startingPrice: 1500,
            EndingPrice: 2500
        },
        {
            price: "₹ 2500 - ₹ 4000",
            priceDetails: "price4k",
            startingPrice: 2500,
            EndingPrice: 4000
        },
        {
            price: "₹ 4000 - ₹ 6000",
            priceDetails: "price6k",
            startingPrice: 4000,
            EndingPrice: 6000
        },
        {
            price: "₹ 6000 - ₹ 8000",
            priceDetails: "price8k",
            startingPrice: 6000,
            EndingPrice: 8000
        },
        {
            price: "₹ 8000 - ₹ 10000",
            priceDetails: "price10k",
            startingPrice: 8000,
            EndingPrice: 10000
        },
        {
            price: "₹ 10000+",
            priceDetails: "pricegt10k",
            startingPrice: 10000,
            EndingPrice: 10000
        },
    ]

const HotelResList = ({ navigation: { navigate, goBack, push } }) => {

    console.log("component.................")
    const [openFilters, setOpenFilters] = useState(false)
    const [selectedItemIndex, setSelectedItemIndex] = useState();
    const [selectedStarsItemIndex, setSelectedStarsItemIndex] = useState();
    const [price, setPrice] = useState(null);
    const [rating, setRating] = useState(null);
    var [count, setCount] = useState(0);
    const {
        searchingHotels,
        hotelResList,
        actions,
        hotelSearchName,
        hotelSearchCheckIn,
        hotelSearchCheckOut,
        hotelSearchAdults,
        hotelSearchChild,
        hotelSearchNights,
        hotelStaticData,
        hotelRooms,
        hotelErrorMessage,
    } = useContext(MyContext);
    const [fetchedData, setFetchedData] = useState([])
    const [renderedData, setRenderedData] = useState();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hotelPriceStart, setHotelPriceStart] = useState()
    const [hotelPriceEnd, setHotelPriceEnd] = useState()
    useEffect(() => {
        setFetchedData([...hotelResList]);
        setRenderedData(hotelResList.slice(0, 20));
        return () => {
            setFetchedData([])
            setRenderedData([])
        }
    }, [hotelResList])
    useEffect(() => {
        setRenderedData(fetchedData.slice(0, 20));
    }, [fetchedData]);
    useEffect(() => {
        const backAction = () => {
          goBack()
          actions.backToHotelSearchPage()
          return true; 
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        return () => backHandler.remove();
      }, []);
    const filterHotels= () => {
        var filteredArr = hotelResList;

           if (rating !== null) {
            filteredArr = filteredArr.filter(
                (hotel) => hotel.StarRating === rating
            );
        }
           if (price !== null) {
            filteredArr = filteredArr.filter((hotel) => {
                return (
                    hotel.Price.OfferedPriceRoundedOff >=
                    hotelPriceStart &&
                    hotel.Price.OfferedPriceRoundedOff < hotelPriceEnd
                );
            });
        }
        if (inputText!=="") {
          filteredArr = filteredArr.filter((hotel) => {
            const staticData = hotelStaticData[hotel.HotelCode];
            if (hotel.HotelName) {
              return hotel.HotelName.toLowerCase().includes(
                inputText.toLowerCase()
              );
            }
            else {
              return staticData?.HotelName.toLowerCase().includes(
                inputText.toLowerCase()
              );
            }

          });
        }
        setFetchedData(filteredArr)
            setOpenFilters(false)
              setCount(0);
        if (rating) {
            setCount(prev => prev + 1);
        }
        if (price) {
            setCount(prev => prev + 1);
        }
      }


      const handleSearch = (text) => {
        setSearchTerm(text);
        inputText=text
        filterHotels()
    };
    const loadMoreData = () => {
        if (renderedData.length !== fetchedData.length) {
            setLoading(true);
        }
        setTimeout(() => {
            const endIndex = Math.min(renderedData.length + 20, fetchedData.length); 
            setRenderedData(prevData => [...prevData, ...fetchedData.slice(prevData.length, endIndex)]);  
            setLoading(false);
        }, 1000);
    };
    const handleEndReached = () => {
        if (renderedData.length < fetchedData.length) {
            loadMoreData();
        }
    };
    const renderItem = useCallback(({ item }) => {
        return <HotelRenderItem item={item} handleBooking={handleBooking}  />
    },[])
    const renderFooter =
        () => {
            if (!loading) return null;
            return (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            );
        };
    const renderHeader =

        <View style={{ gap: responsiveHeight(1) }}>
            {count > 0 ? (
                <TouchableOpacity style={styles.clearFilterContainer} onPress={() => removeFilters()}>
                    <Text style={styles.clearFilterTitle}>Clear Filters</Text>
                </TouchableOpacity>
            ) : null}
            <TextInput
                placeholder='Search for your favourite hotel'
                style={{
                    borderWidth: 1,
                    borderRadius: responsiveHeight(2),
                    fontSize: responsiveHeight(2.1), 
                    fontFamily: fonts.primary,
                    textAlignVertical: 'center', 
                    overflow: 'hidden',
                    padding:responsiveHeight(1.5)
                }}
                value={searchTerm}
                onChangeText={handleSearch}
            />
            <Text style={styles.totalHotels}>
                {`Hotel search results (${fetchedData.length})`}
            </Text>
        </View>
    const handleOpenFilters = useCallback(() => {
        setOpenFilters(!openFilters)
    }, [openFilters])

    const handleItemClick = useCallback((index, price) => {
        setSelectedItemIndex(index === selectedItemIndex ? null : index);
        setPrice(prevSelectedPrice => prevSelectedPrice === price ? null : price);
        setPriceState(price)
    }, [selectedItemIndex]);

    const handleHotelPrices = () => {
        return priceData.map((ele, index) => {
            return (
                <TouchableOpacity style={[styles.row, index === selectedItemIndex ? styles.selectedItem : null]} onPress={() => handleItemClick(index, ele.priceDetails)} key={index}>
                    <Text style={styles.priceTitle}>{`${ele.price} (${handlehotelsLengthBasedOnPrice(ele.startingPrice, ele.EndingPrice)})`}</Text>
                </TouchableOpacity>
            )
        })
    }
    const handlehotelsLengthBasedOnPrice = useCallback((starting, ending) => {
        return Array.isArray(hotelResList) ? hotelResList.filter((hotel) => {
            if (starting === ending) {
                return hotel.Price.OfferedPriceRoundedOff >= starting;
            } else {
                return hotel.Price.OfferedPriceRoundedOff >= starting && hotel.Price.OfferedPriceRoundedOff < ending;
            }
        }).length : null;
    }, [hotelResList]);

    const handleStarItemClick = useCallback((index, ratings) => {
        setRating(prevSelectedTime => prevSelectedTime === ratings ? null : ratings);
        setSelectedStarsItemIndex(index === selectedStarsItemIndex ? null : index);
    }, [selectedStarsItemIndex]);

    const generatePattern = () => {
        return data.map((row, index) => (
            <TouchableOpacity key={index} style={[styles.row, index === selectedStarsItemIndex ? styles.selectedItem : null]} onPress={() => handleStarItemClick(index, row.length)}>
                {[...Array(row.length).keys()].map((key) => (
                    <IconSwitcher key={`${index + 1}_${key}`} componentName='AntDesign' iconName='star' iconsize={2.5} color='#ffd700' />
                ))}
            </TouchableOpacity>
        ));
    };
    const setPriceState = (price) => {
        if (price === "price1and5k") {
            setHotelPriceStart(1);
            setHotelPriceEnd(1500);
        }
        if (price === "price2and5k") {
            setHotelPriceStart(1500);
            setHotelPriceEnd(2500);
        }
        if (price === "price4k") {
            setHotelPriceStart(2500);
            setHotelPriceEnd(4000);
        }
        if (price === "price6k") {
            setHotelPriceStart(4000);
            setHotelPriceEnd(6000);
        }
        if (price === "price8k") {
            setHotelPriceStart(6000);
            setHotelPriceEnd(8000);
        }
        if (price === "price10k") {
            setHotelPriceStart(8000);
            setHotelPriceEnd(10000);
        }
        if (price === "pricegt10k") {
            setHotelPriceStart(10000);
            setHotelPriceEnd(1000000);
        }
        if (price === null) {
            setHotelPriceStart(null);
            setHotelPriceEnd(null);
        }
    };

    const handleBooking = useCallback((hotel) => {
        push("HotelInfo", { item: hotel });

    }, []);

    const handleKeyExtractor = (item, ind) => ind.toString()

    const removeFilters = () => {
        setSearchTerm("")
        inputText=""
        setCount(0)
        setRating(null);
        setPrice(null);
        setFetchedData(hotelResList)
        setSelectedItemIndex(null)
        setSelectedStarsItemIndex(null)
    };

    const handleEditButton = () => {
        goBack()
        actions.setHotelErrorMessage()
        actions.backToHotelSearchPage()
        removeFilters()
    }
    if (searchingHotels) {
        return <View style={styles.progressBarContainer}>
           <View style={styles.progressbar}>
           <ProgressBar />
           </View>
        </View>
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerMainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{`${hotelSearchName}`}</Text>
                    <View style={styles.editButtonMainContainer}>
                    <TouchableOpacity style={styles.editButtonContainer} onPress={handleEditButton}>
                        <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.2} />
                    </TouchableOpacity>
                    </View>
                </View>
                {hotelSearchCheckIn && <Text style={styles.subTitle}>{`${hotelSearchCheckIn?.toString()
                    .slice(4, 10)} - ${hotelSearchCheckOut?.toString()
                        .slice(4, 10)} | ${hotelRooms} ${hotelRooms > 1 ? "Rooms" : "Room"
                    } | ${hotelSearchAdults} ${hotelSearchAdults > 1 ? "Adults" : "Adult"
                    }${hotelSearchChild
                        ? ` | ${hotelSearchChild} ${hotelSearchChild > 1 ? "Children" : "Child"
                        } `
                        : ""
                    }| ${hotelSearchNights} ${hotelSearchNights > 1 ? "nights" : "night"
                    }`}</Text>}
            </View>

            <FilterHeader handlefiltersToggleActions={handleOpenFilters} value={openFilters} customStyle={{ rowGap: responsiveHeight(1), paddingHorizontal: responsiveWidth(4) }} filtersCount={count} handlefilters={filterHotels} removeFilters={removeFilters}>
                <Text style={styles.ratingTitle}>Rating</Text>
                <View style={styles.container}>
                    {openFilters && generatePattern()}
                </View>
                <Text style={styles.ratingTitle}>Price</Text>
                <View style={styles.container}>
                    {openFilters && handleHotelPrices()}
                </View>
                {/* <TouchableOpacity style={styles.applyFiltersBtn} onPress={filterHotels}>
                    <Text style={styles.applyFiltersBtnText} >Appy</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.filterClosingIcon} onPress={handleOpenFilters}>
                    <IconSwitcher componentName='Ionicons' iconName='chevron-up' color={colors.black} iconsize={3.5} />
                </TouchableOpacity>
            </FilterHeader>

          { hotelResList.length > 0 ? <View style={styles.roomDetailsMainContainer}>
                {!openFilters && <FlatList
                    data={renderedData}
                    renderItem={renderItem}
                    keyExtractor={handleKeyExtractor}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={() => <Text>"No Data Found"</Text>}
                    ListHeaderComponentStyle={{ paddingVertical: 10 }}
                />}
            </View>:
            <View style={styles.hotelErrorMessageCon}>
                <Text style={styles.errorMessage}>{hotelErrorMessage?.ErrorMessage}</Text>
            </View>
            }
        </View>
    )
}

export default React.memo(HotelResList)