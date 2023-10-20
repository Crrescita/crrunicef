

import { StyleSheet } from "react-native";
import { Colors } from "../../config/colors";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  inputTextTitle: {
    marginTop: 20,
    marginBottom: 5,
    color: Colors.BLACK,
    fontSize: 14,
    fontWeight: '500'


  },
  textInput: {
    width: "100%",
    textTransform: "none",

  },
  iconEye: {
    position: "absolute",
    right: 10,
    top: 17
  },
  txtWarning: {
    color: Colors.WARNING_RED
  },

});

export default styles;