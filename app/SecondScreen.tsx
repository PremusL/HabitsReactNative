import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { AddButton } from "./Buttons";
import { HabitList } from "./HabitObject";
import {
  getAllKeys,
  multiGet,
  saveData,
  clearAll,
  removeData,
} from "./LocalStorageUtil";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreenProps } from "./types/screen.d";
import styles from "./style/styles";
import { HabitType } from "./types/habit.d";
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const SecondScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
    const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
        console.log(nativeEvent.translationX, nativeEvent.translationY);
    
        if (nativeEvent.translationX < -50) {
            
        //   navigation.navigate("SecondScreen", undefined); // Replace "NewScreen" with your target screen name
        }
      };
    return (
        <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
            <View style={styles.mainPage}>
                <Text>Second Screen</Text>
            </View>
        </PanGestureHandler>
    );
}

export default SecondScreen;