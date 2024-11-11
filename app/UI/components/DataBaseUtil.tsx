import axios from "axios";
import {HabitType} from "../types/habit.d";
import * as SQLite from "expo-sqlite";
import {Constants} from "./Constants";

const BASE_URL = "http://192.168.1.103:3001"; // Use 'http://localhost:3000' for iOS

const timeoutDuration = 5000;

export const getLocalDB = async () => {
    const db = await SQLite.openDatabaseAsync(Constants.localDBName, {
        useNewConnection: true,
    });
    return db;
};

export const readHabitsDB: any = async () => {
    console.log("Reading data from database");
    try {
        const response = await axios.get(`${BASE_URL}/api/readHabits`, {timeout: timeoutDuration});
        console.log("Data read successfully", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to read data", error);
        return null;
    }
};

export const updateDataDb: any = async (data: HabitType) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/updateHabits`, data, {
            timeout: timeoutDuration,
        });
        console.log("Data updated successfully", response.data);
    } catch (error) {
        console.log("Failed to update data", error);
    }
};

export const deleteHabitDB = async (habit_id: number) => {
    console.log("Deleting data from database");
    // remote
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/deleteHabit/${habit_id}`,
            {timeout: timeoutDuration}
        );
        console.log("Data deleted successfully", response.data);
    } catch (error) {
        console.log("Failed to delete data", error);
    }
};

export const addHabitDb = async (user_id: number | null, data: HabitType) => {
    console.log("Writing data to database");
    if (user_id === null) {
        console.log("User not logged in");
        return;
    }
    // remote
    try {
        const response = await axios.post(
            `${BASE_URL}/api/writeHabit/${user_id}`,
            data,
            {
                timeout: timeoutDuration,
            }
        );
        console.log("Data written successfully", response.data);
    } catch (error) {
        console.log("Failed to write data", error);
    }
};
