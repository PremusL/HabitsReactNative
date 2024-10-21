import React, { createContext, useState, useEffect } from "react";
import { HabitType } from "../../types/habit.d";
import { readHabitsDB } from "../DataBaseUtil";

const PostgresqlContext = createContext<HabitType[] | undefined>(undefined);

export const PostgresqlProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [data, setData] = useState<HabitType[]>([]);

  useEffect(() => {
    readHabitsDB().then((data: HabitType[]) => {
      setData(data);
    });
  }, []);

  return (
    <PostgresqlContext.Provider value={data}>
      {children}
    </PostgresqlContext.Provider>
  );
};

export default PostgresqlContext;
