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
import { useData } from './DataContext';


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  // const [habits, setHabits] = useState<HabitType[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState(0);
  const { data, fetchData } = useData();

  const keyToSet = currentKey === -1 ? 0 : currentKey;

  const removeHabit = (habitKey: string) => {
    removeData(habitKey);
  };

  useEffect(() => {
    console.log("data: " + data);
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

  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX < -50) { // checks for swipe left
      navigation.navigate("SecondScreen")
    }
  };
  // calls fetchData just once
  useFocusEffect(
    useCallback(() => {
      fetchData();
      data.forEach((element: any, index: number) => {console.log("nummero: " + index + " " + JSON.stringify(element))});
      // console.log("Data v homescreenu: " + data);
    }, [])
  );
  return (
    <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
    <View style={styles.mainPage}>
      <AddButton navigation={navigation} whereTo="HabitCreationScreen" />
      <HabitList
        habits={data}
        navigation={navigation as any}
        selectedHabit={selectedHabit}
        setSelectedHabit={(habitKey) => setSelectedHabit(habitKey ?? null)}
      />
    </View>
    </PanGestureHandler>
  );
};
export default HomeScreen;
