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

  const result = await db.runAsync(query1);
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
     ${result.lastInsertRowId},
     "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
   "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}");`;
  await db.execAsync(query2);
};

export const deleteHabitLocalDb = async (
  db: SQLite.SQLiteDatabase,
  habit_id: string
) => {
  // Naj majo export spredaj, ne pa na koncu datoteke
  try {
    await db.execAsync(
      `DELETE FROM ${Constants.habit} WHERE habit_id = ${habit_id}`
    );
    await db.execAsync(
      `DELETE FROM ${Constants.habit_instance} WHERE habit_id = ${habit_id}`
    );

    console.log("Data locally deleted successfully");
  } catch (error) {
    console.error("Failed to delete data", error);
  }
};

export const updateHabitLocalDB = async (
  db: SQLite.SQLiteDatabase,
  data: HabitType
) => {
  console.log("Updating data in database with data:", data);
  try {
    const query = `
      UPDATE ${Constants.habit_instance}
        SET
        ${HabitTypeConstants.name} = '${data.name}',
        ${HabitTypeConstants.description} = '${data.description}',
        ${HabitTypeConstants.date} = '${data.date}',
        ${HabitTypeConstants.time} = '${data.time}',
        ${HabitTypeConstants.color} = '${data.color}',
        ${HabitTypeConstants.icon} = '${data.icon}',
        ${HabitTypeConstants.intensity} = '${data.intensity}',
        ${HabitTypeConstants.good} = '${data.good}',
        ${HabitTypeConstants.version} = ${data.version}
        WHERE ${HabitTypeConstants.habit_id} = ${data.habit_id};
       `;
    console.group("Query", query);

    await db.execAsync(query);
  } catch (error) {
    console.error("Failed to update local data", error);
  }
};
