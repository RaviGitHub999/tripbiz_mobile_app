import { View, Text, StyleSheet, FlatList,TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import IconSwitcher from '../../icons/IconSwitcher';
import { colors, fonts } from '../../../../config/theme';
import {responsiveHeight, responsiveWidth } from '../../../../utils/responsiveScale';

const CustomSelect = ({  data, renderData, selectedItem, handledropDown, viewAll,CustomStyle,disable }) => {
    const sendingData = ({ item, index }) => renderData(item, index)
    return (
        <>
            <TouchableOpacity style={[styles.btnContainer,CustomStyle]} onPress={handledropDown} disabled={disable}>
                <Text style={styles.selectedText}>{ selectedItem }</Text>
                <IconSwitcher componentName='Ionicons' iconName={viewAll ? "chevron-up" : 'chevron-down'} color={colors.black} iconsize={3} />
            </TouchableOpacity>
            {
                viewAll &&
                <FlatList data={data} renderItem={sendingData} style={styles.flatListContainer} nestedScrollEnabled />
            }
        </>
    )
}
const styles = StyleSheet.create({
    btnContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        backgroundColor: colors.white,
        borderRadius: responsiveHeight(1.5),
        elevation: responsiveHeight(0.4)
    },
    selectedText:
    {
        fontSize: responsiveHeight(2),
        fontFamily: fonts.secondry,
        color: colors.lightGray
    },
    flatListContainer:
    {
        borderWidth: responsiveHeight(0.12),
        borderColor: colors.primary,
        backgroundColor: colors.white,
        maxHeight:responsiveHeight(15.5)
    }
})
export default CustomSelect