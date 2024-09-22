// src/types/navigation.d.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: { description?: { text: string }; date?: string; remove?: { habit_key: number } };
  HabitCreationScreen: { description?: { text: string }; remove?: { habit_key: number } };
  HabitScreen: { name: string; date: string; habitKey: number };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type HabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HabitScreen'>;