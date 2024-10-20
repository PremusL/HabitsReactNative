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

const HabitScreenPreview: React.FC<HabitScreenPreviewProps> = ({ data }) => {
  const currentDate: string = data?.date ? data.date : getTodaysDate();
  const markedDates = generateMarkedDates(
    currentDate,
    getTodaysDate(),
    data.color == "#ffffff" ? "green" : data?.color!
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
        Last occurance: {formatDate(data.date)} at {data.time}
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Description:{"\n"}
        {data?.description ? data?.description : "No notes"}
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Intensity:{"\n"}
        {data.intensity && data.intensity !== 0
          ? data?.intensity + "/10"
          : "No intensity"}
      </Text>
    </View>
  );
};
export default HabitScreenPreview;
