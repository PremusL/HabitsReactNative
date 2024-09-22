import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AddButtonProps, RemoveButtonProps } from "./types/button.d";

const AddButton: React.FC<AddButtonProps> = ({ navigation, whereTo, disabled = false, data = {} }) => (
  <TouchableOpacity
    style={[
      styles.addButton,
      disabled ? { backgroundColor: 'grey' } : { backgroundColor: 'darkgreen' },
    ]}
    onPress={() => navigation.navigate(whereTo, data as any)}
    disabled={disabled}
  >
    <Text style={{ color: 'white', fontWeight: 'normal', fontSize: 24 }}>
      +
    </Text>
  </TouchableOpacity>
);

const RemoveButton: React.FC<RemoveButtonProps> = ({ navigation, whereTo = 'Home', data = {} }) => {
  console.log('RemoveButton data: ', data);
  return (
    <TouchableOpacity
      style={[styles.removeButton]}
      onPress={() => navigation.navigate(whereTo, data as any)} // ta any bi blo treba zamenat z dejansko obliko
    >
      <Text style={{ color: 'white', fontWeight: 'normal', fontSize: 24 }}>
        -
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "red",
  },
});

export { AddButton, RemoveButton };
