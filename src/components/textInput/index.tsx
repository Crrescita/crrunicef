import React, { ElementType, FC, Fragment, useState } from "react";
import { StyleProp, Text, TextStyle, View } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
// import Ionicons from "@expo/vector-icons/Ionicons";
import Ionicons from 'react-native-vector-icons/Ionicons'

import { Colors } from "../../config/colors";
import styles from "./styles";

type TextInputComponentType = {
  onChangeText: (val: number | string | any) => void;
  value?: string | number | any;
  title?: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: TextInputProps["keyboardType"];
  warningMessage?: string;
  warning?: boolean | string | number;
  textInputStyle?: StyleProp<TextStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  iconStyle?: TextStyle;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  editable?: boolean;
};

const TextInputComponent: FC<TextInputComponentType> = ({
  onChangeText,
  value,
  title,
  label,
  placeholder,
  secureTextEntry = false,
  maxLength,
  keyboardType,
  warningMessage,
  warning,
  textInputStyle,
  onFocus,
  onBlur,
  iconStyle,
  autoFocus,
  blurOnSubmit,
  editable = true
}: TextInputComponentType) => {
  const [passVisible, setPassVisible] = useState<boolean>(false);

  return (
    <Fragment>
      {title && <Text style={styles.inputTextTitle}>{title}</Text>}
      <View style={styles.container}>
        <TextInput
          editable={editable}
          autoFocus={autoFocus}
          style={[styles.textInput, textInputStyle]}
          label={label}
          value={value}
          mode="outlined"
          placeholder={placeholder}
          onChangeText={onChangeText}
          outlineColor={Colors.BOX_BORDER_COLOR}
          activeOutlineColor={Colors.BOX_BORDER_COLOR}
          placeholderTextColor={Colors.TEXT_COLOR_LIGHT}
          secureTextEntry={secureTextEntry ? !passVisible : false}
          maxLength={maxLength}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          blurOnSubmit={blurOnSubmit}
        />
        {secureTextEntry && (
          <Ionicons
            onPress={() => setPassVisible(!passVisible)}
            style={[styles.iconEye, iconStyle]}
            name={passVisible ? "eye-off" : "eye"}
            size={26}
            color={Colors.BLACK}
          />
        )}
      </View>
      {warning && (
        <Text style={styles.txtWarning}>{warningMessage}</Text>
      )}
    </Fragment>
  );
};

export default TextInputComponent;


