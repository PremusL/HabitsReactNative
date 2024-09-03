import { formatDate, calculateDaysDifference, getTodaysDate } from "./Util";
import styles from "./style/styles";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Habit = ({ habit, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate("HabitScreen", habit)}>
    <View style={styles.habit_card}>
      <Text style={{ fontSize: 24 }}>
        {habit.name} - {calculateDaysDifference(habit.date, getTodaysDate())}{" "}
        days free
      </Text>
    </View>
  </TouchableOpacity>
);

const HabitList = ({ habits, navigation }) => (
  <View>
    {habits.map((habit) => (
      <Habit key={habit.habitKey} habit={habit} navigation={navigation} />
    ))}
  </View>
);

export { Habit, HabitList };
