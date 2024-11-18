import React, {createContext, useState, useEffect, useContext} from "react";
import {Text, ActivityIndicator, View, Button} from "react-native";
import {HabitType} from "../../types/habit.d";
import {useLoadingContext} from "./LoadingContext";
import {addHabitDb, getLocalDB, readHabitsDb, updateHabitRemoteDb} from "../DataBaseUtil";
import * as SQLite from "expo-sqlite";
import {Constants} from "../Constants";
import {useUserContext} from "./UserContext";
import {addHabitLocalDb, readHabitsLocalDb, updateHabitLocalSync} from "../LocalStorageUtil";


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


    const createLocalTable = async (db: SQLite.SQLiteDatabase) => {
        try {
            // language=SQL format=false
            console.log("creating table");
            await db.execAsync(`
                DROP TABLE IF EXISTS habit;
                CREATE TABLE habit
                (
                    habit_id INTEGER PRIMARY KEY,
                    version  INTEGER NOT NULL
                );
            `);

            await db.execAsync(
                `DROP TABLE IF EXISTS habit_instance;
                CREATE TABLE habit_instance
                (
                    habit_instance_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    habit_id          INTEGER NOT NULL,
                    name              TEXT,
                    description       TEXT, -- SQLite treats VARCHAR as TEXT
                    date              TEXT, -- Use TEXT for date format
                    time              TEXT, -- Use TEXT for time format
                    color             TEXT,
                    icon              TEXT,
                    intensity         INTEGER,
                    good              TEXT CHECK (good IN ('Y', 'N')),
                    version           INTEGER   DEFAULT 0,
                    change_time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (habit_id) REFERENCES habit (habit_id) ON DELETE CASCADE
                );`
            );
        } catch (error) {
            console.log("Error creating table", error);
        }
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
            console.log("local", dataLocal);
            console.log("remote", dataRemote);
            //TODO habit id is not the same in local and remote db
            // Sync remote habits to local
            // addHabitLocalDb adds habit_id automatically and the id added atomatically ins't the same as the one that is saved on the database
            for (const remoteHabit of dataRemote) {
                const localHabit = dataLocal.find(habit => habit.habit_id === remoteHabit.habit_id);
                if (!localHabit) {
                    setLoading(true);
                    await addHabitLocalDb(db, remoteHabit);
                    console.log("Added habit to local db:", remoteHabit);
                    setLoading(false);
                }
            }
            // Sync local habits to remote
            for (const localHabit of dataLocal) {
                const remoteHabit = dataRemote.find(habit => habit.habit_id === localHabit.habit_id);
                if (!remoteHabit) {
                    const habit_id_new = await addHabitDb(user_id, localHabit);

                    if (habit_id_new !== -1) await updateHabitLocalSync(db, localHabit.habit_id, habit_id_new);
                    console.log("added habit to remote", localHabit);
                }
            }

            console.log("Sync completed successfully");
        } catch (error) {
            console.error("Error during sync:", error);
        }
    };

    const fetchData = async () => {
        const db = await getLocalDB();
        await fetchDataOffline(db);
        // await syncData();
    };

    useEffect(() => {
        const waitFetchData = async () => {
            setLoading(true);
            const db = await getLocalDB();
            // createIfNotExist(db);
            // createLocalTable(db);
            // await syncData();a
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
