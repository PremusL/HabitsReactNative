import * as SQLite from "expo-sqlite";
import { Constants } from "./Constants";
import { HabitType } from "../types/habit.d";

export const addHabitLocalDb = async (
  db: SQLite.SQLiteDatabase,
  habit: HabitType
) => {
  const query = `
    INSERT INTO ${Constants.habit}
    (version) VALUES (0);
    
    INSERT INTO ${Constants.habit_instance} (
    habit_id,
    name,
    description,
    date,
    time,
    color,
    icon,
    intensity,
    good
    ) VALUES (
     ${habit.habit_id}, "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
   "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}");`;
  await db.execAsync(query);
};

export const deleteHabitLocalDb = async (
  db: SQLite.SQLiteDatabase,
  habit_id: string
) => {
  // Naj majo export spredaj, ne pa na koncu datoteke
  try {
    await db.execAsync(
      `DELETE FROM ${Constants.habit} WHERE habit_id = ${habit_id}
       DELETE FROM ${Constants.habit_instance} WHERE habit_id = ${habit_id}
      `
    );
    console.log("Data locally deleted successfully");
  } catch (error) {
    console.error("Failed to delete data", error);
  }
};
