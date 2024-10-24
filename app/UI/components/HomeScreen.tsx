import React, { useState, useEffect, useCallback, useContext } from "react";
import { SafeAreaView } from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import { HomeScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { writeHabitDB, deleteHabitDB } from "./DataBaseUtil";
import { usePostgreSQLContext } from "./Contexts/PostgresqlContext";
import { useSqLiteContext } from "./Contexts/SqLiteContext";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { data, fetchData } = useSqLiteContext();
  const { dataDb, fetchDataDb } = usePostgreSQLContext();
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [maxKey, setMaxKey] = useState<number | null>(0);
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
      console.log("this is fetched data " + JSON.stringify(dataDb));
    };
    waitFetchData();
  }, []);
  useEffect(() => {
    // adding a habit
    const waitingSaveData = async (keyToSet: number, currentParams: any) => {
      currentParams["habit_key"] = keyToSet; // Set the key to the current habit
      await writeHabitDB(currentParams);
      await fetchData();

      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_key"]);
      }
      console.log("DataDB after add" + JSON.stringify(data), maxKey);
    };
    // removing a habit
    const waitingRemoveData = async (remove_key: string) => {
      await deleteHabitDB(remove_key);
      await fetchData();

      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_key"]);
      }
    };
    if (!route.params) {
      return;
    }

    if (route.params.name && route.params.date) {
      const currentParams = route.params;

      console.log("-----------------");
      waitingSaveData(maxKey ? maxKey + 1 : 0, currentParams);

      console.log("-----------------");
    } else if (route.params && route.params.remove) {
      const remove_key: string = route.params.remove;
      waitingRemoveData(remove_key);
    } else {
      console.log("no paramss", route.params.name, route.params.date);
    }
  }, [route.params]);

  return (
    // <PanGestureHandler
    //   onGestureEvent={handleGesture}
    //   onHandlerStateChange={handleGesture}
    // >
    <SafeAreaView style={styles.mainPage}>
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
