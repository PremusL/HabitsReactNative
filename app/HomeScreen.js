import React, { useState, useEffect } from "react";
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

const HomeScreen = ({ navigation, route }) => {
  const [habits, setHabits] = useState([]);
  const [currentKey, setCurrentKey] = useState(0);
  // currentKey = 0;
  const addHabit = (habitName, habitDate) => {
    setHabits([
      ...habits,
      { name: habitName, date: habitDate, habitKey: currentKey },
    ]);
    setCurrentKey(currentKey + 1);
    console.log(habits);
  };
  const removeHabit = (habitKey) => {
    const updatedHabits = habits.filter((habit) => habit.habitKey != habitKey);

    setHabits(updatedHabits);
  };

  useEffect(() => {
    if (route.params && route.params.description) {
      const currentParams = route.params;
      const paramDescription = currentParams.description;
      const paramDate = currentParams.date;
      addHabit(paramDescription, paramDate);
      console.log("route.params: ", paramDate);
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
    backgroundColor: "#99a8bf",
  },
};
