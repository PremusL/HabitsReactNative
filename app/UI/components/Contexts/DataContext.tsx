import React, {createContext, useState, useEffect, useContext} from "react";
import {Text, ActivityIndicator, View, Button} from "react-native";
import {HabitType} from "../../types/habit.d";
import {useLoadingContext} from "./LoadingContext";
import {addHabitDb, getLocalDB, readHabitsDb, updateDataDb, updateHabitRemoteDb} from "../DataBaseUtil";
import * as SQLite from "expo-sqlite";
import {Constants} from "../Constants";
import {useUserContext} from "./UserContext";
import {
    addHabitLocalDb,
    createLocalTable,
    deleteAndCreateLocalDB,
    readHabitsLocalDb,
    updateHabitLocalSync
} from "../LocalStorageUtil";
import {printHabitIds} from "../Util";


interface DataContextType {
    data: HabitType[];
    fetchData: () => Promise<void>;
}


const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext() {
    const dataContext = useContext(DataContext);
    if (dataContext === undefined) {
        throw new Error("Data was not loaded");
    }
    return dataContext;
}

const syncLocalToRemote = async (db: SQLite.SQLiteDatabase, dataLocal: HabitType[], dataRemote: HabitType[], user_id: number) => {
    for (const localHabit of dataLocal) {
        const remoteHabit = dataRemote.find(habit => habit.name === localHabit.name);
        if (!remoteHabit) {
            const habit_id_new = await addHabitDb(user_id, localHabit);
            if (habit_id_new !== -1) await updateHabitLocalSync(db, localHabit.habit_id, habit_id_new);
            console.log("added habit to remote", localHabit);
        } else if (localHabit.habit_id !== remoteHabit.habit_id) {
            await updateHabitLocalSync(db, localHabit.habit_id, remoteHabit.habit_id);
        }

        await updateDataDb(user_id, localHabit);


    }
    const dataLocalEnd: HabitType[] = await readHabitsLocalDb(db);
    return dataLocalEnd;
}

const syncRemoteToLocal = async (db: SQLite.SQLiteDatabase, dataLocal: HabitType[], dataRemote: HabitType[]) => {
    for (const remoteHabit of dataRemote) {
        const localHabit = dataLocal.find(habit => habit.name === remoteHabit.name);
        if (!localHabit) {
            await addHabitLocalDb(db, remoteHabit);
            console.log("Added habit to local db:", remoteHabit)
        }
    }
    const dataLocalEnd: HabitType[] = await readHabitsLocalDb(db);
    return dataLocalEnd;
}

export const DataProvider: React.FC<{ children: any }> = ({children}) => {
    const [data, setData] = useState<HabitType[]>([]);
    const {loading, setLoading} = useLoadingContext();
    const {user_id, setUser} = useUserContext();

    const createIfNotExist = (db: SQLite.SQLiteDatabase) => {

        Promise.all([
            db.getFirstAsync(`SELECT *
                              FROM ${Constants.habit}`),
            db.getFirstAsync(`SELECT *
                              FROM ${Constants.habit_instance}`)
        ])
            .then(([habitResult, habitInstanceResult]) => {
                console.log("Both tables exist");
                console.log("Habit table first line: ", habitResult);
                console.log("Habit instance table first line: ", habitInstanceResult);
            })
            .catch((error) => {
                console.log("One or both tables do not exist, creating tables");
                createLocalTable(db);
            });


    };

    const fetchDataOffline = async (db: SQLite.SQLiteDatabase) => {
        const data = await readHabitsLocalDb(db);
        setData(data);
    };


    const syncData = async () => {
        if (!user_id) {
            console.log("No user_id found, skipping sync");
            return;
        }
        console.log("user_id found, syncing data", user_id);
        try {
            const db = await getLocalDB();
            const dataLocal: HabitType[] = await readHabitsLocalDb(db);
            const dataRemote: HabitType[] = await readHabitsDb(user_id);

            const dataLocalToRemote = await syncLocalToRemote(db, dataLocal, dataRemote, user_id);
            console.log("Data local end", dataLocalToRemote);
            const dataLocalFromRemote = await syncRemoteToLocal(db, dataLocalToRemote, dataRemote);
            setData(dataLocalFromRemote);
            printHabitIds(data);
        } catch (error) {
            console.error("Error during sync:", error);
        }
    };

    const fetchData = async () => {
        await syncData();
        const db = await getLocalDB();
        await fetchDataOffline(db);

    };

    useEffect(() => {
        const waitFetchData = async () => {
            setLoading(true);
            const db = await getLocalDB();
            // createIfNotExist(db);
            // createLocalTable(db);
            await syncData();
            await fetchData();
            setLoading(false);
        };
        waitFetchData();
        console.log("Data fetched");

        // Sync data every 10 minutes
        const intervalId = setInterval(async () => {
            // await syncData();
        }, 600000);

        return () => clearInterval(intervalId);
    }, []);

    return loading ? (
        <View style={{margin: 40}}>
            <ActivityIndicator size="large" color="#0000ff"/>
        </View>
    ) : (

        <DataContext.Provider value={{data: data, fetchData}}>
            {children}
        </DataContext.Provider>

    );
};
