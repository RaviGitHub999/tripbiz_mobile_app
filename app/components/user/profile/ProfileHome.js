import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { colors, fonts } from '../../../config/theme'
import { responsiveHeight } from '../../../utils/responsiveScale'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth';
import MyContext from '../../../context/Context'
const ProfileHome = () => {
  var {userAccountDetails } = useContext(MyContext)
const {navigate}=useNavigation()

const handleLogout = async () => {
  try {
      await auth().signOut();
      navigate("Login");
  } catch (error) {
      console.error('Error logging out:', error);
  }
}
const handleProfileNavigation = (action) => {
  switch(action) {
      case "changePassword":
          navigate("ChangePassword");
          break;
      case "rolesAndApproval":
          navigate("Role");
          break;
      case "logout":
        handleLogout()
          break;
      default:
          navigate("Profile");
          break;
  }
}
  return (
    <View style={styles.mainContainer}>
       <View style={styles.headerContainer}>
       <Image source={require("./assets/UserProfile1.png")} style={styles.img}/>
      <View style={styles.headerTitleContainer}><Text style={styles.title}>{`Name :${userAccountDetails?.firstName} ${userAccountDetails?.lastName}`}</Text></View>
       </View>
       <View style={styles.profileSettingsContainer}>
        <TouchableOpacity onPress={()=>handleProfileNavigation()}>
            <Text style={styles.title}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleProfileNavigation("changePassword")}>
            <Text style={styles.title}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleProfileNavigation("rolesAndApproval")}>
            <Text style={styles.title}>Roles and Approval</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleProfileNavigation("logout")}>
            <Text style={styles.title}>Logout</Text>
        </TouchableOpacity>
       </View>
      
    </View>
  )
}
const styles=StyleSheet.create(
    {
       mainContainer:
       {
        flex:1,
        // alignItems:'center',
        // justifyContent:'center',
        padding:responsiveHeight(2)
       } ,
      //  card:
      //  { 
      //  backgroundColor:colors.white,
      //  elevation:5,
      //  height:responsiveHeight(35),
      //  borderRadius:responsiveHeight(2),
      //  padding:responsiveHeight(2),
      //  alignItems:'center',
      //  gap:responsiveHeight(5),
      //  width:responsiveHeight(30),
      //  justifyContent:"center"
      //  },
      headerContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:responsiveHeight(2)
      },
      headerTitleContainer:
      {
        flex:1
      },
       img:
       {
        height:responsiveHeight(9),
        width:responsiveHeight(9)
       },
       profileSettingsContainer:
       {
        marginTop:responsiveHeight(5),
        gap:responsiveHeight(2)
       },
       title:
       {
        fontSize:responsiveHeight(2.5),
        fontFamily:fonts.primary,
        color:colors.primary
       }
    }
)
export default ProfileHome