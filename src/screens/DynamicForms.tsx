import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput, Button } from '../components';
import { Colors } from '../config/colors';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios';
import { API_URL } from "../utils/constant";
import { useNavigation, CommonActions }
    from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'
import moment from 'moment'

type DynamicFormType = {
    formData?: any;
};


const DynamicForm: FC<DynamicFormType> = ({ formData }: DynamicFormType) => {
    const navigation = useNavigation<RootNavigationProp>();
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const [formValues, setFormValues] = useState({});
    const [finalFormValue, setFinalFormVlaues] = useState(formData);
    const [token, setUserToken] = useState("");
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const baseUrl = API_URL.BASE_URL_DEV;




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
    const handleChange = (fieldId: any, value: string, field: string) => {
        let obj = finalFormValue;

        obj[fieldId - 1].ans = value;

        if (obj[fieldId - 1].ans == '') {
            obj[fieldId - 1].error = true;
        } else {
            obj[fieldId - 1].error = false;
        }

        //console.log(obj);


        setFinalFormVlaues(obj)
        setFormValues({ ...formValues, [fieldId]: value });


    };


    const handleDateChange = (fieldId: any, value: string, index: any) => {
        let obj = finalFormValue;

        obj[index].ans = value;

        //console.log(obj);
        setFinalFormVlaues(obj)
        setFormValues({ ...formValues, [fieldId]: value });


    };

    const handleSubmit = () => {
        let obj = finalFormValue;
        let isValid = true;

        finalFormValue.map((field: any, index: any) => {
            if (field.ans == '') {
                // field.error = true;
                obj[index].error = true;
                isValid = false;
                showDangerToast("Please fill/Select " + field.title);
                return;
            }
        })

        setFinalFormVlaues(obj);
        if (isValid) {
            handleFormSubmit();
        }

        // You can make an API request to send the form data here
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            console.log(finalFormValue);
            const response = await axios.post(`${baseUrl}/general/storeData`,
                finalFormValue, await getHeader());

            if (response.status === 200) {
                console.log(response.data);
                setLoading(false);
                if (response.data.status == true) {
                    showSuccessToast(response.data.message);
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: "DashboardScreen" }],
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
    };

    const renderFormField = (field: any, index: any) => {
        switch (field.f_type) {
            case 'text':
                return (
                    <TextInput
                        title={field.title}
                        onChangeText={(text) => handleChange(field.sno, text, field)}
                        value={field.ans}
                        placeholder={"Enter your " + field.title}
                        textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                    />

                );
            case 'date':
                return (
                    <>
                        <Pressable key={field.sno} onPress={() => setOpen(true)}>
                            <TextInput
                                title={field.title}
                                onChangeText={(text) => handleChange(field.sno, text, field)}
                                value={field.ans}
                                editable={false}
                                placeholder={"DD-MM-YYYY"}
                                keyboardType='numeric'
                                textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
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
                                handleDateChange(field.sno, moment(date).format('DD-MM-YYYY'), index)
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />
                    </>
                );

            case 'number':
                return (
                    <TextInput
                        title={field.title}
                        onChangeText={(text) => handleChange(field.sno, text, field)}
                        value={field.ans}
                        placeholder={"Enter your " + field.title}
                        keyboardType='numeric'
                        textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                    />
                );

            case 'textarea':
                return (
                    <TextInput
                        title={field.title}
                        onChangeText={(text) => handleChange(field.sno, text, field)}
                        value={field.ans}
                        placeholder={"Enter your " + field.title}
                        textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                    />
                );

            case 'dropdown':
                return (
                    <>
                        <Text
                            style={styles.gender}>{field.title}</Text>

                        <View style={styles.dropdown}>
                            <Picker
                                selectedValue={field.ans}
                                onValueChange={(itemValue) => handleChange(field.sno, itemValue, field)}
                            >
                                {field.options.map((option: any) => (
                                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>

                    </>

                );

            default:
                return null;
        }
    };

    const renderForm = () => {
        return finalFormValue.map((field: any, index: any) => (
            <View key={field.sno}>
                {renderFormField(field, index)}
            </View>
        ));
    };

    return (
        <View
            style={{
                paddingTop: 5, paddingRight: 20, paddingLeft: 20,
                marginBottom: 30,

            }}>
            {renderForm()}

            <Button
                loading={loading}
                onPress={handleSubmit}
                title="Submit"
            />

        </View>
    );
};

const styles = StyleSheet.create({

    gender: {
        marginTop: 20,
        marginBottom: 5,
        color: Colors.BLACK,
        fontSize: 14,
        fontWeight: '500'
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
    placeholderStyle: {
        fontSize: 16,
        color: Colors.TEXT_COLOR_LIGHT,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: Colors.BLACK,
    },
})

export default DynamicForm;