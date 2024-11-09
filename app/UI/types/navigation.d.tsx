// src/types/navigation.d.ts
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: {
    description?: { text: string };
    date?: string;
    time?: string;
    remove?: { habit_id: number | undefined };
  };
  HabitCreationScreen: {
    description?: { text: string; date?: string; time?: string };
    remove?: { habit_id: number | undefined };
  };
  HabitScreen: {
    name: string;
    date: string;
    time: string;
    habit_id?: number | undefined;
  };
};

export type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
