import React, { createContext, useState, useEffect, useContext } from "react";
import { HabitType } from "../../types/habit.d";
import { readHabitsDB } from "../DataBaseUtil";
import { usePostgreSQLContext } from "./PostgresqlContext";
import * as SQLite from "expo-sqlite";
import { set } from "date-fns";

interface SqLiteContextType {
  data: HabitType[];
  fetchData: () => Promise<void>;
}
const SqLiteContext = createContext<SqLiteContextType | undefined>(undefined);

export function useSqLiteContext() {
  const habitData = useContext(SqLiteContext);
  if (habitData === undefined) {
    throw new Error("Data was not loaded");
  }
  return habitData;
}

export const SqLiteProvider: React.FC<{ children: any }> = ({ children }) => {
  // const [data, setData] = useState<HabitType[]>([]);
  const { dataDb, fetchDataDb } = usePostgreSQLContext();
  const [data, setData] = useState<HabitType[]>([]);

  const testSql = async () => {
    const db = await SQLite.openDatabaseAsync("databaseName");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS LocalHabits (
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
        frequency INTEGER
      );
      `);

    dataDb.forEach((habit: HabitType, index: number) => {
      console.log("jfoejofejoefjofejo");
    });

    // const allRows: any = await db.getAllAsync("SELECT * FROM test");
    // for (const row of allRows) {
    //   console.log(row.id, row.value, row.intValue);
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataDb();
      setData(dataDb);
    };
    fetchData();
    console.log("SqLiteContext data: " + JSON.stringify(dataDb));
  }, []);

  return (
    <SqLiteContext.Provider value={{ data, fetchData: fetchDataDb }}>
      {children}
    </SqLiteContext.Provider>
  );
};
