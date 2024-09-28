import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreenProps, SecondScreenProps } from "./types/screen.d";
import styles from "./style/styles";
import { HabitType } from "./types/habit.d";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateDaysDifference,
} from "./Util";
import { useData } from "./DataContext";

const SecondScreen: React.FC<SecondScreenProps> = ({ navigation, route }) => {
  // const markedDates = generateMarkedDates(currentDate, getTodaysDate());
  const { data, fetchData } = useData();
  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX > 50) {
      navigation.navigate("Home"); // Replace "NewScreen" with your target screen name
    }
  };
  useFocusEffect(
    useCallback(() => {
      // fetchData();
      data.forEach((element: any, index: number) => {
        // console.log("nummero: " + index + " " + JSON.stringify(element));
      });
      // console.log("Data v homescreenu: " + data);
    }, [])
  );
  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGesture}
    >
      <View style={styles.mainPage}>
        <Calendar
          markingType={"period"}
          hideExtraDays={true}
          firstDay={1}
          // markedDates={markedDates}
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
      </View>
    </PanGestureHandler>
  );
};

export default SecondScreen;
