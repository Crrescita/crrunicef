import { StyleSheet } from "react-native";
import { Colors } from "../../../config/colors";

const styles = StyleSheet.create({
   button: {
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: Colors.BUTTON,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    marginVertical:16
  },
  buttonDisabled: {
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: "#6c757d",
  },
});

export default styles;
