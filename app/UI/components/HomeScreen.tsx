import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, Button } from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import { HomeScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { writeHabitDB, deleteHabitDB } from "./DataBaseUtil";
import { deleteHabitLocal } from "./LocalStorageUtil";
import { useLoadingContext } from "./Contexts/LoadingContext";
import { Text } from "react-native";
import { useDataContext } from "./Contexts/DataContext";
// import { useDataContext } from "./Contexts/DataContext";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { data, fetchData } = useDataContext();
  const [databases, setDatabases] = useState<string[]>([]);

  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [maxKey, setMaxKey] = useState<number | null>(0);
  const { loading, setLoading } = useLoadingContext();
  // const [dataDB, setDataDB] = useState(data);

  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX < -50) {
      navigation.navigate("SecondScreen");
    }
  };

  useEffect(() => {
    const waitFetchData = async () => {
      await fetchData();
      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_key"]);
      }
      // console.log("this is fetched data " + JSON.stringify(data), maxKey);
    };
    waitFetchData();
  }, []);
  useEffect(() => {
    // adding a habit
    const waitingSaveData = async (keyToSet: number, currentParams: any) => {
      currentParams["habit_key"] = keyToSet; // Set the key to the current habit
      setLoading(true);
      writeHabitDB(currentParams);
      fetchData();
      setLoading(false);

      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_key"]);
      }
      console.log("DataDB after add" + JSON.stringify(data), maxKey);
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

      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_key"]);
      }
    };
    if (!route.params) {
      return;
    }

    if (route.params.name != null && route.params.date != null) {
      const currentParams = route.params;

      console.log("-----------------");
      waitingSaveData(maxKey ? maxKey + 1 : 0, currentParams);

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
  if (loading) {
    return <Text>Loading...</Text>;
  }

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
          setSelectedHabit={(habit_key) => setSelectedHabit(habit_key ?? null)}
        />
      )}
    </SafeAreaView>
  );
};
export default HomeScreen;
