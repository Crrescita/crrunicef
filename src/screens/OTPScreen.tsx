import React, { FC, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, RouteProp, useRoute, CommonActions } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { TextInput, Button, MyScreen, Header } from '../components';
import { regx, API_URL } from "../utils/constant";
import axios from 'axios';
import { useToast } from "react-native-toast-notifications";
import { RootStackParamList } from '../../src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = Record<never, string>;
type OtpScreenRoute = RouteProp<RootStackParamList, "OTPScreen">;
const OTPScreen: FC<Props> = ({ }: Props) => {
    const route = useRoute<OtpScreenRoute>();
    const toast = useToast();
    const navigation = useNavigation<RootNavigationProp>();
    const [otpFirstDigit, setFirstOTP] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const mobileNumber = route?.params?.mobile_number;

    const baseUrl = API_URL.BASE_URL_DEV;

    const showDangerToast = (msg: string) => {
        toast.show(msg, {
            type: "danger",
            placement: "bottom",
            duration: 4000,
            animationType: "zoom-in",
        });
    }

    const showSuccessToast = (msg: string) => {
        toast.show(msg, {
            type: "success",
            placement: "bottom",
            duration: 4000,
            animationType: "zoom-in",
        });
    }

    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/auth/verifyOtp`, {
                "mobile": mobileNumber,
                "otp": otpFirstDigit
            });

            if (response.status === 200) {
                setLoading(false);
                if (response.data.status == true) {
                    showSuccessToast(response.data.message);
                    if (response.data.data.user) {
                        console.log(response.data.data.user);
                        AsyncStorage.setItem("USER", JSON.stringify(response.data.data.user));
                        AsyncStorage.setItem("IS_USER_LOGGED_IN", "1");
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "DashboardScreen" }],
                            })
                        );


                    } else {
                        navigation.navigate("SignupScreen", { mobile_number: mobileNumber })
                    }

                } else {
                    showDangerToast(response.data.message);
                }


            } else {
                throw new Error("An error has occurred");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            showDangerToast('Invalid credentials OR something went wrong!')

        }

    };


    return (

        <MyScreen>
            <Header navigation={navigation} style={styles.header} />
            <ScrollView>
                <View style={styles.subContainer}>
                    <View style={styles.myHeadingStyle}>
                        <Text
                            style={styles.textHeading}>Verify OTP</Text>
                        <Text
                            style={styles.textSubHeading}>
                            Verify your mobile number here!</Text>

                    </View>


                    <View style={{ padding: 10 }}>
                        <Text
                            style={styles.textOTP}>
                            Enter your OTP</Text>

                        <View
                            style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>

                            <TextInput
                                onChangeText={(text) => setFirstOTP(text)}
                                value={otpFirstDigit}
                                placeholder='OTP'
                                maxLength={4}
                                keyboardType='number-pad'
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                warning={otpFirstDigit && !regx.otpmy.test(otpFirstDigit)}
                            />

                        </View>
                        <Button
                            disabled={!regx.otpmy.test(otpFirstDigit)}
                            onPress={handleLogin}
                            loading={loading}
                            title="Verfiy Now!"
                        />

                    </View>
                </View>

            </ScrollView>
        </MyScreen>
    );
};




const styles = StyleSheet.create({
    subContainer: {
        padding: 10,
    },

    textHeading: {
        fontSize: 30,
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        marginTop: 0,
    },
    textSubHeading: {
        fontSize: 16,
        color: Colors.TEXT_COLOR_LIGHT,
        marginTop: 10,
        marginHorizontal: 15,
    },
    myHeadingStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textOTP: {
        color: Colors.BLACK,
        marginTop: 30,
        fontWeight: '500',
        fontSize: 14,
    },
    header: {
        paddingTop: 30
    },

});

export default OTPScreen;