import React, { createContext, useState, useEffect, useContext } from "react";
import { HabitType } from "../../types/habit.d";
import { readHabitsDB } from "../DataBaseUtil";

interface PostgresqlContextType {
  data: HabitType[];
  fetchData: () => Promise<void>;
}

export const PostgresqlContext = createContext<
  PostgresqlContextType | undefined
>(undefined);

export function usePostgreSQLContext() {
  const habitData = useContext(PostgresqlContext);
  if (habitData === undefined) {
    throw new Error("Data was not loaded");
  }
  return habitData;
}

export const PostgresqlProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [data, setData] = useState<HabitType[]>([]);

  const fetchData = async () => {
    const data = await readHabitsDB();
    console.log("Data fetched: ", data);
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PostgresqlContext.Provider value={{ data, fetchData }}>
      {children}
    </PostgresqlContext.Provider>
  );
};

export default PostgresqlContext;
