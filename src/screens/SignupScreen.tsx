import React, { FC, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { useNavigation, RouteProp, useRoute, CommonActions } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { TextInput, Button, MyScreen, Header } from '../components';
import { regx, API_URL } from "../utils/constant";
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import { useToast } from "react-native-toast-notifications";
import { RootStackParamList } from '../../src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'
import moment from 'moment'


type signUpScreenRoute = RouteProp<RootStackParamList, "SignupScreen">;
type Props = Record<never, string>;
interface RenderPasswordConditions {
    title: string;
}
const SignupScreen: FC<Props> = ({ }: Props) => {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const toast = useToast();

    const route = useRoute<signUpScreenRoute>();
    const savedMobileNo = route?.params?.mobile_number;
    const navigation = useNavigation<RootNavigationProp>();
    const [fullName, setFullName] = useState<string>("");
    const [fatherName, setFatherName] = useState<string>("");
    const [dob, setDOB] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState<string>(savedMobileNo);
    const [email, setEmail] = useState<string>("");
    const [aadhaar, setAadhar] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmedPassword] = useState<string>("");
    const [checkboxValue, setCheckboxSelection] = useState<boolean>(false);
    const [genderValue, setGenderValue] = useState("");
    const [livingArea, setLivingArea] = useState("");
    const [isMarried, setIsMarried] = useState("");


    const [loading, setLoading] = useState<boolean>(false);


    const genderData = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];


    const livingData = [
        { label: 'Urban', value: 'Urban' },
        { label: 'Rural', value: 'Rural' },
    ];

    const marriedData = [
        { label: 'Married', value: 'yes' },
        { label: 'Unmarried', value: 'Unmarried' },
        { label: 'Seprated', value: 'Seprated' },
        { label: 'Divorced', value: 'Divorced' },
    ];


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
        if (!checkboxValue) {
            showDangerToast("Checked Terms and condition checked box!")
        } else {
            setLoading(true);

            try {
                const response = await axios.post(`${baseUrl}/auth/signup`, {
                    "name": fullName,
                    "email": email,
                    "is_married": isMarried,
                    "mobile": mobileNumber,
                    "fathername": fatherName,
                    "dob": dob,
                    "gender": genderValue,
                    "living_area": livingArea,
                    "password": password,
                    "aadhar_no": aadhaar,
                    "terms": 1
                });

                if (response.status === 200) {
                    console.log(response.data);
                    setLoading(false);
                    if (response.data.status == true) {
                        showSuccessToast(response.data.message);
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "LoginScreen" }],
                            })
                        );

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
            <Header navigation={navigation} style={styles.header} />
            <ScrollView>
                <View style={styles.subContainer}>

                    <View style={styles.myHeadingStyle}>
                        <Text
                            style={styles.textHeading}>Sign Up</Text>


                        <Text
                            style={styles.textSubHeading}>
                            Become a part of our community by registering for an account today
                        </Text>

                    </View>


                    <View style={{ padding: 10 }}>


                        <TextInput
                            title="Mobile"
                            onChangeText={(text) => setMobileNumber(text)}
                            value={mobileNumber}
                            placeholder='Enter your Mobile Number'
                            warningMessage="Please enter 10 Digit mobile number."
                            keyboardType='number-pad'
                            maxLength={10}
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warning={mobileNumber && !regx.phoneLastTen.test(mobileNumber)}
                        />

                        <TextInput
                            title="Full Name"
                            onChangeText={(text) => setFullName(text)}
                            value={fullName}
                            placeholder='Enter your full name'
                            warningMessage="Please enter a full name."
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warning={fullName && !regx.fullname.test(fullName)}
                        />

                        <TextInput
                            title="Father Name"
                            onChangeText={(text) => setFatherName(text)}
                            value={fatherName}
                            placeholder='Enter your father name'
                            warningMessage="Please enter a father name."
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warning={fatherName && !regx.fullname.test(fatherName)}
                        />

                        <TextInput
                            title="Email address"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder='Enter your email'
                            warningMessage="Please enter a valid email."
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warning={email && !regx.email.test(email)}
                        />

                        <Pressable onPress={() => setOpen(true)}>
                            <TextInput
                                title="DOB"
                                onChangeText={(text) => setDOB(text)}
                                value={dob}
                                placeholder='DD-MM-YYYY'
                                editable={false}
                                warningMessage="Please enter valid DOB."
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                                warning={dob && !regx.dob.test(dob)}
                            />
                        </Pressable>



                        <DatePicker
                            modal
                            mode='date'
                            open={open}
                            date={date}
                            onConfirm={(date) => {
                                setOpen(false)
                                setDate(date)
                                //moment(date).format('MM/DD/YYYY');
                                setDOB(moment(date).format('DD-MM-YYYY'))
                                // console.log(moment(date).format('MM/DD/YYYY'));
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />

                        <TextInput
                            title="Password"
                            placeholder='Enter your password'
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
                            title="Confirm Password"
                            placeholder='Enter confirm password'
                            onChangeText={(text) => setConfirmedPassword(text)}
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            value={confirmPassword}
                            secureTextEntry
                            warningMessage="Password not matched"
                            warning={password != confirmPassword}
                        />


                        <Text
                            style={styles.gender}>Select Marital Status</Text>

                        <View style={styles.containerDrop}>
                            <Dropdown
                                style={[styles.dropdown]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={marriedData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select item'}
                                value={isMarried}
                                onChange={item => {
                                    setIsMarried(item.value);
                                }}

                            />
                        </View>

                        <Text
                            style={styles.gender}>Select Gender</Text>

                        <View style={styles.containerDrop}>
                            <Dropdown
                                style={[styles.dropdown]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={genderData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select item'}
                                value={genderValue}
                                onChange={item => {
                                    setGenderValue(item.value);
                                }}

                            />
                        </View>


                        <Text
                            style={styles.gender}>Select Urban</Text>

                        <View style={styles.containerDrop}>
                            <Dropdown
                                style={[styles.dropdown]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={livingData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select item'}
                                value={livingArea}
                                onChange={item => {
                                    setLivingArea(item.value);
                                }}

                            />
                        </View>

                        <TextInput
                            title="Aadhaar Number"
                            onChangeText={(text) => setAadhar(text)}
                            value={aadhaar}
                            placeholder='Enter your Aadhaar Number'
                            warningMessage="Please enter 12 Digit Aadhaar number."
                            keyboardType='number-pad'
                            maxLength={12}
                            textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                            warning={aadhaar && !regx.adhaarcard.test(aadhaar)}
                        />

                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                uncheckedColor={Colors.BLUR_COLOR}
                                color={Colors.DARK_NAVY_BLUE_PRIMARY}
                                status={checkboxValue ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setCheckboxSelection(!checkboxValue);
                                }}
                            />
                            <Text style={styles.label}>Be creating your account
                                you have to agree with our Terms and condition</Text>
                        </View>


                        <Button
                            disabled={!regx.email.test(email) || !regx.fullname.test(fullName)
                                || !regx.fullname.test(fatherName) || !regx.dob.test(dob)
                                || !regx.phoneLastTen.test(mobileNumber) || !regx.password.test(password)
                                || livingArea.length == 0 || genderValue.length == 0 || isMarried.length == 0
                                || password != confirmPassword}
                            onPress={handleLogin}
                            loading={loading}
                            title="Sign Up"
                        />

                        <Text
                            style={styles.signupStyle}
                            onPress={() => navigation.navigate("LoginScreen")}>
                            Already have an account? Sign In</Text>

                    </View>

                </View>
            </ScrollView>

        </MyScreen>




    );
};




const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        marginLeft: -7,
        marginTop: 20,
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: 'center',
    },
    label: {
        marginVertical: 5,
        marginHorizontal: 10,
        color: '#0A051E',
        fontWeight: '400',
        fontSize: 14,
    },
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
        marginTop: 0,
    },

    gender: {
        marginTop: 20,
        marginBottom: 5,
        color: Colors.BLACK,
        fontSize: 14,
        fontWeight: '500'
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
        marginTop: 20,
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


    containerDrop: {
        backgroundColor: Colors.lightThemeColor,
    },

    dropdown: {
        height: 60,
        borderColor: Colors.BOX_BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 1,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },

    placeholderStyle: {
        fontSize: 16,
        color: Colors.TEXT_COLOR_LIGHT,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Colors.BLACK,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    header: {
        paddingTop: 30
    },
});

export default SignupScreen;