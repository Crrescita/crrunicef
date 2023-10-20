import React, { FC, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { TextInput, OutlineButton, Button, MyScreen } from '../components';
import { regx, API_URL } from "../utils/constant";
import axios from 'axios';
import { useToast } from "react-native-toast-notifications";


type Props = Record<never, string>;
const LoginScreen: FC<Props> = ({ }: Props) => {
    const toast = useToast();
    const navigation = useNavigation<RootNavigationProp>();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    //const url = API_URL.BASE_URL_DEV + API_URL.GET_HOME_DATA;
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
            const response = await axios.post(`${baseUrl}/auth/signin`, {
                "email": email,
                "password": password,
            });

            // console.log(response);

            if (response.status === 200) {
                setLoading(false);
                if (response.data.status == true) {
                    console.log('true');
                    //console.log(response.data.data);

                    AsyncStorage.setItem("USER", JSON.stringify(response.data.data));
                    AsyncStorage.setItem("IS_USER_LOGGED_IN", "1");

                    // const value = await AsyncStorage.getItem("USER");
                    // console.log('value from storages');
                    // console.log(JSON.stringify(value));
                    // let obj = JSON.parse(value);
                    // console.log(obj.email);
                    navigation.replace("DashboardScreen")

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

    // const handleLogin = async () => {
    //     setLoading(true);
    //     axios.get(`${baseUrl}home/getAlla`).then((response) => {
    //         console.log(response.data.data);
    //         setLoading(false);
    //     }).catch((error) => {
    //         setLoading(false);
    //         console.log(error.response.statusText);
    //         //toast.show(error);
    //         toast.show("Task finished successfully", {
    //             type: "danger ",
    //             placement: "bottom",
    //             duration: 4000,
    //             animationType: "zoom-in",
    //         });
    //     });


    // };



    return (
        <MyScreen>
            <ScrollView>

                <View style={styles.subContainer}>

                    <View style={styles.myHeadingStyle}>
                        <Text
                            style={styles.textHeading}>Sign In</Text>


                        <Text
                            style={styles.textSubHeading}>
                            Our Secure login process ensure the confidentiality
                            of your information.</Text>

                    </View>


                    <View style={{ padding: 10 }}>
                        <TextInput
                            title="Email address"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder='Enter your email'
                            warningMessage="Please enter a valid email."
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warning={email && !regx.email.test(email)}
                        />

                        <TextInput
                            secureTextEntry
                            title="Password"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholder='Enter your password'
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warningMessage="Password must contain minimum 5 characters."
                            warning={password && password.length < 5}
                        />

                        <OutlineButton contentStyle={styles.btnForgotPassword}
                            title="Forgot password?" />

                        <Button
                            disabled={!regx.email.test(email) || password.length < 5}
                            onPress={handleLogin}
                            loading={loading}
                            title="Sign In"
                        />

                        <Text
                            style={styles.signupStyle}>
                            OR</Text>

                        <Button
                            // disabled={!regx.email.test(email) || password.length < 8}
                            onPress={() => navigation.navigate("LoginByOTP")}
                            title="Login With OTP"
                        />

                        <Text
                            style={styles.signupStyle}
                            onPress={() => navigation.navigate("SignupScreen", {
                                mobile_number: ''
                            })}>
                            Don't have account? Sign up</Text>

                    </View>



                </View>

            </ScrollView>

        </MyScreen>




    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR,
    },

    subContainer: {
        padding: 10,
    },

    textHeading: {
        fontSize: 30,
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        marginTop: 50,
    },
    textSubHeading: {
        fontSize: 15,
        color: Colors.TEXT_COLOR_LIGHT,
        marginTop: 10,
        marginHorizontal: 15,
    },
    signupStyle: {
        fontSize: 16,
        color: Colors.BLACK,
        fontWeight: '400',
        marginTop: 26,
        alignSelf: 'center'
    },
    myHeadingStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnForgotPassword: {
        justifyContent: 'flex-end',
        alignItems: "flex-end",
        color: Colors.BLACK,
        fontSize: 15

    },
});

export default LoginScreen;