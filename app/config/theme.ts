// import {store} from '../redux/store';

export const fonts = {
    primary: 'Montserrat-SemiBold',
    // secondry: 'Montserrat-Medium',
    title: 'Montserrat-Black',
    subTitle: 'Montserrat-Light',
    textInput: "Montserrat-Regular",
    textFont: "Montserrat-Medium",
  };

  export const lightTheme = {
    primary :"#001219",
    primaryLite : "#108bbc",
    secondary : "#BB3E03",
    highlight : "#94D2BD",
    highlightLite : "#94d2bd2a",
    highlightTranslucent : "#94d2bda9",
    facebook:"#1877f2",
    google:"#df4a32",
    white:"#FFFFFF",
    black:"#000000",
    lightGray:"#505050",
    red:"red",
    gray:"#A6A39E"
  };
 
  export const darkTheme = {
    primary :"#001219",
    primaryLite : "#108bbc",
    secondary : "#BB3E03",
    highlight : "#94D2BD",
    highlightLite : "#94d2bd2a",
    highlightTranslucent : "#94d2bda9",
    facebook:"#1877f2",
    google:"#df4a32",
     white:"#FFFFFF",
    black:"#000000",
    lightGray:"#505050",
    red:"red",
    gray:"#A6A39E"
   
  };
  
  // const isDarkMode = store.getState()?.Theme?.isDarkMode;
  const isDarkMode = false;
  
  export const colors = isDarkMode ? darkTheme : lightTheme;
  