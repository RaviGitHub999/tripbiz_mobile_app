import {Text } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigator from './app/components/common/navigation/AppNavigator'
import MyProvider from './app/context/MyProvider'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import ErrorBoundary from './ErrorBoundary'

const App = () => {
  useEffect(()=>{
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  },[]) 
  return (
   <ErrorBoundary>
     <MyProvider>
    <NavigationContainer>
    <AppNavigator/>
    </NavigationContainer>
      <Toast/>
    </MyProvider>
   </ErrorBoundary>
  )
}

export default App

