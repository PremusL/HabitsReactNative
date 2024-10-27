import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { getTodaysDate, formatDate, timeToString, stringToTime } from "../Util";
import { HabitScreenEditProps } from "../../types/screen.d";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  habitCreationScreenStyles,
  habitScreenStyles,
} from "../../style/styles";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ColorPicker, {
  Panel1,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";
import { CheckBox, Slider, Switch } from "@rneui/themed";
import { HabitType } from "../../types/habit.d";
import { updateDataDB } from "../DataBaseUtil";
import { useDataContext } from "../Contexts/DataContext";

const iconList = [
  "rocket",
  "coffee",
  "heart",
  "star",
  "music",
  "camera",
  "bell",
  "bicycle",
  "book",
  "cloud",
  "leaf",
  "anchor",
];

const HabitScreenEdit: React.FC<HabitScreenEditProps> = ({
  habit_key,
  setEdit,
}) => {
  const { data, fetchData } = useDataContext();
  const currentHabit = data.find(
    (habit: HabitType) => habit.habit_key === habit_key
  );
  if (!currentHabit) {
    throw new Error("Habit with habit_key " + habit_key + " not found");
  }

  const [name, setNameChange] = useState(currentHabit.name);
  const [textDescription, onChangeTextDescription] = useState(
    currentHabit?.description
  );
  const [selectedDate, setSelectedDate] = useState(currentHabit?.date);
  const [selectedTime, setCurrentTime] = useState(
    stringToTime(currentHabit.time)
  );
  const [color, setColor] = useState(currentHabit?.color);
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(currentHabit?.intensity == -1);
  const [valueSlider, setValueSlider] = useState(currentHabit?.intensity);
  const [switchValue, setSwitchValue] = useState(currentHabit?.good); // false meaning the habit is bad
  const [selectedIcon, setSelectedIcon] = useState(currentHabit?.icon);

  const handleSave = async (data: HabitType) => {
    await updateDataDB(data);
    await fetchData();
    setEdit(false);
  };

  const onSelectColor = ({ hex }: any): void => {
    console.log(hex);
    setColor(hex);
  };

  const toggleCheckbox = () => {
    setChecked(!checked);
    if (!checked) {
      setValueSlider(0);
    }
  };

  const settingSelectedIcon = (icon: string) => {
    if (selectedIcon === icon) setSelectedIcon("");
    else setSelectedIcon(icon);
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
      <Text style={habitScreenStyles.subtitle}>Edit habit</Text>
      <Text style={habitScreenStyles.subsectionText}>Edit the name</Text>
      <TextInput
        style={habitCreationScreenStyles.titleInput}
        onChangeText={setNameChange}
        value={name}
        placeholder="Enter here"
        keyboardType="default"
      />
      <View>
        <Text style={habitScreenStyles.subsectionText}>Edit the date</Text>
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
        <Text style={habitScreenStyles.subsectionText}>Edit time</Text>
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

        <Text style={habitScreenStyles.subsectionText}>Edit type</Text>
        <View style={{ flexDirection: "row" }}>
          <Switch
            color={switchValue == "Y" ? "darkgreen" : "darkred"}
            value={switchValue == "Y"}
            onValueChange={() => setSwitchValue(switchValue == "Y" ? "N" : "Y")}
            style={habitCreationScreenStyles.switch}
          />
          <Text
            style={[habitCreationScreenStyles.basicText, { marginTop: 12 }]}
          >
            {switchValue ? "Good habit" : "Bad habit"}
          </Text>
        </View>
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
        <Text style={habitScreenStyles.subsectionText}>Select color:</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={habitCreationScreenStyles.basicText}>
            Selected color:
            <Text style={{ fontWeight: "bold" }}>{color}</Text>
          </Text>
          <View
            style={[
              habitCreationScreenStyles.smallColorView,
              { backgroundColor: color },
            ]}
          />
        </View>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={[habitCreationScreenStyles.chooseBtn]}
        >
          <Text style={{ fontSize: 20, margin: 10, color: "white" }}>
            Choose color
          </Text>
        </TouchableOpacity>
        <Modal visible={showModal} animationType="slide">
          <View style={habitCreationScreenStyles.modal}>
            <ColorPicker
              style={{ width: "100%" }}
              value="white"
              onComplete={onSelectColor}
            >
              <Preview />
              <Panel1 />
              <HueSlider />
              <OpacitySlider />
            </ColorPicker>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[habitCreationScreenStyles.chooseBtn, { marginTop: 20 }]}
            >
              <Text style={{ fontSize: 20, margin: 10, color: "white" }}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={habitCreationScreenStyles.subsectionText}>
          Select icon:
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {iconList.map((icon, index) => (
            <TouchableOpacity onPress={() => settingSelectedIcon(icon)}>
              <Icon
                name={icon}
                size={30}
                color={selectedIcon === icon ? "darkgreen" : "#1a1a1a"}
                style={{ margin: 15 }}
                key={index}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          handleSave({
            name: name,
            date: selectedDate,
            time: timeToString(selectedTime),
            description: textDescription,
            intensity: checked ? -1 : valueSlider,
            color: color,
            good: switchValue,
            icon: selectedIcon,
            habit_key: habit_key,
            frequency: currentHabit.frequency,
            current_time_stamp: new Date().toISOString(),
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

export default HabitScreenEdit;
