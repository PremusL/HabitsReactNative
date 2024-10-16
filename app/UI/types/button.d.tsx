import { RootStackParamList, NavigationProp } from "./screen.d";

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
  habit_key: string;
  frequency: number;
  setFrequency: (frequency: number) => void;
}
