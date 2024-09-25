import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./app/HomeScreen";
import HabitScreen from "./app/HabitScreen";
import HabitCreationScreen from "./app/HabitCreationScreen";
import { RootStackParamList } from "./app/types/screen.d";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library

const Tab = createBottomTabNavigator();

const App = () => {
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
  
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap | undefined;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Create') {
              iconName = 'add-circle';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return iconName ? <Ionicons name={iconName} size={size} color={color} /> : null;
          },
          headerStyle: {
            backgroundColor: '#1a1a1a', // Set your desired color
          },
          headerTintColor: '#fff', // Set the color of the back button and title
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        })}
        // tabBarOptions={{
        //   activeTintColor: 'tomato',
        //   inactiveTintColor: 'gray',
        // }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Create" component={HabitCreationScreen} />
        {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
);
}
export default App;
