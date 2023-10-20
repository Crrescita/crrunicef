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


type ResultScreenFacingScreenRoute = RouteProp<RootStackParamList, "ResultScreen">;
type Props = Record<never, string>;
const ResultScreen: FC<Props> = ({ }: Props) => {
    const route = useRoute<ResultScreenFacingScreenRoute>();
    const uniqueId = route?.params?.unique_id;
    const navigation = useNavigation<RootNavigationProp>();
    const baseUrl = API_URL.BASE_URL_DEV;
    const [headerColor, setHeaderColor] = useState("");
    const [data, setMyData] = useState({
        "id": 7,
        "fs_id": 3,
        "title": "",
        "type": "",
        "interpretation": {
            "label": "Interpretation & Analysis",
            "value": [
                {
                    "label": "Likely a mild fever, possibly due to a common cause."
                }
            ]
        },
        "self_help_guide": {
            "label": "Self Help Guide",
            "value": [
                {
                    "label": "Rest, hydration, and over-the-counter fever reducers."
                }
            ]
        },
        "mentor_guide": {
            "label": "Mentor's Guide",
            "value": [
                {
                    "label": "Monitor symptoms, ensure hydration, and rest."
                }
            ]
        },
        "created_at": "2023-10-09 21:00:00",
        "updated_at": "2023-10-09 21:00:00",
        "score": "(1-10)"
    });
    const toast = useToast();


    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        LogBox.ignoreAllLogs();
        getAreYouFacingAnyIssueData();
    }, []);

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to go back?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
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
        console.log('unique id at result form');
        console.log(uniqueId);
        await axios.post(`${baseUrl}/general/getUserResult`,
            { "unique_id": uniqueId },
            await getHeader()).then((response) => {
                if (response.data.data.type == 'mild') {
                    setHeaderColor('#34A853');
                } else if (response.data.data.type == 'moderate') {
                    setHeaderColor('#DA8E00');
                } else {
                    setHeaderColor('#CA380C');

                }

                setMyData(response.data.data);
                console.log(response.data.data);

            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <MyScreen>
            <View style={{ alignItems: 'center', }}>
                <Text style={styles.textQuestion}>Result</Text>
            </View>

            <ScrollView>
                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
                    <View style={{ marginTop: 15 }}>

                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <Image
                                style={styles.header_logo}
                                source={require("../assets/result.png")} />
                        </View>

                        <View style={{
                            marginTop: 20,
                            borderColor: Colors.BOX_BORDER_COLOR,
                            borderWidth: 2,
                            borderRadius: 10,
                            padding: 20,
                        }}>

                            <Text
                                style={{
                                    color: headerColor,
                                    fontSize: 16,
                                    fontWeight: '500'
                                }}
                            >{data.type + " " + data.score}</Text>


                            <View style={{
                                flexDirection: 'row',
                                marginRight: 20,
                                marginTop: 10,
                                flex: 1,
                            }}>

                                <Entypo
                                    name={"star"}
                                    size={20}
                                    color={Colors.BLACK}
                                />

                                <Text
                                    ellipsizeMode='tail'
                                    style={{
                                        color: Colors.BLACK,
                                        fontSize: 13,
                                        fontWeight: '600',
                                        marginLeft: 10,
                                    }}
                                >{data.title}</Text>
                            </View>

                        </View>

                        {/*  interpretation */}
                        {data.interpretation.value != null &&
                            <>
                                <Text
                                    style={{
                                        marginTop: 20,
                                        marginLeft: 10,
                                        color: "#34A853",
                                        fontWeight: "500",
                                        fontSize: 16
                                    }}>{data.interpretation.label}</Text>


                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={data.interpretation.value}
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
                                                    fontSize: 13,
                                                    fontWeight: '400',
                                                    marginLeft: 10,
                                                }}
                                            >{"\u25CF   " + item.label}</Text>
                                        </View>
                                    }
                                />

                            </>
                        }



                        {/* Self help guided data */}
                        {data.self_help_guide.value != null &&
                            <>
                                <Text
                                    style={{
                                        marginTop: 20,
                                        marginLeft: 10,
                                        color: "#34A853",
                                        fontWeight: "500",
                                        fontSize: 16
                                    }}>{data.self_help_guide.label}</Text>


                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={data.self_help_guide.value}
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
                                                    fontSize: 13,
                                                    fontWeight: '400',
                                                    marginLeft: 10,
                                                }}
                                            >{"\u25CF   " + item.label}</Text>
                                        </View>
                                    }
                                />

                            </>
                        }


                        {/* mentor_guide data */}
                        {data.mentor_guide.value != null &&
                            <>
                                <Text
                                    style={{
                                        marginTop: 20,
                                        marginLeft: 10,
                                        color: "#34A853",
                                        fontWeight: "500",
                                        fontSize: 16
                                    }}>{data.mentor_guide.label}</Text>


                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={data.mentor_guide.value}
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
                                                    fontSize: 13,
                                                    fontWeight: '400',
                                                    marginLeft: 10,
                                                }}
                                            >{"\u25CF   " + item.label}</Text>
                                        </View>
                                    }
                                />

                            </>
                        }


                    </View>

                </View>
            </ScrollView>


            <View style={{
                margin: 10
            }}>
                <Button
                    onPress={() => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: "DashboardScreen" }],
                            })
                        );
                    }}
                    title="Go To Home"
                />
            </View>


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

export default ResultScreen;