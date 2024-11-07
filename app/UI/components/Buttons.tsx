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
  onPress,
}) => {
  const handleAddButtonPress = () => {
    try {
      onPress();
    } catch (e) {
      console.log("On press in addButton doesn't work", e);
    }
    navigation.navigate(whereTo as any);
  };

  return (
    <TouchableOpacity
      style={[
        buttonStyles.addButton,
        disabled
          ? { backgroundColor: "grey" }
          : { backgroundColor: "darkgreen" },
      ]}
      onPress={() => {
        handleAddButtonPress();
      }}
      disabled={disabled}
    >
      <Text style={{ color: "white", fontWeight: "normal", fontSize: 24 }}>
        +
      </Text>
    </TouchableOpacity>
  );
};

const RemoveButton: React.FC<RemoveButtonProps> = ({ navigation, onPress }) => {
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
          onPress: () => {
            onPress;
            navigation.navigate("Home");
          },
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
  setShowAnother,
}) => {
  const handleFrequencyButtonPress = () => {
    Alert.alert(
      "Did it happen again?",
      "",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            setShowAnother(true);
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
