import { View, Text, TouchableOpacity, Button, TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useState } from 'react'
import { styles } from './profileStyles'
import TripDetailsInput from '../../Trips/TripDetails/TripDetailsInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors, fonts } from '../../../config/theme'
import MyContext from '../../../context/Context'
import { useNavigation } from '@react-navigation/native'

const Profile = () => {
  var { actions, userAccountDetails } = useContext(MyContext)
  var [edit, setEdit] = useState(true)
  const{goBack}=useNavigation()
  var [userData, setUserData] = useState({
    firstName: userAccountDetails?.firstName,
    lastName: userAccountDetails?.lastName,
    mobileNumber: userAccountDetails?.mobileNumber,
    passportNumber: userAccountDetails?.passportNumber,
    GSTNo: userAccountDetails?.GSTNo,
    PANNo: userAccountDetails?.PANNo,
    companyName: userAccountDetails?.companyName,
  });
  const setData = (name, e) => {
    setUserData({
      ...userData,
      [name]: e,
    });
  }

 const  updateData = async () => {
    var data = await actions.updateUserProfile(userAccountDetails.userid, userData)
    setUserData({
        firstName: data?.firstName,
        lastName: data?.lastName,
        mobileNumber: data?.mobileNumber,
        passportNumber: data?.passportNumber,
        GSTNo: data?.GSTNo,
        PANNo: data?.PANNo,
        companyName: data?.companyName,
    })
    setEdit(!edit)
}
  return (
  
     <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.mainContainer}>
        <TouchableOpacity style={styles.back} onPress={goBack}>
          <IconSwitcher componentName='AntDesign' iconName='arrowleft'  iconsize={3.5}/>
        </TouchableOpacity>
       
       <View style={styles.headerContainer}>
       <Text style={styles.title}>Profile</Text>
       <View style={userAccountDetails.accountType === "PrePaid"?styles.profileType:[styles.profileType,{backgroundColor:"#9c27b0"}]}>
        <Text style={styles.btnTitle}>{userAccountDetails.accountType}</Text>
       </View>
       </View>
       <View style={styles.approvalTypeContainer}>
          <Text style={styles.profiledetailsTitle}>Approval Type : </Text>
          <Text style={[styles.profiledetailsTitle,{fontFamily:fonts.secondry}]}>{`${userAccountDetails.approvalType} `}<Text style={styles.profiledetailssubTitle}>for submission</Text></Text>
        </View>
        <TouchableOpacity style={styles.updateBtn} onPress={() => {
          setEdit(!edit)
        }}>
          <Text style={styles.profiledetailsTitle}>Update</Text>
          <IconSwitcher componentName='FontAwesome5' iconName='edit' color={colors.primary} iconsize={2} />
        </TouchableOpacity>
        <View style={styles.profiledetailsMainContainer}>
          <Text style={styles.profiledetailsTitle}>Login Details</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Email:</Text>
            <Text style={styles.profiledetailssubTitle}>{userAccountDetails?.email}</Text>
          </View>
        </View>

        <View style={styles.profiledetailsMainContainer}>
          <Text style={styles.profiledetailsTitle}>Personal Info</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>First Name :</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={'Enter your First Name'} stateValue={userData.firstName} handleonChange={(e) => setData("firstName", e)} isEditable={edit} />
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Last Name :</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={"Enter your last name"} stateValue={userData.lastName} handleonChange={(e) => setData("lastName", e)} isEditable={edit} />
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Mobile :</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={"Enter your mobile number"} stateValue={userData.mobileNumber} handleonChange={(e) => setData("mobileNumber", e)} isEditable={edit} />
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Passport Number :</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={"Enter your passport number"} stateValue={userData.passportNumber} handleonChange={(e) => setData("passportNumber", e)} isEditable={edit} />
            </View>
          </View>
          {/* <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Passport :</Text>
            <View style={styles.inputBoxContainer}>
              {!edit ? <View style={styles.passwordBtnContainer}>
                <TouchableOpacity style={styles.chooseFileBtn} onPress={() => handlePickFile("passport")} disabled={edit}>
                  <Text style={styles.chooseFileBtnText}>Choose File</Text>
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode='middle' style={{ flex: 1 }}>{file.passport ? file.passport : `No file chosen`}</Text>
              </View> : file.passport ? <Text style={styles.fileName}>{file.passport}</Text> : <Text style={styles.fileName}>{userData.passport.slice(120, userAccountDetails?.passport?.indexOf('?'))}</Text>}
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Aadhar Card</Text>
            <View style={styles.inputBoxContainer}>
              {!edit ? <View style={styles.passwordBtnContainer}>
                <TouchableOpacity style={styles.chooseFileBtn} onPress={() => handlePickFile("aadharCard")} disabled={edit}>
                  <Text style={styles.chooseFileBtnText}>Choose File</Text>
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode='middle' style={{ flex: 1 }}>{file.aadharCard ? file.aadharCard : `No file chosen`}</Text>
              </View> : file.aadharCard ? <Text style={styles.fileName}>{file.aadharCard}</Text> : <Text style={styles.fileName}>{userData.aadharCard.slice(118, userAccountDetails?.aadharCard?.indexOf('?'))}</Text>}
            </View>
          </View> */}
        </View>

        <View style={styles.profiledetailsMainContainer}>
          <Text style={styles.profiledetailsTitle}>Company Info</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Company GST No :</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={"Enter your company GST no"} stateValue={userData.GSTNo} handleonChange={(e) => setData("GSTNo", e)} isEditable={edit} />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>{`Company PAN Number  :`}</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={"Enter your company PAN number"} stateValue={userData.PANNo} handleonChange={(e) => setData("PANNo", e)} isEditable={edit} />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.profiledetailssubTitle}>Company Name :</Text>
            <View style={styles.inputBoxContainer}>
              <TripDetailsInput placeholderName={"Enter your company name"} stateValue={userData.companyName} handleonChange={(e) => setData("companyName", e)} isEditable={edit} />
            </View>
          </View>
        </View>

        {!edit ? <View style={styles.updateAndCancelBtnContainer}>
          <TouchableOpacity style={styles.btn} onPress={updateData}>
            <Text style={styles.btnTitle}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {
            setEdit(!edit)
          }}>
            <Text style={styles.btnTitle}>Cancel</Text>
          </TouchableOpacity>
        </View> : null}
      </View>
    </KeyboardAwareScrollView>
 
  )
}

export default Profile