import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { getTodaysDate, formatDate, timeToString, stringToTime } from "../Util";
import {
  HabitScreenAnotherProps,
  HabitScreenEditProps,
} from "../../types/screen.d";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  habitCreationScreenStyles,
  habitScreenStyles,
} from "../../style/styles";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { CheckBox, Slider } from "@rneui/themed";
import { HabitType } from "../../types/habit.d";
import { writeHabitDB } from "../DataBaseUtil";
import { usePostgreSQLContext } from "../Contexts/PostgresqlContext";

const HabitScreenAnother: React.FC<HabitScreenAnotherProps> = ({
  habit_key,
  setShowAnother,
}) => {
  const { data, fetchData } = usePostgreSQLContext();

  const [textDescription, onChangeTextDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setCurrentTime] = useState(new Date());

  const currentHabit = data.find(
    (habit: HabitType) => habit.habit_key === habit_key
  );
  const currentFrequency = currentHabit?.frequency;
  if (!currentHabit || !currentFrequency) {
    throw new Error(
      "Habit with habit_key " +
        habit_key +
        " not found with freq: " +
        currentHabit?.frequency
    );
  }

  const [checked, setChecked] = useState(currentHabit?.intensity == -1);
  const [valueSlider, setValueSlider] = useState(currentHabit?.intensity);

  const handleSave = async (data: HabitType) => {
    await writeHabitDB(data);
    await fetchData();
    setShowAnother(false);
  };

  const toggleCheckbox = () => {
    setChecked(!checked);
    if (!checked) {
      setValueSlider(0);
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date | undefined
  ): void => {
    if (selectedTime) {
      setCurrentTime(selectedTime);
    } else {
      console.log("No time selected");
    }
  };
  const showTimepicker = (): void => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: handleTimeChange,
      mode: "time",
      is24Hour: true,
      positiveButton: { label: "OK", textColor: "black" },
      negativeButton: { label: "Cancel", textColor: "black" },
    });
  };

  return (
    <View>
      <Text style={habitScreenStyles.subtitle}>Add another occurance</Text>
      <View>
        <Text style={habitScreenStyles.subsectionText}>Choose date</Text>
      </View>
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

      <Text style={habitScreenStyles.editSubtitleText}>
        Selected date:{"  "}
        <Text style={{ fontWeight: "bold" }}>{formatDate(selectedDate)}</Text>
      </Text>
      <View>
        <Text style={habitScreenStyles.subsectionText}>Choose time</Text>
        <TouchableOpacity
          onPress={showTimepicker}
          style={[habitCreationScreenStyles.chooseBtn, { marginTop: 20 }]}
        >
          <Text style={{ fontSize: 20, margin: 10, color: "white" }}>
            Choose time
          </Text>
        </TouchableOpacity>
        <Text style={habitScreenStyles.subsectionText}>
          Selected time:{"  "}
          <Text style={{ fontWeight: "bold" }}>
            {selectedTime.toTimeString()}
          </Text>
        </Text>
        <Text style={habitScreenStyles.subsectionText}>Description:</Text>
        <TextInput
          style={habitCreationScreenStyles.descriptionInput}
          onChangeText={onChangeTextDescription}
          value={textDescription}
          placeholder="Enter here"
          keyboardType="default"
          editable
          multiline
          numberOfLines={4}
          maxLength={200}
        />
        <Text style={habitScreenStyles.subsectionText}>Set intensity:</Text>
        <View style={{ flexDirection: "row" }}>
          <Slider
            disabled={checked}
            value={checked ? 0 : valueSlider}
            onValueChange={setValueSlider}
            style={{ width: "63%" }}
            animationType="spring"
            step={1}
            thumbStyle={{
              height: 20,
              width: 20,
              backgroundColor: checked ? "grey" : "darkgreen",
            }}
            maximumValue={10}
            minimumValue={0}
          />
          <CheckBox
            checked={checked}
            onPress={toggleCheckbox}
            title={"No intensity"}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="darkgreen"
            wrapperStyle={habitCreationScreenStyles.intensityCheckBox}
            containerStyle={habitCreationScreenStyles.intensityCheckBox}
          />
        </View>
        <Text style={habitScreenStyles.editSubtitleText}>
          Value:{" "}
          <Text style={{ fontWeight: "bold" }}>
            {valueSlider != -1 ? valueSlider : 0}
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          handleSave({
            name: currentHabit.name,
            date: selectedDate,
            time: timeToString(selectedTime),
            description: textDescription,
            intensity: checked ? -1 : valueSlider,
            color: currentHabit.color,
            good: currentHabit.good,
            icon: currentHabit.icon,
            habit_key: habit_key,
            frequency: currentFrequency + 1,
          })
        }
        style={{
          marginTop: 20,
          marginBottom: 40,
          backgroundColor: "#1a1a1a",
          borderRadius: 5,
          alignItems: "center",
          width: 150,
          alignSelf: "center",
        }}
      >
        <Text style={{ fontSize: 18, margin: 8, color: "white" }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HabitScreenAnother;
