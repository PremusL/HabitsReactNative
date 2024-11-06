import React, { createContext, useState, useEffect, useContext } from "react";
import { Text } from "react-native";
import { HabitType } from "../../types/habit.d";
import { useLoadingContext } from "./LoadingContext";
import { getLocalDB, readHabitsDB } from "../DataBaseUtil";
import * as SQLite from "expo-sqlite";
import { Constants, HabitTypeConstants } from "../Constants";
import { addHabitLocalDb } from "../LocalStorageUtil";

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
    db.getFirstAsync(`SELECT * FROM habit`)
      .then((result) => {
        console.log("Table exists first line: ", result);
      })
      .catch((error) => {
        console.log("Table does not exist, creating table");
        createLocalTable(db);
      });
    db.getFirstAsync(`SELECT * FROM habit_instance`)
      .then((result) => {
        console.log("Table exists first line: ", result);
      })
      .catch((error) => {
        console.log("Table does not exist, creating table");
        createLocalTable(db);
      });
  };

  const fetchDataOffline = async (db: SQLite.SQLiteDatabase) => {
    const query = `SELECT
       hi.${HabitTypeConstants.habit_id},
       hi.${HabitTypeConstants.name},
       hi.${HabitTypeConstants.date},
       hi.${HabitTypeConstants.time},
       hi.${HabitTypeConstants.description},
       hi.${HabitTypeConstants.color},
       hi.${HabitTypeConstants.icon},
       hi.${HabitTypeConstants.intensity},
       hi.${HabitTypeConstants.good},
       hi.${HabitTypeConstants.version},
       hi.${HabitTypeConstants.change_time_stamp}
      FROM ${Constants.habit} h
      JOIN ${Constants.habit_instance} hi
      ON h.habit_id = hi.habit_id`;

    const allRows: any = db.getAllAsync(query).catch((error) => {
      console.log(error);
    });
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
        DROP TABLE IF EXISTS habit;
        CREATE TABLE habit (
          habit_id INTEGER PRIMARY KEY AUTOINCREMENT,
          version INTEGER NOT NULL
        );
        `);
      await db.execAsync(`
        DROP TABLE IF EXISTS habit_instance;
        CREATE TABLE "habit_instance" (
          habit_instance_id INTEGER PRIMARY KEY AUTOINCREMENT,
          habit_id INTEGER NOT NULL,
          name TEXT,
          description TEXT,                 -- SQLite treats VARCHAR as TEXT
          date TEXT,                        -- Use TEXT for date format
          time TEXT,                        -- Use TEXT for time format
          color TEXT,
          icon TEXT,
          intensity INTEGER,
          good TEXT CHECK (good IN ('Y', 'N')),
          version INTEGER DEFAULT 0,
          change_time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          FOREIGN KEY (habit_id) REFERENCES "habit"(habit_id) ON DELETE CASCADE
      );
      `);
    } catch (error) {
      console.log("Error creating table", error);
    }
  };

  const removeLocalHabit = async (
    db: SQLite.SQLiteDatabase,
    habit_id: string
  ) => {
    await db.execAsync(
      `DELETE FROM ${Constants.habit_instance} WHERE habit_id = ${habit_id};
       DELETE FROM ${Constants.habit} WHERE habit_id = ${habit_id};`
    );
  };

  const syncData = async () => {
    let isOnline = false;
    // try {
    //   await fetchDataOnline();
    // } catch (error) {
    //   console.log(isOnline);
    //   isOnline = false;
    // }
    if (!isOnline) {
      console.log("We are not online, sync not successful");
      return;
    }
    // try {
    //   const db = await SQLite.openDatabaseAsync(Constants.localDBName);
    //   const dataLocal: HabitType[] = await db.getAllAsync(
    //     `SELECT * FROM ${Constants.habit}`
    //   );
    //   const dataRemote: HabitType[] = await readHabitsDB();

    //   dataRemote.forEach((remoteHabit: HabitType) => {
    //     const localhabit = dataLocal.find(
    //       (habit: HabitType) => habit.habit_id === remoteHabit.habit_id
    //     );
    //     if (!localhabit) {
    //       addHabitLocalDb(db, remoteHabit);
    //       console.log("Added habit to local db:", remoteHabit);
    //     }
    //   });
    //   dataLocal.forEach((localHabit: HabitType) => {
    //     const remoteHabit = dataRemote.find(
    //       (habit: HabitType) => habit.habit_id === localHabit.habit_id
    //     );
    //     if (!remoteHabit) {
    //       console.log("Local habit not in remote db:", localHabit);
    //       // Optionally, you can add this habit to the remote database
    //       removeLocalHabit(db, localHabit.habit_id.toString());
    //     }
    //   });
    // } catch (error) {
    //   console.log("Error fetching data from the online database:", error);
    // }
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
      // await syncData();
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
