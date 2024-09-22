import { calculateDaysDifference, getTodaysDate } from "./Util";
import styles from "./style/styles";
import React from "react";
import { View, Text, TouchableOpacity, Button} from "react-native";
import { HabitInterface, HabitListInterface } from "./types/habit.d";

// export const Habit: React.FC<HabitInterface> = ({ habit, navigation }) => {
//   const daysFree = habit.date ? calculateDaysDifference(habit.date, getTodaysDate()) : "N/A";
//   return (
//   <TouchableOpacity onPress={() => navigation.navigate("HabitScreen", habit as any)}>
//     <View style={styles.habit_card}>
//       <Text style={{ fontSize: 24 }}>
//         {habit.name} - {daysFree} days free
//         days free
//       </Text>
//     </View>
//   </TouchableOpacity>
// );
// }

export const Habit: React.FC<HabitInterface> = ({ habit, navigation, isSelected, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.habitCard, isSelected && styles.selectedHabitCard]}>
      <Text style={{ fontSize: 24 }}>
        {habit.name} - {habit.date}
      </Text>
        {isSelected && (
          <View>
            <Text>Details</Text>
            <TouchableOpacity style={{ backgroundColor: 'darkgreen', padding: 5, borderRadius: 5, marginTop: 5, width: 80, alignItems: 'center' }}
            onPress={() => navigation.navigate("HabitScreen", { name: habit.name, habitKey: habit.habitKey, date: habit.date })}
            >
             <Text style={{ color: 'white', fontWeight: 'normal', fontSize: 15, backgroundColor: 'darkgreen' }}>
                  More
            </Text> 
              </TouchableOpacity>
          </View>
        )}
    </View>
  </TouchableOpacity>
);

export const HabitList: React.FC<HabitListInterface> = ({ habits, navigation, selectedHabit, setSelectedHabit }) => (
  <View>
    {habits.map((habit) => (
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

