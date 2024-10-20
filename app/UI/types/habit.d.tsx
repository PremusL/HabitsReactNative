// src/types/habit.d.ts
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./screen.d";

export interface HabitType {
  habit_key: number | null;
  name: string | undefined;
  date: string | undefined;
  time: string | undefined;
  description: string | undefined;
  color: string | undefined;
  icon: string | undefined;
  intensity: number | undefined;
  good: string | undefined;
  frequency: number | undefined;
}

export interface HabitInterface {
  habit: HabitType;
  navigation: NativeStackNavigationProp<RootStackParamList, "HabitScreen">;
  isSelected: boolean;
  onPress: () => void;
}

export interface HabitListInterface {
  habits: HabitType[];
  navigation: NativeStackNavigationProp<RootStackParamList, "HabitScreen">;
  selectedHabit: number | null;
  setSelectedHabit: (habit_key: number | null) => void;
}
