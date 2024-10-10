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
import { ProfileScreenProps } from "../types/screen.d";
import { styles } from "../style/styles";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const handleGesture = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.translationX > 50) {
      navigation.navigate("SecondScreen");
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGesture}
    >
      <View style={styles.mainPage}>
        <Text>Profile Screen</Text>
      </View>
    </PanGestureHandler>
  );
};

export default ProfileScreen;
