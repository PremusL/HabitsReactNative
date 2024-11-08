import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./app/UI/components/HomeScreen";
import HabitScreen from "./app/UI/components/HabitScreen/HabitScreen";
import HabitCreationScreen from "./app/UI/components/HabitCreationScreen";
import ProfileScreen from "./app/UI/components/ProfileScreen/ProfileScreen";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library
import { LoadingProvider } from "./app/UI/components/Contexts/LoadingContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { DataProvider } from "./app/UI/components/Contexts/DataContext";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navigatorOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: "#1a1a1a", // Set your desired color
  },
  headerTintColor: "#fff", // Set the color of the back button and title
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitleAlign: "center",
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap | undefined;

        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Profile") {
          iconName = "person";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <LoadingProvider>
      <DataProvider>
        <MenuProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={navigatorOptions}>
              <Stack.Screen
                name="Tabs"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HabitScreen"
                component={HabitScreen}
                options={({ navigation }) => ({
                  title: "Habit Screen",
                  headerRight: () => (
                    <Menu onSelect={() => console.log("onSelect")}>
                      <MenuTrigger customStyles={triggerStyles}>
                        <Icon name="bars" size={25} color="red" />
                      </MenuTrigger>
                      <MenuOptions>
                        <MenuOption onSelect={() => alert("Option 1")}>
                          <Text style={styles.menuOptionText}>Option 1</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => alert("Option 2")}>
                          <Text style={styles.menuOptionText}>Option 2</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => alert("Option 3")}>
                          <Text style={styles.menuOptionText}>Option 3</Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  ),
                })}
              />
              <Stack.Screen
                name="HabitCreationScreen"
                component={HabitCreationScreen}
                options={({ navigation }) => ({
                  title: "Create Habit",
                  headerRight: () => (
                    <Menu>
                      <MenuTrigger customStyles={triggerStyles}>
                        <TouchableOpacity style={styles.menuButton}>
                          <Icon name="bars" size={25} color="#fff" />
                        </TouchableOpacity>
                      </MenuTrigger>
                      <MenuOptions>
                        <MenuOption onSelect={() => alert("Option 1")}>
                          <Text style={styles.menuOptionText}>Option 1</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => alert("Option 2")}>
                          <Text style={styles.menuOptionText}>Option 2</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => alert("Option 3")}>
                          <Text style={styles.menuOptionText}>Option 3</Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  ),
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </MenuProvider>
      </DataProvider>
    </LoadingProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  menuButton: {
    marginRight: 15,
  },
  menuOptionText: {
    padding: 10,
    fontSize: 16,
  },
});

const triggerStyles = {
  triggerTouchable: {
    underlayColor: "rgba(255, 255, 255, 0.2)", // Change color on press
    activeOpacity: 0.7,
  },
};

export default App;
