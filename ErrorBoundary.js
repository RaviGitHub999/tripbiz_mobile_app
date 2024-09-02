import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const navigation = useNavigation();

  const reloadApp = () => {
    setHasError(false);
    // You might need to trigger a full app reload depending on your use case
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleCatch = (error, errorInfo) => {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Something went wrong.</Text>
        <Button title="Go Back" onPress={goBack} />
        <Button title="Reload" onPress={reloadApp} />
      </View>
    );
  }

  try {
    return children;
  } catch (error) {
    handleCatch(error);
    return null;
  }
};

export default ErrorBoundary;
