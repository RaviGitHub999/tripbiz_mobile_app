import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from 'react';
import {colors, fonts} from '../../../config/theme';
import {responsiveHeight} from '../../../utils/responsiveScale';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import MyContext from '../../../context/Context';
import PopUp from '../../common/popup/PopUp';
const ProfileHome = () => {
  var {userAccountDetails,actions} = useContext(MyContext);
  const [logOutStatus, setLogOutStatus] = useState(false);
  const {navigate} = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigate('Login');
      actions.setRes()
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const handleProfileNavigation = action => {
    switch (action) {
      case 'changePassword':
        navigate('ChangePassword');
        break;
      case 'rolesAndApproval':
        navigate('Role');
        break;
      case 'logout':
        setLogOutStatus(true)
        break;
      default:
        navigate('Profile');
        break;
    }
  };
  return (
    <React.Fragment>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require('./assets/UserProfile1.png')}
            style={styles.img}
          />
          <View style={styles.headerTitleContainer}>
            <Text
              style={
                styles.title
              }>{`Name :${userAccountDetails?.firstName} ${userAccountDetails?.lastName}`}</Text>
          </View>
        </View>
        <View style={styles.profileSettingsContainer}>
          <TouchableOpacity onPress={() => handleProfileNavigation()}>
            <Text style={styles.title}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleProfileNavigation('changePassword')}>
            <Text style={styles.title}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleProfileNavigation('rolesAndApproval')}>
            <Text style={styles.title}>Roles and Approval</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleProfileNavigation('logout')}>
            <Text style={styles.title}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <PopUp
        value={logOutStatus}
        handlePopUpClose={() => setLogOutStatus(false)}>
<Text style={[styles.title,{textAlign:'center'}]}>Are you sure you want to logout </Text>
<View style={styles.btnsContainer}>
  <TouchableOpacity style={styles.btn} onPress={handleLogout}><Text style={styles.btntitle}>Yes</Text></TouchableOpacity>
  <TouchableOpacity style={styles.btn} onPress={()=>setLogOutStatus(false)}><Text style={styles.btntitle}>Back</Text></TouchableOpacity>
</View>
        </PopUp>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: responsiveHeight(2),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(2),
  },
  headerTitleContainer: {
    flex: 1,
  },
  img: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
  },
  profileSettingsContainer: {
    marginTop: responsiveHeight(5),
    gap: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveHeight(2.5),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  btnsContainer:{
    flexDirection:'row',
    alignSelf:'center',
    width:"70%",
    justifyContent:'space-between',
    marginTop:responsiveHeight(2)
  },
  btn:{
    paddingVertical:responsiveHeight(1),
    paddingHorizontal:responsiveHeight(3),
    backgroundColor:colors.primary,
    width:"40%",
    alignItems:'center',
    justifyContent:'center',
    borderRadius:responsiveHeight(1)
  },
  btntitle:{
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.white, 
  }
});
export default ProfileHome;
