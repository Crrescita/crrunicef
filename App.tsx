import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator
} from '@react-navigation/native-stack';
import { ToastProvider } from 'react-native-toast-notifications'

import {
  LogBox
} from 'react-native';

// My Imports are here
import { RootStackParamList } from './src/types';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { StatusBar } from './src/components'
import SubMenuScreen from './src/screens/SubMenuScreen';
import GeneralFormScreen from './src/screens/GeneralFormScreen';
import LoginByOTP from './src/screens/LoginByOTP';
import AreYouFacingIssueScreen from './src/screens/AreYouFacingIssueScreen';
import IssuesFormScreen from './src/screens/detail_issue_form/IssuesFormScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ResultScreen from './src/screens/ResultScreen';
import FAQScreen from './src/screens/FAQScreen';



const Stack = createNativeStackNavigator();
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = Record<never, string>;
LogBox.ignoreAllLogs();
const App: FC<Props> = ({ }: Props) => {
  return (
    <ToastProvider
      placement="bottom"
      duration={5000}
      animationType='zoom-in'
      animationDuration={250}
      successColor="green"
      dangerColor="red"
      warningColor="orange"
      normalColor="gray"
      textStyle={{ fontSize: 16 }}
      offset={50} // offset for both top and bottom toasts
      offsetTop={30}
      offsetBottom={40}
      swipeEnabled={true}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle='dark-content' />
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen}
              options={
                { headerShown: false }
              } />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name='OTPScreen' component={OTPScreen} />
            <Stack.Screen name='SignupScreen' component={SignupScreen} />
            <Stack.Screen name='DashboardScreen' component={DashboardScreen} />
            <Stack.Screen name='SubMenuScreen' component={SubMenuScreen} />
            <Stack.Screen name='GeneralFormScreen' component={GeneralFormScreen} />
            <Stack.Screen name='LoginByOTP' component={LoginByOTP} />
            <Stack.Screen name='AreYouFacingIssueScreen' component={AreYouFacingIssueScreen} />
            <Stack.Screen name='IssuesFormScreen' component={IssuesFormScreen} />
            <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
            <Stack.Screen name='ResultScreen' component={ResultScreen} />
            <Stack.Screen name='FAQScreen' component={FAQScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ToastProvider>
  )
}

export default App;