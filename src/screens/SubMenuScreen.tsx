import React, { FC, useEffect, useState } from 'react';
import {
    View, StyleSheet, Text, Dimensions, Image,
    FlatList, TouchableWithoutFeedback, GestureResponderEvent
} from 'react-native';

import { useNavigation, RouteProp, useRoute, CommonActions } from "@react-navigation/native";
import { RootNavigationProp } from '../../App';
import { Colors } from '../config/colors';
import { MyScreen, Header } from '../components';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../src/types';

type subMenuScreenRoute = RouteProp<RootStackParamList, "SubMenuScreen">;
type Props = Record<never, string>;
const SubMenuScreen: FC<Props> = ({ }: Props) => {
    const route = useRoute<subMenuScreenRoute>();
    const menuId = route?.params?.id;
    const title = route?.params?.title;
    const navigation = useNavigation<RootNavigationProp>();
    const [token, setUserToken] = useState("");


    useEffect(() => {
        getToken();
    }, [])

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem("USER");
            if (value !== null) {
                // We have data!!
                console.log(JSON.parse(value));
                setUserToken(JSON.parse(value).token);

            }
        } catch (error) {
            // Error retrieving data
        }

    }

    const MYDATA = [
        {
            "id": "1",
            "image": require("../assets/logo.png"),
            "image_server": "https://crrescita.s3.ap-south-1.amazonaws.com/mobAppIcon/general_detail.png",
            "title": "Edit Health Details",
            "desciption": "Update personal, medical, and family health information."
        },
        {
            "id": "2",
            "image": require("../assets/logo.png"),
            "title": "Are you facing any issue?",
            "image_server": "https://crrescita.s3.ap-south-1.amazonaws.com/mobAppIcon/areyoufacingissue.png",
            "desciption": "Check symptoms, book consultations, and access emergency contacts."
        },
        {
            "id": "3",
            "image": require("../assets/logo.png"),
            "title": "FAQ",
            "image_server": "https://crrescita.s3.ap-south-1.amazonaws.com/mobAppIcon/faq.png",
            "desciption": "Guidance on app usage, health queries, data privacy, and technical support."
        }
    ];

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

                        <Image style={styles.image}
                            source={{ uri: image }} />

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

    return (
        <MyScreen>

            <Header navigation={navigation} style={styles.header}
                header={title} headerStyle={styles.textHeadingHeader} />

            <View style={styles.listContainer}>

                <FlatList data={MYDATA}
                    style={{
                        marginBottom: 20,
                        marginHorizontal: 15,
                    }}
                    renderItem={
                        ({ item, index }) => <Card title={item.title}
                            subTitle={item.desciption}
                            image={item.image_server}
                            onPress={(item) => {
                                console.log();
                                if (index == 0) {
                                    navigation.navigate('GeneralFormScreen');
                                } else if (index == 1) {
                                    navigation.navigate('AreYouFacingIssueScreen', {
                                        menuId: menuId
                                    });
                                } else if (index == 2) {
                                    navigation.navigate('FAQScreen', {
                                        menuId: menuId
                                    });
                                }



                            }} />
                    }
                    keyExtractor={item => item.id}
                />
            </View>

        </MyScreen>
    );
};




const styles = StyleSheet.create({
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
        height: Dimensions.get('window').width + 60,
        marginVertical: 20,
        flexDirection: 'column',
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

export default SubMenuScreen;