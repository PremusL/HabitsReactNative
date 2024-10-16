import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IncreaseFrequencyButton, RemoveButton } from "./Buttons"; // Adjust the path as necessary
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateDaysDifference,
  calculateTimeDifference,
  formatDate,
} from "./Util"; // Adjust the path as necessary
import { HabitScreenProps } from "../types/screen.d";
import Icon from "react-native-vector-icons/FontAwesome";
import { habitCreationScreenStyles } from "../style/styles";

const HabitScreen: React.FC<HabitScreenProps> = ({ navigation, route }) => {
  const currentParams = route?.params;

  const [showEdit, setShowEdit] = React.useState(false);
  const [frequency, setFrequency] = React.useState(currentParams?.frequency);

  const handleFrequencyUpdate = (frequency: number) => {
    setFrequency(frequency);
  };

  const currentDate = currentParams?.date;
  const markedDates = generateMarkedDates(currentDate, getTodaysDate());

  return (
    <View style={styles.habit_view}>
      <IncreaseFrequencyButton
        habit_key={currentParams?.habit_key}
        frequency={frequency}
        setFrequency={handleFrequencyUpdate}
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            textAlign: "center",
            marginRight: 10,
          }}
        >
          {currentParams?.name}
        </Text>
        {currentParams.icon && (
          <Icon
            name={currentParams?.icon}
            color={currentParams.color}
            size={30}
            style={{ textAlign: "center" }}
          />
        )}
      </View>
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
        data={{ remove: currentParams?.habit_key }}
      />
      <Text style={{ fontSize: 22 }}>
        Free for: {calculateTimeDifference(currentDate, getTodaysDate())} days
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Last occurance: {formatDate(currentParams.date)} at {currentParams.time}
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Description:{"\n"}
        {currentParams?.description ? currentParams?.description : "No notes"}
      </Text>
      <Text style={habitCreationScreenStyles.basicText}>
        Intensity:{"\n"}
        {currentParams?.intensity > 0
          ? currentParams?.intensity + "/10"
          : "No intensity"}
      </Text>
      <TouchableOpacity
        onPress={() => setShowEdit(!showEdit)}
        style={{
          marginTop: 20,
          marginBottom: 40,
          backgroundColor: "#1a1a1a",
          borderRadius: 5,
          alignItems: "center",
          width: 150,
          alignSelf: "center",
        }}
      >
        <Text style={{ fontSize: 18, margin: 10, color: "white" }}>
          {showEdit ? "Hide" : "Edit"}
        </Text>
      </TouchableOpacity>
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
