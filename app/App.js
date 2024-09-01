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
import HabitsScreen from "./HabitsScreen";
import { formatDate } from "./Util";

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e", // Set your desired color
          },
          headerTintColor: "#fff", // Set the color of the back button and title
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Habit" component={HabitsScreen} />
        <Stack.Screen name="HabitScreen" component={HabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HabitList = ({ habits, navigation }) => (
  <View>
    {habits.map((habit) => (
      <Habit key={habit.habitKey} habit={habit} navigation={navigation} />
    ))}
  </View>
);

export { HabitList };

const Habit = ({ habit, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate("HabitScreen", habit)}>
    <View style={styles.habit_card}>
      <Text style={{ fontSize: 24 }}>
        {habit.name} - {formatDate(habit.date)}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: "darkblue",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 5.84,
  },
  mainPage: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#99a8bf",
  },
  addButton: {
    backgroundColor: "darkblue",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  removeButton: {
    backgroundColor: "darkred",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  habit_card: {
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "center",
    alignItems: "center",
  },
  habit_view: {
    // alignContent: 'center',
    alignItems: "center",
    // justifyContent: 'center', // center vertically
    backgroundColor: "#99a8bf",
    paddingTop: 20,
    flex: 1,
  },
  input: {
    height: 40,
    width: 230,
    margin: 12,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    // padding: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#ff00",
    alignItems: "center",
    justifyContent: "center",
    height: 400,
  },
  grid_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
    // backgroundColor: '#f00',
    height: 500,
    marginTop: 50,
  },
  set_button: {
    width: 100,
    height: 90,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "#fff",
  },

  grid_item: {
    width: "50%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'orange',
    // margin: 2,
  },
  grid_text: {
    fontSize: 24,
    marginTop: 10,
  },
  box: {
    width: 40,
    height: 40,
  },
});

export default App;
