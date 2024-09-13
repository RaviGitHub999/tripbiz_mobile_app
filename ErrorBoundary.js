import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {errorImg} from './app/components/splash/assets';
import { colors, fonts } from './app/config/theme';
import { responsiveHeight } from './app/utils/responsiveScale';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }
  handleReset = () => {
    this.setState({hasError: false});
  };

  // // Back button using navigation prop
  // handleBack = () => {
  //   if (this.props.navigation) {
  //     this.props.navigation.goBack();
  //   }
  // };

  render() {
    if (this.state.hasError) {
      return (
        <ImageBackground
          source={errorImg}
          style={{flex: 1}}
          resizeMode="stretch">
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
             <View style={styles.container}>
             <Text style={styles.errorText}>Oops! something went wrong.</Text>
              <Text style={styles.infoText}>
               We encountered an unexpected error.Please reload the App
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleReset}>
                <Text style={styles.buttonText}>Reload</Text>
              </TouchableOpacity>
             </View>
            </View>
        </ImageBackground>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: responsiveHeight(5),
    color: colors.white,
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
    fontFamily:fonts.primary
  },
  infoText: {
    fontSize: responsiveHeight(2),
    color:"gray",
    marginBottom: 30,
    textAlign: 'center',
    fontFamily:fonts.secondry
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveHeight(2.5),
    borderRadius: responsiveHeight(2.5),
    marginVertical: responsiveHeight(1.8),
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: colors.facebook,
  },
  buttonText: {
    color: colors.white,
    fontSize: responsiveHeight(1.8),
    fontFamily:fonts.primary
  },
});

export default ErrorBoundary;
