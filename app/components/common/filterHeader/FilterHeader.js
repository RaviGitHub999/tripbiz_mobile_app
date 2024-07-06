import { View, Text ,TouchableOpacity, ScrollView} from 'react-native'
import React, { useContext } from 'react'
import { styles } from './styles'
import IconSwitcher from '../icons/IconSwitcher'
import { colors } from '../../../config/theme'
import { responsiveHeight } from '../../../utils/responsiveScale'
const FilterHeader = ({ handlefiltersToggleActions,removeFilters, children, value, customStyle,filtersCount,handlefilters}) => {
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
              {filtersCount > 0 ?<TouchableOpacity style={styles.clearFilterContainer} onPress={() => removeFilters()}>
                    <Text style={styles.clearFilterTitle}>Clear Filters</Text>
                </TouchableOpacity>:null}
               {
                value?
                <TouchableOpacity style={styles.applyFiltersBtn} onPress={handlefilters}>
                    <Text style={styles.applyFiltersBtnText} >Apply</Text>
                </TouchableOpacity>:null
               }
            </View  >
            {value ? <View style={customStyle?customStyle:styles.childrenContainer}>
                <ScrollView contentContainerStyle={{paddingBottom:responsiveHeight(20)}} showsVerticalScrollIndicator={false}>
                   <View style={{flex:1}}>
                   {children}
                   </View>
                </ScrollView>
            </View> : null}
        </View>
    )
}
export default React.memo( FilterHeader)