import axios from "axios";
import { HabitType } from "../types/habit.d";
import * as SQLite from "expo-sqlite";
import { Constants } from "./Constants";

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
    const db = await getLocalDB();
    const query = `UPDATE ${Constants.localHabitsTable} 
        SET
        name = '${data.name}',
        description = '${data.description}',
        date = '${data.date}',
        time = '${data.time}',
        color = '${data.color}',
        icon = '${data.icon}',
        intensity = '${data.intensity}',
        good = '${data.good}',
        frequency = ${data.frequency},
        change_time_stamp = '${data.change_time_stamp}'
        WHERE habit_key = ${data.habit_key};
       `;

    await db.execAsync(query);
    console.log(query);
  } catch (error) {
    console.error("Failed to update local data", error);
  }
  // Remote
  try {
    const response = await axios.post(`${BASE_URL}/api/updateHabits`, data, {
      timeout: timeoutDuration,
    });
    console.log("Data updated successfully", response.data);
  } catch (error) {
    console.log("Failed to update data", error);
  }
};

export const deleteHabitDB = async (habit_key: string) => {
  console.log("Deleting data from database");
  // local
  try {
    const db = await getLocalDB();
    await db.execAsync(
      `DELETE FROM ${Constants.localHabitsTable} WHERE habit_key = ${habit_key}`
    );
  } catch (error) {
    console.log("Failed to delete local data", error);
  }
  // remote
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/deleteHabits/${habit_key}`,
      { timeout: timeoutDuration }
    );
    console.log("Data deleted successfully", response.data);
  } catch (error) {
    console.log("Failed to delete data", error);
  }
};

export const writeHabitDB = async (data: HabitType) => {
  console.log("Writing data to database");
  // local
  try {
    const db = await getLocalDB();
    const query = `INSERT INTO ${Constants.localHabitsTable} (habit_key, name, description, date, time, 
      color, icon, intensity, good, frequency, change_time_stamp) VALUES
      (${data.habit_key}, '${data.name}', '${data.description}', '${data.date}', '${data.time}', 
      '${data.color}', '${data.icon}', ${data.intensity},
      '${data.good}', ${data.frequency}, '${data.change_time_stamp}')`;
    await db.execAsync(query);
  } catch (error) {
    console.log("Failed to add a habait to local data", error);
  }
  // remote
  try {
    const response = await axios.post(`${BASE_URL}/api/writeHabits`, data, {
      timeout: timeoutDuration,
    });
    console.log("Data written successfully", response.data);
  } catch (error) {
    console.log("Failed to write data", error);
  }
};
