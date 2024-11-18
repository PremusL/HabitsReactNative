import axios from "axios";
import {HabitType} from "../types/habit.d";
import * as SQLite from "expo-sqlite";
import {Constants} from "./Constants";
// @ts-ignore
// import {BASE_URL} from "@env";

const BASE_URL = "http://10.0.2.2:8787";


const timeoutDuration = 4000;

export const getLocalDB = async () => {
    const db = await SQLite.openDatabaseAsync(Constants.localDBName, {
        useNewConnection: true,
    });
    return db;
};

export const readHabitsDb: any = async (user_id: number) => {
    console.log("Reading data from database");
    try {
        const response = await axios.get(`${BASE_URL}/api/readHabits/${user_id}`,
            {timeout: timeoutDuration});
        console.log("Data read successfully", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to read data", error);
        return null;
    }
};

export const updateDataDb: any = async (user_id: number, data: HabitType) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/updateHabits/${user_id}`, data, {
            timeout: timeoutDuration,
        });
        console.log("Data updated successfully", response.data);
    } catch (error) {
        console.log("Failed to update data", error);
    }
};

export const updateHabitRemoteDb: any = async (user_id: number, habit_id_old: number, habit_id_new: number) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/updateHabit/${user_id}`, {
            'habit_id_old': habit_id_old,
            'habit_id_new': habit_id_new
        }, {
            timeout: timeoutDuration,
        });
        console.log("Data updated successfully", response.data);
    } catch (error) {
        console.log("Failed to update data", error);
    }
};


export const deleteHabitDB = async (user_id: number, habit_id: number) => {
    console.log("Deleting data from database");
    // TODO - delete just for user_id
    // remote
    try {
        const response = await axios.post(
            `${BASE_URL}/api/deleteHabit/${user_id}`, {habit_id},
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
        return -1;
    }
    try {
        const response = await axios.post(
            `${BASE_URL}/api/writeHabit/${user_id}`,
            data,
            {
                timeout: timeoutDuration,
            }
        );

        console.log("Data written successfully!@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", response, response.data);

        return response.data.habit_id;
    } catch (error) {
        console.log("Failed to write data", error);
        return -1;
    }
};
