import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { IncreaseFrequencyButton, RemoveButton } from "../Buttons";
import { HabitScreenProps } from "../../types/screen.d";
import Icon from "react-native-vector-icons/FontAwesome";
import { HabitType } from "../../types/habit.d";
import { updateDataDB } from "../DataBaseUtil";
import HabitScreenEdit from "./HabitScreenEdit";
import HabitScreenPreview from "./HabitScreenPreview";

const HabitScreen: React.FC<HabitScreenProps> = ({ navigation, route }) => {
  const currentParams = route?.params;
  const [data, setData] = useState(currentParams);
  const [showEdit, setShowEdit] = useState(false);

  const editSaveButtonHandler = () => {
    if (showEdit) {
      setShowEdit(false);

      updateDataDB(data);
      console.log("Save changes");
    } else {
      // Edit habit
      setShowEdit(true);
      console.log("Edit habit");
    }
  };

  const handleDataUpdate = (data: HabitType) => {
    setShowEdit(false);
    setData(data);
  };

  console.log("Current data: ", data);
  return (
    <View style={{ flex: 1 }}>
      <IncreaseFrequencyButton data={data} updateData={handleDataUpdate} />
      <RemoveButton
        navigation={navigation}
        whereTo="Home"
        data={{ remove: data?.habit_key }}
      />
      <ScrollView style={styles.habit_view}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "center",
              marginRight: 10,
              marginBottom: 15,
            }}
          >
            {data?.name}
          </Text>
          {data.icon && (
            <Icon
              name={data?.icon}
              color={data.color}
              size={30}
              style={{ textAlign: "center", marginBottom: 15 }}
            />
          )}
        </View>
        {!showEdit && <HabitScreenPreview data={data} />}
        {showEdit && (
          <HabitScreenEdit currentParams={data} setData={handleDataUpdate} />
        )}

        {!showEdit && (
          <TouchableOpacity
            onPress={() => editSaveButtonHandler()}
            style={{
              marginTop: 20,
              marginBottom: 40,
              backgroundColor: data.color == "#ffffff" ? "#1a1a1a" : data.color,
              borderRadius: 5,
              alignItems: "center",
              width: 150,
              alignSelf: "center",
            }}
          >
            <Text style={{ fontSize: 18, margin: 8, color: "white" }}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  habit_view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#cccccc",
  },
});

export default HabitScreen;
