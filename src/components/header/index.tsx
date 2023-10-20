import React, { FC, Fragment } from "react";
import { StyleProp, StyleSheet, ViewStyle, View, Text } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import styles from "./styles";
import { Colors } from "../../config/colors";
import Ionicons from 'react-native-vector-icons/Ionicons'

type HeaderType = {
    navigation: NavigationProp<ParamListBase>,
    style?: StyleProp<ViewStyle>;
    header?: string;
    headerStyle?: StyleProp<ViewStyle>;
};

const Header: FC<HeaderType> = ({
    navigation,
    style,
    header,
    headerStyle,
}) => {

    return (
        <Fragment>
            <View style={{ flexDirection: "row" }}>
                <Ionicons
                    onPress={() => navigation.goBack()}
                    style={[styles.arrowBack, style]}
                    name={"arrow-back"}
                    size={28}
                    color={Colors.BLACK}
                />

                {header && <Text style={[styles.textHeading, style]}>{header}</Text>}

            </View>

        </Fragment>
    );
};



export default Header;


