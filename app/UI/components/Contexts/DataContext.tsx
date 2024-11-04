import React, { createContext, useState, useEffect, useContext } from "react";
import { Text } from "react-native";
import { HabitType } from "../../types/habit.d";
import { useLoadingContext } from "./LoadingContext";
import { getLocalDB, readHabitsDB } from "../DataBaseUtil";
import * as SQLite from "expo-sqlite";
import { Constants } from "../Constants";

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

export const DataProvider: React.FC<{ children: any }> = ({ children }) => {
  const [data, setData] = useState<HabitType[]>([]);
  const { loading, setLoading } = useLoadingContext();

  const createIfNotExist = (db: SQLite.SQLiteDatabase) => {
    const firstRow = db
      .getFirstAsync(`SELECT * FROM ${Constants.localHabitsTable}`)
      .then((result) => {
        console.log("Table exists first line: ", result);
      })
      .catch((error) => {
        console.log("Table does not exist, creating table");
        createLocalTable(db);
      });
  };

  const fetchDataOffline = async (db: SQLite.SQLiteDatabase) => {
    const allRows: any = await db.getAllAsync(
      `SELECT * FROM ${Constants.localHabitsTable}`
    );
    setData(allRows);
    console.log("All rows:", allRows);
  };

  const fetchDataOnline = async () => {
    // const db = await SQLite.openDatabaseAsync(Constants.localDBName);
    const data = await readHabitsDB();
    setData(data);
    // loadFromDBtoLocal(db, data); // Load data to local db
  };
  const createLocalTable = async (db: SQLite.SQLiteDatabase) => {
    try {
      await db.execAsync(`
      DROP TABLE IF EXISTS ${Constants.localHabitsTable};
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS ${Constants.localHabitsTable} (
        habits_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        habit_key INTEGER,
        name TEXT,
        description VARCHAR(500),
        date VARCHAR(50),
        time VARCHAR(50),
        color VARCHAR(50),
        icon VARCHAR(50),
        intensity INTEGER,
        good VARCHAR(1),
        frequency INTEGER,
        change_time_stamp TEXT
      );
      `);
    } catch (error) {
      console.log("Error creating table", error);
    }
  };

  const addLocalHabit = async (db: SQLite.SQLiteDatabase, habit: HabitType) => {
    await db.execAsync(
      `INSERT OR REPLACE INTO ${Constants.localHabitsTable}
      (habit_key, name, description, date, time, color, icon, intensity, good, frequency, change_time_stamp) VALUES
    (${habit.habit_key}, "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
     "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}", "${habit.frequency}", "${habit.change_time_stamp}")`
    );
  };
  const removeLocalHabit = async (
    db: SQLite.SQLiteDatabase,
    habit_key: string
  ) => {
    await db.execAsync(
      `DELETE FROM ${Constants.localHabitsTable} WHERE habit_key = ${habit_key}`
    );
  };

  const syncData = async () => {
    let isOnline = true;
    try {
      await fetchDataOnline();
    } catch (error) {
      console.log(isOnline);
      isOnline = false;
    }
    if (!isOnline) {
      console.log("We are not online, sync not successful");
      return;
    }
    try {
      const db = await SQLite.openDatabaseAsync(Constants.localDBName);
      const dataLocal: HabitType[] = await db.getAllAsync(
        `SELECT * FROM ${Constants.localHabitsTable}`
      );
      const dataRemote: HabitType[] = await readHabitsDB();

      dataRemote.forEach((remoteHabit: HabitType) => {
        const localhabit = dataLocal.find(
          (habit: HabitType) => habit.habit_key === remoteHabit.habit_key
        );
        if (!localhabit) {
          addLocalHabit(db, remoteHabit);
          console.log("Added habit to local db:", remoteHabit);
        }
      });
      dataLocal.forEach((localHabit: HabitType) => {
        const remoteHabit = dataRemote.find(
          (habit: HabitType) => habit.habit_key === localHabit.habit_key
        );
        if (!remoteHabit) {
          console.log("Local habit not in remote db:", localHabit);
          // Optionally, you can add this habit to the remote database
          removeLocalHabit(db, localHabit.habit_key.toString());
        }
      });
    } catch (error) {
      console.error("Error fetching data from the online database:", error);
    }
  };

  const fetchData = async () => {
    const db = await getLocalDB();
    await fetchDataOffline(db);
  };

  useEffect(() => {
    const waitFetchData = async () => {
      setLoading(true);
      const db = await getLocalDB();

      createIfNotExist(db);
      await syncData();
      await fetchData();
      setLoading(false);
    };
    waitFetchData();
    console.log("Data fetched");
  }, []);

  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <DataContext.Provider value={{ data: data, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
