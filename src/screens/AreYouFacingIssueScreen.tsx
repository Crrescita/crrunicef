import React, { FC, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, ScrollView
} from 'react-native';
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { MyScreen, Header, Button } from '../components';
import { API_URL } from "../utils/constant";
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../src/types';


type areYourFacingScreenRoute = RouteProp<RootStackParamList, "AreYouFacingIssueScreen">;
type Props = Record<never, string>;
const AreYouFacingIssueScreen: FC<Props> = ({ }: Props) => {
    const route = useRoute<areYourFacingScreenRoute>();
    const menuId = route?.params?.menuId;

    const navigation = useNavigation<RootNavigationProp>();
    const baseUrl = API_URL.BASE_URL_DEV;
    const [title, setTitle] = useState("Are you facing any issue?");
    const [selectedValue, setSelectedValue] = useState('');
    const [listData, setMyData] = useState([]);
    const toast = useToast();

    const [token, setUserToken] = useState("");
    useEffect(() => {

    }, [])


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


    const getAreYouFacingAnyIssueData = async () => {
        axios.get(`${baseUrl}/general/getFacingissueslist?id=${menuId}`, await getHeader()).then((response) => {
            setMyData(response.data.data);

        }).catch((error) => {
            console.log(error);
        });
    };



    useEffect(() => {
        getAreYouFacingAnyIssueData();
    }, [])





    const renderCheckBox = () => {
        return listData.map((field: any) => (
            <View key={field.id}>
                <View style={styles.radioGroup}>
                    <View style={styles.radioButton}>
                        <RadioButton.Android
                            uncheckedColor='#E2DBC7'
                            value={field.id}
                            status={selectedValue === field.id ?
                                'checked' : 'unchecked'}
                            onPress={() => setSelectedValue(field.id)}
                            color="#007BFF"
                        />
                        <Text onPress={() => setSelectedValue(field.id)}
                            style={styles.radioLabel}>
                            {field.title}
                        </Text>

                    </View>

                </View>
            </View>
        ));
    };



    return (
        <MyScreen>

            <Header navigation={navigation} style={styles.header}
                header='Question' headerStyle={styles.textHeadingHeader} />


            <Text style={styles.textQuestion}>{title}</Text>
            <ScrollView>
                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                    <View style={{ marginTop: 15 }}>
                        {renderCheckBox()}
                    </View>
                </View>
            </ScrollView>


            <View style={{
                margin: 10
            }}>
                <Button
                    onPress={() => {
                        if (selectedValue) {
                            navigation.navigate("IssuesFormScreen", { id: selectedValue })
                            console.log(selectedValue);
                        } else {
                            showDangerToast("Select issue!")
                        }

                    }}
                    title="Next"
                />
            </View>


        </MyScreen>
    );
};




const styles = StyleSheet.create({
    radioGroup: {
        flexDirection: 'column',
        marginTop: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    header: {
        paddingTop: 30
    },
    textHeadingHeader: {
        fontSize: 20,
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        fontWeight: '700',
        paddingTop: 15,
        paddingLeft: 15
    },
    textQuestion: {
        color: Colors.BLACK,
        fontWeight: '500',
        fontSize: 16,
        marginLeft: 20,
        marginTop: 30,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginLeft: 0,
        marginTop: 10,
        marginBottom: 0,
    },
    label: {
        marginVertical: 5,
        marginHorizontal: 10,
        color: '#000000',
        fontWeight: '400',
        fontSize: 14,
    },

});

export default AreYouFacingIssueScreen;