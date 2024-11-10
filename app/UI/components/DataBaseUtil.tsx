import axios from "axios";
import { HabitType } from "../types/habit.d";
import * as SQLite from "expo-sqlite";
import { Constants } from "./Constants";
import { addHabitLocalDb, deleteHabitLocalDb } from "./LocalStorageUtil";

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
    const query = `UPDATE ${Constants.habit_instance} 
        SET
        name = '${data.name}',
        description = '${data.description}',
        date = '${data.date}',
        time = '${data.time}',
        color = '${data.color}',
        icon = '${data.icon}',
        intensity = '${data.intensity}',
        good = '${data.good}',
        version = ${data.version + 1},
        change_time_stamp = '${data.change_time_stamp}'
        WHERE habit_id = ${data.habit_id};
       `;

    await db.execAsync(query);
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

export const deleteHabitDB = async (habit_id: number) => {
  console.log("Deleting data from database");
  // local
  try {
    const db = await getLocalDB();
    deleteHabitLocalDb(db, habit_id);
  } catch (error) {
    console.log("Failed to delete local data", error);
  }
  // remote
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/deleteHabits/${habit_id}`,
      { timeout: timeoutDuration }
    );
    console.log("Data deleted successfully", response.data);
  } catch (error) {
    console.log("Failed to delete data", error);
  }
};

export const addHabitDB = async (user_id: number | null, data: HabitType) => {
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
