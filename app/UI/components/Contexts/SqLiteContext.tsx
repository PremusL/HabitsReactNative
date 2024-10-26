import React, { createContext, useState, useEffect, useContext } from "react";
import { Text, Button } from "react-native";
import { HabitType } from "../../types/habit.d";
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
  const [loading, setLoading] = useState(true);

  const testSql = async () => {
    const db = await SQLite.openDatabaseAsync("localhabits.db");

    try {
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
      dataDb.forEach(async (habit) => {
        await db.execAsync(
          `INSERT INTO LocalHabits (habit_key, name, description, date, time, color, icon, intensity, good, frequency) VALUES
        (${habit.habit_key}, "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
         "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}", "${habit.frequency}")`
        );
      });
    } catch (error) {
      console.error("Error inserting habit:", error);
    }

    const allRows: any = await db.getAllAsync("SELECT * FROM LocalHabits");
    for (const row of allRows) {
      console.log(
        row.description,
        row.habit_key,
        row.name,
        row.date,
        row.time,
        row.color,
        row.icon,
        row.intensity,
        row.good,
        row.frequency
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataDb();
      setData(dataDb);
      setLoading(false);
    };
    fetchData();
    testSql();
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SqLiteContext.Provider value={{ data, fetchData: fetchDataDb }}>
      {children}
    </SqLiteContext.Provider>
  );
};
