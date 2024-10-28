import React, { createContext, useState, useEffect, useContext } from "react";
import { Text } from "react-native";
import { HabitType } from "../../types/habit.d";
import { useLoadingContext } from "./LoadingContext";
import { readHabitsDB } from "../DataBaseUtil";
import * as SQLite from "expo-sqlite";
import { Constants } from "../Constants";
import { set } from "date-fns";

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

  const fetchDataOffline = async () => {
    const db = await SQLite.openDatabaseAsync(Constants.localDBName);
    const allRows: any = await db.getAllAsync("SELECT * FROM LocalHabits");
    setData(allRows);
  };

  const fetchDataOnline = async () => {
    const db = await SQLite.openDatabaseAsync(Constants.localDBName);
    const data = await readHabitsDB();
    setData(data);
    loadFromDBtoLocal(db, data); // Load data to local db
  };

  const loadFromDBtoLocal = async (
    db: SQLite.SQLiteDatabase,
    data: HabitType[]
  ) => {
    if (data == null) {
      return;
    }
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
      data.forEach(async (habit) => {
        await db.execAsync(
          `REPLACE INTO ${Constants.localHabitsTable}
          (habit_key, name, description, date, time, color, icon, intensity, good, frequency, change_time_stamp) VALUES
        (${habit.habit_key}, "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
         "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}", "${habit.frequency}", "${habit.change_time_stamp}")`
        );
        console.log("Current timestamp: ", habit.change_time_stamp);
      });

      const allRows: any = await db.getAllAsync("SELECT * FROM LocalHabits");
      console.log("All rows:", allRows);
    } catch (error) {
      console.error(
        "Error inserting habits into local when there was connection:",
        error
      );
    }
  };

  const fetchData = async () => {
    try {
      // logic for not reading the local database when there is connection
      let online = true;
      try {
        await fetchDataOnline();
      } catch (e) {
        console.log("error fetching from db", e);
        online = false;
      }
      if (online) return;
      try {
        await fetchDataOffline();
      } catch (error) {
        console.error("Error getting local data:", error);
      }
    } catch (error) {
      console.error("Error opening local database:", error);
    }
  };

  useEffect(() => {
    const waitFetchData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    waitFetchData();
    console.log("Data fetched");
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <DataContext.Provider value={{ data: data, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
