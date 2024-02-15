import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { styles } from './styles'
import IconSwitcher from '../icons/IconSwitcher'
import { colors } from '../../../config/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MyContext from '../../../context/Context'

const FilterHeader = ({ handlefiltersToggleActions, children, value, customStyle }) => {

    return (
        <View style={{ borderWidth: 1 }}>
            <View style={styles.mainContainer}>
                <View style={styles.filterTitleContainer}>
                    <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
                    <Text style={styles.filterTitle}>Filters</Text>
                </View>
                <TouchableOpacity onPress={handlefiltersToggleActions}>
                    <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
                </TouchableOpacity>

            </View >
            {value ? <View style={customStyle?customStyle:styles.childrenContainer}>
                {children}
            </View> : null}

        </View>
    )
}

export default FilterHeader