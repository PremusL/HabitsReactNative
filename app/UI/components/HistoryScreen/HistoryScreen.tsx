import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Button,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Touchable,
  ScrollView,
} from "react-native";
import { HistoryScreenProps } from "../../types/screen.d";
import { historyStyles } from "../../style/styles";
import { useLoadingContext } from "../Contexts/LoadingContext";
import { HabitType } from "../../types/habit.d";
import { getHistoryLocalDb } from "../LocalStorageUtil";
import { getLocalDB } from "../DataBaseUtil";
import { TouchableOpacity } from "react-native-gesture-handler";

const HistoryScreen: React.FC<HistoryScreenProps> = ({ route }) => {
  const { loading, setLoading } = useLoadingContext();
  const [data, setData] = useState<HabitType[] | null>([]);

  useEffect(() => {
    const habit_id = route.params.habit_id;

    const waitHistory = async (habit_id: number) => {
      const db = await getLocalDB();
      const result = await getHistoryLocalDb(db, habit_id);
      setData(result);
    };

    setLoading(true);
    console.log("route: " + route.params.habit_id);
    waitHistory(habit_id);
    setLoading(false);
  }, []);

  useEffect(() => {
    // console.log("data history is: ", data);
  }, [data]);

  return (
    <ScrollView style={styles.mainPage}>
      {data ? (
        data.map((habit, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              index == data.length - 1 && { backgroundColor: "#e0f7fa" },
            ]}
          >
            {Object.entries(habit).map(([key, value], obj_index) => (
              <View key={key}>
                {obj_index == 0 && (
                  <Text style={styles.cardTitle}>Version: {habit.version}</Text>
                )}
                {obj_index > 0 &&
                  !["habit_instance_id", "habit_id", "version"].includes(
                    key
                  ) && (
                    <Text style={[styles.cardText, ,]}>
                      {key}: {value}
                    </Text>
                  )}
              </View>
            ))}
            {/* habit.entries().((habit, index) => (
              <Text style={styles.cardTitle}>{habit.name}</Text>
            ))}; */}
            {/* <Text style={styles.cardTitle}>{habit.name}</Text>
            <Text style={styles.cardText}>
              Description: {habit.description}
            </Text>
            <Text style={styles.cardText}>Date: {habit.date}</Text>
            <Text style={styles.cardText}>Time: {habit.time}</Text>
            <Text style={styles.cardText}>Intensity: {habit.intensity}</Text>
            <Text style={styles.cardText}>Good: {habit.good}</Text> */}
          </TouchableOpacity>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
export default HistoryScreen;
