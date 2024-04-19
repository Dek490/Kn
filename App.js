// App.js

import React, { forwardRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MianNavigation';
import Toast, { ToastRef } from 'react-native-toast-message';

const ToastWithRef = forwardRef((props, ref) => <Toast {...props} ref={ref} />);

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigation />
      <Toast ref={ToastRef} />
    </NavigationContainer>
 
  );
}
