import { View, Text, Image, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import MyContext from '../../../context/Context'
import { styles } from './styles'
import IconSwitcher from '../../common/icons/IconSwitcher'
import ProgressBar from '../../common/progressBar/ProgressBar'
import { colors } from '../../../config/theme'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import FilterHeader from '../../common/filterHeader/FilterHeader'
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
const HotelResList = ({ navigation: { navigate, goBack } }) => {
    console.log("<<<<<<<<<<<<<<<<<<<<<<<----------------------------------------->>>>>>>>>>>>>>>>>")
    // const [shouldRenderList, setShouldRenderList] = useState(false)
    const [openFilters, setOpenFilters] = useState(false)
    const [selectedItemIndex, setSelectedItemIndex] = useState();
    const [selectedStarsItemIndex, setSelectedStarsItemIndex] = useState();
    const [price, setPrice] = useState();
    const [rating, setRating] = useState();
    var [count, setCount] = useState(0);
    const [imageError, setImageError] = useState(false);
    const { searchingHotels,
        hotelResList,
        actions, hotelStaticData,
        hotelRooms,
        recommondedHotels,
        hotelImageList, hotelSearchChild, selectedCheckInDate,
        selectedCheckOutDate,
        cityHotelItem,
        hotelNights,
        hotelRoomArr,
        hotelSearchText } = useContext(MyContext)
    const handleBooking = (hotel) => {
        navigate("HotelInfo", { item:hotel })
    }
    const handleImageError = () => {
        setImageError(true);
    };
    // const hotelIdsInObject = recommondedHotels ? Object.keys(recommondedHotels).map(ele => { return { HotelCode: ele } }) : []
    // const idToIndex = hotelIdsInObject.reduce((acc, item, index) => {
    //     acc[item.HotelCode] = index;
    //     return acc;
    // }, {});
    const hotelIdsInObject = useMemo(() => {
        console.log("C1")
        return recommondedHotels
          ? Object.keys(recommondedHotels).map(ele => ({ HotelCode: ele }))
          : [];
          
      }, [recommondedHotels]);
    const idToIndex = useMemo(() => {
        console.log("C2")
        return hotelIdsInObject.reduce((acc, item, index) => {
          acc[item.HotelCode] = index;
          return acc;
        }, {});
      }, [hotelIdsInObject]);
    // const filteredHotels = hotelResList.filter(hotel => {
    //     const staticData = hotelStaticData[hotel.HotelCode];
    //     const hotelName = hotel.HotelName ? hotel.HotelName : staticData?.HotelName;
    //     return hotelName?.length > 0;
    // })
    const filteredHotels = useMemo(() => {
        console.log("C3")
        return hotelResList.filter(hotel => {
          const staticData = hotelStaticData[hotel.HotelCode];
          const hotelName = hotel.HotelName ? hotel.HotelName : staticData?.HotelName;
          return hotelName?.length > 0;
        });
      }, [hotelResList, hotelStaticData]);
    const finalData = actions.filterHotels(filteredHotels).sort((a, b) => {
        // console.log(a.HotelCode)
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
    // const finalData = useMemo(() => {
    //     console.log("C4")
    //     return actions
    //       .filterHotels(filteredHotels)
    //       .sort((a, b) => {
    //         const indexA = idToIndex[a.HotelCode];
    //         const indexB = idToIndex[b.HotelCode];
    //         if (indexA === undefined && indexB === undefined) {
    //           return 0;
    //         } else if (indexA === undefined) {
    //           return 1;
    //         } else if (indexB === undefined) {
    //           return -1;
    //         }
    //         return indexA - indexB;
    //       });
    //   }, [filteredHotels]);
    const isImageUri = (uri) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
        return imageExtensions.some((ext) => uri.endsWith(ext));
    };
    const RenderHotelItem = React.memo(({ hotel, index }) => {
        const staticData = hotelStaticData[hotel.HotelCode];
        const starRatingFull = Math.floor(hotel.StarRating);
        const rating = [];

        for (let i = 1; i <= Math.ceil(hotel.StarRating); i++) {
            if (i > starRatingFull) {
                rating.push(<IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={1.8} />);
            } else {
                rating.push(<IconSwitcher componentName='AntDesign' iconName='star' color='#ffd700' iconsize={1.8} />);
            }
        }

        const img = hotelImageList?.hasOwnProperty(hotel.HotelCode) ? hotelImageList[hotel.HotelCode] : {};
        const hotelPic = img?.HotelPicture ? img?.HotelPicture : "https://i.travelapi.com/hotels/35000000/34870000/34867700/34867648/89943464_z.jpg";
        const hotelImg = hotel.HotelPicture === "https://images.cdnpath.com/Images/HotelNA.jpg" ? hotelPic : hotel?.HotelPicture;
        // console.log(hotelImg,index)
        const ind = idToIndex[hotel.HotelCode];
        return (
            <View style={styles.hotelCard}>
                <View style={styles.hotelImgContainer}>
                    {isImageUri(hotelImg) ? (<Image source={{ uri: hotelImg }} style={styles.hotelImg} />
                    ) : (
                        <View style={styles.noImageContainer}>
                            <Text style={styles.noImgText}>No Image Available</Text>
                        </View>
                    )}
                </View>
                <View style={styles.hotelDetailsContainer}>
                    <View style={styles.hotelNameContainer}>
                        <Text style={styles.hotelName}>{hotel.HotelName ? hotel.HotelName : staticData?.HotelName}</Text>
                        {ind !== undefined ? <View style={styles.recommendedTitleContainer}><Text style={styles.recommendedTitle}>Recommended</Text></View> : null}
                    </View>
                    <View style={styles.hotelDetailsBox}>
                        <View style={styles.hotelDetailsRow}>
                            <Text style={styles.hotelPrice}>
                                {/* <FontAwesomeIcon icon={faRupeeSign} />{' '} */}
                                {`${hotel.Price.OfferedPriceRoundedOff ? `₹ ${hotel.Price.OfferedPriceRoundedOff.toLocaleString("en-IN")}` : `₹ ${hotel.Price.PublishedPriceRoundedOff.toLocaleString("en-IN")}`}`}
                            </Text>

                        </View>
                        <View style={styles.hotelInfoButton}>
                            <View style={styles.hotelRating}>{rating}</View>
                            <TouchableOpacity style={styles.bookingBtn} onPress={() => handleBooking(hotel)}>
                                <Text style={styles.bookingBtnText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    });
    const handleOpenFilters = () => {
        setOpenFilters(!openFilters)
    }
    const generatePattern = () => {
        return data.map((row, index) => (
            <TouchableOpacity key={index} style={[styles.row, index === selectedStarsItemIndex ? styles.selectedItem : null]} onPress={() => handleStarItemClick(index, row.length)}>
                {[...Array(row.length).keys()].map((key) => (
                    <IconSwitcher key={`${index}_${key}`} componentName='AntDesign' iconName='star' iconsize={2.5} color='#ffd700' />
                ))}
            </TouchableOpacity>
        ));
    };

    const handleHotelPrices = () => {
        return priceData.map((ele, index) => {
            return (
                <TouchableOpacity style={index === selectedItemIndex ? styles.selectedItem : null} onPress={() => handleItemClick(index, ele.priceDetails)}>
                    <Text style={styles.priceTitle}>{`${ele.price} (${handlehotelsLengthBasedOnPrice(ele.startingPrice, ele.EndingPrice)})`}</Text>
                </TouchableOpacity>
            )
        })
    }
    const handleItemClick = useCallback((index, price) => {
        setSelectedItemIndex(index === selectedItemIndex ? null : index);
        setPrice(prevSelectedPrice => prevSelectedPrice === price ? null : price);
    }, [selectedItemIndex]);
    const handleStarItemClick = useCallback((index, ratings) => {
        setRating(prevSelectedTime => prevSelectedTime === ratings ? null : ratings);
        setSelectedStarsItemIndex(index === selectedStarsItemIndex ? null : index);
    }, [selectedStarsItemIndex]);
    var setPriceState = async (price) => {
        // setIsPriceSelected((prevSelectedPrice) =>
        //   prevSelectedPrice === price ? null : price
        // );
        if (price === "price1and5k") {
            await actions.setHotelPriceStart(1);
            await actions.setHotelPriceEnd(1500);
        }
        if (price === "price2and5k") {
            await actions.setHotelPriceStart(1500);
            await actions.setHotelPriceEnd(2500);
        }
        if (price === "price4k") {
            await actions.setHotelPriceStart(2500);
            await actions.setHotelPriceEnd(4000);
        }
        if (price === "price6k") {
            await actions.setHotelPriceStart(4000);
            await actions.setHotelPriceEnd(6000);
        }
        if (price === "price8k") {
            await actions.setHotelPriceStart(6000);
            await actions.setHotelPriceEnd(8000);
        }
        if (price === "price10k") {
            await actions.setHotelPriceStart(8000);
            await actions.setHotelPriceEnd(10000);
        }
        if (price === "pricegt10k") {
            await actions.setHotelPriceStart(10000);
            await actions.setHotelPriceEnd(1000000);
        }
        if (price === null) {
            await actions.setHotelPriceStart(null);
            await actions.setHotelPriceEnd(null);
        }
    };
    var removeFilters = async () => {
        setCount(0)
        // setIsRatingSelected(null);
        // setIsPriceSelected(null);
        await actions.setHotelPriceStart(null);
        await actions.setHotelPriceEnd(null);
        await actions.setHotelRating(null);
        await actions.setHotelSearchText(null);
    };
    const setRatingState = async (rating) => {
        await actions.setHotelRating(rating);
    };
    const applyFilters =  () => {
        setOpenFilters(false)
        setCount(0);
     setRatingState(rating);
     setPriceState(price);
        if (rating) {
            setCount((prev) => prev + 1)
        }
        if (price) {
            setCount((prev) => prev + 1);
        }
    }

    const handlehotelsLengthBasedOnPrice = useCallback((starting, ending) => {
        return Array.isArray(filteredHotels) ? filteredHotels.filter((hotel) => {
            if (starting === ending) {
                return hotel.Price.OfferedPriceRoundedOff >= starting;
            } else {
                return hotel.Price.OfferedPriceRoundedOff >= starting && hotel.Price.OfferedPriceRoundedOff < ending;
            }
        }).length : null;
    }, [filteredHotels]);

    useEffect(() => {
        if (searchingHotels) {

            actions.hotelSearch()
        }
        console.log("useEffect")
    }, [])


    // useEffect(() => {
    //     if (searchingHotels) {
    //       setShouldRenderList(true); 
    //       actions.hotelSearch();
    //     } else {
    //       setShouldRenderList(false); 
    //     }
    //   }, [searchingHotels])
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        >
            <View style={styles.headerMainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{`${cityHotelItem.DESTINATION}, ${cityHotelItem.STATEPROVINCE}`}</Text>
                    <TouchableOpacity style={styles.editButtonContainer} onPress={() => { goBack(), actions.handleHotelBackButton() }}>
                        <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.2} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>{`${selectedCheckInDate} - ${selectedCheckOutDate} | ${hotelRooms} ${hotelRooms > 1 ? "Rooms" : "Room"
                    } | ${hotelRoomArr[0].adults} ${hotelRoomArr[0].adults > 1 ? "Adults" : "Adult"} ${hotelSearchChild
                        ? ` | ${hotelSearchChild} ${hotelSearchChild > 1 ? "Children" : "Child"
                        } `
                        : ""
                    } | ${hotelNights} ${hotelNights > 1 ? "nights" : "night"
                    }`}</Text>
            </View>
            {!searchingHotels && <FilterHeader handlefiltersToggleActions={handleOpenFilters} value={openFilters} customStyle={{ rowGap: responsiveHeight(1), paddingHorizontal: responsiveWidth(4) }} filtersCount={count}>
                <Text style={styles.ratingTitle}>Rating</Text>
                <View style={styles.container}>
                    {generatePattern()}
                </View>
                <Text style={styles.ratingTitle}>Price</Text>
                <View style={styles.container}>
                    {handleHotelPrices()}
                </View>
                <TouchableOpacity style={styles.applyFiltersBtn} onPress={applyFilters} >
                    <Text style={styles.applyFiltersBtnText} >Appy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterClosingIcon} onPress={handleOpenFilters}>
                    <IconSwitcher componentName='Ionicons' iconName='chevron-up' color={colors.black} iconsize={3.5} />
                </TouchableOpacity>
            </FilterHeader>}

            {searchingHotels ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <ProgressBar />
                    <Text>Ravi</Text>
                </View> :
                <ScrollView >
                    <View style={{ paddingHorizontal: responsiveHeight(2), paddingTop: responsiveHeight(2), flex: 1, rowGap: responsiveHeight(1) }}>

                        {count > 0 ? <TouchableOpacity style={styles.clearFilterContainer} onPress={removeFilters}>
                            <Text style={styles.clearFilterTitle}>Clear Filters</Text>
                        </TouchableOpacity> : null}


                        <TextInput placeholder='Search for your favourite hotel' style={{ borderWidth: 1, paddingHorizontal: responsiveWidth(5), borderRadius: responsiveHeight(2), fontSize: responsiveHeight(2.1) }} value={hotelSearchText} onChangeText={async (e) => {
                            await actions.setHotelSearchText(e);
                        }} />
                        <Text style={styles.totalHotels}>{`Hotel search results (${actions.filterHotels(filteredHotels).filter((hotel) => {
                            var staticData = hotelStaticData[hotel.HotelCode];
                            var hotelName = hotel.HotelName ? hotel.HotelName : staticData?.HotelName;
                            return hotelName?.length > 0;
                        }).length
                            })`}</Text>
  
    { !openFilters&&<FlatList
        data={finalData}
        renderItem={({ item, index }) => <RenderHotelItem hotel={item} index={index} />}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        windowSize={5}
        updateCellsBatchingPeriod={30}
        maxToRenderPerBatch={10}
      /> }
    
                    </View>
                </ScrollView>}
        </KeyboardAvoidingView>
    )
}

export default (HotelResList)
// import { View, Text } from 'react-native'
// import React from 'react'

// const HotelResList = (props) => {
//   return (
//     <View>
//       <Text onPress={()=>props.navigation.navigate("HotelInfo")}>HotelResList</Text>
//     </View>
//   )
// }

// export default HotelResList