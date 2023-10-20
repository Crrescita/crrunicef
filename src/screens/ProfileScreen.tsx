import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../config/colors';
import { Button, MyScreen, Header, TextInput, OutlineButton } from '../components';
import { useNavigation, CommonActions }
    from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { regx, API_URL } from "../utils/constant";
import { useToast } from "react-native-toast-notifications";
import axios from 'axios';


interface RenderPasswordConditions {
    title: string;
}



type Props = Record<never, string>;
const ProfileScreen: FC<Props> = ({ }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const navigation = useNavigation<RootNavigationProp>();
    const [userProfilePic, setUserProfilePic] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmailAddress] = useState("");
    const [mobile, setMobileNo] = useState("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmedPassword] = useState<string>("");


    useEffect(() => {
        getUserDataFromLocal();
    }, []);

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

    const getUserDataFromLocal = async () => {
        try {
            const value = await AsyncStorage.getItem("USER");
            if (value !== null) {
                // We have data!!
                console.log(JSON.parse(value));
                setUserName(JSON.parse(value).name);
                setUserProfilePic(JSON.parse(value).profile_pic);
                setEmailAddress(JSON.parse(value).email);
                setMobileNo(JSON.parse(value).mobile);

            }
        } catch (error) {
            // Error retrieving data
        }

    }

    const handleLogout = async () => {
        AsyncStorage.setItem("IS_USER_LOGGED_IN", "0");
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "LoginScreen" }],
            })
        );
    };

    const getHeader = async () => {
        const value = await AsyncStorage.getItem("USER");
        let token = JSON.parse(value).token
        if (!token) {
            return {};
        }
        return {
            headers: {
                token: `${token}`,
            },
        };
    };

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/changePassword`, {
                "password": password,
            }, await getHeader());

            if (response.status === 200) {
                console.log(response.data);
                setLoading(false);
                if (response.data.status == true) {
                    showSuccessToast(response.data.message);
                    setPassword("");
                    setConfirmedPassword("");

                } else {
                    showDangerToast(response.data.message);
                }


            } else {
                throw new Error("An error has occurred");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            showDangerToast('something went wrong!')

        }
    };


    const handleDeleteMyAccount = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user/deleteAccount`,
                await getHeader());

            if (response.status === 200) {
                console.log(response.data);
                setLoading(false);
                if (response.data.status == true) {
                    showSuccessToast(response.data.message);
                    handleLogout();
                } else {
                    showDangerToast(response.data.message);
                }


            } else {
                throw new Error("An error has occurred");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            showDangerToast('something went wrong!')

        }
    };




    const RenderPasswordConditions = ({ title }: RenderPasswordConditions) => {
        return (
            <View style={styles.renderConditionsWrapper}>
                <View style={styles.conditionTextWrapper} />
                <Text style={styles.conditionText}>{title}</Text>
            </View>
        );
    };

    return (
        <MyScreen>
            <Header navigation={navigation} style={styles.header}
            />
            <ScrollView>
                <View style={styles.subContainer}>
                    <View style={styles.myHeadingStyle}>
                        <Text
                            style={styles.textHeading}>My Profile</Text>

                    </View>


                    <View style={{
                        padding: 10,
                        flex: 1,
                        flexDirection: 'column'
                    }}>

                        <View
                            style={{
                                marginHorizontal: 50,
                                alignSelf: 'center',
                            }}>

                            <View style={{
                                height: 100,
                                width: 100,
                                borderRadius: 50,
                                backgroundColor: "#6c757d",
                                alignContent: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>

                                <Text style={{
                                    color: "white", alignContent: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    fontSize: 54,
                                    fontWeight: '700',
                                }}>{Array.from(userName)[0]}</Text>

                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'column',
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: Colors.BOX_BORDER_COLOR,
                            padding: 10,
                            marginTop: 20,
                            overflow: "hidden",
                        }}>

                            <TextInput
                                title="Name"
                                onChangeText={(text) => setUserName(text)}
                                value={userName}
                                editable={false}
                                placeholder='Enter your name'
                                warningMessage="Please enter name."
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                warning={userName && !regx.fullname.test(userName)}
                            />

                            <TextInput
                                title="Email"
                                onChangeText={(text) => setEmailAddress(text)}
                                value={email}
                                editable={false}
                                placeholder='Enter your name'
                                warningMessage="Please enter name."
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                warning={email && !regx.email.test(email)}
                            />

                            <TextInput
                                title="Mobile"
                                onChangeText={(text) => setMobileNo(text)}
                                value={mobile}
                                editable={false}
                                placeholder='Enter your name'
                                warningMessage="Please enter name."
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                warning={mobile && !regx.phoneLastTen.test(mobile)}
                            />

                        </View>

                        <Button
                            onPress={handleLogout}
                            title="Logout"
                        />


                        <View style={{
                            flexDirection: 'column',
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: Colors.BOX_BORDER_COLOR,
                            padding: 10,
                            marginTop: 50,
                            overflow: "hidden",
                        }}>
                            <Text
                                style={styles.gender}>Change Password</Text>

                            <TextInput
                                title="New Password"
                                placeholder='Enter your new password'
                                onChangeText={(text) => setPassword(text)}
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                value={password}
                                secureTextEntry
                            />
                            {password && !regx.password.test(password) && (
                                <View style={styles.conditionWrapper}>
                                    <Text style={styles.warningText}>
                                        Your password must satisfy all the conditions:
                                    </Text>
                                    <RenderPasswordConditions
                                        title={"Must be at least 8 characters in length"}
                                    />
                                    <RenderPasswordConditions
                                        title={"Should contain at least one upper case"}
                                    />
                                    <RenderPasswordConditions
                                        title={"Should contain at least one digit"}
                                    />
                                    <RenderPasswordConditions
                                        title={"Should contain at least one special character"}
                                    />
                                </View>
                            )}

                            <TextInput
                                title="Confirm New Password"
                                placeholder='Enter confirm new password'
                                onChangeText={(text) => setConfirmedPassword(text)}
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                value={confirmPassword}
                                secureTextEntry
                                warningMessage="Password not matched"
                                warning={password != confirmPassword}
                            />

                            <Button
                                disabled={!regx.password.test(password) || password != confirmPassword}
                                title="Change Password"
                                onPress={handleChangePassword}
                                loading={loading}
                            />

                        </View>

                        <View style={{
                            justifyContent: 'center',
                            alignItems: "center",
                            marginTop: 20,
                            marginBottom: 20
                        }}>
                            <Text style={styles.btnForgotPassword}
                                onPress={() => {
                                    Alert.alert('Hold on!', 'Are you sure you want to delete your account?', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => null,
                                            style: 'cancel',
                                        },
                                        { text: 'YES', onPress: handleDeleteMyAccount },
                                    ]);
                                }}>
                                Delete My Account
                            </Text>
                        </View>



                    </View>




                </View>

            </ScrollView>

        </MyScreen>




    );
};




const styles = StyleSheet.create({
    btnForgotPassword: {
        color: Colors.WARNING_RED,
        fontSize: 16,
        fontWeight: '500'

    },
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR,
    },
    gender: {
        marginTop: 10,
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        fontSize: 16,
        fontWeight: '700'
    },

    conditionWrapper: {
        backgroundColor: Colors.HEX_COLOR_E3E4,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    warningText: {
        color: Colors.WARNING_HEADING,
        fontSize: 16,
        paddingBottom: 10,
    },
    renderConditionsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    conditionTextWrapper: {
        marginRight: 5,
        width: 5,
        height: 5,
        borderRadius: 6,
        backgroundColor: Colors.HEX_COLOR_711,
    },
    conditionText: {
        color: Colors.HEX_COLOR_711,

    },
    subContainer: {
        padding: 10,
    },
    myHeadingStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    textHeading: {
        fontSize: 30,
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        marginTop: 0,
        marginBottom: 20
    },
    textSubHeading: {
        fontSize: 16,
        color: Colors.TEXT_COLOR_LIGHT,
        marginTop: 10,
        marginHorizontal: 15,
    },
    header: {
        paddingTop: 30
    },

});

export default ProfileScreen;