import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext } from 'react'
import MyContext from '../../../context/Context'
import { styles } from './CabResListStyles'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors } from '../../../config/theme'
import { useNavigation } from '@react-navigation/native'
import CabCard from './CabCard'

const CabResList = () => {
    const { goBack } = useNavigation()
    const { cabResList, cabNights, cabCity, cabStartDate, cabEndDate, selectedTime, cabType, cabCount } = useContext(MyContext)

    const handleEditButton = () => {
        console.log("first")
        goBack()
    }
const handleRenderItems=({item})=>
    {
        return <CabCard item={item}/>
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerMainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{`${cabCity}`}</Text>
                    <TouchableOpacity style={styles.editButtonContainer} onPress={handleEditButton}>
                        <IconSwitcher componentName='MaterialIcons' iconName='edit' color={colors.white} iconsize={2.2} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>
                    {`${cabStartDate} ${cabEndDate ? '-' : ''} ${cabEndDate ? cabEndDate : ''} | Time: ${selectedTime ? selectedTime : ''} | ${cabType} | ${cabCount} ${cabCount > 1 ? "Cabs" : "Cab"
                        }`}
                </Text>
            </View>
            <FlatList data={cabResList} renderItem={handleRenderItems}/>
        </View>
    )
}

export default CabResList