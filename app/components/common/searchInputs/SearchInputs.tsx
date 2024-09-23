import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState,useMemo, useContext } from 'react'
import IconSwitcher from '../icons/IconSwitcher'
import { styles } from './styles'
import { responsiveHeight } from '../../../utils/responsiveScale'
import { colors } from '../../../config/theme'
import MyContext from '../../../context/Context'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
const dropDownList = ["Economy", "Premium Economy", "Business", "First", "Any cabin class"]
interface IProps {
  btn: boolean,
  dropDown: boolean,
  placeholder?: string,
  customStyles?:any,
  customFontStyles?:any,
  handleDatePicker?:()=>void,
  handleChangeText?:((event:string,name:string)=>void),
  stateName?:string|any,
  Value?:string,
  selectedObj?: {
    name: string;
    iataCode: string;
    address: { cityName: string; countryName: string }
},
selected?:boolean
}
interface DropDownState {
  dropDownArrow?: boolean,
  dropDownHandle?: boolean
}

const SearchInputs: React.FC<IProps> = ({ btn, dropDown,selected, placeholder,customStyles,handleDatePicker,handleChangeText,  stateName,Value,selectedObj,customFontStyles}) => {
  const {actions,classes,departure,returnDate,originSelectedAirport,oriRes} = useContext<any>(MyContext)
  const memoizedClasses = useMemo(() => classes, [classes]);
  const memoizedDeparture = useMemo(() => departure, [departure]);
  const memoizedReturnDate = useMemo(() => returnDate, [returnDate]);
  const memoizedOriginSelectedAirport = useMemo(() => originSelectedAirport, [originSelectedAirport]);
  const [active, setActive] = useState(false)
  const [activeBtn, setActiveBtn] = useState(false)
  const[btnOrTextInput,setBtnOrTextInput]=useState(false)
  const [dropDownState, setDropDownState] = useState<DropDownState>({ dropDownArrow: false, dropDownHandle: false })
  // console.log(selectedObj,"lklk")
  // console.log(selected,"lklk")
  const handleFocus = (name: string) => {
    if (name === "input") {
      setActive(true)
    }
    else {
      setActiveBtn(true)
      setDropDownState({ dropDownArrow: !dropDownState.dropDownArrow, dropDownHandle: !dropDownState.dropDownHandle })
    }
  }
  const handleBlur = () => {
    setActive(false);
    setBtnOrTextInput(false)
  }
  const handlePressOut = () => {
    setTimeout(() => {
      setActiveBtn(false);
    }, 500);
  };
  const handleDropDown = (ele: string) => {
    actions.handleClass(ele)
    setTimeout(() => {
      setDropDownState({ dropDownHandle: !dropDownState.dropDownHandle })
    }, 500);
  }
  const handleDate=(name:string)=>
{
  switch (name) {
    case "departure":
  return memoizedDeparture
  case "return":
    return memoizedReturnDate
  }
}
// :activeBtn?`${handleDate(datePick)}`
// console.log(originSelectedAirport)
  return (
    <View style={{flex:1}}>
      {btn ?
        <>
          <View style={[styles.btnMainContainer, activeBtn && { borderColor:colors.primary, borderWidth: responsiveHeight(0.3) },customStyles]}>
           { !dropDown?<TouchableWithoutFeedback onPressIn={() => handleFocus("btn")}
              onPressOut={handlePressOut} style={styles.btn} onPress={handleDatePicker}>
              <Text style={[styles.btnText,customFontStyles]}>{dropDown ? classes: placeholder}</Text>
              {dropDown && (dropDownState.dropDownArrow ? <IconSwitcher componentName='AntDesign' iconName='caretup' iconsize={2.2} /> : <IconSwitcher componentName='AntDesign' iconName='caretdown' iconsize={2.2} />)}
            </TouchableWithoutFeedback>

:
<View style={styles.classIDBtn}>
<Text style={[styles.btnText,customFontStyles]}>{dropDown ? classes: placeholder}</Text>
<TouchableWithoutFeedback onPressIn={() => handleFocus("btn")}
              onPressOut={handlePressOut} >
{dropDown && (dropDownState.dropDownArrow ? <IconSwitcher componentName='AntDesign' iconName='caretup' iconsize={2.2} /> : <IconSwitcher componentName='AntDesign' iconName='caretdown' iconsize={2.2} />)}
</TouchableWithoutFeedback>
             </View>}
          </View>
          {
            dropDown && dropDownState.dropDownHandle && <View style={styles.dropDownListContainer}>
              {
                dropDownList.map((ele) => {
                  return (
                    <TouchableWithoutFeedback key={ele} style={[styles.eachListItem, classes === ele && { backgroundColor: colors.facebook }]} onPress={() => handleDropDown(ele)}>
                      <Text style={[styles.eachListText,classes === ele &&{color:colors.white}]}>{ele}</Text>
                    </TouchableWithoutFeedback>
                  )
                })
              }
            </View>
          }
        </>
        :
        (
          btnOrTextInput?<View style={[styles.textInputContainer, active && { borderColor: colors.primary, borderWidth: responsiveHeight(0.3) }]}>
          <TextInput style={styles.textInputFont} placeholder={placeholder} onFocus={() => handleFocus("input")} onBlur={handleBlur} onChangeText={(e)=>handleChangeText&&handleChangeText(e,stateName)} value={Value} autoFocus={true} placeholderTextColor="#969696"/>
        </View>:<TouchableWithoutFeedback  onPress={()=>setBtnOrTextInput(true)} style={styles.btnorTextInput}>
            
              {!selected?<Text style={styles.textInputFont}>{placeholder}</Text>:
              <View style={styles.selectedAirportContainer}>
                <Text style={styles.title}>{selectedObj?.address.cityName}</Text>
                <Text style={styles.subTitle}>{selectedObj?.iataCode},{selectedObj?.name}</Text>
                </View>}
            
          </TouchableWithoutFeedback>
        )}
    </View>
  )
}

export default SearchInputs





