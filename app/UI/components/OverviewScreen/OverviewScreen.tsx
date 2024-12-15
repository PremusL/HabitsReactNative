import React, {useEffect, useState} from "react";
import {
    Button,
    View,
    Text
} from "react-native";
import {overviewStyles, profileStyles} from "../../style/styles";
import {ProfileScreenProps} from "../../types/screen.d";
import {getTodaysDate} from "../Util";
import {Calendar} from "react-native-calendars";
import {readHabitInstancesDb, readHabitsDb} from "../DataBaseUtil";
import {HabitType} from "../../types/habit.d";
import {useUserContext} from "../Contexts/UserContext";


export const OverviewScreen: React.FC<ProfileScreenProps> = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const {user_id, setUser} = useUserContext();

    const [habitInstances, setHabitInstances] = useState<HabitType[]>([]);


    useEffect(() => {
        const waitReadHabitInstances = async () => {
            setHabitInstances(await readHabitInstancesDb(user_id));
        }
        waitReadHabitInstances();
        console.log(habitInstances);
    }, []);

    const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
    const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
    const workout = {key: 'workout', color: 'green'};

    return (
        <View style={overviewStyles.mainPage}>
            {user_id != null ? (
                <View>
                    <Calendar
                        style={{borderColor: "black", borderWidth: 2}}
                        onDayPress={(day: any) => {
                            setSelectedDate(day.dateString);
                        }}
                        markingType={"multi-dot"}
                        hideExtraDays={true}
                        firstDay={1}
                        maxDate={getTodaysDate()}
                        markedDates={{
                            '2024-12-15': {dots: [massage, workout], disabled: false},
                            '2024-12-13': {dots: [massage, workout], disabled: false}
                        }}
                        theme={{
                            backgroundColor: "#00000",
                            calendarBackground: "#00000",
                            textSectionTitleColor: "black",
                            selectedDayBackgroundColor: "black",
                            selectedDayTextColor: "black",
                            selectedDayTextWeight: "700",
                            todayTextColor: "green",
                            dayTextColor: "black",
                            textDisabledColor: "#666666",
                            arrowColor: "black",
                        }}
                    />
                    <Button title={"Fetch habits"} onPress={() => readHabitInstancesDb(user_id)}
                            color={'black'}></Button>
                </View>
            ) : (<Text> Login to use habit OverView </Text>)}

        </View>
    );
};
