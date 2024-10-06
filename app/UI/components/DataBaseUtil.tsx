import axios from "axios";
import { HabitType } from "../types/habit.d";
const BASE_URL = "http://10.0.2.2:3000"; // Use 'http://localhost:3000' for iOS

export const readHabitsDB: any = async () => {
  console.log("Reading data from database");
  try {
    const response = await axios.get(`${BASE_URL}/api/readHabits`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to read data", error);
    return null;
  }
};
export const readOneHabitDB = async (habitKey: string) => {
  console.log("Reading data from database");
  try {
    const response = await axios.get(`${BASE_URL}/api/readHabits/${habitKey}`);
    console.log("Data read successfully", response.data);
  } catch (error) {
    console.error("Failed to read data", error);
  }
};

export const writeHabitDB = async (data: HabitType) => {
  console.log("Writing data to database");
  try {
    const response = await axios.post(`${BASE_URL}/api/writeHabits`, data);
    console.log("Data written successfully", response.data);
  } catch (error) {
    console.error("Failed to write data", error);
  }
};
