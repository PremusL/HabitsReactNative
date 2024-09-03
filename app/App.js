import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import HabitScreen from "./HabitScreen";
import HabitCreationScreen from "./HabitCreationScreen";
import { formatDate, calculateDaysDifference, getTodaysDate } from "./Util";
import { getData } from "./LocalStorageUtil";
import styles from "./style/styles";

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1a1a1a", // Set your desired color
          },
          headerTintColor: "#fff", // Set the color of the back button and title
          headerTitleStyle: {
            fontWeight: "bold",
            position: "absolute",
            bottom: 30,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Habit" component={HabitCreationScreen} />
        <Stack.Screen name="HabitScreen" component={HabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
