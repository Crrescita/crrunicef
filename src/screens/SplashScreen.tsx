import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image
} from "react-native";
import { Colors } from "../config/colors";

import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = Record<never, string>;

const SplashScreen: FC<Props> = ({ }: Props) => {
  const navigation = useNavigation<RootNavigationProp>();

  setTimeout(() => {

    handleUserChecked();
  }, 1000);

  const handleUserChecked = async () => {
    const value = await AsyncStorage.getItem("IS_USER_LOGGED_IN");
    if (value == "1") {
      navigation.replace('DashboardScreen');
    } else {
      navigation.replace('LoginScreen');
    }

  }

  return (
    <View style={styles.container}>

      <Image
        style={styles.logo}
        source={require("../assets/logo.png")} />

      <Text style={styles.bottomtext}>www.crrescita.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DARK_NAVY_BLUE_PRIMARY,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  logo: {
    width: 200,
    height: 200,
  },
  bottomtext: {
    color: Colors.BOTTOM_TEXT_COLOR,
    position: 'absolute', //Here is the trick
    bottom: 10, //Here is the trick
    fontSize: 16,

  },
})

export default SplashScreen;