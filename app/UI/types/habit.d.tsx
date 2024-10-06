// src/types/habit.d.ts
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./screen.d";

export interface HabitType {
  habitKey: number | null;
  name: string | undefined;
  date: string | undefined;
  time: string | undefined;
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
  setSelectedHabit: (habitKey: number | null) => void;
}
