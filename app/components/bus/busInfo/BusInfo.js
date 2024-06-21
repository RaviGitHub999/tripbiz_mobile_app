import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors } from '../../../config/theme'
import { styles } from './BusInfoStyles'
import Rishi from '../../wallet/Rishi'
import Select from '../../common/select/Select'
import CustomSelection from '../../common/mainComponents/customSelect/CustomSelection'
import MyContext from '../../../context/Context'
import ProgressBar from '../../common/progressBar/ProgressBar'

const BusInfo = () => {
   const[boardingPoint,setBoardingPoint]=useState(null)
   const[droppingPoint,setDroppingPoint]=useState(null)
   const{bookingBus,fetchingBusSeat,actions,}=useContext(MyContext)
   const handleDropping=(val)=>
    {
        setDroppingPoint(val)
    }

    const  handleBoarding=(val)=>
        {
            setBoardingPoint(val)
        }
  return (
    <>
    {
       fetchingBusSeat?
       <View style={styles.progressBarContainer}>
   <ProgressBar/>
       </View> :
       <View style={styles.mainContainer}>
       <TouchableOpacity style={styles.backIconContainer}>
         <IconSwitcher componentName='AntDesign' iconName='arrowleft' color={colors.primary} iconsize={3.2}/>
       </TouchableOpacity>
       <View>
         <Text>Select Pickup and Drop Points</Text>
         <View>
             <View>
                 <Text>Select Boarding Point</Text>
                 <CustomSelection placeHolder={"Select Boarding Point"} setValue={handleBoarding} value={boardingPoint}/>
                
             </View>
 
             <View>
                 <Text>Select Boarding Point</Text>
                 <CustomSelection placeHolder={"Select Dropping Point"} setValue={handleDropping} value={droppingPoint}/>
                
             </View>
         </View>
       </View>
     </View>
    }
    </>
    
  )
}

export default BusInfo