import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { getAllKeys, multiGet } from "./LocalStorageUtil";
import { HabitType } from "../types/habit.d";
import { readHabitsDB, writeHabitDB } from "./DataBaseUtil";

// Define the shape of the context data
interface DataContextType {
  data: HabitType[];
  nextKey: number;
  fetchData: () => void;
}

// Create the context with a default value
export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

// Create a provider component
export const DataProvider: React.FC<{ children: any }> = ({ children }) => {
  const [data, setData] = useState<HabitType[]>([]);
  const [nextKey, setMaxKey] = useState(0);

  const fetchData = async () => {
    // console.log("FETCHING IN DATACONTEXT!");
    try {
      const readonlyKeys: readonly string[] | undefined = await getAllKeys();
      const keys: string[] | undefined = readonlyKeys?.slice();
      keys?.sort((a, b) => parseInt(a) - parseInt(b));
      // console.log("Keys: ", keys);
      if (!keys) {
        console.log("No keys found");
        return;
      }

      const data = await multiGet(keys);
      if (!data) {
        console.log("Multi get didn't work");
        return;
      }
      let fetchedHabits = data.map((element: any) => {
        const curKeyValue = element[0];
        const jsonData = JSON.parse(element[1]);
        return {
          name: jsonData.description,
          date: jsonData.date,
          time: jsonData.time,
          habit_key: curKeyValue,
        };
      });
      if (!fetchedHabits) {
        return;
      }
      fetchedHabits = fetchedHabits.sort((a, b) => a.habit_key - b.habit_key);

      setData(fetchedHabits);
      setMaxKey(() => parseInt(data[data.length - 1][0]) + 1);
      data.forEach((element: any, index: number) => {
        // console.log("DataContext: " + index + " " + JSON.stringify(element));
      });
    } catch (error) {
      console.error("Failed to fetch keys", error);
    }
  };
  return (
    <DataContext.Provider value={{ data, nextKey, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
