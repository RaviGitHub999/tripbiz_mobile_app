// import { View, Text, BackHandler, StatusBar, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Button,ActivityIndicator } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import CustomInput from '../common/customInput/CustomInput';
// import CustomButton from '../common/customButton/CustomButton';
// import { styles } from './styles';
// import IconSwitcher from '../common/icons/IconSwitcher';
// import { colors } from '../../config/theme';
// import en from "./locales/en.json"
// import auth from '@react-native-firebase/auth';
// import MyContext from '../../context/Context';
// const Login = ({navigation:{navigate,isFocused}}) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const{loading,email,password,actions}=useContext(MyContext)
//   // const handleNavigation= async()=>
//   // {
//   //   actions(loginAction({navigate}))
//   // }
//   const handleChangeText=(event,name)=>
//   {
// actions.handleOnChangeText({event,name})
//   }
//   const handleLogin = async () => {

//     try {     
//       if(email!==""&&password!=="")
//         {
//           setIsLoading(true)
//     const result = await actions.loginAction(email,password);
//       setIsLoading(false)
//       Alert.alert(
//         'Login successful!',
//         '',
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               navigate('BottomNavigation'); // Navigate to the other screen
//             },
//           },
//         ],
//         { cancelable: false }
//       );

//         }
//         else{
//           Alert.alert('Input Fields Empty');
//         }
//     } catch (error) {
//       setIsLoading(false)
//       Alert.alert('Login failed', error.message);
//     }
//   };
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       if (isFocused()) {
//         BackHandler.exitApp();
//         return true;
//       }
//       return false;
//     });

//     return () => backHandler.remove();
//   }, [isFocused]);
//   return (
//    <KeyboardAvoidingView style={styles.container} behavior='padding'>
//      <ScrollView contentContainerStyle={styles.scrollContainer}>
//       {isLoading&&<View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color={colors.facebook} />
//         </View>}
//      <View style={styles.mainContainer}>
//       <StatusBar hidden={false} />
//       <Text style={styles.title}>{(en.login)}</Text>
//       <View style={styles.inputContainer}>
//         <CustomInput iconComponentName={en.iconComponentName1} name={en.iconName1} placeHolder={en.placeHolder1} title={en.title1} iconsize={3.6} handleChange={handleChangeText} stateName='email' value={email}/>
//         <CustomInput iconComponentName={en.iconComponentName2} name={en.iconName2} placeHolder={en.placeHolder2} title={en.title2} iconsize={3.6} handleChange={handleChangeText} stateName='password' value={password}/></View>
//       <Text style={styles.forgotPassword}>{(en.forgotpassword)}</Text>
//       <View style={styles.btnContainer}>
//       {/* handleSubmit={handleNavigation} */}
//         <CustomButton title={(en.login)} handleSubmit={handleLogin}/>
//       </View>
//       <View style={styles.loginMethodsContainer}>
//         <Text style={styles.loginmethodsTitle}>{(en.loginMethosTitle)}</Text>
//         <View style={styles.loginIconsMainContainer}>
//           <View style={styles.iconContainer1}>
//             <IconSwitcher componentName={en.iconComponentName3} iconName={en.iconName3} color={colors.white} iconsize={5.5} />
//           </View>
//           <View style={styles.iconContainer2}>
//             <IconSwitcher componentName={en.iconComponentName4} iconName={en.iconName4} color={colors.white} iconsize={3.2} />
//           </View>
//         </View>
//         {
//           <View style={styles.loginPageSwitchContainer}>
//           <Text style={styles.loginPageSwitch}>{(en.notamember)}</Text>
//           <TouchableOpacity>
//             <Text style={styles.signupText}>{en.signUpLink}</Text>
//           </TouchableOpacity>
//         </View>
//         }
//       </View>
//     </View>
//      </ScrollView>
//    </KeyboardAvoidingView>

//   )
// }
// export default Login


{/* <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoComplete='email'
        
      /> */}
{/* {emailError ? <Text style={styles1.error}>{emailError}</Text> : null} */ }
{/* <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}

        secureTextEntry={true}
      /> */}
{/* {passwordError ? <Text style={styles1.error}>{passwordError}</Text> : null} */ }


import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, StatusBar, TouchableOpacity, BackHandler } from 'react-native';
import { styles } from './styles';
import en from "./locales/en.json"
import MyContext from '../../context/Context';
import CustomInput from '../common/customInput/CustomInput';
import CustomButton from '../common/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import PopUp from '../common/popup/PopUp';
import { responsiveFontSize, responsiveHeight } from '../../utils/responsiveScale';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [securePassword, setSecurePassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPop, setForgotPop] = useState(false);
  const { navigate, isFocused } = useNavigation()
  const { actions } = useContext(MyContext)
  const handleEmailChange = (text) => {
    setEmail(text);
    if (text === "") {
      setEmailError("");
    }
    else {
      setEmailError(validateEmail(text) ? '' : 'Please enter a valid email address');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text === "") {
      setPasswordError("");
    }
    else {
      setPasswordError(text.length >= 6 ? '' : 'Password must be at least 6 characters long');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      setEmailError(!email || !validateEmail(email) ? 'Please enter a valid email address' : '');
      setPasswordError(!password || password.length < 6 ? 'Password must be at least 6 characters long' : '');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      setEmailError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true)
    const user=await actions.loginAction(email, password);
    setIsLoading(false)
  if(user)
    {
      Alert.alert(
        'Login successful!',
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              navigate('BottomNavigation');
  
            },
          },
        ],
        { cancelable: false }
      );
    }


  };


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSecurePassword = () => {
    setSecurePassword(!securePassword)
  }
  // const handleForgotPassword = () => {
  //   navigate("ChangePassword")
  // }
  const handleForgotPassword = () => {
    setForgotPop(!forgotPop)
  }

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
    <>
      <StatusBar hidden={false} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContainer}  >
        <View style={styles.container}>
          <Text style={styles.title}>{(en.login)}</Text>
          <View style={styles.inputContainer}>
            <View style={styles.errorMsgContainer}>
              <CustomInput iconComponentName={en.iconComponentName1} name={en.iconName1} placeHolder={en.placeHolder1} title={en.title1} iconsize={2.8} handleChange={handleEmailChange} stateName='email' value={email} />
              {emailError ? <Text style={styles.errorMsg}>{emailError}</Text> : null}
            </View>
            <View style={styles.errorMsgContainer}>
              <CustomInput iconComponentName={en.iconComponentName2} name={en.iconName2} placeHolder={en.placeHolder2} title={en.title2} iconsize={2.5} handleChange={handlePasswordChange} stateName='password' value={password} secure={securePassword} showPassword={handleSecurePassword} />
              {passwordError ? <Text style={styles.errorMsg}>{passwordError}</Text> : null}
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>{(en.forgotpassword)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            {/* handleSubmit={handleNavigation} */}
            <CustomButton title={(en.login)} handleSubmit={handleLogin} loading={isLoading} />
          </View>
        </View>

      </ScrollView>
      <PopUp value={forgotPop} handlePopUpClose={handleForgotPassword}>
        <View style={{alignItems:'center',justifyContent:'center',gap:responsiveHeight(1)}}>
        <Text style={[styles.loginmethodsTitle,{fontSize:responsiveHeight(1.8)}]}>Please send an email to support@tripbizz.com</Text>
        <Text style={[styles.loginmethodsTitle,{fontSize:responsiveHeight(1.8)}]}>OR</Text>
        <Text style={[styles.loginmethodsTitle,{fontSize:responsiveHeight(1.8)}]}>Contact +91 9949269044</Text>
        </View>
      </PopUp>
    </>

  );

};

export default LoginScreen;


