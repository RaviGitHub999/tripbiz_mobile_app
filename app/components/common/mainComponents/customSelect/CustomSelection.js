import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TouchableHighlight,
  } from 'react-native';
  import React, {useState} from 'react';
import IconSwitcher from '../../icons/IconSwitcher';
import { colors, fonts } from '../../../../config/theme';
import { responsiveHeight, responsiveWidth } from '../../../../utils/responsiveScale';
  const CustomSelection = ({placeHolder, value,setValue}) => {
    const [toggle, setToggle] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const expenseTypeData = [
      'Select Expense',
      'Meal',
      'Transport',
      'Miscellaneous',
    ];
    const handleToggle = () => {
      setToggle(!toggle);
    };
    const handleSetValue=(item)=>
      {
          setValue(item)
      }
    const handleSelect = (item,ind) => {
      setSelectedItemIndex(ind);
      handleToggle()
      handleSetValue(item)
    };
    
    const handleRenderData = ({item, index}) => {
      return (
        <TouchableHighlight
        style={[
          styles.item,
          selectedItemIndex === index && styles.itemHovered,
        ]}
        underlayColor={colors.whiteSmoke}
          onPress={() => handleSelect(item,index)}>
          <Text style={[styles.selectedItemTitle, selectedItemIndex === index && styles.activeSelectedItemTitle]}>{item}</Text>
        </TouchableHighlight>
      );
    };
    return (
      <>
        <Pressable style={styles.mainContainer} onPress={handleToggle}>
          <Text style={styles.title}>{value ?? placeHolder}</Text>
          <IconSwitcher
            componentName="Feather"
            iconName={toggle ? 'chevron-up' : 'chevron-down'}
            color={colors.primary}
            iconsize={2.5}
          />
        </Pressable>
        {toggle && (
          <FlatList
            data={expenseTypeData}
            renderItem={handleRenderData}
            style={styles.flatListContainer}
            nestedScrollEnabled
          />
        )}
      </>
    );
  };
  const styles = StyleSheet.create({
    mainContainer: 
    {
      backgroundColor: 'rgba(128, 128, 128, 0.5)',
      padding: responsiveHeight(1.5),
      borderRadius: responsiveHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: responsiveHeight(1.8),
      fontFamily: fonts.secondry,
      color: colors.primary,
      flex: 1,
    },
    flatListContainer: {
      borderWidth: responsiveHeight(0.12),
      borderColor: colors.primary,
      backgroundColor: colors.white,
      maxHeight: responsiveHeight(15.5),
    },
    item: {
      paddingVertical: responsiveHeight(0.8),
      paddingLeft: responsiveWidth(2),
    },
    itemHovered: {
      backgroundColor: colors.facebook,
    },
    selectedItemTitle:
    {
        fontSize: responsiveHeight(1.6),
        fontFamily: fonts.primary,
        color: colors.primary
  
    },
    activeSelectedItemTitle:
    {
        color: colors.white
    },
  });
  export default CustomSelection;
  