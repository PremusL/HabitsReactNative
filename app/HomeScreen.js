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
import { getAllKeys, multiGet, saveData } from "./LocalStorageUtil";

const HomeScreen = ({ navigation, route }) => {
  let data = [];
  const [habits, setHabits] = useState([]);
  const [currentKey, setCurrentKey] = useState(0);
  // currentKey = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await getAllKeys();
        data = await multiGet(keys);
        // console.log("keys: ", keys);
        // console.log("data: ", data);

        // You can use the keys to fetch and set habits if needed
      } catch (error) {
        console.error("Failed to fetch keys", error);
      }
    };
    fetchData();
    // make a list of habbits from the data that is read from the local storage,
    //the data is already saved here, it might be a problem because it is recognizing
    // one key less than actually exists
    data.forEach((element) => {
      console.log("element: " + element);
      // setHabits([
      //   ...habits,
      //   { name: element.habitName, date: habitDate, habitKey: currentKey },
      // ]);
    });
  }, [route.params]); // it runs every time when route.params changes

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
    backgroundColor: "#99a8bf",
  },
};
