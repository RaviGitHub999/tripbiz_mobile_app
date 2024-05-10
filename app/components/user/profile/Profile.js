import { View, Text, TouchableOpacity, Button, TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useState } from 'react'
import { styles } from './profileStyles'
import TripDetailsInput from '../../Trips/TripDetails/TripDetailsInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import IconSwitcher from '../../common/icons/IconSwitcher'
import { colors } from '../../../config/theme'
import MyContext from '../../../context/Context'
import * as DocumentPicker from 'react-native-document-picker';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale'
const Profile = () => {
  var { actions, userAccountDetails } = useContext(MyContext)
  var [edit, setEdit] = useState(true)
  // const [file, setFile] = useState({
  //   passport: "",
  //   aadharCard: ""
  // })
  var [userData, setUserData] = useState({
    firstName: userAccountDetails?.firstName,
    lastName: userAccountDetails?.lastName,
    mobileNumber: userAccountDetails?.mobileNumber,
    passportNumber: userAccountDetails?.passportNumber,
    // aadharCard: userAccountDetails?.aadharCard,
    // passport: userAccountDetails?.passport,
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

  // const handlePickFile = async (name) => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
      
  //     if (name === "passport") {
  //       setData("passport", res[0].uri)
  //       setFile({ ...file, passport: res[0].name })
  //     }
  //     else {
  //       setData("aadharCard", res[0].uri)
  //       setFile({ ...file, aadharCard: res[0].name })
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //     } else {
  //       console.log(err);
  //     }
  //   }
  // };
 const  updateData = async () => {
    var data = await actions.updateUserProfile(userAccountDetails.userid, userData)
    setUserData({
        firstName: data?.firstName,
        lastName: data?.lastName,
        mobileNumber: data?.mobileNumber,
        passportNumber: data?.passportNumber,
        // aadharCard: data?.aadharCard,
        // passport: data?.passport,
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
        <Text style={styles.title}>Profile</Text>
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