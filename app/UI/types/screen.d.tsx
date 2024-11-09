import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

export type RootStackParamList = {
  Home:
    | {
        description?: { text: string };
        date?: string;
        time?: Date;
        remove?: { habit_id: number | null };
      }
    | undefined;
  HabitCreationScreen: {
    description: { text: string };
    remove?: { habit_id?: number } | {} | undefined;
  };
  HabitScreen: { habit_id: number };
  SecondScreen: undefined;
  Profile: undefined;
  HistoryScreen: { params: { habit_id: number } };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface HabitCreationScreenProps {
  navigation: NavigationProp;
}

export interface HabitScreenProps {
  navigation: NavigationProp;
  route: { params: { habit_id: number } } | any | undefined;
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
export interface ProfileScreenProps {}
export interface HistoryScreenProps {
  route: { params: { habit_id: number } } | any | undefined;
}
export interface RightCornerMenuProps {
  navigation: NavigationProp;
  route: any;
}

export interface HabitScreenEditProps {
  habit_id: number;
  setEdit: (edit: boolean) => void;
}
export interface HabitScreenAnotherProps {
  habit_id: number;
  setShowAnother: (isAnother: boolean) => void;
}
export interface HabitScreenPreviewProps {
  habit_id: number;
}
