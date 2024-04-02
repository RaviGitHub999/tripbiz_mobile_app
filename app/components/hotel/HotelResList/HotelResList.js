
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import MyContext from '../../../context/Context'
import { styles } from './styles'
import IconSwitcher from '../../common/icons/IconSwitcher'
import ProgressBar from '../../common/progressBar/ProgressBar'
import { colors } from '../../../config/theme'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import FilterHeader from '../../common/filterHeader/FilterHeader'
import HotelRenderItem from './HotelRenderItem'
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

const HotelResList = ({ navigation: { navigate, goBack ,push} }) => {

    console.log("component.................")
    const [openFilters, setOpenFilters] = useState(false)
    const [selectedItemIndex, setSelectedItemIndex] = useState();
    const [selectedStarsItemIndex, setSelectedStarsItemIndex] = useState();
    const [price, setPrice] = useState();
    const [rating, setRating] = useState();
    var [count, setCount] = useState(0);
    const [error, setError] = useState(false);
const {
        searchingHotels,
        hotelResList,
        actions,
        fetchingHotelInfo,
        hotelInfoRes,
        hotelSearchName,
        hotelSearchCheckIn,
        hotelSearchCheckOut,
        hotelSearchAdults,
        hotelSearchChild,
        hotelSearchNights,
        hotelSearchText,
        hotelRating,
        hotelStaticData,
        hotelRooms,
        recommondedHotels,
        hotelImageList,
        hotelErrorMessage,
        cityHotel,
        hotelSessionExpiredPopup
    } = useContext(MyContext);
    const [data1, setData] = useState([])
    const [renderedData, setRenderedData] = useState(data1.slice(0, 20));
    const [loading, setLoading] = useState(false);
    const [applyingfilters, setApplyingFilters] = useState(false)
    const [filterhotelsdata, setFiltersHotelsData] = useState([])
    const [idToIndex, setidToIndex] = useState()
    useEffect(() => {
        console.log("useEffect")
        if (hotelResList.length > 0) {
            const hotelIdsInObject = recommondedHotels ? Object.keys(recommondedHotels).map(ele => { return { HotelCode: ele } }) : []
            const idToIndex = hotelIdsInObject.reduce((acc, item, index) => {
                acc[item.HotelCode] = index;
                return acc;
            }, {});

            setidToIndex(idToIndex)
            const filteredHotels = hotelResList.filter(hotel => {
                const staticData = hotelStaticData[hotel.HotelCode];
                const hotelName = hotel.HotelName ? hotel.HotelName : staticData?.HotelName;
                return hotelName?.length > 0;
            })
            setFiltersHotelsData(filteredHotels)
            const finalData = actions.filterHotels(filteredHotels).sort((a, b) => {
                const indexA = idToIndex[a.HotelCode];
                const indexB = idToIndex[b.HotelCode];

                if (indexA === undefined && indexB === undefined) {
                    return 0;
                } else if (indexA === undefined) {
                    return 1;
                } else if (indexB === undefined) {
                    return -1;
                }
                return indexA - indexB;
            });
            console.log(finalData)

            setData(finalData)
            setRenderedData(finalData.slice(0, 20))
        }
    }, [hotelResList, applyingfilters])

    const loadMoreData = () => {
        if (renderedData.length !== data1.length) {
            setLoading(true);
        }
        setTimeout(() => {
            const endIndex = Math.min(renderedData.length + 20, data1.length); // Calculate the end index for new data
            setRenderedData(prevData => [...prevData, ...data1.slice(prevData.length, endIndex)]); // Append new data to renderedData
            setLoading(false);
        }, 1000);
    };
    const handleEndReached = () => {
        console.log("handleEndReached")
        if (renderedData.length < data1.length) { // Check if there are more items to render
            loadMoreData();
        }
    };

    const isImageUri = (uri) => {
        console.log("isImageUri")
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
        return imageExtensions.some((ext) => uri.endsWith(ext));
    };
    const renderItem = ({ item, index }) => {
        return <HotelRenderItem item={item} handleBooking={handleBooking} idToIndex={idToIndex}/>
    }
    const renderFooter =
        () => {
            if (!loading) return null;
            return (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            );
        };
    const renderHeader = useMemo(() => {
        return (

            <View style={{ gap: responsiveHeight(1) }}>

                {count > 0 ? <TouchableOpacity style={styles.clearFilterContainer} onPress={() => removeFilters()}>
                    <Text style={styles.clearFilterTitle}>Clear Filters</Text>
                </TouchableOpacity> : null}


                <TextInput placeholder='Search for your favourite hotel' style={{ borderWidth: 1, paddingHorizontal: responsiveWidth(5), borderRadius: responsiveHeight(2), fontSize: responsiveHeight(2.1) }} value={hotelSearchText} onChangeText={(e) => {
                    actions.setHotelSearchText(e);
                    setApplyingFilters(!applyingfilters)
                    setError(false)
                }} />
                <Text style={styles.totalHotels}>{`Hotel search results (${actions.filterHotels(filterhotelsdata).filter((hotel) => {
                    var staticData = hotelStaticData[hotel.HotelCode];
                    var hotelName = hotel.HotelName ? hotel.HotelName : staticData?.HotelName;
                    return hotelName?.length > 0;
                }).length
                    })`}</Text>
            </View>
        )
    }, [filterhotelsdata, applyingfilters])



    const handleOpenFilters = useCallback(() => {
        console.log("handleOpenFilters")
        setOpenFilters(!openFilters)
    }, [openFilters])

    const handleItemClick = useCallback((index, price) => {
       console.log("handleItemClick")
        setSelectedItemIndex(index === selectedItemIndex ? null : index);
        setPrice(prevSelectedPrice => prevSelectedPrice === price ? null : price);
    }, [selectedItemIndex]);

    const handleHotelPrices = () => {
        console.log("handleHotelPrices")
        return priceData.map((ele, index) => {
            return (
                <TouchableOpacity style={index === selectedItemIndex ? styles.selectedItem : null} onPress={() => handleItemClick(index, ele.priceDetails)} key={index}>
                    <Text style={styles.priceTitle}>{`${ele.price} (${handlehotelsLengthBasedOnPrice(ele.startingPrice, ele.EndingPrice)})`}</Text>
                </TouchableOpacity>
            )
        })
    }
    const handlehotelsLengthBasedOnPrice = useCallback((starting, ending) => {
        console.log("handlehotelsLengthBasedOnPrice")
        return Array.isArray(filterhotelsdata) ? filterhotelsdata.filter((hotel) => {
            if (starting === ending) {
                return hotel.Price.OfferedPriceRoundedOff >= starting;
            } else {
                return hotel.Price.OfferedPriceRoundedOff >= starting && hotel.Price.OfferedPriceRoundedOff < ending;
            }
        }).length : null;
    }, [filterhotelsdata]);

    const handleStarItemClick = useCallback((index, ratings) => {
        console.log("handleStarItemClick")
        setRating(prevSelectedTime => prevSelectedTime === ratings ? null : ratings);
        setSelectedStarsItemIndex(index === selectedStarsItemIndex ? null : index);
    }, [selectedStarsItemIndex]);

    const generatePattern = () => {
        console.log("generatePattern")
        return data.map((row, index) => (
            <TouchableOpacity key={index} style={[styles.row, index === selectedStarsItemIndex ? styles.selectedItem : null]} onPress={() => handleStarItemClick(index, row.length)}>
                {[...Array(row.length).keys()].map((key) => (
                    <IconSwitcher key={`${index}_${key}`} componentName='AntDesign' iconName='star' iconsize={2.5} color='#ffd700' />
                ))}
            </TouchableOpacity>
        ));
    };

    const setRatingState = (rating) => {
        console.log("setRatingState")
        actions.setHotelRating(rating);
    };
    const setPriceState = (price) => {
        // setIsPriceSelected((prevSelectedPrice) =>
        //   prevSelectedPrice === price ? null : price
        // );
        console.log("setPriceState")
        if (price === "price1and5k") {
            actions.setHotelPriceStart(1);
            actions.setHotelPriceEnd(1500);
        }
        if (price === "price2and5k") {
            actions.setHotelPriceStart(1500);
            actions.setHotelPriceEnd(2500);
        }
        if (price === "price4k") {
            actions.setHotelPriceStart(2500);
            actions.setHotelPriceEnd(4000);
        }
        if (price === "price6k") {
            actions.setHotelPriceStart(4000);
            actions.setHotelPriceEnd(6000);
        }
        if (price === "price8k") {
            actions.setHotelPriceStart(6000);
            actions.setHotelPriceEnd(8000);
        }
        if (price === "price10k") {
            actions.setHotelPriceStart(8000);
            actions.setHotelPriceEnd(10000);
        }
        if (price === "pricegt10k") {
            actions.setHotelPriceStart(10000);
            actions.setHotelPriceEnd(1000000);
        }
        if (price === null) {
            actions.setHotelPriceStart(null);
            actions.setHotelPriceEnd(null);
        }
    };

  const handleBooking = useCallback((hotel) => {
    push("HotelInfo", { item: hotel });

}, []);

        const handleKeyExtractor=(item, ind) => ind.toString()

    const removeFilters = () => {
        console.log("removeFilters")
        setApplyingFilters(false)
        setCount(0)
        setRating(null);
        setPrice(null);
        setRatingState(null);
        setPriceState(null);
        setSelectedItemIndex(null)
        setSelectedStarsItemIndex(null)
        actions.setHotelPriceStart(null);
        actions.setHotelPriceEnd(null);
        actions.setHotelRating(null);
        actions.setHotelSearchText(null);
    };


    const applyFilters = useMemo(() => {
        console.log("applyFilters")
        return () => {
            setOpenFilters(false);
            setApplyingFilters(!applyingfilters);
            setCount(0);
            setRatingState(rating);
            setPriceState(price);
            if (rating) {
                setCount(prev => prev + 1);
            }
            if (price) {
                setCount(prev => prev + 1);
            }
        };
    }, [rating, price]);

    const handleEditButton = () => {
        console.log("handleEditButton")
        goBack()
        actions.setHotelErrorMessage()
        actions.backToHotelSearchPage()
        removeFilters()
        actions.setHotelSearchText('')
    }

    return (
        searchingHotels ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ProgressBar />
            </View>
            :
            <View style={{ flex: 1 }}>
                <View style={styles.headerMainContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{`${hotelSearchName}`}</Text>
                        <TouchableOpacity style={styles.editButtonContainer} onPress={handleEditButton}>
                            <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.2} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subTitle}>{`${hotelSearchCheckIn
                        .toString()
                        .slice(4, 10)} - ${hotelSearchCheckOut
                            .toString()
                            .slice(4, 10)} | ${hotelRooms} ${hotelRooms > 1 ? "Rooms" : "Room"
                        } | ${hotelSearchAdults} ${hotelSearchAdults > 1 ? "Adults" : "Adult"
                        }${hotelSearchChild
                            ? ` | ${hotelSearchChild} ${hotelSearchChild > 1 ? "Children" : "Child"
                            } `
                            : ""
                        }| ${hotelSearchNights} ${hotelSearchNights > 1 ? "nights" : "night"
                        }`}</Text>
                </View>

                {<FilterHeader handlefiltersToggleActions={handleOpenFilters} value={openFilters} customStyle={{ rowGap: responsiveHeight(1), paddingHorizontal: responsiveWidth(4) }} filtersCount={count}>
                    <Text style={styles.ratingTitle}>Rating</Text>
                    <View style={styles.container}>
                        {openFilters&&generatePattern()}
                    </View>
                    <Text style={styles.ratingTitle}>Price</Text>
                    <View style={styles.container}>
                        {openFilters&&handleHotelPrices()}
                    </View>
                    <TouchableOpacity style={styles.applyFiltersBtn} onPress={applyFilters} >
                        <Text style={styles.applyFiltersBtnText} >Appy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterClosingIcon} onPress={handleOpenFilters}>
                        <IconSwitcher componentName='Ionicons' iconName='chevron-up' color={colors.black} iconsize={3.5} />
                    </TouchableOpacity>
                </FilterHeader>}



                {hotelResList &&<View style={styles.roomDetailsMainContainer}>
                    <FlatList
                        data={renderedData}
                        renderItem={renderItem}
                        keyExtractor={handleKeyExtractor}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={renderHeader}
                        style={{ marginBottom: responsiveHeight(15) }}
                        ListHeaderComponentStyle={{ paddingVertical: 10 }}
                    />
                </View>}

            </View>
    )
}

export default React.memo(HotelResList)