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
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import {
  getAllKeys,
  multiGet,
  saveData,
  clearAll,
  removeData,
} from "./LocalStorageUtil";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreenProps } from "./types/screen.d";
import styles from "./style/styles";
import { HabitType } from "./types/habit.d";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateDaysDifference,
} from "./Util";

const SecondScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  // const markedDates = generateMarkedDates(currentDate, getTodaysDate());

    const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
        console.log(nativeEvent.translationX, nativeEvent.translationY);
    
        if (nativeEvent.translationX > 50) {
            
          navigation.navigate("Home", undefined); // Replace "NewScreen" with your target screen name
        }
      };
    return (
        <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
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
}

export default SecondScreen;