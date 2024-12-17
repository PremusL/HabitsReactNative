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
import {getLocalDB, readHabitInstancesDb, readHabitsDb} from "../DataBaseUtil";
import {HabitType} from "../../types/habit.d";
import {useUserContext} from "../Contexts/UserContext";
import {readInstancesHabitsLocalDb} from "../LocalStorageUtil";


export const OverviewScreen: React.FC<ProfileScreenProps> = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const {user_id, setUser} = useUserContext();

    const [habitInstances, setHabitInstances] = useState<HabitType[]>([]);

    const dates = (): { [key: string]: any } => {
        const dates: { [key: string]: any } = {};
        habitInstances.forEach((habitInstance) => {
            const date = habitInstance.date;
            if (dates[date] === undefined) {
                dates[date] = {dots: [getDotObject(habitInstance.habit_id)]};
            }
        });
        return dates;
    }


    const waitReadHabitInstances = async () => {
        const db = await getLocalDB();

        setHabitInstances(await readInstancesHabitsLocalDb(db));
        console.log(habitInstances);

    }

    useEffect(() => {
        waitReadHabitInstances();

    }, []);

    const getDotObject = (habit_id: number) => {
        const colors = ["blue", "red", "green", "yellow", "purple", "orange", "pink", "brown", "black"];
        const color = colors[habit_id % colors.length];
        return {key: habit_id, color: color};
    }

    const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
    const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
    const workout = {key: 'workout', color: 'green'};

    return (
        <View style={overviewStyles.mainPage}>
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
                    markedDates={dates()}
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
                <Button title={"Fetch habits"} onPress={() => waitReadHabitInstances()}
                        color={'black'}></Button>
            </View>
        </View>
    );
};
