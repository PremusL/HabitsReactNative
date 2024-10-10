import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { AddButton } from "./Buttons";
import { formatDate, getTodaysDate } from "./Util";
import { habitCreationScreenStyles } from "../style/styles";
import {
  RootStackParamList,
  HabitCreationScreenProps,
} from "../types/screen.d";

const HabitCreationScreen: React.FC<HabitCreationScreenProps> = ({
  navigation,
}) => {
  const [text, onChangeText] = useState("");
  const [selected, setSelectedDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const onChange = (
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
      onChange,
      mode: "time",
      is24Hour: true,
      positiveButton: { label: "OK", textColor: "black" },
      negativeButton: { label: "Cancel", textColor: "black" },
    });
  };
  const advancedOptionsInteract = () => {
    setShowAdvanced(showAdvanced ? false : true);
  };

  return (
    <SafeAreaView style={styles.habit_view}>
      <AddButton
        navigation={navigation}
        whereTo="Home"
        disabled={!selected || !text || text.length < 1 || selected.length < 1}
        data={{
          habit_key: null,
          name: text,
          description: text,
          date: selected,
          time:
            (currentTime.getHours() < 10
              ? "0" + currentTime.getHours()
              : currentTime.getHours()) +
            ":" +
            (currentTime.getMinutes() < 10
              ? "0" + currentTime.getMinutes()
              : currentTime.getMinutes()) +
            ":00",
        }}
      />
      <ScrollView>
        {/* <View style={{ ustifyContent: "center", alignItems: "center" }}> */}
        <Text style={habitCreationScreenStyles.titleText}>
          What habit do you want to quit?
        </Text>
        {/* </View> */}
        <TextInput
          style={habitCreationScreenStyles.titleInput}
          onChangeText={onChangeText}
          value={text}
          placeholder="Enter here"
          keyboardType="default"
        />
        <View>
          <Text style={habitCreationScreenStyles.subsectionText}>
            Choose the last date of occurrence:
          </Text>
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

        {selected ? (
          <Text style={{ fontSize: 17, marginTop: 20 }}>
            Selected date:{" "}
            <Text style={{ fontWeight: "bold" }}>{formatDate(selected)}</Text>
          </Text>
        ) : null}
        {!showAdvanced && (
          <View>
            <TouchableOpacity
              onPress={showTimepicker}
              style={{
                marginTop: 20,
                backgroundColor: "#1a1a1a",
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, margin: 10, color: "white" }}>
                Choose time
              </Text>
            </TouchableOpacity>
            {currentTime ? (
              <Text style={{ fontSize: 17, marginTop: 20 }}>
                Selected time:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {currentTime.toString()}
                </Text>
              </Text>
            ) : null}
            <Text style={habitCreationScreenStyles.subsectionText}>
              Description:
            </Text>
            <TextInput
              style={habitCreationScreenStyles.descriptionInput}
              onChangeText={onChangeText}
              value={text}
              placeholder="Enter here"
              keyboardType="default"
              editable
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={advancedOptionsInteract}
          style={{
            marginTop: 20,
            marginBottom: 40,
            backgroundColor: "#1a1a1a",
            borderRadius: 5,
            alignItems: "center",
            width: 200,
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: 20, margin: 10, color: "white" }}>
            {showAdvanced ? "Show advanced" : "Hide"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  habit_view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#cccccc",
  },
});

export default HabitCreationScreen;
