import React, {useState, useEffect} from "react";
import {SafeAreaView, Button, Text, ScrollView} from "react-native";
import {AddButton} from "./Buttons";
import {HabitList} from "./HabitObject";
import {HomeScreenProps} from "../types/screen.d";
import {styles} from "../style/styles";
import {useDataContext} from "./Contexts/DataContext";
import {useUserContext} from "./Contexts/UserContext";
import {RefreshControl} from "react-native-gesture-handler";
import {addHabitLocalDb} from "./LocalStorageUtil";


const HomeScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
    const {data, fetchData} = useDataContext();
    const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
    const {user_id, setUser} = useUserContext();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        const waitFetchData = async () => {
            await fetchData();
        };
        waitFetchData();
    }, []);

    return (
        <SafeAreaView style={styles.mainPage}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <AddButton
                    navigation={navigation}
                    whereTo="HabitCreationScreen"
                    onPress={() => {
                    }}
                />
                {user_id != null && (
                    <Text style={{position: "absolute", bottom: 20, left: 30}}>
                        You are logged in
                    </Text>
                )}

                {data && (
                    <HabitList
                        habits={data}
                        navigation={navigation as any}
                        selectedHabit={selectedHabit}
                        setSelectedHabit={(habit_id) => setSelectedHabit(habit_id ?? null)}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
export default HomeScreen;
