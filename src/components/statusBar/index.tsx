import React from "react";
import {
  View,
  StatusBar,
  StatusBarProps,
  Platform,
  NativeModules,
} from "react-native";
import { Colors } from "../../config/colors";


const { StatusBarManager } = NativeModules;

interface StatusBarComponentProps {
  backgroundColor?: string;
  opacity?: number;
  barStyle?: StatusBarProps["barStyle"];
}

const StatusBarComponent: React.FC<StatusBarComponentProps> = ({
  backgroundColor = "transparent",
  opacity = 1,
  barStyle = "default",
}: StatusBarComponentProps) => {
  const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        opacity: opacity,
      }}
    >
      <StatusBar
        translucent={true}
        animated={true}
        backgroundColor={backgroundColor || Colors.GRAY_97}
        barStyle={barStyle || "dark-content"}
      />
    </View>
  );
};

export default StatusBarComponent;
