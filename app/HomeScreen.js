import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./App";
import { getAllKeys, multiGet, saveData, clearAll } from "./LocalStorageUtil";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation, route }) => {
  const [habits, setHabits] = useState([]);
  const [currentKey, setCurrentKey] = useState(0);
  // for clearing the local storage
  // clearAll();

  const fetchData = async () => {
    try {
      const keys = await getAllKeys();
      const data = await multiGet(keys);
      // console.log("keys: ", keys);
      // console.log("data: ", data);
      const fetchedHabits = data.map((element) => {
        const curKeyValue = element[0];
        const jsonData = JSON.parse(element[1]);
        return {
          name: jsonData.description,
          date: jsonData.date,
          habitKey: curKeyValue,
        };
      });
      removeHabits(keys);
      setHabits(fetchedHabits);
      setCurrentKey(fetchedHabits.length);
      // You can use the keys to fetch and set habits if needed
    } catch (error) {
      console.error("Failed to fetch keys", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const removeHabits = (habitKeys) => {
    const updatedHabits = habits.filter(
      (habit) => !habitKeys.includes(habit.habitKey)
    );

    setHabits(updatedHabits);
  };

  useEffect(() => {
    if (route.params && route.params.description) {
      const currentParams = route.params;
      const paramDescription = currentParams.description;
      const paramDate = currentParams.date;
      // addHabit(paramDescription, paramDate);
      // Save habit data when the component mounts
      saveData(currentKey.toString(), JSON.stringify(currentParams));
      setCurrentKey(currentKey + 1);
    } else if (route.params && route.params.remove) {
      const remove_key = route.params.remove;
      removeHabit(remove_key);
    } else {
      console.log("no params");
    }
  }, [route.params]);

  return (
    <View style={styles.mainPage}>
      <Text style={{ fontSize: 20, padding: 10 }}>I will quit:</Text>
      <AddButton navigation={navigation} whereTo={"Habit"} />
      <HabitList habits={habits} navigation={navigation} />
    </View>
  );
};
export default HomeScreen;

styles = {
  mainPage: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#cccccc",
  },
};
