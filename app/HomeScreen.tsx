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
import { HabitList } from "./HabitObject";
import {
  getAllKeys,
  multiGet,
  saveData,
  clearAll,
  removeData,
} from "./LocalStorageUtil";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreenProps } from "./types/screen.d";
import styles from "./style/styles";
import { HabitType } from "./types/habit.d";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [currentKey, setCurrentKey] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);

  // get all keys and data from AsyncStorage
  const fetchData = async () => {
    try {
      const keys = await getAllKeys();
      if (!keys) {
        return;
      }
      const data = await multiGet(keys);
      if (!data) {
        return;
      }
      const fetchedHabits = data.map((element: any) => {
        const curKeyValue = element[0];
        const jsonData = JSON.parse(element[1]);
        return {
          name: jsonData.description,
          date: jsonData.date,
          habitKey: curKeyValue,
        };
      });
      if (!fetchedHabits) {
        return;
      }
      setHabits(fetchedHabits);
      setCurrentKey(fetchedHabits.length);
      // You can use the keys to fetch and set habits if needed
    } catch (error) {
      console.error("Failed to fetch keys", error);
    }
  };
  // calls fetchData just once
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const removeHabit = (habitKey: string) => {
    removeData(habitKey);
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
      const remove_key: string = route.params.remove;
      removeHabit(remove_key);
    } else {
      console.log("no params");
    }
  }, [route.params]);

  return (
    <View style={styles.mainPage}>
      <AddButton navigation={navigation} whereTo="HabitCreationScreen" />
      <HabitList
        habits={habits}
        navigation={navigation as any}
        selectedHabit={selectedHabit}
        setSelectedHabit={(habitKey) => setSelectedHabit(habitKey ?? null)}
      />
    </View>
  );
};
export default HomeScreen;
