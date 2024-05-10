import { View, Text, TouchableOpacity, Keyboard, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { styles } from './ChangePasswordStyles'
import { TextInput } from 'react-native-gesture-handler'
import { responsiveHeight } from '../../../utils/responsiveScale'
import { TouchableWithoutFeedback } from 'react-native'
import ChangePasswordInput from './ChangePasswordInput'
import MyContext from '../../../context/Context'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'
const ChangePassword = () => {
  const { actions, userAccountDetails, changePasswordError } = useContext(MyContext)
  const [oldPassword, setOldPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [errors, setErrors] = useState({
    oldpassword: '',
    newpassword: '',
    confirmpassword: '',
});
const [confirmError, setConfirmError] = useState('')
const {navigate}=useNavigation()
const validateInput = (name, value) => {
  if (name === 'oldpassword') {
    setErrors({
      ...errors,
      oldpassword: value.trim() === '' ? 'Old password is required' : '',
    });
  } else if (name === 'newpassword') {
    const confirmError = value.trim() !== '' && value.trim() !== newPassword ? 'Passwords do not match' : '';
    setErrors({
      ...errors,
      newpassword: value.trim() === '' ? 'New password is required' : '',
      confirmpassword: confirmError,
    });
  } else if (name === 'confirmpassword') {
    const confirmError = value.trim() !== '' && value.trim() !== newPassword ? 'Passwords do not match' : '';
    setErrors({
      ...errors,
      confirmpassword: value.trim() === '' ? 'Confirm password is required' : confirmError,
    });
  }
};



const handleLogout = async () => {
  try {
      await auth().signOut();
      navigate("Login");
  } catch (error) {
      console.error('Error logging out:', error);
  }
}
// var handleSubmit = async () => {
  

 
//   if (oldPassword===""||confirmPassword===""||newPassword==="" ) {
//     Alert.alert(
//       'Error',
//       'Please fill in all fields correctly.',
//       [{ text: 'OK' }]
//     );

// if(oldPassword==="")
//   {
//     setErrors({...errors,oldpassword:"Old password is required"})
//   }
//   else if(confirmPassword==="")
//     {
//       setErrors({...errors,confirmpassword:"Confirm password is required "}) 
//     }

//     else if(newPassword==="")
//       {
//         setErrors({...errors,confirmpassword:"New password is required "}) 
//       }
//     return; // Prevent further execution
//   }
//   console.log("ravi")
//   // setErrors({
//   //     oldpassword: '',
//   //     newpassword: '',
//   //     confirmpassword: '',
//   // });
//   // if (newPassword !== confirmPassword) {
//   //     setConfirmError("Passwords does not match")
//   //     return;
//   // }
//   // await actions.changeUserPassword( oldPassword, newPassword)
//   // await handleLogout();
// }

const handleSubmit = async () => {
  let errors = {};

  if (oldPassword === "") {
    errors = { ...errors, oldpassword: "Old password is required" };
  }
  if (newPassword === "") {
    errors = { ...errors, newpassword: "New password is required" };
  }
  if (confirmPassword === "") {
    errors = { ...errors, confirmpassword: "Confirm password is required" };
  }

  if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
    Alert.alert(
      'Error',
      'Please fill in all fields correctly.',
      [{ text: 'OK' }]
    );

    setErrors(errors);
    return; 
  }

  if (newPassword !== confirmPassword) {
    Alert.alert(
      'Error',
      'New password and Confirm password do not match.',
      [{ text: 'OK' }]
    );
    return; 
  }

 const success=await actions.changeUserPassword( oldPassword, newPassword)
 if(success)
  {
    await handleLogout();
  }
  else{
setConfirmPassword("")
setNewPassword("")
  }
};
  return (
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <View style={styles.mainContainer}>
      <Text style={styles.maintitle}>ChangePassword</Text>
      <View style={styles.inputContainer} >
        <Text style={styles.subTitle}>Old Password</Text>
        <ChangePasswordInput placeholderName={"Enter old password"}  handleBlur={(e)=>validateInput("oldpassword",e)} handleonChange={(e)=>{validateInput("oldpassword",e),setOldPassword(e)}} stateValue={oldPassword}/>
       {errors.oldpassword&& <Text style={styles.errorTitle}>{errors.oldpassword}</Text>}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.subTitle}>New Password</Text>
        <ChangePasswordInput placeholderName={"Enter new password"} handleBlur={(e)=>validateInput("newpassword",e)} handleonChange={(e)=>{validateInput("newpassword",e),setNewPassword(e)}} stateValue={newPassword}/>
        {errors.newpassword&&<Text style={styles.errorTitle}>{errors.newpassword}</Text>}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.subTitle}>Confirm new Password</Text>
        <ChangePasswordInput placeholderName={"Confirm new password"} handleBlur={(e)=>validateInput("confirmpassword",e)} handleonChange={(e)=>{validateInput("confirmpassword",e),setConfirmPassword(e)}} stateValue={confirmPassword} secure={true}/>
     { errors.confirmpassword &&<Text style={styles.errorTitle}>{errors.confirmpassword}</Text>}
      </View>
      <Text style={styles.errorTitle}>{confirmError}</Text>
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnTitle}>Change Password</Text>
      </TouchableOpacity>
    </View>
   </TouchableWithoutFeedback>
  )
}

export default ChangePassword