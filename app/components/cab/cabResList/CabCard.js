import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Keyboard } from 'react-native'
import React, { useContext, useState } from 'react'
import MyContext from '../../../context/Context'
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';
import { colors, fonts } from '../../../config/theme';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import IconSwitcher from '../../common/icons/IconSwitcher';
import PopUp from '../../common/popup/PopUp';
import { TextInput } from 'react-native';
var imgs = [
    {
        passenger: 4,
        type: "Sedan",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/hatchback_new.png",
    },
    {
        passenger: 4,
        type: "Indica or similar",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/sedan_new.png",
    },
    {
        passenger: 6,
        type: "SUV (Innova/Ertiga)",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
        passenger: 6,
        type: "Innova",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
        passenger: 6,
        type: "Innova crysta",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
        passenger: 6,
        type: "Innova Crysta",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
    {
        passenger: 6,
        type: "Ertiga",
        image:
            "https://jsak.mmtcdn.com/cabs_cdn_dt/image/Cab_Images/xylo_new.png",
    },
];
const cabTypes =
    [
        "8 hrs cab at disposal",
        "12 hrs cab at disposal",
        "4 hrs cab at disposal",
        "10 hrs cab at disposal"
    ]

const CabCard = ({ item }) => {
    var [submitIsOpen, setSubmitIsOpen] = useState(false);
    var [isloading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("tab1");
    const { actions, cabNights, cabStartDate, cabEndDate, cabCount, cabCity, cabType, cabService, cabSD, selectedTime, userTripStatus } = useContext(MyContext)
    var cabImg = imgs.filter((img) => img.type.trim() === item.Car.trim());

    var cabFinalPrice;
    if (cabNights > 0) {
        cabFinalPrice = item.Price * Number(cabCount) * cabNights;
    } else {
        cabFinalPrice = item.Price * Number(cabCount);
    }

    var myStr = cabCity + "_trip";
    const formattedDate = `${cabSD?.toLocaleString("default", {
        month: "long",
    })} ${cabSD?.getDate()}`;
    const combinedString = `${myStr}_${formattedDate}`;

    const sortedTrips = userTripStatus.userTrips.slice().sort((a, b) => {
        var aTime = new Date(a?.data?.date?.seconds * 1000);
        var bTime = new Date(b?.data?.date?.seconds * 1000);
        return bTime - aTime;
    });

    var getTime = (seconds) => {
        const timestampInSeconds = seconds;
        const timestampInMilliseconds = timestampInSeconds * 1000;
        const date = new Date(timestampInMilliseconds);
        return date;
    };

    const bookingrenderItem = ({ item }) => {
        const date = getTime(item?.data?.date?.seconds);
        const dateStr = date.toString().slice(4, 10);

        return (
            <TouchableOpacity style={styles.tripCard} onPress={() => {
                // addtoTrip(item.id)
                // navigate("TripDetails", { id: item.id });
            }}>
                <Text style={styles.tripTitle}>{item.data.name}</Text>
                <Text style={styles.tripDate}>{dateStr}</Text>
            </TouchableOpacity>
        );
    };


    const handleAddToTrip = async () => {
        setIsLoading(true);
        var cabTotalPrice = (cabFinalPrice * cabService) / 100 + cabFinalPrice;
        let newtripid = await actions.editTripBtn(combinedString, "cabs", {
            cabCity,
            cabType,
            item,
            cabStartDate,
            cabEndDate,
            cabCount,
            cabTotalPrice,
            cabFinalPrice,
            cabNights,
            selectedTime,
        });
        setIsLoading(false);
        setSubmitIsOpen(true);
        // navigate("TripDetails", { id: newtripid });
        await actions.getLastDoc();

    };
    return (
        <>
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={styles.imaContainer}>
                        <Image source={{ uri: cabImg[0]?.image }} style={styles.img} resizeMode='stretch' />
                    </View>
                    <View style={styles.subContainer}>
                        <View style={styles.headerMainContainer}>
                            <View style={styles.headerSubContainer_1}>
                                <Text style={styles.title}>{item.Car}</Text>
                                <Text style={styles.subTitle}>{`(${item["Max. number of passengers"]} Seater)`}</Text>
                            </View>
                            <View style={styles.headerSubContainer_2}>
                                <Text style={styles.subTitle}>{`${cabStartDate} ${cabEndDate ? "-" : ""} ${cabEndDate} `}{`(${cabNights > 0 ? cabNights : ''} days)`}</Text>
                            </View>
                        </View>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.title}>{`No of Cabs-${cabCount}`}</Text>
                            {item.Notes ? <View style={styles.headerSubContainer_1}>
                                <Text style={styles.title}>Limit : </Text>
                                <Text style={styles.subTitle}>{item?.Notes}</Text>
                            </View> : null}
                            <View style={styles.headerSubContainer_1}>
                                <Text style={styles.title}>Cost : </Text>
                                <Text style={[styles.title, { color: colors.secondary }]}>&#8377;{` ${item.Price} ${!cabTypes.includes(cabType) ? "per trip" : "per day"}`}</Text>
                            </View>
                            <View style={styles.headerSubContainer_1}>
                                <Text style={styles.title}>{`Total Cost for ${cabNights} ${cabNights > 1 ? "nights" : "night"} : `}</Text>
                                <Text style={styles.price}>&#8377; {`${cabFinalPrice.toLocaleString()}`}</Text>
                            </View>
                            <View style={styles.headerSubContainer_1}>
                                <Text style={styles.title}>Service Fees:</Text>
                                {/* <Text style={styles.price}>{`${cabFinalPrice.toLocaleString()} (${item?.Price} * ${cabCount} cab * ${cabNights} days) ${cabService}% service fee`}</Text> */}
                                <Text style={styles.price}> &#8377; {(cabService / 100) * cabFinalPrice}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.btn} onPress={handleAddToTrip}>
                    <Text style={styles.btnTitle}>Add to trip</Text>
                </TouchableOpacity>
            </View>       
            <PopUp value={submitIsOpen} handlePopUpClose={() => setSubmitIsOpen(false)}>
               <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
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
                                contentContainerStyle={{ paddingHorizontal: responsiveWidth(3) }} 
                                nestedScrollEnabled/> :
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
               </TouchableWithoutFeedback>
            </PopUp>
        </>
    )
}
const styles = StyleSheet.create(
    {

        mainContainer:
        {

            marginVertical: responsiveHeight(1.5),
            paddingVertical: responsiveHeight(2),
            paddingLeft: responsiveWidth(2),
            marginHorizontal: responsiveWidth(3),
            borderRadius: responsiveHeight(1.5),
            elevation: responsiveHeight(0.4),
            backgroundColor: colors.white
        },
        container: {
            flexDirection: "row",
            gap: responsiveWidth(2),
        },
        imaContainer: {
            height: responsiveHeight(12),
            width: responsiveHeight(12),
            alignItems: 'center',
            justifyContent: 'center'
        },
        img: {
            height: responsiveHeight(10),
            width: responsiveHeight(10)
        },
        subContainer: {
            flex: 1
        },
        headerMainContainer:
        {
            flexDirection: 'row',
            flex: 1,
            gap: responsiveHeight(0.5)
        },
        headerSubContainer_1:
        {
            flexDirection: 'row',
            flex: 1,
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        headerSubContainer_2:
        {
            flex: 1,
            backgroundColor: colors.highlight,
            justifyContent: 'center',
            padding: responsiveHeight(0.8),
            borderTopLeftRadius: responsiveHeight(1.5),
            borderBottomLeftRadius: responsiveHeight(1.5)
        },
        title: {
            fontSize: responsiveHeight(1.8),
            fontFamily: fonts.primary,
            color: colors.primary
        },
        subTitle: {
            fontSize: responsiveHeight(1.8),
            fontFamily: fonts.textInput,
            color: colors.primary
        },
        detailsContainer:
        {
            marginTop: responsiveHeight(1),
            gap: responsiveHeight(0.5),
            paddingRight: responsiveWidth(1)
        },
        price:
        {
            fontSize: responsiveHeight(1.8),
            fontFamily: fonts.primary,
            color: colors.secondary
        },
        btn: {
            borderWidth: 1,
            alignSelf: 'flex-end',
            marginRight: responsiveWidth(5),
            padding: responsiveHeight(1),
            marginTop: responsiveHeight(1),
            borderRadius: responsiveHeight(1),
            backgroundColor: colors.primary

        },
        btnTitle: {
            fontSize: responsiveHeight(1.8),
            fontFamily: fonts.primary,
            color: colors.white,

        },
        tripsContainer: {
            alignItems: 'center',
          },
          createNewTripBtn: {
            borderWidth: responsiveHeight(0.2),
            flexDirection: 'row',
            gap: responsiveHeight(1),
            alignItems: 'center',
            paddingHorizontal: responsiveWidth(8),
            paddingVertical: responsiveHeight(1),
            borderStyle: 'dashed',
            backgroundColor: "#edf8f4",
            borderRadius: responsiveHeight(0.8),
            width: '90%',
            justifyContent: 'center'
          },
          createNewTripBtnTitle: {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary
          },
          triptitles: {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary,
            textAlign: 'center'
          },
          tripCard: {
            marginVertical: responsiveHeight(0.5),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(2),
            borderRadius: responsiveHeight(1.5),
            backgroundColor: colors.white,
            shadowColor: colors.black,
            shadowOffset: { width: responsiveWidth(-0.2), height: responsiveHeight(-5) },
            shadowOpacity: responsiveHeight(0.3),
            shadowRadius: responsiveHeight(3),
            elevation: responsiveHeight(0.4),
            width: "100%"
          },
          tripTitle: {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary
          },
          tripDate: {
            fontSize: responsiveHeight(1.7),
            fontFamily: fonts.textFont,
            color: colors.highlight
          },
          addingNewTripContainer: {
            gap: responsiveHeight(1.5)
          },
          addingNewTripSubContainer: {
            gap: responsiveHeight(1)
          },
          addingNewTripBtn: {
            borderWidth: 1,
            padding: responsiveHeight(1),
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveHeight(1.5),
            borderRadius: responsiveHeight(1.3),
            backgroundColor: colors.black,
            alignItems: 'center',
            alignSelf: 'center',
            width: "60%"
          },
          addingNewTripBtnText: {
            color: colors.white,
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary
          },
          multiTextContainer: {
            borderWidth: 1,
            textAlignVertical: "top",
            borderRadius: responsiveHeight(1.3),
            paddingHorizontal: responsiveWidth(3),
            fontSize: responsiveHeight(2.3)
          },
          newtriptitle: {
            fontSize: responsiveHeight(2.5),
            fontFamily: fonts.primary,
            color: colors.primary,
            // textAlign: 'center'
          },

    }
)
export default CabCard