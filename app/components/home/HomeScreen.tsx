
import React, { useContext, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import IconSwitcher from '../common/icons/IconSwitcher';
import { colors, fonts } from '../../config/theme';
import { responsiveFontSize, responsiveHeight } from '../../utils/responsiveScale';
import { styles } from './styles';
import FlightsSearch from '../flight/FlightsSearch';
import HotelSearch from '../hotel/HotelSearch';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import MyContext from '../../context/Context';
import CabSearch from '../cab/CabSearch';
import BusSearch from '../bus/BusSearch';
import { logo } from './assets';
//'flights', 'hotel', 'bus', 'train'
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


const HomeScreen = (props: any) => {
  const{activeComponent,actions,flatListRef}=useContext(MyContext)
  const getContentMemoized = useMemo(() => {
    return (component: string, props: any) => {
      switch (component) {
        case 'flights':
          return <FlightsSearch {...props} />;
        case 'hotel':
          return <HotelSearch  {...props} />;
        case 'cab':
          return <CabSearch  {...props} />;
        case 'bus':
          return <BusSearch  {...props} />;
        default:
          return 'Default content goes here';
      }
    };
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
      </View>
      <View style={styles.headersContainer}>
      {/* <Text style={styles.headerText}>Search {activeComponent} for your business travels</Text> */}
      <Image source={logo} style={styles.appLogo} />
        <View style={styles.nav} >
          <FlatList ref={flatListRef} data={components} renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={[styles.navItem, activeComponent === item.categoryName && styles.active]}
                onPress={() => actions.switchComponent(item.categoryName)}>
                <View style={styles.categoriesContainer}>
                  <IconSwitcher componentName={item.componentName} color={activeComponent === item.categoryName ? colors.white : colors.primary} iconName={item.iconName} iconsize={3.2} />
                  <Text style={activeComponent === item.categoryName ? styles.categoryName : { ...styles.categoryName, color: colors.primary }}>{item.categoryName}</Text>
                </View>
              </TouchableOpacity>
            )
          }} keyExtractor={item => item.categoryName} horizontal showsHorizontalScrollIndicator={false} />
        </View>
        <View style={styles.section}>
          {getContentMemoized(activeComponent, { ...props })}
        </View>
      </View>
    </View>
  );
};


export default HomeScreen;