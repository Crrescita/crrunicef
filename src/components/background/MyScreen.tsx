import React, { Children, FC, PropsWithChildren, } from "react";
import {
    StyleSheet, SafeAreaView, View, Image, StyleProp, ViewStyle,
    ImageBackground
} from "react-native";
import { Colors } from "../../config/colors";

type myProps = { style?: StyleProp<ViewStyle>; }

type Props = PropsWithChildren<myProps>;

const MyScreen: FC<Props> = ({ children, style }: Props) => {
    return (
        <SafeAreaView style={[styles.screen]}>


            {style ?
                <View style={[styles.view, style]}>
                    {children}
                </View>
                : <ImageBackground
                    style={[styles.view, style]}
                    blurRadius={2}
                    source={require("../../assets/bg_image.png")}>
                    {children}
                </ImageBackground>}



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: 40,
        flex: 1,
    },
    view: {
        backgroundColor: Colors.BACKGROUND_COLOR,
        flex: 1,
    },
    logo: {
        width: 188,
        height: 188,
    },
});

export default MyScreen;