import { View, Text, Image, TouchableOpacity, FlatList, Animated, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import MyContext from '../../../context/Context'
import { styles } from './styles'
import ProgressBar from '../../common/progressBar/ProgressBar'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors } from '../../../config/theme'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { TouchableWithoutFeedback } from 'react-native'
import { Keyboard } from 'react-native'
import HotelInfoRenderItems from './HotelInfoRenderItems'
import PopUp from '../../common/popup/PopUp'
import { BackHandler } from 'react-native'

const HotelInfo = ({ route: { params }, navigation: { goBack, navigate } }) => {
    const [selectedRoom, setSelectedRoom] = useState(0);
    const [breakfastFilter, setBreakfastFilter] = useState(false);
    const [cancelFilter, setCancelFilter] = useState(false);
    const [heightAnim] = useState(new Animated.Value(responsiveHeight(10)));
    const { ResultIndex, HotelCode, SupplierHotelCodes, } = params.item
    const { actions, selectedTripId, selectedTrip, hotelSessionExpired, fetchingHotelInfo, hotelInfoRes, bookingHotel, hotelStaticData, hotelSearchCheckOut, hotelSearchCheckIn, hotelSearchNights, hotelRoomArr, hotelSearchChild, domesticHotel, userTripStatus } = useContext(MyContext)
    const hotelCheckIn = new Date(hotelSearchCheckIn)
    const hotelCheckOut = new Date(hotelSearchCheckOut)
    const increasedHeight = bookingHotel?.selectedRoomType?.length >= 3 ? responsiveHeight(35) : responsiveHeight(30);
    const initialHeight = responsiveHeight(10);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hotelDescriptionPopUp, setHotelDescriptionPopUp] = useState(false)
    const [hotelImagesPopUp, setHotelImagesPopUp] = useState(false)
    const [mainImgIdx, setMainImgIdx] = useState(0);
    const [activeTab, setActiveTab] = useState("tab1");
    const [submitIsOpen, setSubmitIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const myDate = new Date();
    const myString = bookingHotel?.hotelSearchQuery?.cityDestName?.split(',')[0].trim() + "trip";
    const formattedDate = `${myDate.toLocaleString("default", {
        month: "long"
    })} ${myDate.getDate()}`;
    const combinedString = `${myString}_${formattedDate}`;
    var [defaultInput, setDefaultInput] = useState(combinedString);

    const sortedTrips = userTripStatus.userTrips.slice().sort((a, b) => {
        var aTime = new Date(a?.data?.date?.seconds * 1000);
        var bTime = new Date(b?.data?.date?.seconds * 1000);
        return bTime - aTime;
    });
    var addtoTrip = async (id) => {
        setSubmitIsOpen(false)
        setIsLoading(true)
        await actions.editTripById(id, bookingHotel, "hotels");
        setIsLoading(false);
    }
    const bookingrenderItem = ({ item }) => {
        const date = getTime(item?.data?.date?.seconds);
        const dateStr = date.toString().slice(4, 10);

        return (
            <TouchableOpacity style={styles.tripCard} onPress={() => {
                addtoTrip(item.id)
                navigate("TripDetails", { id: item.id });
            }}>
                <Text style={styles.tripTitle}>{item.data.name}</Text>
                <Text style={styles.tripDate}>{dateStr}</Text>
            </TouchableOpacity>
        );
    };

    const handleInputChange = (e) => {
        setDefaultInput(e)
    }
    const handleAddToTrip = async () => {
        setIsLoading(true);
        let newtripid = await actions.editTripBtn(defaultInput, "hotels", bookingHotel);
        setIsLoading(false);
        setSubmitIsOpen(false);
        navigate("TripDetails", { id: newtripid });
        // await actions.getLastDoc();

    };

    var getTime = (seconds) => {
        const timestampInSeconds = seconds;
        const timestampInMilliseconds = timestampInSeconds * 1000;
        const date = new Date(timestampInMilliseconds);
        return date;
    };

    const images = hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images ? [...hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails?.Images] : []
    useEffect(() => {
        // actions.getLastDoc()
        actions.fetchHotelInfo(
            {
                resultIndex: ResultIndex,
                hotelCode: HotelCode,
                categoryId: SupplierHotelCodes &&
                    SupplierHotelCodes.length > 0
                    ? SupplierHotelCodes[0].CategoryId
                    : "",
                hotelSearchRes: params.item
            }
        )
    }, [])
    const toggleHeight = () => {
        setIsExpanded(!isExpanded);
    };
    const generatePattern = (itemCount) => {
        return Array.from({ length: itemCount }, (_, index) => index).map((ele, ind) => {
            return (
                <View key={`${ind + 1}_`}>
                    <IconSwitcher componentName='AntDesign' iconName='star' iconsize={2} color='#ffd700' />
                </View>
            )
        })

    };

    const adults = bookingHotel?.hotelSearchQuery?.hotelRoomArr.reduce((acc, obj) => {
        acc.adults += parseInt(obj.adults, 10);
        acc.child += parseInt(obj.child, 10);
        return acc;
    }, { adults: 0, child: 0 });
   
    const renderItem = ({ item, index }) => {
        return (
            <HotelInfoRenderItems room={item} index={index} selectedRoom={selectedRoom} />
        )
    }
    const handleHotelDescriptionPopUp = () => {
        setHotelDescriptionPopUp(!hotelDescriptionPopUp)
    }

    const handleHotelImagesPopUp = () => {
        console.log("clicked")
        setHotelImagesPopUp(!hotelImagesPopUp)
    }

    const handleSelectedHotelImage = (ind) => {
        setMainImgIdx(ind)
    }
    const handleRenderHotelImages = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ margin: responsiveHeight(1) }} onPress={() => handleSelectedHotelImage(index)}>
                <Image source={{ uri: imageError ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : item }} style={{ height: responsiveHeight(8), width: responsiveHeight(8), borderRadius: responsiveHeight(1) }} onError={() => setImageError(true)} />
            </TouchableOpacity>
        )
    }
    useEffect(() => {
        const backAction = () => {
          goBack()
          actions.handleGoBack()
          return true; 
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        return () => backHandler.remove();
      }, []);
    if (fetchingHotelInfo || isLoading) {
        return <View style={styles.progressBarContainer}>
            <View style={styles.progressbar}>
                <ProgressBar />
            </View>
        </View>
    }
    return (
        <>
            <View style={styles.mainContainer}>
                {hotelInfoRes?.hotelInfo?.HotelInfoResult ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: responsiveHeight(10) }}>
                    <View style={styles.hotelDetailsContainer}>
                        <View style={styles.backIconContainer}>
                            <TouchableOpacity onPress={() => { goBack(), actions.handleGoBack() }}>
                                <IconSwitcher componentName='AntDesign' iconName='arrowleft' color="black" iconsize={3} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.hotelImgMainContainer}>
                            <TouchableOpacity onPress={handleHotelImagesPopUp}>
                                <Image source={{ uri: imageError ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" : hotelInfoRes?.hotelInfo?.HotelInfoResult?.HotelDetails.Images[0] }} style={styles.hotelImg} onError={() => setImageError(true)} />
                            </TouchableOpacity>
                            <View style={styles.hotelDescriptions}>
                                <Text style={styles.hotelName}>{bookingHotel?.hotelName ? bookingHotel?.hotelName : hotelStaticData[bookingHotel?.hotelCode]?.HotelName}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {hotelInfoRes?.hotelSearchRes?.StarRating ? generatePattern(hotelInfoRes?.hotelSearchRes?.StarRating) : null}
                                </View>
                                <Text style={styles.hotelPrice}>
                                    {`₹ ${hotelInfoRes?.hotelSearchRes?.Price.OfferedPriceRoundedOff
                                        ? hotelInfoRes?.hotelSearchRes?.Price.OfferedPriceRoundedOff.toLocaleString(
                                            "en-IN"
                                        )
                                        : hotelInfoRes?.hotelSearchRes?.Price.PublishedPriceRoundedOff.toLocaleString(
                                            "en-IN"
                                        )
                                        }`}
                                </Text>
                            </View>

                        </View>
                        {hotelInfoRes?.hotelSearchRes?.HotelLocation ? <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: responsiveWidth(2) }}>
                            <Text style={styles.addressTitle}>Location:</Text>
                            <Text style={styles.address}>{`${hotelInfoRes.hotelSearchRes.HotelLocation}`}</Text>
                        </View> : null}



                        <View>
                            <Text style={styles.addressTitle}>
                                Address:
                            </Text>
                            <Text style={styles.address}>
                                {`${hotelInfoRes.hotelInfo?.HotelInfoResult?.HotelDetails.Address}`}
                            </Text>
                        </View>
                        {hotelInfoRes?.hotelSearchRes?.HotelDescription ?
                            <View >
                                <Text style={{ alignContent: "center" }} >
                                    {hotelInfoRes?.hotelSearchRes?.HotelDescription.slice(0, 60) + "..."}
                                    <TouchableOpacity onPress={handleHotelDescriptionPopUp}>
                                        <IconSwitcher componentName='EvilIcons' iconName='external-link' color='black' iconsize={3} />
                                    </TouchableOpacity>
                                </Text>


                            </View>
                            : null
                        }
                        <View style={styles.checkInAndCheckOutDatesContainer}>
                            <Text style={styles.checkInAndCheckOutDates}>{`${hotelCheckIn.toLocaleString('en-us', { month: 'long' })} ${hotelCheckIn.getDate()}, ${hotelCheckIn.getFullYear()} - ${hotelCheckOut.toLocaleString('en-us', { month: 'long' })} ${hotelCheckOut.getDate()}, ${hotelCheckOut.getFullYear()} , ${hotelSearchNights} Nights`}</Text>
                        </View>
                        <View>
                            {/* <Text style={styles.PersonsDetails}>{`Adults-${adults?.adults} , Children-${adults?.child}`}</Text> */}
                            <Text style={styles.PersonsDetails}>{`Adults-${adults?.adults}`}</Text>
                        </View>
                        <View style={{ rowGap: responsiveHeight(1) }}>
                            <Text style={styles.roomDetailsTitle}>Room Details</Text>
                            <View style={styles.roomsMappedContainer}>
                                {
                                    bookingHotel.selectedRoomType &&
                                    bookingHotel.selectedRoomType.map((room, r) => {
                                        return (
                                            <TouchableOpacity style={r === selectedRoom ? [styles.roomDetailsActiveContainer, styles.roomDetailsContainer] : styles.roomDetailsContainer} onPress={() => setSelectedRoom(r)}>
                                                <Text style={r === selectedRoom ? [styles.roomDetailsActiveTitle1] : styles.roomDetailsTitle1}>{`Room ${r + 1}`}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            <View style={styles.roomDetailsMainContainer}>
                                {/* BreakfastAndRefundableButtons */}
                                <View style={styles.breakfastAndRefundableButtonsContainer}>
                                    <TouchableOpacity style={breakfastFilter ? [styles.breakfastBtn, styles.activebreakfastBtn] : styles.breakfastBtn} onPress={() => setBreakfastFilter((prev) => !prev)}>
                                        <Text style={breakfastFilter ? [styles.activebreakfastBtnText] : styles.breakfastBtnText}>Breakfast</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={cancelFilter ? [styles.breakfastBtn, styles.activebreakfastBtn] : styles.breakfastBtn} onPress={() => setCancelFilter((prev) => !prev)}>
                                        <Text style={cancelFilter ? [styles.activebreakfastBtnText] : styles.breakfastBtnText}>Refundable</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* 
                                        {hotelInfoFlatList} */}

                                <FlatList
                                    data={hotelInfoRes.roomResult?.GetHotelRoomResult?.HotelRoomsDetails.filter((room, r) => {
                                        if (breakfastFilter && cancelFilter) {
                                            if (
                                                actions.checkForTboMeals(room.Inclusion).includes("Breakfast") &&
                                                actions.validCancelDate(room.LastCancellationDate)
                                            ) {
                                                return true;
                                            }
                                            return false;
                                        } else if (breakfastFilter) {
                                            if (actions.checkForTboMeals(room.Inclusion).includes("Breakfast")) {
                                                return true;
                                            }
                                            return false;
                                        } else if (cancelFilter) {
                                            if (actions.validCancelDate(room.LastCancellationDate)) {
                                                return true;
                                            }
                                            return false;
                                        }
                                        return true;
                                    })}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    scrollEnabled={false}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>:
                <Text>The selected hotel is not available, Please select another hotel</Text>}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={hotelDescriptionPopUp}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ height: "100%", width: "100%", backgroundColor: colors.black, position: "absolute", opacity: 0.5, }}></View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                            <View style={{ backgroundColor: 'white', width: '100%', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }}>
                                <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={handleHotelDescriptionPopUp}>
                                    <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                                </TouchableOpacity>
                                <View>
                                    <Text style={styles.addressTitle}>Location:<Text style={styles.address}>{hotelInfoRes?.hotelSearchRes?.HotelLocation}</Text></Text>
                                    <Text style={styles.addressTitle}>Description:<Text style={styles.address}>{hotelInfoRes?.hotelSearchRes?.HotelDescription}</Text></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={hotelImagesPopUp}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ height: "100%", width: "100%", backgroundColor: colors.black, position: "absolute", opacity: 0.5, }}></View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                            <View style={{ backgroundColor: 'white', width: '100%', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 }}>
                                <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={handleHotelImagesPopUp}>
                                    <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                                </TouchableOpacity>
                                <View>
                                    <Image source={{ uri: images[mainImgIdx] }} style={styles.popUpSelectedImg} />
                                </View>
                                {images.length > 0 ?
                                    <View style={{ height: responsiveHeight(50), alignItems: "center", justifyContent: 'center', paddingTop: responsiveHeight(2) }}>
                                        <FlatList data={images} renderItem={handleRenderHotelImages} numColumns={4} showsVerticalScrollIndicator={false} />
                                    </View>
                                    : null}
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={submitIsOpen}
                >
                    <View style={styles.modalMainContainer}>
                        <View style={styles.modalOpacityLayer}></View>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modelSubContainer1}>
                                <View style={styles.modelSubContainer2}>
                                    <TouchableOpacity style={styles.modalIcon} onPress={() => setSubmitIsOpen(false)}>
                                        <IconSwitcher componentName='Entypo' iconName='cross' iconsize={3} color='black' />
                                    </TouchableOpacity>
                                    {activeTab === 'tab1' ? <View style={styles.tripsContainer}>
                                        <TouchableOpacity style={styles.createNewTripBtn} onPress={() => setActiveTab('tab2')}>
                                            <Text style={styles.createNewTripBtnTitle}>Create New Trip</Text>
                                            <IconSwitcher componentName='Entypo' iconName='plus' color={colors.black} iconsize={3} />
                                        </TouchableOpacity>
                                        {
                                            sortedTrips.length > 0 ?
                                                <FlatList
                                                    data={sortedTrips}
                                                    renderItem={bookingrenderItem}
                                                    keyExtractor={(item) => item.id}
                                                    ListHeaderComponent={() => {
                                                        return (
                                                            <View >
                                                                <Text style={styles.triptitles}>Or</Text>
                                                                <Text style={styles.triptitles}>Select an existing trip</Text>
                                                            </View>
                                                        )
                                                    }}
                                                    ListHeaderComponentStyle={{ marginTop: responsiveHeight(1) }}

                                                    style={{ height: responsiveHeight(50) }}
                                                    contentContainerStyle={{ paddingHorizontal: responsiveWidth(3) }} /> :
                                                <View>
                                                    <ActivityIndicator size={"large"} color={"blue"} />

                                                </View>
                                        }
                                    </View> :
                                        <View style={styles.addingNewTripContainer}>
                                            <TouchableOpacity onPress={() => setActiveTab('tab1')}>
                                                <IconSwitcher componentName='MaterialCommunityIcons' iconName='arrow-left-thin' color={colors.primary} iconsize={4} />
                                            </TouchableOpacity>
                                            <View style={styles.addingNewTripSubContainer}>
                                                <Text style={styles.newtriptitle}>Enter new trip Name</Text>
                                                <TextInput
                                                    editable
                                                    multiline
                                                    numberOfLines={3}
                                                    placeholder='Enter name of your trip'
                                                    style={styles.multiTextContainer}
                                                    value={defaultInput}
                                                    onChangeText={handleInputChange} />
                                                <TouchableOpacity style={styles.addingNewTripBtn} onPress={handleAddToTrip}>
                                                    <Text style={styles.addingNewTripBtnText}>Add to trip</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>



                                    }

                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            </View>
            <View style={styles.totalRoomPriceContainer}>
                <TouchableOpacity style={styles.totalRoomPriceToggleContainer} onPress={toggleHeight}>
                    <IconSwitcher componentName='Ionicons' iconName={isExpanded ? "chevron-down" : 'chevron-up'} color='black' iconsize={3} />
                </TouchableOpacity>
                <View style={styles.roomPriceContainer}>
                    <Text style={styles.totalPriceText}>Total Price: <Text style={styles.totalPrice}>{` ₹ ${Math.ceil(bookingHotel?.hotelTotalPrice).toLocaleString("en-IN")} `}</Text></Text>
                    {
                        selectedTripId ?
                            <View style={styles.selectedTripContainer}>
                                <Text style={styles.selectedTripTitle}>{`Do you want to add to ${selectedTrip?.data?.name ? selectedTrip?.data?.name : selectedTripId}`}</Text>
                                <View style={styles.selectedTripBtnContainer}>
                                    <TouchableOpacity onPress={
                                        () => {
                                            navigate("TripDetails", { id: selectedTripId })
                                            actions.editTripById(selectedTripId, bookingHotel, "hotels");
                                            actions.handleSelectedTripId()
                                        }
                                    } style={styles.yesBtn}>
                                        <Text style={styles.yesBtnText}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.yesBtn} onPress={() => {
                                        actions.backToHotelResPage()
                                        goBack()
                                    }}>
                                        <Text style={styles.yesBtnText}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : <TouchableOpacity style={styles.addtotripBtn} onPress={() => {
                                setSubmitIsOpen(true);
                                setDefaultInput(combinedString);
                            }}>
                                <Text style={styles.addtotripBtnText}>Add to trip</Text>
                            </TouchableOpacity>}
                </View>

            </View>

            <PopUp value={isExpanded} handlePopUpClose={toggleHeight}>
                <>
                    {isExpanded &&
                        // <View style={bookingHotel?.selectedRoomType?.length >= 3 ? { height: responsiveHeight(30) } : { height: responsiveHeight(20) }}>
                        // <ScrollView style={{ rowGap: responsiveHeight(1) }} >
                        <>
                            {bookingHotel?.selectedRoomType &&
                                bookingHotel?.selectedRoomType?.map((room, r) => {
                                    return (
                                        <View style={styles.card}>
                                            <View style={styles.cardMainSubContainer}>
                                                <View style={styles.cardSubContainer1}>
                                                    <Text style={styles.roomType}>{room.RoomTypeName}</Text>
                                                    <View style={styles.mealsDescriptionContainer}>
                                                        <IconSwitcher componentName='MaterialIcons' iconName='dinner-dining' color='black' iconsize={3} />
                                                        <Text style={styles.inclusion}>{room.Inclusion && room.Inclusion.length > 0
                                                            ? actions.checkForTboMeals(room.Inclusion)
                                                            : "No meals"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.cardSubContainer2}>
                                                    <Text style={styles.roomPrice}>{`₹ ${room.Price.OfferedPriceRoundedOff
                                                        ? room.Price.OfferedPriceRoundedOff.toLocaleString(
                                                            "en-IN"
                                                        )
                                                        : room.Price.PublishedPriceRoundedOff.toLocaleString(
                                                            "en-IN"
                                                        )
                                                        }`}</Text>
                                                    {
                                                        room.LastCancellationDate &&
                                                            actions.validCancelDate(
                                                                room.LastCancellationDate
                                                            ) ? <View style={styles.mealsDescriptionContainer}>
                                                            <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
                                                            <Text style={styles.inclusion}>{`Free cancellation upto ${new Date(
                                                                room.LastCancellationDate
                                                            )
                                                                .toString()
                                                                .slice(4, 10)}`}</Text>
                                                        </View> : <View style={styles.mealsDescriptionContainer}>
                                                            <IconSwitcher componentName='MaterialCommunityIcons' iconName='cancel' color='black' iconsize={2} />
                                                            <Text style={styles.inclusion}>Non-refundable</Text>
                                                        </View>
                                                    }

                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}

                            <View style={styles.hotelPriceContainer}>
                                <Text style={styles.hotelPriceText}>Room price:</Text>
                                <Text style={styles.hotelPriceTP}>{` ₹ ${bookingHotel?.hotelFinalPrice?.toLocaleString("en-IN")} `}</Text>
                            </View>
                            <View style={styles.dashedLine} />
                            <View style={styles.hotelPriceContainer}>
                                <Text style={styles.hotelPriceText}>Service Charges</Text>
                                <Text style={styles.hotelPriceTP}>{` + ${Math.round(bookingHotel?.hotelServiceCharge)}`}</Text>
                            </View>
                            <View style={styles.hotelPriceContainer}>
                                <Text style={styles.hotelPriceText}>GST</Text>
                                <Text style={styles.hotelPriceTP}>{` + ${Math.round(bookingHotel?.calculateGstFromService)}`}</Text>
                            </View>
                        </>

                        // </ScrollView>
                        // </View>
                    }
                </>
            </PopUp>
        </>
    )
}
export default React.memo(HotelInfo)

