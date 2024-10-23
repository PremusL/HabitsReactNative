import { RootStackParamList, NavigationProp } from "./screen.d";
import { HabitType } from "./habit.d";

export interface AddButtonProps {
  navigation: NavigationProp;
  whereTo: keyof RootStackParamList;
  disabled?: boolean;
  data?: object;
}

export interface RemoveButtonProps {
  navigation: NavigationProp;
  whereTo?: keyof RootStackParamList;
  data?: object;
}

export interface IncreaseFrequencyButtonProps {
  data: HabitType;
}
