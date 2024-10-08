import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, ScrollView } from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import {
  getAllKeys,
  multiGet,
  saveData,
  clearAll,
  removeData,
} from "./LocalStorageUtil";
import { HomeScreenProps } from "../types/screen.d";
import styles from "../style/styles";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useData } from "./DataContext";
import { readHabitsDB, writeHabitDB, deleteHabitDB } from "./DataBaseUtil";
import { HabitType } from "../types/habit.d";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  // const [habits, setHabits] = useState<HabitType[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState("0");
  const [maxKey, setMaxKey] = useState(0);
  const [dataDB, setDataDB] = useState([]);
  // const { data, nextKey, fetchData } = useData();

  // console.log(nextKey);

  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX < -50) {
      navigation.navigate("SecondScreen");
    }
  };

  useEffect(() => {
    const waitFetchData = async () => {
      const currentData = await readHabitsDB();
      await setDataDB(currentData);
      console.log("DataDB: ", JSON.stringify(currentData));

      if (currentData.length > 0) {
        setMaxKey(currentData[currentData.length - 1]["habit_key"]);
      }
    };
    waitFetchData();
  }, []);
  useEffect(() => {
    const waitingSaveData = async (keyToSet: number, currentParams: any) => {
      currentParams["habit_key"] = keyToSet; // Set the key to the current habit
      await writeHabitDB(currentParams);
      const currentData = await readHabitsDB();
      setDataDB(currentData);

      if (currentData.length > 0) {
        setMaxKey(currentData[currentData.length - 1]["habit_key"]);
      }

      console.log("DataDB after add" + JSON.stringify(currentData), maxKey);
    };
    const waitingRemoveData = async (remove_key: string) => {
      await deleteHabitDB(remove_key);
      const currentData = await readHabitsDB();
      setDataDB(currentData);
      if (currentData.length > 0) {
        setMaxKey(currentData[currentData.length - 1]["habit_key"]);
      }
    };
    if (route.params && route.params.description) {
      const currentParams = route.params;

      console.log("-----------------");
      waitingSaveData(maxKey + 1, currentParams);

      console.log("-----------------");
    } else if (route.params && route.params.remove) {
      const remove_key: string = route.params.remove;
      waitingRemoveData(remove_key);
    } else {
      console.log("no paramss");
    }
  }, [route.params]);

  // useEffect(() => {
  //   const waitReadHabitsDB = async () => {

  //   };
  //   waitReadHabitsDB();
  // }, []);

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGesture}
    >
      <View style={styles.mainPage}>
        <AddButton navigation={navigation} whereTo="HabitCreationScreen" />
        <HabitList
          habits={dataDB}
          navigation={navigation as any}
          selectedHabit={selectedHabit}
          setSelectedHabit={(habit_key) => setSelectedHabit(habit_key ?? null)}
        />
      </View>
    </PanGestureHandler>
  );
};
export default HomeScreen;
