// import React, { createContext, useState, useEffect, useContext } from "react";
// import { Text, Button } from "react-native";
// import { HabitType } from "../../types/habit.d";
// import { usePostgreSQLContext } from "./PostgresqlContext";
// import * as SQLite from "expo-sqlite";
// import { Constants } from "../Constants";
// import { useLoadingContext } from "./LoadingContext";

// interface SqLiteContextType {
//   data: HabitType[];
//   fetchData: () => Promise<void>;
// }
// const SqLiteContext = createContext<SqLiteContextType | undefined>(undefined);

// export function useSqLiteContext() {
//   const habitData = useContext(SqLiteContext);
//   if (habitData === undefined) {
//     throw new Error("Data was not loaded");
//   }
//   return habitData;
// }

// export const SqLiteProvider: React.FC<{ children: any }> = ({ children }) => {
//   // const [data, setData] = useState<HabitType[]>([]);
//   const { dataDb, fetchDataDb } = usePostgreSQLContext();
//   const [data, setData] = useState<HabitType[]>([]);
//   const { loading, setLoading } = useLoadingContext();

//   const setAllLocalData = async (db: SQLite.SQLiteDatabase) => {
//     console.log("Setting all local data");
//     try {
//       const allRows: any = await db.getAllAsync(
//         `SELECT * FROM ${Constants.localHabitsTabel}`
//       );
//       setData(allRows);
//     } catch (error) {
//       console.error("Error getting local data:", error);
//     }
//   };

//   const createAndInsert = async (db: SQLite.SQLiteDatabase) => {
//     try {
//       await db.execAsync(`
//       DROP TABLE IF EXISTS ${Constants.localHabitsTabel};
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS ${Constants.localHabitsTabel} (
//         habits_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
//         habit_id INTEGER,
//         name TEXT,
//         description VARCHAR(500),
//         date VARCHAR(50),
//         time VARCHAR(50),
//         color VARCHAR(50),
//         icon VARCHAR(50),
//         intensity INTEGER,
//         good VARCHAR(1),
//         frequency INTEGER,
//         change_time_stamp TEXT
//       );
//       `);
//       dataDb.forEach(async (habit) => {
//         await db.execAsync(
//           `REPLACE INTO ${Constants.localHabitsTabel} (habit_id, name, description, date, time, color, icon, intensity, good, frequency) VALUES
//         (${habit.habit_id}, "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
//          "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}", "${habit.frequency}")`
//         );
//       });
//       const allRows: any = await db.getAllAsync("SELECT * FROM LocalHabits");
//       console.log("All rows:", allRows);
//     } catch (error) {
//       console.error("Error inserting habit:", error);
//     }
//   };

//   const fetchData = async () => {
//     await fetchDataDb();
//     setData(dataDb);

//     // const db = await SQLite.openDatabaseAsync(Constants.localDBName);
//     // if (dataDb == null || dataDb.length == 0) {
//     //   setAllLocalData(db);
//     // } else {
//     //   createAndInsert(db);
//     // }
//     setLoading(false);
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchData();
//   }, []);
//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <SqLiteContext.Provider value={{ data, fetchData }}>
//       {children}
//     </SqLiteContext.Provider>
//   );
// };
