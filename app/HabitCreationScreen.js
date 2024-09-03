import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { AddButton } from "./Buttons";
import { formatDate, getTodaysDate, generateMarkedDates } from "./Util";

const HabitCreationScreen = ({ navigation }) => {
  const [text, onChangeText] = useState("");
  const [settable, setSettable] = useState(true);

  const [selected, setSelectedDate] = useState("");

  const markedDates = generateMarkedDates("2024-08-21", getTodaysDate());

  return (
    <View style={styles.habit_view}>
      {/* <View style={{ ustifyContent: "center", alignItems: "center" }}> */}
      <Text style={{ fontSize: 22, textAlign: "center", fontWeight: 650 }}>
        What habit do you want to quit?
      </Text>
      {/* </View> */}
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Enter here"
        keyboardType="default"
      />
      <View>
        <Text
          style={{
            fontSize: 17,
            margin: 20,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Choose the last date of occurrence:
        </Text>
      </View>
      <AddButton
        navigation={navigation}
        whereTo="Home"
        disabled={!selected || !text || text.length < 1 || selected.length < 1}
        data={{ description: text, date: selected }}
      />

      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markingType={"period"}
        hideExtraDays={true}
        firstDay={1}
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
          arrowColor: "black",
        }}
      />
      {selected ? (
        <Text style={{ fontSize: 17, margin: 20 }}>
          Selected date: {formatDate(selected)}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  habit_view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#cccccc",
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 10,
  },
});

export default HabitCreationScreen;
