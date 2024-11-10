import React, { useState, useEffect } from "react";
import { SafeAreaView, Button, Text } from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import { HomeScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { useDataContext } from "./Contexts/DataContext";
import { useUserContext } from "./Contexts/UserContext";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { data, fetchData } = useDataContext();
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [maxKey, setMaxKey] = useState<number | null>(0);
  const { user_id, setUser } = useUserContext();

  useEffect(() => {
    const waitFetchData = async () => {
      await fetchData();
      if (data.length > 0) {
        setMaxKey(data[data.length - 1]["habit_id"]);
      }
    };
    waitFetchData();
  }, []);

  return (
    <SafeAreaView style={styles.mainPage}>
      <AddButton
        navigation={navigation}
        whereTo="HabitCreationScreen"
        onPress={() => {}}
      />
      {user_id != null && (
        <Text style={{ position: "absolute", bottom: 20, left: 30 }}>
          You are logged in
        </Text>
      )}

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
