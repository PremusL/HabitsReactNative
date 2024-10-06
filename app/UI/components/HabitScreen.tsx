import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RemoveButton } from "./Buttons"; // Adjust the path as necessary
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateDaysDifference,
} from "./Util"; // Adjust the path as necessary
import { HabitScreenProps } from "../types/screen.d";

const HabitScreen: React.FC<HabitScreenProps> = ({ navigation, route }) => {
  const currentParams = route?.params;
  const currentDate = currentParams?.date;
  const markedDates = generateMarkedDates(currentDate, getTodaysDate());

  return (
    <View style={styles.habit_view}>
      <Text style={{ fontSize: 24 }}>Habit: {currentParams?.name}</Text>
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
      <RemoveButton
        navigation={navigation}
        whereTo="Home"
        data={{ remove: currentParams?.habitKey }}
      />
      <Text style={{ fontSize: 22 }}>
        Free for: {calculateDaysDifference(currentDate, getTodaysDate())} days
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  habit_view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#cccccc",
  },
});

export default HabitScreen;
