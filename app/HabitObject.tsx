import { formatDate, getTodaysDate, calculateTimeDifference } from "./Util";
import styles from "./style/styles";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated} from "react-native";
import { HabitInterface, HabitListInterface } from "./types/habit.d";

export const Habit: React.FC<HabitInterface> = ({ habit, navigation, isSelected, onPress }) => {
  const [timeDifference, setTimeDifference] = useState("N/A");
  // const animatedValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const startDateTime = habit.date + "T" + habit.time;
      const currentTime = new Date();
      const endDateTime = getTodaysDate() + "T" + 
      (currentTime.getHours() < 10 ? "0" + currentTime.getHours() : currentTime.getHours()) +
      ":" +
      (currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes()) +
      ":" +
      (currentTime.getSeconds() < 10 ? "0" + currentTime.getSeconds() : currentTime.getSeconds())

      setTimeDifference(calculateTimeDifference(startDateTime, endDateTime))
    }, 1000);
    return () => clearInterval(interval);
  }, [habit.date, habit.time]);


  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: isSelected ? 1.02 : 0.97,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  return (
  <TouchableOpacity onPress={onPress}>
    <Animated.View style={[styles.habitCard, isSelected && styles.selectedHabitCard, { transform: [{ scale: scaleValue }] }] }>
      {!isSelected && (
        <Text style={{ fontSize: 24 }}>
          {habit.name}
        </Text>
      )}
      
        {isSelected && (
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Text style={{ fontSize: 22 }}>
            {habit.name}
          </Text>
            <Text>Details:</Text>
            <Text>Last occurance: {formatDate(habit.date)}</Text>
            <Text>Time: {timeDifference}</Text>

            <TouchableOpacity style={{ backgroundColor: 'darkgreen', padding: 5, borderRadius: 5, marginTop: 5, width: 80, alignItems: 'center' }}
            onPress={() => navigation.navigate("HabitScreen", { name: habit.name, habitKey: habit.habitKey, date: habit.date, time: habit.time })}
            >
             <Text style={{ color: 'white', fontWeight: 'normal', fontSize: 15, backgroundColor: 'darkgreen' }}>
                  More
            </Text> 
              </TouchableOpacity>
          </Animated.View>
        )}
    </Animated.View>
  </TouchableOpacity>
  );
};

export const HabitList: React.FC<HabitListInterface> = ({ habits, navigation, selectedHabit, setSelectedHabit }) => (
  <View>
    {habits.map((habit, index) => (
      <Habit
        key={habit.habitKey}
        habit={habit}
        navigation={navigation}
        isSelected={selectedHabit === habit.habitKey}
        onPress={() => selectedHabit === habit.habitKey ? setSelectedHabit(null) : setSelectedHabit(habit.habitKey)}
      />
    ))}
  </View>
);

