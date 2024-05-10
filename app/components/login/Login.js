import { View, Text, BackHandler, StatusBar, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Button,ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CustomInput from '../common/customInput/CustomInput';
import CustomButton from '../common/customButton/CustomButton';
import { styles } from './styles';
import IconSwitcher from '../common/icons/IconSwitcher';
import { colors } from '../../config/theme';
import en from "./locales/en.json"
import auth from '@react-native-firebase/auth';
import MyContext from '../../context/Context';
const Login = ({navigation:{navigate,isFocused}}) => {
  const [isLoading, setIsLoading] = useState(false);
  const{loading,email,password,actions}=useContext(MyContext)
  // const handleNavigation= async()=>
  // {
  //   actions(loginAction({navigate}))
  // }
  const handleChangeText=(event,name)=>
  {
actions.handleOnChangeText({event,name})
  }
  const handleLogin = async () => {
    setIsLoading(true)
    try {
      if(email!==""&&password!=="")
        {
    const result = await actions.loginAction(email,password);
      setIsLoading(false)
      Alert.alert(
        'Login successful!',
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              navigate('CustomerBottomNavigation'); // Navigate to the other screen
            },
          },
        ],
        { cancelable: false }
      );
      
        }
    } catch (error) {
      setIsLoading(false)
      Alert.alert('Login failed', error.message);
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isFocused]);
  return (
   <KeyboardAvoidingView style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollContainer}>
      {isLoading&&<View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.facebook} />
        </View>}
     <View style={styles.mainContainer}>
      <StatusBar hidden={false} />
      <Text style={styles.title}>{(en.login)}</Text>
      <View style={styles.inputContainer}>
        <CustomInput iconComponentName={en.iconComponentName1} name={en.iconName1} placeHolder={en.placeHolder1} title={en.title1} iconsize={3.6} handleChange={handleChangeText} stateName='email' value={email}/>
        <CustomInput iconComponentName={en.iconComponentName2} name={en.iconName2} placeHolder={en.placeHolder2} title={en.title2} iconsize={3.6} handleChange={handleChangeText} stateName='password' value={password}/></View>
      <Text style={styles.forgotPassword}>{(en.forgotpassword)}</Text>
      <View style={styles.btnContainer}>
      {/* handleSubmit={handleNavigation} */}
        <CustomButton title={(en.login)} handleSubmit={handleLogin}/>
      </View>
      <View style={styles.loginMethodsContainer}>
        <Text style={styles.loginmethodsTitle}>{(en.loginMethosTitle)}</Text>
        <View style={styles.loginIconsMainContainer}>
          <View style={styles.iconContainer1}>
            <IconSwitcher componentName={en.iconComponentName3} iconName={en.iconName3} color={colors.white} iconsize={5.5} />
          </View>
          <View style={styles.iconContainer2}>
            <IconSwitcher componentName={en.iconComponentName4} iconName={en.iconName4} color={colors.white} iconsize={3.2} />
          </View>
        </View>
        {
          <View style={styles.loginPageSwitchContainer}>
          <Text style={styles.loginPageSwitch}>{(en.notamember)}</Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>{en.signUpLink}</Text>
          </TouchableOpacity>
        </View>
        }
      </View>
    </View>
     </ScrollView>
   </KeyboardAvoidingView>
   
  )
}
export default Login