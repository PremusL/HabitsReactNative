import { calculateDaysDifference, getTodaysDate } from "./Util";
import styles from "./style/styles";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HabitInterface, HabitListInterface } from "./types/habit.d";

export const Habit: React.FC<HabitInterface> = ({ habit, navigation }) => {
  const daysFree = habit.date ? calculateDaysDifference(habit.date, getTodaysDate()) : "N/A";
  return (
  <TouchableOpacity onPress={() => navigation.navigate("HabitScreen", habit as any)}>
    <View style={styles.habit_card}>
      <Text style={{ fontSize: 24 }}>
        {habit.name} - {daysFree} days free
        days free
      </Text>
    </View>
  </TouchableOpacity>
);
}

export const HabitList: React.FC<HabitListInterface> = ({ habits, navigation }) => (
  <View>
    {habits.map((habit) => (
      <Habit key={habit.habitKey} habit={habit} navigation={navigation} />
    ))}
  </View>
);