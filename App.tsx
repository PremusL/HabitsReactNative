import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import HomeScreen from "./app/HomeScreen";
import HabitScreen from "./app/HabitScreen";
import HabitCreationScreen from "./app/HabitCreationScreen";
import { RootStackParamList } from "./app/types/screen.d";
import { View, Text, TextInput, StyleSheet } from "react-native";


const App: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigatorOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: '#1a1a1a', // Set your desired color
    },
    headerTintColor: '#fff', // Set the color of the back button and title
    headerTitleStyle: {
      fontWeight: 'bold'
    },
    headerTitleAlign: 'center'
  };
  return (

    <NavigationContainer>
      <Stack.Navigator
        screenOptions={navigatorOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Your Habits", animation: "slide_from_right" }}
        />
        <Stack.Screen name="HabitCreationScreen" component={HabitCreationScreen} options={{ title: "Create a habit" }} />
        <Stack.Screen name="HabitScreen" component={HabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
