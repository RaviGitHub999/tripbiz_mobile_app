// import { View, Text, StyleSheet } from 'react-native'
// import React, { useState } from 'react'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import IconSwitcher from '../icons/IconSwitcher'
// import { colors } from '../../../config/theme'
// import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
// const data=[
//     {
//       name:"ravi"  
//     },
//     {
//         name:"ravi123"  
//       },
//       {
//         name:"ravi456"  
//       },
//       {
//         name:"ravi789"  
//       },

// ]
// const Select = () => {
//     const[viewAll,setViewAll]=useState(false);
//     const handledropDown=()=>
//     {
//         setViewAll(!viewAll)
//     }
//     return (
//         <View>
//             <TouchableOpacity style={styles.maincontainer} onPress={handledropDown}>
//                 <Text>No excess Baggage</Text>
//                 <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3} />
//             </TouchableOpacity>
//             {
//                 viewAll?<View style={styles.items}>
//                     {
//                         data.map((ele)=>
//                         {
//                             return(
//                                 <Text>{ele.name}</Text>
//                             )
//                         })
//                     }
//                 </View>:null
//             }
//         </View>
//     )
// }

// export default Select
// const styles = StyleSheet.create({
//     maincontainer: {
//         borderWidth: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingLeft: responsiveWidth(4),
//         paddingRight: responsiveWidth(1),
//         alignItems: 'center',
//         height: responsiveHeight(5)
//     },
//     items:{
//         borderWidth:1,
//         paddingLeft:responsiveWidth(4),
//         rowGap:responsiveHeight(1),
//         paddingVertical:responsiveHeight(1)
//     }
// })
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
import { colors } from '../../../config/theme';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';
import IconSwitcher from '../icons/IconSwitcher';
import MyContext from '../../../context/Context';

const data = [
    { name: "ravi" },
    { name: "ravi123" },
    { name: "ravi456" },
    { name: "ravi789" },
];

const Select = ({ bookIndex, segIndex, bookingFlight, name,traveller }) => {
    const [viewAll, setViewAll] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
const{actions}=useContext(MyContext)
    const handledropDown = () => {
        setViewAll(!viewAll);
    };

    const handleItemPress = (index, bag,type) => {
        const pickedItem=name === "baggage" ? bag.Weight > 0 ? `${bag.Weight}KG at Rs ${bag.Price}/-` : "No excess baggage" : bag.Quantity > 0 ? `${bag.AirlineDescription} -> Rs ${bag.Price}/-` : "No add-on meal"
        setSelectedItem(pickedItem);
        setSelectedItemIndex(index);
        setViewAll(false);
        // actions.handleChangeFlightBook(
        //     pickedItem,
        //     type,
        //     bookIndex,
        //     segIndex,
        //     index
        //   )
        actions.handleMeal(
            pickedItem,
            type,
            bookIndex,
            segIndex,
            traveller
          )
    };
    return (
        <View>
            <TouchableOpacity style={styles.maincontainer} onPress={handledropDown}>
               <View style={{width:"80%"}}>
               <Text>{selectedItem ? selectedItem : name === "baggage" ? "No excess Baggage" : "No add-on meal"}</Text>
               </View>
                <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3} />
            </TouchableOpacity>
            {viewAll ? (
                <View style={styles.items}>
                    {
                        name === "baggage" ?
                            <FlatList data={bookingFlight[bookIndex].baggageData[segIndex]} renderItem={({ item, index }) => {
                                return (
                                    <TouchableHighlight
                                        key={index}
                                        underlayColor={colors.lightGray}
                                        onPress={() => handleItemPress(index, item,name)}
                                        style={[
                                            styles.item,
                                            selectedItemIndex === index && styles.itemHovered,
                                        ]}
                                    >
                                        <Text>{item.Weight > 0 ? `${item.Weight}KG at Rs ${item.Price}/-` : "No excess baggage"}</Text>
                                    </TouchableHighlight>
                                )
                            }}  nestedScrollEnabled/>
                            :
                            <FlatList data={bookingFlight[bookIndex].mealData[segIndex]} renderItem={({ item, index }) => {
                                return (
                                    <TouchableHighlight
                                        key={index}
                                        underlayColor={colors.lightGray}
                                        onPress={() => handleItemPress(index, item,name)}
                                        style={[
                                            styles.item,
                                            selectedItemIndex === index && styles.itemHovered,
                                        ]}
                                    >
                                        <Text>{item.Quantity > 0 ? `${item.AirlineDescription} -> Rs ${item.Price}/-` : "No add-on meal"}</Text>
                                    </TouchableHighlight>
                                )
                            }} nestedScrollEnabled/>
                    }
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    maincontainer: {
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: responsiveWidth(4),
        paddingRight: responsiveWidth(1),
        alignItems: 'center',
        height: responsiveHeight(5),
    },
    items: {
        borderWidth: 1,
        rowGap: responsiveHeight(1),
        height: responsiveHeight(18)
    },
    item: {
        paddingVertical: responsiveHeight(1),
        paddingLeft: responsiveWidth(4),
    },
    itemHovered: {
        backgroundColor: colors.lightGray,
    },
});

export default Select;

