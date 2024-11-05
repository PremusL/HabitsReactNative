import React, { useState, useEffect } from "react";
import { SafeAreaView, Button } from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import { HomeScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { writeHabitDB, deleteHabitDB } from "./DataBaseUtil";
import { deleteHabitLocal } from "./LocalStorageUtil";
import { useLoadingContext } from "./Contexts/LoadingContext";
import { useDataContext } from "./Contexts/DataContext";
// import { useDataContext } from "./Contexts/DataContext";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { data, fetchData } = useDataContext();
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [maxKey, setMaxKey] = useState<number | null>(0);
  const { loading, setLoading } = useLoadingContext();

  useEffect(() => {
    const waitFetchData = async () => {
      await fetchData();
      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_id"]);
      }
    };
    waitFetchData();
  }, []);
  useEffect(() => {
    // adding a habit
    const waitingSaveData = async (keyToSet: number, currentParams: any) => {
      currentParams["habit_id"] = maxKey; // Set the key to the current habit
      setLoading(true);
      await writeHabitDB(currentParams);
      await fetchData();
      setLoading(false);
    };
    // removing a habit
    const waitingRemoveData = async (remove_key: string) => {
      try {
        setLoading(true);
        await deleteHabitDB(remove_key);
        await fetchData();
        setLoading(false);
      } catch (error) {
        console.error("Error no connection, can't remove from the remote DB");
        await deleteHabitLocal(remove_key);
        await fetchData();
      }

      if (data && data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_id"]);
      }
    };
    if (!route.params) {
      return;
    }

    if (route.params.name != null && route.params.date != null) {
      const currentParams = route.params;

      console.log("-----------------");

      waitingSaveData(maxKey ? maxKey : 0, currentParams);

      console.log("-----------------");
    } else if (route.params && route.params.remove >= 0) {
      const remove_key: string = route.params.remove;
      waitingRemoveData(remove_key);
    } else {
      console.log(
        "no paramss",
        route.params.remove,
        route.params != null,
        route.params.remove != null
      );
    }
  }, [route.params]);

  useEffect(() => {
    if (data && data.length > 0 && data[data.length - 1]["habit_id"] != null) {
      setMaxKey(() => data[data.length - 1]["habit_id"] + 1);
      console.log("Max key is " + maxKey);
    }
    console.log("DataDB after add" + JSON.stringify(data), maxKey);
  }, [data]);

  return (
    // <PanGestureHandler
    //   onGestureEvent={handleGesture}
    //   onHandlerStateChange={handleGesture}
    // >
    <SafeAreaView style={styles.mainPage}>
      <Button title="fetch data" onPress={fetchData} />
      <AddButton navigation={navigation} whereTo="HabitCreationScreen" />
      {data && (
        <HabitList
          habits={data}
          navigation={navigation as any}
          selectedHabit={selectedHabit}
          setSelectedHabit={(habit_id) => setSelectedHabit(habit_id ?? null)}
        />
      )}
    </SafeAreaView>
  );
};
export default HomeScreen;
