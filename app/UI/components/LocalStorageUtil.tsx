import * as SQLite from "expo-sqlite";
import {Constants, HabitTypeConstants} from "./Constants";
import {HabitType} from "../types/habit.d";
import {updateHabitRemoteDb} from "./DataBaseUtil";


export const readHabitsLocalDb = async (db: SQLite.SQLiteDatabase) => {
    const query = `SELECT hi.${HabitTypeConstants.habit_id},
                          hi.${HabitTypeConstants.name},
                          hi.${HabitTypeConstants.date},
                          hi.${HabitTypeConstants.time},
                          hi.${HabitTypeConstants.description},
                          hi.${HabitTypeConstants.color},
                          hi.${HabitTypeConstants.icon},
                          hi.${HabitTypeConstants.intensity},
                          hi.${HabitTypeConstants.good},
                          hi.${HabitTypeConstants.version},
                          hi.${HabitTypeConstants.change_time_stamp}
                   FROM ${Constants.habit} h
                            JOIN ${Constants.habit_instance} hi
                                 ON h.${HabitTypeConstants.habit_id} = hi.${HabitTypeConstants.habit_id}
                   WHERE h.${HabitTypeConstants.version} = hi.${HabitTypeConstants.version}
    `;
    try {
        const allRows: any = await db.getAllAsync(query);

        return allRows;
    } catch (error) {
        console.log("Fail on offline fetch", error);
        return null;
    }
}


export const addHabitLocalDb = async (
    db: SQLite.SQLiteDatabase,
    habit: HabitType
) => {
    if (habit.habit_id == -1) {
        const habit_id_max: {
            max_id: number
        } | null = await db.getFirstAsync(`SELECT MAX(${HabitTypeConstants.habit_id}) as max_id
                                           FROM ${Constants.habit}`);

        habit.habit_id = habit_id_max != null ? habit_id_max.max_id + 1 : 0;
    }

    console.group("NEW LOCAL HABIT ID:", habit.habit_id);
    const query1 = `
        INSERT INTO ${Constants.habit}
            (${HabitTypeConstants.habit_id}, ${HabitTypeConstants.version})
        VALUES (${habit.habit_id}, 0);`; //TODO

    const query2 = `
        INSERT INTO ${Constants.habit_instance} (${HabitTypeConstants.habit_id},
                                                 ${HabitTypeConstants.name},
                                                 ${HabitTypeConstants.description},
                                                 ${HabitTypeConstants.date},
                                                 ${HabitTypeConstants.time},
                                                 ${HabitTypeConstants.color},
                                                 ${HabitTypeConstants.icon},
                                                 ${HabitTypeConstants.intensity},
                                                 ${HabitTypeConstants.good})
        VALUES (${habit.habit_id},
                "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
                "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}");`;

    // console.log("Query add habit", query1, query2);
    await db.runAsync(query1);
    await db.execAsync(query2);
};
export const addInstanceHabitLocalDb = async (
    db: SQLite.SQLiteDatabase,
    habit: HabitType
) => {
    const query1 = `
        UPDATE ${Constants.habit}
        SET ${HabitTypeConstants.version} = ${habit.version}
        WHERE ${HabitTypeConstants.habit_id} = ${habit.habit_id};`;

    const query2 = `
        INSERT INTO ${Constants.habit_instance} (${HabitTypeConstants.habit_id},
                                                 ${HabitTypeConstants.name},
                                                 ${HabitTypeConstants.description},
                                                 ${HabitTypeConstants.date},
                                                 ${HabitTypeConstants.time},
                                                 ${HabitTypeConstants.color},
                                                 ${HabitTypeConstants.icon},
                                                 ${HabitTypeConstants.intensity},
                                                 ${HabitTypeConstants.good},
                                                 ${HabitTypeConstants.version})
        VALUES (${habit.habit_id},
                "${habit.name}", "${habit.description}", "${habit.date}", "${habit.time}",
                "${habit.color}", "${habit.icon}", "${habit.intensity}", "${habit.good}", ${habit.version});`;
    // console.group("Query add instance", query1);

    try {
        await db.execAsync(query1);
        await db.execAsync(query2);
    } catch (error) {
        console.log("Failed to add instance to local data", error);
    }
};

export const deleteHabitLocalDb = async (
    db: SQLite.SQLiteDatabase,
    habit_id: number
) => {
    // Naj majo export spredaj, ne pa na koncu datoteke
    try {
        await db.execAsync(
            `DELETE
             FROM ${Constants.habit}
             WHERE habit_id = ${habit_id}`
        );
        await db.execAsync(
            `DELETE
             FROM ${Constants.habit_instance}
             WHERE habit_id = ${habit_id}`
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
            SET ${HabitTypeConstants.name}        = '${data.name}',
                ${HabitTypeConstants.description} = '${data.description}',
                ${HabitTypeConstants.date}        = '${data.date}',
                ${HabitTypeConstants.time}        = '${data.time}',
                ${HabitTypeConstants.color}       = '${data.color}',
                ${HabitTypeConstants.icon}        = '${data.icon}',
                ${HabitTypeConstants.intensity}   = '${data.intensity}',
                ${HabitTypeConstants.good}        = '${data.good}'
            WHERE ${HabitTypeConstants.habit_id} = ${data.habit_id}
              AND ${HabitTypeConstants.version} = ${data.version};
        `;
        // console.group("Query", query);

        await db.execAsync(query);
    } catch (error) {
        console.error("Failed to update local data", error);
    }
};

export const getHistoryLocalDb = async (
    db: SQLite.SQLiteDatabase,
    habit_id: number
) => {
    try {
        const query = `SELECT *
                       FROM ${Constants.habit_instance}
                       WHERE ${HabitTypeConstants.habit_id} = ${habit_id}`;
        const allRows: HabitType[] = await db.getAllAsync(query);
        console.log("All rows from instance:", allRows);

        return allRows;
    } catch (error) {
        console.error("Failed to get history", error);
        return null;
    }
};


export const updateHabitLocalSync = async (
    db: SQLite.SQLiteDatabase,
    habit_id_old: number,
    habit_id_new: number
) => {
    const query_habit = `
        UPDATE ${Constants.habit}
        SET habit_id = ${habit_id_new}
        WHERE habit_id = ${habit_id_old} RETURNING
			*;`;

    const query_habit_instance = `
        UPDATE ${Constants.habit_instance}
        SET habit_id = ${habit_id_new}
        WHERE habit_id = ${habit_id_old};`;

    // console.log("queries", query_habit, query_habit_instance);

    await db.runAsync(query_habit);
    const result = await db.runAsync(query_habit_instance);

    console.log("Data locally updated successfully");

}
export const createLocalTable = async (db: SQLite.SQLiteDatabase) => {
    try {
        // language=SQL format=false\
        const query_habit = `
            DROP TABLE IF EXISTS habit;
            CREATE TABLE habit
            (
                habit_id INTEGER NOT NULL,
                version  INTEGER NOT NULL
            );
        `;
        const query_habit_instance = `DROP TABLE IF EXISTS habit_instance;
        CREATE TABLE habit_instance
        (
            habit_instance_id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id          INTEGER NOT NULL,
            name              TEXT,
            description       TEXT, -- SQLite treats VARCHAR as TEXT
            date              TEXT, -- Use TEXT for date format
            time              TEXT, -- Use TEXT for time format
            color             TEXT,
            icon              TEXT,
            intensity         INTEGER,
            good              TEXT CHECK (good IN ('Y', 'N')),
            version           INTEGER   DEFAULT 0,
            change_time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;


        await db.execAsync(query_habit);
        await db.execAsync(query_habit_instance);
        console.log("creating table: ", query_habit, query_habit_instance);


    } catch (error) {
        console.log("Error creating table", error);
    }
};

export const deleteAndCreateLocalDB = async (db: SQLite.SQLiteDatabase) => {
    const query_habit = `DROP TABLE IF EXISTS ${Constants.habit};`;
    const query_habit_instance = `DROP TABLE IF EXISTS ${Constants.habit_instance};`;
    await db.execAsync(query_habit);
    await db.execAsync(query_habit_instance);

    await createLocalTable(db);
}