require("dotenv").config({path: "../../.env"});
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {neon} = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);
const app = express();
const host = process.env.HOST || "192.168.1.103";
const port = 3001;

const userRemoteTable = '"user"';

// Middleware to parse JSON bodies
app.use(express.json());

//? Login endpoint
app.post("/api/login", async (req, res) => {
    const {username, password} = req.body;

    try {
        const query = `SELECT * FROM ${userRemoteTable} WHERE username = '${username}'`;
        const result = await sql(query);

        if (!result || result.length === 0) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const user = result[0];

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({error: "Invalid credentials"});
        }
        const token = jwt.sign({userId: user.user_id}, process.env.SECRET_KEY, {
            expiresIn: "8h",
        });
        res.json({toekn: token, user_id: user.user_id});
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Register endpoint
app.post("/api/register", async (req, res) => {
    const {username, password} = req.body;
    console.log("req.body", req.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
    INSERT INTO ${userRemoteTable} 
    (username, password)
    VALUES ('${username}', '${hashedPassword}')
    RETURNING user_id;`;
        console.log("Executing query:", query);
        const result = await sql(query);
        const userId = result[0].user_id;

        res
            .status(201)
            .json({user_id: userId, message: "User registered successfully"});
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});
app.get("/api/readHabits", async (req, res) => {
    console.log("Request to read");

    try {// TODO ADD USER ID
        const query = `SELECT 
            hi.${HabitTypeConstants.habit_id},
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

        const result = await sql(query);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error("Error executing query:", error);
        if (!res.headersSent) {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
});


app.post("/api/writeHabit/:user_id", async (req, res) => {
    const {user_id} = req.params;
    const {
        habit_id,
        name,
        description,
        date,
        time,
        color,
        icon,
        intensity,
        good,
        version,
    } = req.body;

    try {

        const query_habit = `
    INSERT INTO ${Constants.habit}
    (${HabitTypeConstants.habit_id}, ${HabitTypeConstants.user_id}, ${HabitTypeConstants.version})
    VALUES (${habit_id}, ${user_id}, 0 )`;
        const query_habit_instance = `
        INSERT INTO ${Constants.habit_instance} (
        ${HabitTypeConstants.habit_id},
        ${HabitTypeConstants.name},
        ${HabitTypeConstants.description},
        ${HabitTypeConstants.date},
        ${HabitTypeConstants.time},
        ${HabitTypeConstants.color},
        ${HabitTypeConstants.icon},
        ${HabitTypeConstants.intensity},
        ${HabitTypeConstants.good},
        ${HabitTypeConstants.version}
        ) VALUES (
         ${habit_id}, '${name}', '${description}', '${date}', '${time}',
        '${color}', '${icon}', '${intensity}', '${good}', ${version})`;

        console.log("Executing query:", query_habit);

        await sql(query_habit);
        await sql(query_habit_instance);
        res.json({message: "Data added successfully"});
    } catch (error) {
        console.error("Error executing query:", error);
        if (!res.headersSent) {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
});

app.delete("/api/deleteHabit/:habit_id", async (req, res) => {
    const {habit_id} = req.params;

    console.log("Request to delete with habit_id:", habit_id);

    if (!habit_id) {
        return res.status(400).json({error: "habit_id is required"});
    }
    try {
        const query_habit_table = `DELETE FROM ${Constants.habit} WHERE ${HabitTypeConstants.habit_id} = ${habit_id}`;
        const query_habit_instance_table = `DELETE FROM ${Constants.habit_instance} WHERE ${HabitTypeConstants.habit_id} = ${habit_id}`;
        await sql(query_habit_table);
        await sql(query_habit_instance_table);

        res.json({message: "Data deleted successfully"});
    } catch (error) {
        console.error("Error executing query:", error);
        if (!res.headersSent) {
            res.status(500).json({error: "Internal Server Error"});
        }
    }
});
app.post("/api/updateHabits", async (req, res) => {
    const {
        habit_id,
        name,
        description,
        date,
        time,
        color,
        icon,
        intensity,
        good,
        version
    } = req.body;
    console.log("updating");

    try {
        const query = `UPDATE ${Constants.habit_instance}
                            SET 
                              name = '${name}',
                              description = '${description}',
                              date = '${date}',
                              time = '${time}',
                              color = '${color}',
                              icon = '${icon}',
                              intensity = ${intensity},
                              good = '${good}',
                              version = ${version},
                              change_time_stamp = CURRENT_TIMESTAMP
                                WHERE habit_id = ${habit_id}
                                AND version = ${version};
                            `;

        console.log("query", query);

        await sql(query);
        res.json({message: "Data updated successfully"});
    } catch (error) {
    }
});


// Start the server
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});

const Constants = {
    localDBName: "localhabits.db",
    habit: "habit",
    habit_instance: "habit_instance",
    userRemoteTable: '"user"',
    habitRemoteTable: '"habit"',
    habit_instanceRemoteTable: '"habit_instance"',
};
const HabitTypeConstants = {
    user_id: "user_id",
    habit_id: "habit_id",
    name: "name",
    date: "date",
    time: "time",
    description: "description",
    color: "color",
    icon: "icon",
    intensity: "intensity",
    good: "good",
    version: "version",
    change_time_stamp: "change_time_stamp",
};
