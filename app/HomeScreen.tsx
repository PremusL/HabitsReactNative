import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useData } from "./DataContext";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  // const [habits, setHabits] = useState<HabitType[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState("0");
  const [maxKey, setMaxKey] = useState(0);
  const { data, nextKey, fetchData } = useData();

  console.log(nextKey);

  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX < -50) {
      // checks for swipe left
      navigation.navigate("SecondScreen");
    }
  };

  const removeHabit = (habitKey: string) => {
    removeData(habitKey);
  };

  const settingKey = () => {
    const numHabits = data.length;

    if (numHabits === 0) {
      setCurrentKey("0");
    } else {
      const maxKeyString: string | null = data[numHabits - 1].habitKey;
      setMaxKey(() => parseInt(maxKeyString ?? "0") + 1);
      console.log("-----------------");
      console.log("maxKey: " + maxKey);
      console.log("-----------------");

      setCurrentKey(() => maxKey.toString());
    }
  };

  useEffect(() => {
    const waitFetchData = async () => {
      await fetchData();
      settingKey();
    };
    waitFetchData();
  }, []);

  useEffect(() => {
    const waitingSaveData = async (keyToSet: string, currentParams: any) => {
      await saveData(keyToSet, JSON.stringify(currentParams));
      await fetchData();
      fetchData();
      console.log("Data after save: ", JSON.stringify(data));
    };
    const waitingRemoveData = async (remove_key: string) => {
      await removeHabit(remove_key);
      await fetchData();
      fetchData();
      console.log("Data after remove: ", JSON.stringify(data));
    };
    if (route.params && route.params.description) {
      const currentParams = route.params;

      settingKey();
      console.log("Key value after the setting key: " + currentKey);
      waitingSaveData(currentKey, currentParams);
    } else if (route.params && route.params.remove) {
      const remove_key: string = route.params.remove;

      waitingRemoveData(remove_key);
    } else {
      console.log("no params");
    }
  }, [route.params]);
  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGesture}
    >
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
