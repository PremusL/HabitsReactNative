import axios from "axios";
import { HabitType } from "../types/habit.d";
import { useLoadingContext } from "./Contexts/LoadingContext";
import * as SQLite from "expo-sqlite";
import { Constants } from "./Constants";

const BASE_URL = "http://10.0.2.2:3001"; // Use 'http://localhost:3000' for iOS

export const readHabitsDB: any = async () => {
  console.log("Reading data from database");
  try {
    const response = await axios.get(`${BASE_URL}/api/readHabits`);

    return response.data;
  } catch (error) {
    console.error("Failed to read data", error);
    return null;
  }
};
export const updateDataDB: any = async (data: HabitType) => {
  console.log("Updating data in database with data:", data);
  try {
    const response = await axios.post(`${BASE_URL}/api/updateHabits`, data);
    console.log("Data updated successfully", response.data);
  } catch (error) {
    console.error("Failed to update data", error);
  }
};

export const deleteHabitDB = async (habit_key: string) => {
  console.log("Deleting data from database");
  // local
  try {
    const db = await SQLite.openDatabaseAsync(Constants.localDBName);
    await db.execAsync(
      `DELETE FROM ${Constants.localHabitsTable} WHERE habit_key = ${habit_key}`
    );
  } catch (error) {
    console.error("Failed to delete local data", error);
  }
  // remote
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/deleteHabits/${habit_key}`
    );
    console.log("Data deleted successfully", response.data);
  } catch (error) {
    console.error("Failed to delete data", error);
  }
};

export const writeHabitDB = async (data: HabitType) => {
  console.log("Writing data to database");
  // local
  try {
    const db = await SQLite.openDatabaseAsync(Constants.localDBName);
    const query = `INSERT INTO ${Constants.localHabitsTable} (habit_key, name, description, date, time, 
      color, icon, intensity, good, frequency, change_time_stamp) VALUES
      (${data.habit_key}, '${data.name}', '${data.description}', '${data.date}', '${data.time}', 
      '${data.color}', '${data.icon}', ${data.intensity},
      '${data.good}', ${data.frequency}, '${data.change_time_stamp}')`;
    console.log(query);
    await db.execAsync(query);
  } catch (error) {
    console.error("Failed to add a habait to local data", error);
  }

  // remote
  try {
    const response = await axios.post(`${BASE_URL}/api/writeHabits`, data);
    console.log("Data written successfully", response.data);
  } catch (error) {
    console.error("Failed to write data", error);
  }
};
