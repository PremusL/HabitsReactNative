import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AddButton = ({ navigation, whereTo, disabled = false, data = {} }) => (
  <TouchableOpacity
    style={[
      styles.addButton,
      disabled ? { backgroundColor: "grey" } : { backgroundColor: "darkgreen" },
    ]}
    onPress={() => navigation.navigate(whereTo, data)}
    disabled={disabled}
  >
    <Text style={{ color: "white", fontWeight: "normal", fontSize: 24 }}>
      +
    </Text>
  </TouchableOpacity>
);

const RemoveButton = ({ navigation, whereTo = "Home", data = {} }) => {
  console.log("RemoveButton data: ", data);
  return (
    <TouchableOpacity
      style={[styles.removeButton]}
      onPress={() => navigation.navigate(whereTo, data)}
    >
      <Text style={{ color: "white", fontWeight: "normal", fontSize: 24 }}>
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
