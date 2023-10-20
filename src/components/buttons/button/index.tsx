import React, { ElementType, FC, Fragment } from "react";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Button as RNPButton } from "react-native-paper";
import styles from "./styles";

type ButtonType = {
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    onPress?: (e: GestureResponderEvent) => void;
    loading?: boolean;
    title?: string;
    Icon?: ElementType,
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
};
const Button: FC<ButtonType> = ({
    disabled,
    style,
    onPress,
    loading,
    title,
    Icon,
    iconName,
    iconSize,
    iconColor,
}: ButtonType) => {

    return (
        <Fragment>
            <RNPButton
                disabled={disabled}
                style={[
                    disabled
                        ? styles.buttonDisabled
                        : styles.button,
                    style]}
                labelStyle={styles.buttonText}
                mode="elevated"
                onPress={onPress}
                loading={loading}
            >
                {title}
                {Icon &&
                    (<Icon
                        name={iconName}
                        size={iconSize}
                        color={iconColor}
                    />
                    )
                }
            </RNPButton>
        </Fragment>
    );
};

export default Button;