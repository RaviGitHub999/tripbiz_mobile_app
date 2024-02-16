import { View, Text ,TouchableOpacity} from 'react-native'
import React, { useContext } from 'react'
import { styles } from './styles'
import IconSwitcher from '../icons/IconSwitcher'
import { colors } from '../../../config/theme'
const FilterHeader = ({ handlefiltersToggleActions, children, value, customStyle,filtersCount}) => {
    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.filterTitleContainer}>
                    <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
                    <Text style={styles.filterTitle}>Filters</Text>
                    {filtersCount > 0 ? <View style={styles.filtersCountContainer}>
            <Text>{filtersCount}</Text>
          </View> : null}
                </View>
            {!value? <TouchableOpacity onPress={handlefiltersToggleActions}>
                    <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
                </TouchableOpacity>:null}
            </View  >
            {value ? <View style={customStyle?customStyle:styles.childrenContainer}>
                {children}
            </View> : null}
        </View>
    )
}
export default FilterHeader