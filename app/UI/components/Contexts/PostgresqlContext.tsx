import React, {createContext, useState, useEffect, useContext} from "react";
import {Text} from "react-native";
import {HabitType} from "../../types/habit.d";
import {readHabitsDb} from "../DataBaseUtil";
import {useLoadingContext} from "./LoadingContext";

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

export const DataProvider: React.FC<{ children: any }> = ({children}) => {
    const [data, setData] = useState<HabitType[]>([]);
    const {loading, setLoading} = useLoadingContext();

    const fetchData = async () => {
        const data = await readHabitsDb();
        setData(data);
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
        <DataContext.Provider value={{data: data, fetchData}}>
            {children}
        </DataContext.Provider>
    );
};
