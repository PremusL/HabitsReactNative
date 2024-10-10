import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreenProps, SecondScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { HabitType } from "../types/habit.d";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateDaysDifference,
} from "./Util";

const SecondScreen: React.FC<SecondScreenProps> = ({ navigation }) => {
  // const markedDates = generateMarkedDates(currentDate, getTodaysDate());
  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX > 50) {
      navigation.navigate("Home"); // Replace "NewScreen" with your target screen name
    }
    if (nativeEvent.translationX < -50) {
      navigation.navigate("Profile"); // Replace "NewScreen" with your target screen name
    }
  };
  useFocusEffect(
    useCallback(() => {
      // console.log("Data v homescreenu: " + data);
    }, [])
  );
  return (
    <View style={styles.mainPage}>
      {/* <Calendar
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
        /> */}
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles2.scrollView}>
          <Text style={styles2.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SecondScreen;

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
