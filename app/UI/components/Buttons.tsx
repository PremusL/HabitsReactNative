import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ViewStyle,
} from "react-native";
import {
  AddButtonProps,
  IncreaseFrequencyButtonProps,
  RemoveButtonProps,
} from "../types/button.d";
import { updateDataDB } from "./DataBaseUtil";
import { buttonStyles } from "../style/styles";

const AddButton: React.FC<AddButtonProps> = ({
  navigation,
  whereTo,
  disabled = false,
  data = {},
}) => (
  <TouchableOpacity
    style={[
      buttonStyles.addButton,
      disabled ? { backgroundColor: "grey" } : { backgroundColor: "darkgreen" },
    ]}
    onPress={() => navigation.navigate(whereTo, data as any)}
    disabled={disabled}
  >
    <Text style={{ color: "white", fontWeight: "normal", fontSize: 24 }}>
      +
    </Text>
  </TouchableOpacity>
);

const RemoveButton: React.FC<RemoveButtonProps> = ({
  navigation,
  whereTo = "Home",
  data = {},
}) => {
  const handleRemoveButtonPress = () => {
    Alert.alert(
      "Remove habit",
      "Do you want to delete this habit?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => navigation.navigate(whereTo, data as any),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={[buttonStyles.removeButton]}
      onPress={handleRemoveButtonPress} // ta any bi blo treba zamenat z dejansko obliko
    >
      <Text style={{ color: "white", fontWeight: "normal", fontSize: 24 }}>
        -
      </Text>
    </TouchableOpacity>
  );
};
const IncreaseFrequencyButton: React.FC<IncreaseFrequencyButtonProps> = ({
  data,
}) => {
  const handleFrequencyButtonPress = () => {
    Alert.alert(
      "Increase Frequency",
      "Did it happen again?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const newFrequency = data.frequency ? data.frequency + 1 : 1;
            data = { ...data, frequency: newFrequency };
            console.log("New data: ", data);
            await updateDataDB(data);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={[buttonStyles.frequencyButton]}
      onPress={handleFrequencyButtonPress}
    >
      <Text style={{ color: "white", fontWeight: "normal", fontSize: 24 }}>
        +
      </Text>
    </TouchableOpacity>
  );
};

export { AddButton, RemoveButton, IncreaseFrequencyButton };
