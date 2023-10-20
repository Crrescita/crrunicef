import React, { FC } from "react";
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button as RNPButton } from "react-native-paper";
import { Colors } from "../../../config/colors";
import styles from "./styles";

type OutlineButtonType = {
    disabled?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
    onPress?: (e: GestureResponderEvent) => void;
    loading?: boolean,
    title?: string,
};

const OutlineButton: FC<OutlineButtonType> = ({
    disabled,
    contentStyle,
    onPress,
    loading,
    title,
}) => {

    return (
        <Pressable  onPress={onPress}>
            <RNPButton
                disabled={disabled}
                contentStyle={contentStyle}
                labelStyle={styles.buttonText}
                mode="text"
                loading={loading}
                textColor={Colors.BLACK}
            >
                {title}
            </RNPButton>
        </Pressable>
    );
};

export default OutlineButton;

