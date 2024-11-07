import { RootStackParamList, NavigationProp } from "./screen.d";
import { HabitType } from "./habit.d";

export interface AddButtonProps {
  navigation: NavigationProp;
  disabled?: boolean;
  whereTo: string;
  onPress: () => void;
}

export interface RemoveButtonProps {
  navigation: NavigationProp;
  whereTo: string;
  onPress: () => void;
}

export interface IncreaseFrequencyButtonProps {
  data: HabitType;
  setShowAnother: (isAnother: boolean) => void;
}
