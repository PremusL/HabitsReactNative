import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { AddButton } from "./Buttons";
import { formatDate, getTodaysDate, timeToString } from "./Util";
import { habitCreationScreenStyles } from "../style/styles";
import { HabitCreationScreenProps } from "../types/screen.d";
import ColorPicker, {
  Panel1,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";
import { CheckBox, Slider, Switch } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome";
import { HabitType } from "../types/habit.d";
import { addHabitLocalDb } from "./LocalStorageUtil";
import { useLoadingContext } from "./Contexts/LoadingContext";
import { addHabitDB, getLocalDB } from "./DataBaseUtil";
import { useUserContext } from "./Contexts/UserContext";

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

const HabitCreationScreen: React.FC<HabitCreationScreenProps> = ({
  navigation,
}) => {
  const { loading, setLoading } = useLoadingContext();
  const { user_id, setUser } = useUserContext();
  const [text, onChangeText] = useState("");
  const [textDescription, onChangeTextDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(true);
  const [valueSlider, setValueSlider] = useState(0);
  const [switchValue, setSwitchValue] = useState(false); // false meaning the habit is bad
  const [selectedIcon, setSelectedIcon] = useState("");

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
  const onPressAddButton = async (data: HabitType) => {
    try {
      const db = await getLocalDB();
      setLoading(true);
      await addHabitLocalDb(db, data);
      setLoading(false);
      await addHabitDB(user_id, data);
    } catch (error) {
      console.log("Failed to add a habit to local data", error);
    }
  };

  return (
    <SafeAreaView style={styles.habit_view}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <AddButton
        navigation={navigation}
        whereTo="Home"
        disabled={
          !selectedDate || !text || text.length < 1 || selectedDate.length < 1
        }
        onPress={() =>
          onPressAddButton({
            habit_id: -1,
            name: text,
            description: textDescription,
            date: selectedDate,
            time: timeToString(currentTime),
            color: color,
            icon: selectedIcon,
            intensity: checked ? -1 : valueSlider,
            good: switchValue ? "Y" : "N",
            version: 0,
            change_time_stamp: undefined,
          })
        }
      />
      <ScrollView>
        <Text style={habitCreationScreenStyles.titleText}>
          What habit do you want to quit?
        </Text>
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
        {selectedDate ? (
          <Text style={{ fontSize: 17, marginTop: 20 }}>
            Selected date:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {formatDate(selectedDate)}
            </Text>
          </Text>
        ) : null}
        {showAdvanced && (
          <View>
            <TouchableOpacity
              onPress={showTimepicker}
              style={[habitCreationScreenStyles.chooseBtn, { marginTop: 20 }]}
            >
              <Text style={{ fontSize: 20, margin: 10, color: "white" }}>
                Choose time
              </Text>
            </TouchableOpacity>
            {currentTime ? (
              <Text style={habitCreationScreenStyles.basicText}>
                Selected time:
                <Text style={{ fontWeight: "bold" }}>
                  {currentTime.toString()}
                </Text>
              </Text>
            ) : null}
            <Text style={habitCreationScreenStyles.subsectionText}>
              Select type of habit:
            </Text>
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
                  style={[
                    habitCreationScreenStyles.chooseBtn,
                    { marginTop: 20 },
                  ]}
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
            {showAdvanced ? "Hide" : "Show advanced"}
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
