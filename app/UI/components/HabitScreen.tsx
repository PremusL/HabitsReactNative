import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { IncreaseFrequencyButton, RemoveButton } from "./Buttons"; // Adjust the path as necessary
import { Calendar } from "react-native-calendars";
import {
  generateMarkedDates,
  getTodaysDate,
  calculateTimeDifference,
  formatDate,
} from "./Util"; // Adjust the path as necessary
import { HabitScreenProps } from "../types/screen.d";
import Icon from "react-native-vector-icons/FontAwesome";
import { habitCreationScreenStyles, habitScreenStyles } from "../style/styles";
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
import { set } from "date-fns";
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

const HabitScreen: React.FC<HabitScreenProps> = ({ navigation, route }) => {
  const currentParams = route?.params;

  const [showEdit, setShowEdit] = React.useState(false);
  const [frequency, setFrequency] = React.useState(currentParams?.frequency);
  const [text, onChangeText] = useState("");
  const [textDescription, onChangeTextDescription] = useState(
    currentParams?.description
  );
  const [selected, setSelectedDate] = useState(currentParams?.date);
  const [currentTime, setCurrentTime] = useState(currentParams?.time);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [color, setColor] = useState(currentParams?.color);
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(true);
  const [valueSlider, setValueSlider] = useState(currentParams?.intensity);
  const [switchValue, setSwitchValue] = useState(currentParams?.good == "Y"); // false meaning the habit is bad
  const [selectedIcon, setSelectedIcon] = useState(currentParams?.icon);

  const toggleCheckbox = () => {
    setChecked(!checked);
    if (!checked) {
      setValueSlider(0);
    }
  };

  const editSaveButtonHandler = () => {
    if (showEdit) {
      setShowEdit(false);
      //TODO saves to the database
      console.log("Save changes");
    } else {
      // Edit habit
      setShowEdit(true);
      console.log("Edit habit");
    }
  };

  const settingSelectedIcon = (icon: string) => {
    if (selectedIcon === icon) setSelectedIcon("");
    else setSelectedIcon(icon);
  };

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

  const onSelectColor = ({ hex }: any): void => {
    console.log(hex);
    setColor(hex);
  };

  const handleFrequencyUpdate = (frequency: number) => {
    setFrequency(frequency);
  };

  const currentDate = currentParams?.date;
  const markedDates = generateMarkedDates(currentDate, getTodaysDate());

  return (
    <View style={{ flex: 1 }}>
      <IncreaseFrequencyButton
        habit_key={currentParams?.habit_key}
        frequency={frequency}
        setFrequency={handleFrequencyUpdate}
      />
      <RemoveButton
        navigation={navigation}
        whereTo="Home"
        data={{ remove: currentParams?.habit_key }}
      />
      <ScrollView style={styles.habit_view}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "center",
              marginRight: 10,
              marginBottom: 15,
            }}
          >
            {currentParams?.name}
          </Text>
          {currentParams.icon && (
            <Icon
              name={currentParams?.icon}
              color={currentParams.color}
              size={30}
              style={{ textAlign: "center" }}
            />
          )}
        </View>
        {!showEdit && <HabitScreenPreview />}
        {showEdit && <HabitScreenEdit />}
        <TouchableOpacity
          onPress={() => editSaveButtonHandler()}
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
          <Text style={{ fontSize: 18, margin: 8, color: "white" }}>
            {showEdit ? "Hide" : "Edit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  function HabitScreenPreview(): React.ReactNode {
    return (
      <View>
        <Calendar
          markingType={"period"}
          hideExtraDays={true}
          firstDay={1}
          markedDates={markedDates}
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

        <Text style={{ fontSize: 22 }}>
          Free for: {calculateTimeDifference(currentDate, getTodaysDate())} days
        </Text>
        <Text style={habitCreationScreenStyles.basicText}>
          Last occurance: {formatDate(currentParams.date)} at{" "}
          {currentParams.time}
        </Text>
        <Text style={habitCreationScreenStyles.basicText}>
          Description:{"\n"}
          {currentParams?.description ? currentParams?.description : "No notes"}
        </Text>
        <Text style={habitCreationScreenStyles.basicText}>
          Intensity:{"\n"}
          {currentParams?.intensity > 0
            ? currentParams?.intensity + "/10"
            : "No intensity"}
        </Text>
      </View>
    );
  }

  function HabitScreenEdit(): React.ReactNode {
    return (
      <View>
        <Text style={habitScreenStyles.subtitle}>Edit habit</Text>
        <Text style={habitScreenStyles.subsectionText}>Edit the name</Text>
        <TextInput
          style={habitCreationScreenStyles.titleInput}
          onChangeText={onChangeText}
          value={currentParams?.name}
          placeholder="Enter here"
          keyboardType="default"
        />
        <View>
          <Text style={habitCreationScreenStyles.subsectionText}>
            Edit the date
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

        <Text style={habitScreenStyles.subsectionText}>
          Selected date:{"  "}
          <Text style={{ fontWeight: "bold" }}>
            {formatDate(currentParams.date)}
          </Text>
        </Text>
        <View>
          <Text style={habitScreenStyles.editSubtitleText}>Edit the time</Text>
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
              {currentParams.time.toString()}
            </Text>
          </Text>

          <Text style={habitScreenStyles.editSubtitleText}>Edit type</Text>
          <View style={{ flexDirection: "row" }}>
            <Switch
              color={switchValue ? "darkgreen" : "darkred"}
              value={switchValue}
              onValueChange={() => setSwitchValue(!switchValue)}
              style={habitCreationScreenStyles.switch}
            />
            <Text
              style={[habitCreationScreenStyles.basicText, { marginTop: 12 }]}
            >
              {switchValue ? "Good habit" : "Bad habit"}
            </Text>
          </View>
          <Text style={habitCreationScreenStyles.subsectionText}>
            Description:
          </Text>
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
          <Text style={habitCreationScreenStyles.subsectionText}>
            Set intensity:
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Slider
              disabled={checked}
              value={valueSlider}
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
          <Text style={habitCreationScreenStyles.basicText}>
            Value: <Text style={{ fontWeight: "bold" }}>{valueSlider}</Text>
          </Text>
          <Text style={habitCreationScreenStyles.subsectionText}>
            Select color:
          </Text>
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
      </View>
    );
  }
};

const styles = StyleSheet.create({
  habit_view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#cccccc",
  },
});

export default HabitScreen;
