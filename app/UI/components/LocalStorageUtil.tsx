import * as SQLite from "expo-sqlite";
import { Constants, HabitTypeConstants } from "./Constants";
import { HabitType } from "../types/habit.d";

export const addHabitLocalDb = async (
  db: SQLite.SQLiteDatabase,
  habit: HabitType
) => {
  const query1 = `
    INSERT INTO ${Constants.habit}
    (${HabitTypeConstants.version}) VALUES (0);`;

  await db.execAsync(query1);
  const cur_id = await db.getFirstAsync(
    `SELECT last_insert_rowid() as id from ${Constants.habit}`
  );
  console.log("Current id: ", cur_id.id);
  const query2 = `
    INSERT INTO ${Constants.habit_instance} (
    ${HabitTypeConstants.habit_id},
    ${HabitTypeConstants.name},
    ${HabitTypeConstants.description},
    ${HabitTypeConstants.date},
    ${HabitTypeConstants.time},
    ${HabitTypeConstants.color},
    ${HabitTypeConstants.icon},
    ${HabitTypeConstants.intensity},
    ${HabitTypeConstants.good}
    ) VALUES (
     ${cur_id.id},
     "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
   "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}");`;
  await db.execAsync(query2);

  // await db.execAsync(query2);
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
