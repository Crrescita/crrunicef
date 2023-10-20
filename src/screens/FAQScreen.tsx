import React, { FC, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, ScrollView, Image, FlatList, LogBox, BackHandler, Alert
} from 'react-native';
// import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import { useNavigation, RouteProp, useRoute, CommonActions } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { MyScreen, Header, Button } from '../components';
import { API_URL } from "../utils/constant";
import axios from 'axios';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';
import Entypo from 'react-native-vector-icons/Entypo'


type FAQScreenRoute = RouteProp<RootStackParamList, "FAQScreen">;
type Props = Record<never, string>;
const FAQScreen: FC<Props> = ({ }: Props) => {
    const route = useRoute<FAQScreenRoute>();
    const menuId = route?.params?.menuId;
    const navigation = useNavigation<RootNavigationProp>();
    const baseUrl = API_URL.BASE_URL_DEV;
    const [headerColor, setHeaderColor] = useState("");
    const [data, setMyData] = useState([
        {
            "label": "Why do we use it ?",
            "value": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        },
        {
            "label": "Why do we use it ?",
            "value": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        }
    ]);
    const toast = useToast();


    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        LogBox.ignoreAllLogs();
        getAreYouFacingAnyIssueData();
    }, []);



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
        await axios.get(`${baseUrl}/general/faq?id=${menuId}`,
            await getHeader()).then((response) => {
                setMyData(response.data.data);
                console.log(response.data.data);

            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <MyScreen>
            <Header navigation={navigation} style={styles.header}
                header='FAQ' />

            <ScrollView>
                <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                    <View style={{ marginTop: 15 }}>

                        {/*  interpretation */}
                        {data != null &&
                            <>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={data}
                                    style={{
                                        marginBottom: 10,
                                    }}
                                    renderItem={
                                        ({ item, index }) => <View style={{
                                            marginLeft: 10,
                                            marginRight: 20,
                                            marginTop: 10,
                                            justifyContent: 'center',
                                            flex: 1,
                                        }}>
                                            <Text
                                                ellipsizeMode='tail'
                                                style={{
                                                    color: Colors.BLACK,
                                                    fontSize: 18,
                                                    fontWeight: '500',
                                                    marginLeft: 10,
                                                }}
                                            >{item.label}</Text>

                                            <Text
                                                ellipsizeMode='tail'
                                                style={{
                                                    color: Colors.BLACK,
                                                    fontSize: 12,
                                                    marginLeft: 10,
                                                }}
                                            >{item.value}</Text>
                                        </View>
                                    }
                                />

                            </>
                        }


                    </View>

                </View>
            </ScrollView>

        </MyScreen>
    );
};




const styles = StyleSheet.create({
    header_logo: {
        width: 250,
        height: 250,
    },
    header: {
        paddingTop: 30
    },
    textQuestion: {
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        fontWeight: '700',
        fontSize: 20,
        alignItems: 'center',
        marginTop: 30,
    },


});

export default FAQScreen;