import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./app/HomeScreen";
import HabitScreen from "./app/HabitScreen";
import HabitCreationScreen from "./app/HabitCreationScreen";
import SecondScreen from "./app/SecondScreen";
import { RootStackParamList } from "./app/types/screen.d";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library
import { DataProvider } from './app/DataContext';

const Tab = createBottomTabNavigator();

// const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
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

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap | undefined;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'SecondScreen') {
          iconName = 'calendar'
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
      // tabBarBackground: () => {
      //   <BlurView tint="" intensity={100} />
      // },  
    })}
    tabBarOptions={{
      activeTintColor: 'white',
      inactiveTintColor: '#888888',
      activeBackgroundColor: '#1a1a1a',
      inactiveBackgroundColor: '#1a1a1a',
      style: {
        backgroundColor: 'red',
      },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="SecondScreen" component={SecondScreen} options={{ title: "Habit"}} />
  </Tab.Navigator>
);

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
    <DataProvider>
      <Stack.Navigator
       screenOptions={navigatorOptions}>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SecondScreen" component={SecondScreen} />
        <Stack.Screen name="HabitScreen" component={HabitScreen} />
        <Stack.Screen name="HabitCreationScreen" component={HabitCreationScreen} />
      </Stack.Navigator>
      </DataProvider>
    </NavigationContainer>
  </GestureHandlerRootView>
);

export default App;
