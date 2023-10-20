import React, { FC, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { TextInput, Button, MyScreen, Header } from '../components';
import { regx, API_URL } from "../utils/constant";
import axios from 'axios';
import { useToast } from "react-native-toast-notifications";

type Props = Record<never, string>;
const LoginByOTP: FC<Props> = ({ }: Props) => {
    const toast = useToast();
    const navigation = useNavigation<RootNavigationProp>();
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
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
            const response = await axios.post(`${baseUrl}/auth/otp`, {
                "mobile": mobileNumber,
            });

            // console.log(response);

            if (response.status === 200) {
                setLoading(false);
                if (response.data.status == true) {
                    console.log('true');
                    showSuccessToast(response.data.message);
                    navigation.navigate("OTPScreen", {
                        mobile_number: mobileNumber,
                    })

                } else {
                    console.log(response.data.message);
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
                            style={styles.textHeading}>Get OTP</Text>
                        <Text
                            style={styles.textSubHeading}>
                            Enter your mobile number here!</Text>

                    </View>


                    <View style={{ padding: 10 }}>
                        <Text
                            style={styles.textOTP}>
                            Enter your 10 digit mobile number</Text>

                        <View
                            style={{ flex: 1, flexDirection: 'column', marginTop: 10 }}>

                            <TextInput
                                onChangeText={(text) => setMobileNumber(text)}
                                value={mobileNumber}
                                placeholder='Enter your Mobile Number'
                                warningMessage="Please enter 10 Digit mobile number."
                                keyboardType='number-pad'
                                maxLength={10}
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                warning={mobileNumber && !regx.phoneLastTen.test(mobileNumber)}
                            />

                        </View>
                        <Button
                            disabled={!regx.phoneLastTen.test(mobileNumber)}
                            onPress={handleLogin}
                            loading={loading}
                            title="Get OTP!"
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

export default LoginByOTP;