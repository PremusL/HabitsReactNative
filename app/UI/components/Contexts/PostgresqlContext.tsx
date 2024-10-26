import React, { createContext, useState, useEffect, useContext } from "react";
import { Text } from "react-native";
import { HabitType } from "../../types/habit.d";
import { readHabitsDB } from "../DataBaseUtil";

interface PostgresqlContextType {
  dataDb: HabitType[];
  fetchDataDb: () => Promise<void>;
}

const PostgresqlContext = createContext<PostgresqlContextType | undefined>(
  undefined
);

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
  const [dataDb, setData] = useState<HabitType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDataDb = async () => {
    const data = await readHabitsDB();
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    const waitFetchDataDb = async () => {
      await fetchDataDb();
    };
    waitFetchDataDb();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <PostgresqlContext.Provider value={{ dataDb, fetchDataDb }}>
      {children}
    </PostgresqlContext.Provider>
  );
};

export default PostgresqlContext;
