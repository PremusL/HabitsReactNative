// src/types/navigation.d.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: { description?: { text: string }; date?: string; time?: string; remove?: { habitKey: number | undefined;} };
  HabitCreationScreen: { description?: { text: string; date?: string; time?: string }; remove?: { habitKey: number | undefined; } };
  HabitScreen: { name: string; date: string; time: string; habitKey?: number | undefined };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type HabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HabitScreen'>;