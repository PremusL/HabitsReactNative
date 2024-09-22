// src/types/habit.d.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './screen.d';

export interface HabitType {
  habitKey: number | undefined;
  name: string | undefined;
  date: string | undefined;
}

export interface HabitInterface {
  habit: HabitType;
  navigation: NativeStackNavigationProp<RootStackParamList, 'HabitScreen'>;
}

export interface HabitListInterface {
  habits: HabitType[];
  navigation: NativeStackNavigationProp<RootStackParamList, 'HabitScreen'>;
}