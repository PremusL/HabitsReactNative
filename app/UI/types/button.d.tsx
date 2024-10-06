import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HabitCreationScreen from '../HabitCreationScreen';
import { HabitType } from './habit.d';
import { RootStackParamList, NavigationProp } from './screen.d';

  
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