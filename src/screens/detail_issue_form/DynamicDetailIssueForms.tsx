import React, { FC, useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput, Button } from '../../components';
import { Colors } from '../../config/colors';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios';
import { API_URL } from "../../utils/constant";
import { useNavigation, CommonActions }
    from "@react-navigation/native";
import { RootNavigationProp } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DynamicFormType = {
    formData?: any;
};


const DynamicDetailIssueForms: FC<DynamicFormType> = ({ formData }: DynamicFormType) => {
    const navigation = useNavigation<RootNavigationProp>();
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const [formValues, setFormValues] = useState({});
    const [finalFormValue, setFinalFormVlaues] = useState(formData);

    const baseUrl = API_URL.BASE_URL_DEV;
    const [token, setUserToken] = useState("");

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


    const handleChange = (fieldId: any, value: string, index: any) => {
        let obj = finalFormValue;
        obj[index].ans = value;
        if (obj[index].ans == '') {
            obj[index].error = true;
        } else {
            obj[index].error = false;
        }
        setFinalFormVlaues(obj)
        setFormValues({ ...formValues, [fieldId]: value });
    };

    const handleSubmit = () => {
        let obj = finalFormValue;
        let isValid = true;

        finalFormValue.map((field: any, index: any) => {
            if (field.ans == '') {
                obj[index].error = true;
                isValid = false;
                showDangerToast("Please fill/Select " + field.title);
                return;
            }
        })

        setFinalFormVlaues(obj);
        if (isValid) {
            console.log("final form submit data");
            console.log(finalFormValue);
            handleFormSubmit();
        }

        // You can make an API request to send the form data here
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        try {
            console.log(finalFormValue);
            const response = await axios.post(`${baseUrl}/general/saveUserSymtoms`,
                finalFormValue, await getHeader());

            if (response.status === 200) {
                console.log(response.data);
                setLoading(false);
                if (response.data.status == true) {
                    showSuccessToast(response.data.message);
                    console.log('unique id');
                    console.log(response.data.data);
                    navigation.navigate("ResultScreen",
                        { unique_id: response.data.data.unique_id });


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
        switch (field.type) {
            case 'text':
                return (
                    <TextInput
                        title={field.title}
                        onChangeText={(text) => handleChange(field.id, text, index)}
                        value={field.ans}
                        placeholder={"Enter your " + field.title}
                        textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                    />

                );
            case 'date':
                return (
                    <TextInput
                        title={field.title}
                        onChangeText={(text) => handleChange(field.sno, text, index)}
                        value={field.ans}
                        placeholder={"DD-MM-YYYY"}
                        keyboardType='numeric'
                        textInputStyle={{ backgroundColor: Colors.lightThemeColor }}
                    />
                );

            case 'number':
                return (
                    <TextInput
                        title={field.title}
                        onChangeText={(text) => handleChange(field.sno, text, index)}
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
                        onChangeText={(text) => handleChange(field.sno, text, index)}
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
                                onValueChange={(itemValue) => handleChange(field.id, itemValue, index)}
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
                onPress={handleSubmit}
                loading={loading}
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

export default DynamicDetailIssueForms;