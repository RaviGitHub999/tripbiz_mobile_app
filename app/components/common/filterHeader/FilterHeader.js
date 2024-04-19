import { View, Text ,TouchableOpacity, ScrollView} from 'react-native'
import React, { useContext } from 'react'
import { styles } from './styles'
import IconSwitcher from '../icons/IconSwitcher'
import { colors } from '../../../config/theme'
const FilterHeader = ({ handlefiltersToggleActions, children, value, customStyle,filtersCount,handlefilters}) => {
    return (
      !value?  <TouchableOpacity style={styles.container} onPress={handlefiltersToggleActions}>
            <View style={styles.mainContainer}>
                <View style={styles.filterTitleContainer}>
                    <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
                    <Text style={styles.filterTitle}>Filters</Text>
                    {filtersCount > 0 ? <View style={styles.filtersCountContainer}>
            <Text>{filtersCount}</Text>

          </View> : null}
                </View>
            {!value? 
            <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
               :null}
               {
                value?
                <TouchableOpacity style={styles.applyFiltersBtn} onPress={handlefilters}>
                    <Text style={styles.applyFiltersBtnText} >Appy</Text>
                </TouchableOpacity>:null
               }
            </View  >
            {value ? <ScrollView style={customStyle?customStyle:styles.childrenContainer}>
                {children}
            </ScrollView> : null}
        </TouchableOpacity>
        :
        <View style={styles.container} onPress={handlefiltersToggleActions}>
            <View style={styles.mainContainer}>
                <View style={styles.filterTitleContainer}>
                    <IconSwitcher componentName='FontAwesome5' iconName='filter' color={colors.black} iconsize={3} />
                    <Text style={styles.filterTitle}>Filters</Text>
                    {filtersCount > 0 ? <View style={styles.filtersCountContainer}>
            <Text>{filtersCount}</Text>

          </View> : null}
                </View>
            {!value? 
            <IconSwitcher componentName='Ionicons' iconName='chevron-down' color={colors.black} iconsize={3.5} />
               :null}
               {
                value?
                <TouchableOpacity style={styles.applyFiltersBtn} onPress={handlefilters}>
                    <Text style={styles.applyFiltersBtnText} >Apply</Text>
                </TouchableOpacity>:null
               }
            </View  >
            {value ? <View style={customStyle?customStyle:styles.childrenContainer}>
                <ScrollView>
                    {children}
                </ScrollView>
            </View> : null}
        </View>
    )
}
export default React.memo( FilterHeader)