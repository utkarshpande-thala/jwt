import React, { useState } from 'react';
import { View } from 'react-native';
import RegistrationScreen from './screens/RegistrationScreen';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {isRegistered ? (
        <LoginScreen />
      ) : (
        <RegistrationScreen onRegister={() => setIsRegistered(true)} />
      )}
    </View>
  );
}
