import React, { useState, useEffect, useCallback, useContext } from "react";
import { View } from "react-native";
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
import { readHabitsDB, writeHabitDB } from "./DataBaseUtil";
import { HabitType } from "../types/habit.d";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  // const [habits, setHabits] = useState<HabitType[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState("0");
  const [maxKey, setMaxKey] = useState(0);
  const { data, nextKey, fetchData } = useData();
  const { dataDB, setDataDB } = useState([]);

  // console.log(nextKey);

  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX < -50) {
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
      const maxKeyString: number | null = data[numHabits - 1].habitKey;
      setMaxKey(() => (maxKeyString ? maxKeyString + 1 : 0));
      // console.log("-----------------");
      // console.log("maxKey: " + maxKey);
      // console.log("-----------------");

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
    const waitingSaveData = async (keyToSet: number, currentParams: any) => {
      currentParams["habitKey"] = keyToSet; // Set the key to the current habit
      await writeHabitDB(currentParams);
      setDataDB(await readHabitsDB());

      console.log("DataDB: ", JSON.stringify(dataDB));

      // await saveData(keyToSet, JSON.stringify(currentParams));
      // await fetchData();
      // fetchData();
      // console.log("Data after save: ", JSON.stringify(data));
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
      waitingSaveData(nextKey, currentParams);
    } else if (route.params && route.params.remove) {
      const remove_key: string = route.params.remove;

      waitingRemoveData(remove_key);
    } else {
      console.log("no params");
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
