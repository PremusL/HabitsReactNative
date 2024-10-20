import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HabitType } from "./habit.d";
import { RouteProp } from "@react-navigation/native";

export type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

export type RootStackParamList = {
  Home:
    | {
        description?: { text: string };
        date?: string;
        time?: Date;
        remove?: { habit_key: number | null };
      }
    | undefined;
  HabitCreationScreen: {
    description: { text: string };
    remove?: { habit_key?: number } | {} | undefined;
  };
  HabitScreen: {
    name: string | undefined;
    date: string | undefined;
    time: string | undefined;
    habit_key: number | null;
  };
  SecondScreen: undefined;
  Profile: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface HabitCreationScreenProps {
  navigation: NavigationProp;
}

export interface HabitScreenProps {
  navigation: NavigationProp;
  route?: { params: HabitType } | any | undefined;
}

export interface HomeScreenProps {
  navigation: NavigationProp;
  route?:
    | {
        params: {
          description?: string;
          remove?: number;
          date?: string;
          time?: Date;
        };
      }
    | any
    | undefined;
}

export interface SecondScreenProps {
  navigation: NavigationProp;
}

export interface SecondScreenProps {
  navigation: NavigationProp;
}
export interface ProfileScreenProps {
  navigation: NavigationProp;
}
export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type HabitScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HabitScreen"
>;

export interface HabitScreenEditProps {
  currentParams: HabitType;
  setData: (data: HabitType) => void;
}
export interface HabitScreenPreviewProps {
  data: HabitType;
}
