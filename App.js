// App.js

import React, { forwardRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MianNavigation';
import Toast, { ToastRef } from 'react-native-toast-message';
import { Text, View } from 'react-native';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://64f509e003aea6b2b549636323ca1f3e@o4507164271837184.ingest.de.sentry.io/4507164273934416',
});

const ToastWithRef = forwardRef((props, ref) => <Toast {...props} ref={ref} />);

export default function App() {
  // throw new Error('My first Sentry error!');
  return (
    <NavigationContainer>
      <MainNavigation />
      <Toast ref={ToastRef} />
    </NavigationContainer>
    
 
  );
}
