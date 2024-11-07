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

import { getTextColorBasedOnBackground } from "../Util";
import HabitScreenAnother from "./HabitScreenAnother";
import { useDataContext } from "../Contexts/DataContext";
import { getLocalDB } from "../DataBaseUtil";
import { useLoadingContext } from "../Contexts/LoadingContext";
import { deleteHabitLocalDb } from "../LocalStorageUtil";

const HabitScreen: React.FC<HabitScreenProps> = ({ navigation, route }) => {
  const { loading, setLoading } = useLoadingContext();
  const [showEdit, setShowEdit] = useState(false);
  const [showAnother, setShowAnother] = useState(false);

  const habit_id = route?.params.habit_id;

  const { data, fetchData } = useDataContext();
  const currentHabit = data.find(
    (habit: HabitType) => habit.habit_id === habit_id
  );
  if (!currentHabit) {
    throw new Error("Habit with habit_id " + habit_id + " not found");
  }

  console.log("Current habit: ", currentHabit);

  const handleUpdateFetchData = async () => {
    await updateDataDB(data);
    await fetchData();
  };

  const editSaveButtonHandler = () => {
    if (showEdit) {
      setShowEdit(false);
      handleUpdateFetchData();

      console.log("Save changes");
    } else {
      // Edit habit
      setShowEdit(true);
      console.log("Edit habit");
    }
  };

  const handleSetShowAnother = (showEdit: boolean) => {
    setShowAnother(showEdit);
  };

  const handleSetShowEdit = (showEdit: boolean) => {
    console.log("Set show edit: ", showEdit);
    setShowEdit(showEdit);
  };

  const onPressRemoveButton = async () => {
    const db = await getLocalDB();
    setLoading(true);
    await deleteHabitLocalDb(db, habit_id);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {!showAnother && !showEdit && (
        <IncreaseFrequencyButton
          data={currentHabit}
          setShowAnother={handleSetShowAnother}
        />
      )}
      {!showAnother && !showEdit && (
        <RemoveButton
          navigation={navigation}
          whereTo="Home"
          onPress={() => {
            onPressRemoveButton();
          }}
        />
      )}
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
            {currentHabit.name}
          </Text>
          {currentHabit.icon && (
            <Icon
              name={currentHabit.icon}
              color={currentHabit.color}
              size={30}
              style={{ textAlign: "center", marginBottom: 15 }}
            />
          )}
        </View>
        {showAnother && (
          <HabitScreenAnother
            habit_id={habit_id}
            setShowAnother={setShowAnother}
          />
        )}
        {!showEdit && !showAnother && (
          <HabitScreenPreview habit_id={habit_id} />
        )}
        {showEdit && (
          <HabitScreenEdit habit_id={habit_id} setEdit={handleSetShowEdit} />
        )}
        {!showEdit && !showAnother && (
          <TouchableOpacity
            onPress={() => editSaveButtonHandler()}
            style={{
              marginTop: 20,
              marginBottom: 40,
              backgroundColor:
                currentHabit.color == "#ffffff"
                  ? "#1a1a1a"
                  : currentHabit.color,
              borderRadius: 5,
              alignItems: "center",
              width: 150,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                margin: 8,
                color:
                  currentHabit.color == "#ffffff"
                    ? "#ffffff"
                    : getTextColorBasedOnBackground(
                        currentHabit.color as string
                      ),
              }}
            >
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
