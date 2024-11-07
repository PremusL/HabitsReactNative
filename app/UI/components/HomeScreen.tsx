import React, { useState, useEffect } from "react";
import { SafeAreaView, Button, Text } from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import { HomeScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { writeHabitDB } from "./DataBaseUtil";
import { useLoadingContext } from "./Contexts/LoadingContext";
import { useDataContext } from "./Contexts/DataContext";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { data, fetchData } = useDataContext();
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [maxKey, setMaxKey] = useState<number | null>(0);

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
    console.log("this is data: ", data);
    if (data && data.length > 0 && data[data.length - 1]["habit_id"] != null) {
      setMaxKey(() => data[data.length - 1]["habit_id"] + 1);
      console.log("Max key is " + maxKey);
    }
    console.log("DataDB after add" + JSON.stringify(data), maxKey);
  }, [data]);

  return (
    <SafeAreaView style={styles.mainPage}>
      <Button title="fetch data" onPress={fetchData} />
      <AddButton
        navigation={navigation}
        whereTo="HabitCreationScreen"
        onPress={() => {}}
      />
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
