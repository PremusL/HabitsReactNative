import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { AddButton } from "./Buttons";
import { formatDate, getTodaysDate, generateMarkedDates } from "./Util";
import { RootStackParamList, HabitCreationScreenProps } from "./types/screen.d";
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';


const HabitCreationScreen: React.FC<HabitCreationScreenProps> = ({ navigation }) => {
  const [text, onChangeText] = useState("");
  const [selected, setSelectedDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const onChange = (event: DateTimePickerEvent, selectedTime?: Date | undefined ): void => {
    if (selectedTime) {
      setCurrentTime(selectedTime);
    }
    else {
      console.log("No time selected");
    }
  };
  const showTimepicker = (): void => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: 'time',
      is24Hour: true,
      positiveButton: {label: 'OK', textColor: 'black'},
      negativeButton: {label: 'Cancel', textColor: 'black'},
    });
  };

  return (
    <View style={styles.habit_view}>
      {/* <View style={{ ustifyContent: "center", alignItems: "center" }}> */}
      <Text style={{ fontSize: 22, textAlign: "center", fontWeight: 600 }}>
        What habit do you want to quit?
      </Text>
      {/* </View> */}
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Enter here"
        keyboardType="default"
      />
      <View>
        <Text
          style={{
            fontSize: 17,
            margin: 20,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Choose the last date of occurrence:
        </Text>
      </View>
      <AddButton
        navigation={navigation}
        whereTo="Home"
        disabled={!selected || !text || text.length < 1 || selected.length < 1}
        data={{ description: text, date: selected, time: currentTime.getHours() + ":" + currentTime.getMinutes() }}
      />

      <Calendar
        onDayPress={(day: any) => {
          setSelectedDate(day.dateString);
        }}
        markingType={"period"}
        hideExtraDays={true}
        firstDay={1}
        maxDate={getTodaysDate()}
        theme={{
          backgroundColor: "#00000",
          calendarBackground: "#00000",
          textSectionTitleColor: "black",
          selectedDayBackgroundColor: "black",
          selectedDayTextColor: "black",
          selectedDayTextWeight: "700",
          todayTextColor: "green",
          dayTextColor: "black",
          textDisabledColor: "gray",
          arrowColor: "black",
        }}
      />
      {selected ? (
        <Text style={{ fontSize: 17, margin: 20 }}>
          Selected date: {formatDate(selected)}
        </Text>
      ) : null}
      <TouchableOpacity onPress={showTimepicker} style={{ marginTop: 20, backgroundColor: '#1a1a1a', borderRadius: 5, alignItems: 'center'}}>
        <Text style={{ fontSize: 20, margin: 10, color: 'white'}}>Choose time</Text>
      </TouchableOpacity>
      
      {currentTime ? (
        <Text style={{ fontSize: 17, marginTop: 20 }}>
          Selected time: <Text style={{ fontWeight: 'bold' }}>{currentTime.getHours()}:{currentTime.getMinutes()}</Text> 
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  habit_view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#cccccc",
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 10,
  },
});

export default HabitCreationScreen;
