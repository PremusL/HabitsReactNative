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
import { PanGestureHandler, State } from 'react-native-gesture-handler';


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState(0);

  const keyToSet = currentKey === -1 ? 0 : currentKey;

  const removeHabit = (habitKey: string) => {
    removeData(habitKey);
  };

  useEffect(() => {
    if (route.params && route.params.description) {
      const currentParams = route.params;
      const paramDescription = currentParams.description;
      const paramDate = currentParams.date;
      const paramTime = currentParams.time;
      console.log("paramTime", paramTime);
      // addHabit(paramDescription, paramDate);
      // Save habit data when the component mounts
      console.log("time to add: ", currentParams);
      saveData(keyToSet.toString(), JSON.stringify(currentParams));
      // setCurrentKey(prev => prev + 1);

    } else if (route.params && route.params.remove) {
      const remove_key: string = route.params.remove;
      console.log("time to remove: ", remove_key);
      removeHabit(remove_key);
      // setCurrentKey(prev => prev + 1);

    } else {
      console.log("no params");
    }
  }, [route.params]);

  // get all keys and data from AsyncStorage
  const fetchData = async () => {
    try {
      const readonlyKeys: readonly string[] | undefined = await getAllKeys();
      const keys: string[] | undefined = readonlyKeys?.slice();
      keys?.sort((a, b) => parseInt(a) - parseInt(b));
      console.log("Keys: ", keys);
      if (!keys) {
        console.log("No keys found");
        return;
      }
      
      const data = await multiGet(keys);
      if (!data) {
        console.log("Multi get didn't work");
        return;
      }
      let fetchedHabits = data.map((element: any) => {
        const curKeyValue = element[0];
        const jsonData = JSON.parse(element[1]);
        return {
          name: jsonData.description,
          date: jsonData.date,
          time: jsonData.time,
          habitKey: curKeyValue,
        };
      });
      if (!fetchedHabits) {
        return;
      }
      fetchedHabits = fetchedHabits.sort((a , b) => a.habitKey - b.habitKey);
      console.log("Fetched habits: ", fetchedHabits);
      setHabits(fetchedHabits);
      
      setCurrentKey(keys[keys.length - 1] ? parseInt(keys[keys.length - 1]) + 1 : 0);
      // You can use the keys to fetch and set habits if needed
    } catch (error) {
      console.error("Failed to fetch keys", error);
    }
  };
  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    console.log(nativeEvent.translationX, nativeEvent.translationY);

    if (nativeEvent.translationX < -50) {
      
      navigation.navigate("SecondScreen") // Replace "NewScreen" with your target screen name
    }
  };
  // calls fetchData just once
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  return (
    <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
    <View style={styles.mainPage}>
      <AddButton navigation={navigation} whereTo="HabitCreationScreen" />
      <HabitList
        habits={habits}
        navigation={navigation as any}
        selectedHabit={selectedHabit}
        setSelectedHabit={(habitKey) => setSelectedHabit(habitKey ?? null)}
      />
    </View>
    </PanGestureHandler>
  );
};
export default HomeScreen;
