import React, { useState } from "react";
import { View, Text } from "react-native";
import { IncreaseFrequencyButton, RemoveButton } from "../Buttons";
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateTimeDifference,
  formatDate,
} from "../Util";
import { HabitScreenPreviewProps } from "../../types/screen.d";
import { habitCreationScreenStyles } from "../../style/styles";
import { HabitType } from "../../types/habit.d";
import { useDataContext } from "../Contexts/DataContext";

const HabitScreenPreview: React.FC<HabitScreenPreviewProps> = ({
  habit_id,
}) => {
  const { data, fetchData } = useDataContext();

  const currentHabit = data.find(
    (habit: HabitType) => habit.habit_id === habit_id
  );
  if (!currentHabit) {
    throw new Error("Habit with habit_id " + habit_id + " not found");
  }

  const currentDate: string = currentHabit?.date
    ? currentHabit.date
    : getTodaysDate();
  const markedDates = generateMarkedDates(
    currentDate,
    getTodaysDate(),
    currentHabit.color == "#ffffff" ? "green" : currentHabit?.color!
  );

  return (
    <View>
      <Calendar
        markingType={"period"}
        hideExtraDays={true}
        firstDay={1}
        markedDates={markedDates}
        maxDate={getTodaysDate()}
        theme={{
          backgroundColor: "#00000",
          calendarBackground: "#00000",
          textSectionTitleColor: "black",
          selectedDayBackgroundColor: "black",
          selectedDayTextColor: "black",
          selectedDayTextWeight: "700",
          todayTextColor: "green",
          dayTextColor: "black",
          textDisabledColor: "gray",
          arrowColor: "black",
        }}
      />

      <Text style={{ fontSize: 22 }}>
        Free for: {calculateTimeDifference(currentDate, getTodaysDate())} days
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Last occurance: {formatDate(currentHabit.date)} at {currentHabit.time}
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Description:{"\n"}
        {currentHabit?.description ? currentHabit?.description : "No notes"}
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Intensity:{"\n"}
        {currentHabit.intensity && currentHabit.intensity !== 0
          ? currentHabit?.intensity + "/10"
          : "No intensity"}
      </Text>
    </View>
  );
};
export default HabitScreenPreview;
