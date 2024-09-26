import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllKeys, multiGet } from './LocalStorageUtil';
import { HabitType } from './types/habit.d';




// Define the shape of the context data
interface DataContextType {
  data: HabitType[];
  fetchData: () => void;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create a provider component
export const DataProvider: React.FC<{children: any}> = ({ children }) => {
  const [data, setData] = useState<HabitType[]>([]);

  const fetchData = async () => {
    try {
      const readonlyKeys: readonly string[] | undefined = await getAllKeys();
      const keys: string[] | undefined = readonlyKeys?.slice();
      keys?.sort((a, b) => parseInt(a) - parseInt(b));
      console.log("Keys: ", keys);
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
          habitKey: curKeyValue,
        };
      });
      if (!fetchedHabits) {
        return;
      }
      fetchedHabits = fetchedHabits.sort((a , b) => a.habitKey - b.habitKey);
      setData(fetchedHabits);
      
    //   setCurrentKey(keys[keys.length - 1] ? parseInt(keys[keys.length - 1]) + 1 : 0);
    
      // You can use the keys to fetch and set habits if needed
    } catch (error) {
      console.error("Failed to fetch keys", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("DataContext: ", data);
  }, []);

  return (
    <DataContext.Provider value={{ data, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};