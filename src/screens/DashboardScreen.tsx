import React, { FC, useEffect, useState } from 'react';
import {
    View, StyleSheet, Text, Image,
    NativeModules,
    FlatList, TouchableWithoutFeedback,
    GestureResponderEvent, SafeAreaView, Platform, TouchableOpacity
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import MyCrousel from '../components/crousel/MyCrousel';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { API_URL } from "../utils/constant";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { StatusBarManager } = NativeModules;

type Props = Record<never, string>;
const DashboardScreen: FC<Props> = ({ }: Props) => {
    const [data, setData] = useState([]);
    const [banner, setBannerData] = useState([]);
    const baseUrl = API_URL.BASE_URL_DEV;
    const [userName, setUserName] = useState("");
    const [userProfilePic, setUserProfilePic] = useState("");
    const [generalDataFlag, setGeneralDataFlag] = useState("0");
    const [token, setUserToken] = useState("");

    const getDashboardData = async () => {
        await axios.get(`${baseUrl}/home/getAll`, await getHeader()).then((response) => {
            setGeneralDataFlag(response.data.data.general_data);
            setData(response.data.data.category);
            setBannerData(response.data.data.banner);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        getDashboardData();
        getUserDataFromLocal();
    }, []);




    const getHeader = async () => {
        const value = await AsyncStorage.getItem("USER");
        let token = JSON.parse(value).token;
        if (!token) {
            return {};
        }
        return {
            headers: {
                token: `${token}`,
            },
        };
    };

    const getUserDataFromLocal = async () => {
        try {
            const value = await AsyncStorage.getItem("USER");
            if (value !== null) {
                // We have data!!
                console.log(JSON.parse(value));
                setUserName(JSON.parse(value).name);
                setUserProfilePic(JSON.parse(value).profile_pic);

            }
        } catch (error) {
            // Error retrieving data
        }

    }

    const navigation = useNavigation<RootNavigationProp>();

    function Card({ title, subTitle, image, onPress }:
        {
            title: string,
            subTitle: string,
            image: string,
            onPress?: (e: GestureResponderEvent) => void;
        }) {
        return (
            <TouchableWithoutFeedback
                onPress={onPress}
            >
                <View style={styles.card}>
                    <View
                        style={{
                            flex: 9,
                            flexDirection: 'row',
                        }}>
                        <Image style={styles.image} source={{ uri: image }} />
                        <View style={{
                            width: 1,
                            height: 60,
                            marginVertical: 10,
                            marginLeft: 10,
                            backgroundColor: Colors.BOX_BORDER_COLOR
                        }} />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                                {title}
                            </Text>
                            <Text style={styles.subTitle} numberOfLines={2} ellipsizeMode='tail'>
                                {subTitle}
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginRight: 10,

                    }}>
                        <AntDesign
                            name={"right"}
                            size={24}
                            color={Colors.BLACK}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 0 : StatusBarManager.HEIGHT;

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: Colors.WHITE,
            marginTop: STATUSBAR_HEIGHT
        }}>

            <View style={{
                flex: 1,
                backgroundColor: Colors.DARK_NAVY_BLUE_PRIMARY
            }}>
                <View style={styles.headerTop}>

                    <View>
                        <Text style={{
                            color: Colors.BOTTOM_TEXT_COLOR,
                            fontWeight: '500',
                            fontSize: 16,
                            marginTop: 10,
                            marginStart: 10
                        }}>Hello,</Text>

                        <Text style={{
                            color: Colors.WHITE,
                            fontWeight: '700',
                            fontSize: 18,
                            marginTop: 2,
                            marginStart: 10
                        }}>{userName}</Text>


                    </View>

                    <View
                        style={{
                            marginHorizontal: 10,
                            flex: 1,
                            alignItems: 'flex-end',
                            alignSelf: 'center',
                        }}>

                        <TouchableOpacity onPress={() => {
                            navigation.navigate("ProfileScreen");
                        }}>

                            <View style={{
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                backgroundColor: "#6c757d",
                                alignContent: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>

                                <Text style={{
                                    color: "white", alignContent: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    fontWeight: '700',
                                }}>{Array.from(userName)[0]}</Text>

                            </View>
                            {/* <Image
                                style={{ height: 40, width: 40, borderRadius: 20 }}
                                source={{ uri: userProfilePic }} /> */}
                        </TouchableOpacity>

                    </View>


                </View>


                <View style={{ marginBottom: 22 }}>
                    <MyCrousel data={banner} />
                </View>

                <View style={styles.listContainer}>

                    <Text style={{
                        color: Colors.DARK_NAVY_BLUE_PRIMARY,
                        fontWeight: '700',
                        fontSize: 18,
                        marginTop: 20,
                        marginStart: 20,
                        marginBottom: 20,
                    }}>Our Best Services</Text>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        style={{
                            marginBottom: 20,
                            marginHorizontal: 15,
                        }}
                        renderItem={
                            ({ item, index }) => <Card key={item?.id + 'item__'} title={item.name}
                                subTitle={item.description}
                                image={item.icon}
                                onPress={() => {
                                    if (generalDataFlag == "1") {
                                        console.log();
                                        navigation.navigate('SubMenuScreen', {
                                            id: item.id, title: item.name
                                        });
                                    } else {
                                        console.log();
                                         navigation.navigate('GeneralFormScreen');
                                        // navigation.navigate('SubMenuScreen', {
                                        //     id: item.id,
                                        //     title: item.name
                                        // });
                                    }
                                }} />
                        }
                        keyExtractor={item => item?.id}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};




const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: Colors.DARK_NAVY_BLUE_PRIMARY,
    },
    headerTop: {
        height: 80,
        flexDirection: 'row',
    },
    card: {
        borderRadius: 15,
        backgroundColor: Colors.lightThemeColor,
        flex: 1,
        flexDirection: "row",
        borderColor: Colors.BOX_BORDER_COLOR,
        borderWidth: 1,
        marginTop: 10,
        width: "100%",
    },
    listContainer: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_COLOR,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    title: {
        color: Colors.DARK_NAVY_BLUE_PRIMARY,
        fontWeight: '500',
        fontSize: 16,
        marginTop: 2,
    },
    subTitle: {
        color: Colors.TEXT_COLOR_DASHBOARD,
        fontSize: 12,
        fontWeight: '400',
    },
    image: {
        width: 60,
        height: 60,
        marginHorizontal: 10,
        marginVertical: 10,
        resizeMode: "contain"
    },

    detailsContainer: {
        marginLeft: 10,
        marginRight: 20,
        justifyContent: 'center',
        flex: 1,
    },


});

export default DashboardScreen;