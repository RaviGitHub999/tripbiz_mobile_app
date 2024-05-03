import { View, Text, KeyboardAvoidingView } from 'react-native'
import React, { useContext } from 'react'
import MyContext from '../../../context/Context'
import TripDetailsInput from './TripDetailsInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from './styles'
import { responsiveHeight } from '../../../utils/responsiveScale'
import SearchInputs from '../../common/searchInputs/SearchInputs'
const InputField = ({ flight, userDetails, s, travIndex, tripData, travellerDetails, handleInputChange, isEdit, travellerType, isInternational }) => {
  const { userAccountDetails } = useContext(MyContext)
  return (

      <View style={{ gap: 10 ,marginBottom:responsiveHeight(2)}}>
        <Text style={[styles.subTitle,{marginTop:responsiveHeight(1)}]}>{travellerType} {travIndex + 1}</Text>
        <TripDetailsInput placeholderName={'First name'} stateValue={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.firstName : (
          userDetails[s]?.firstName ?
            userDetails[s].firstName :
            ((travellerDetails[flight.id] ? travellerDetails[flight.id][s]?.firstName : '')))}
          isEditable={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.firstName : isEdit[flight.id]}
          handleonChange={(e) =>
            handleInputChange(s, 'firstName', e, travellerType)} />

        <TripDetailsInput placeholderName={'Last name'} stateValue={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.lastName : (
          userDetails[s]?.lastName ?
            userDetails[s].lastName :
            ((travellerDetails[flight.id] ? travellerDetails[flight.id][s]?.lastName : '')))}
          isEditable={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.lastName : isEdit[flight.id]}
          handleonChange={(e) =>
            handleInputChange(s, 'lastName', e, travellerType)} />

        {
          s === 0 ?
            <>
              <TripDetailsInput placeholderName={'Email'} stateValue={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s].email : (
                userDetails[0]?.email ?
                  userDetails[0].email :
                  ((travellerDetails[flight.id] ? travellerDetails[flight.id][s]?.email : '')))}
                isEditable={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s].email : isEdit[flight.id]}
                handleonChange={(e) =>
                  handleInputChange(s, 'email', e, travellerType)} />

              <TripDetailsInput placeholderName={'Mobile Number'} stateValue={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s].mobileNumber : (
                userDetails[0]?.mobileNumber ?
                  userDetails[0].mobileNumber :
                  ((travellerDetails[flight.id] ? travellerDetails[flight.id][s]?.mobileNumber : '')))}
                isEditable={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s].mobileNumber : isEdit[flight.id]}
                handleonChange={(e) =>
                  handleInputChange(s, 'mobileNumber', e, travellerType)} />
            </> : null
        }
        {
          isInternational &&
          <>
            <TripDetailsInput placeholderName={'Passport Number'} stateValue={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.passportNumber : (
              userDetails[s]?.passportNumber ?
                userDetails[s].passportNumber :
                ((travellerDetails[flight.id] ? travellerDetails[flight.id][s]?.passportNumber : '')))}
              isEditable={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.passportNumber : isEdit[flight.id]}
              handleonChange={(e) =>
                handleInputChange(s, 'passportNumber', e, travellerType)} />

            <TripDetailsInput placeholderName={'Passport Issue Country'} stateValue={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.passportCountry : (
              userDetails[s]?.passportCountry ?
                userDetails[s].passportCountry :
                ((travellerDetails[flight.id] ? travellerDetails[flight.id][s]?.passportCountry : '')))}
              isEditable={(tripData?.data?.travellerDetails && tripData?.data?.travellerDetails[flight.id]) ? tripData?.data?.travellerDetails[flight.id][s]?.passportCountry : isEdit[flight.id]}
              handleonChange={(e) =>
                handleInputChange(s, 'passportCountry', e, travellerType)} />
          </>
        }
        {
          s === 0 && travellerType === "Adult" ?
          <View style={{alignItems:'center'}}>
            <Text style={styles.title}>Company Details</Text>
            <Text style={styles.subTitle}>Company Name:{`${userAccountDetails?.companyName}`}</Text>
            <Text style={styles.subTitle}>Company GST No:{`${userAccountDetails?.GSTNo}`}</Text>
            <Text style={styles.subTitle}>Company PAN No:{`${userAccountDetails?.PANNo}`}</Text>
          </View>
          :null
        }
      </View>
  )
}

export default InputField