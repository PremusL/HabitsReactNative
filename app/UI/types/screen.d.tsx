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
  route?: number | any | undefined;
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
  habit_key: number;
  setEdit: (edit: boolean) => void;
}
export interface HabitScreenAnotherProps {
  habit_key: number;
  setShowAnother: (isAnother: boolean) => void;
}
export interface HabitScreenPreviewProps {
  habit_key: number;
}
