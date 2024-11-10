require("dotenv").config({ path: "../../.env" });
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);
const app = express();
const host = process.env.HOST || "192.168.1.103";
const port = 3001;

const userRemoteTable = '"user"';

// Middleware to parse JSON bodies
app.use(express.json());

//? Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = `SELECT * FROM ${userRemoteTable} WHERE username = '${username}'`;
    const result = await sql(query);

    if (!result || result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.user_id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Register endpoint
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("req.body", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO ${userRemoteTable} (username, password) VALUES ('${username}', '${hashedPassword}')`;
    console.log("Executing query:", query);
    await sql(query);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/writeHabit/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const {
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
  // const keys = Object.keys(req.body);

  try {
    const query1 = `
    INSERT INTO ${Constants.habit}
    (${HabitTypeConstants.version}, ${HabitTypeConstants.user_id}) VALUES (0, ${user_id});`;

    const result = await sql(query1);
    console.log("result from insert into habit:", result);
    //     const query2 = `
    //     INSERT INTO ${Constants.habit_instance} (
    //     ${HabitTypeConstants.habit_id},
    //     ${HabitTypeConstants.name},
    //     ${HabitTypeConstants.description},
    //     ${HabitTypeConstants.date},
    //     ${HabitTypeConstants.time},
    //     ${HabitTypeConstants.color},
    //     ${HabitTypeConstants.icon},
    //     ${HabitTypeConstants.intensity},
    //     ${HabitTypeConstants.good}
    //     ) VALUES (
    //      ${result.lastInsertRowId},
    //      "${name}", "${description}", "${date}", "${time}",
    //    "${color}", "${icon}", "${intensity}", "${good}");`;

    //     await sql(query2);
    //     res.json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.delete("/api/deleteHabits/:habit_id", async (req, res) => {
  console.log("Request to delete");
  const { habit_id } = req.params;

  if (!habit_id) {
    return res.status(400).json({ error: "habit_id is required" });
  }

  try {
    const result = await client.query(
      `DELETE FROM ${tableName} WHERE habit_id = $1`,
      [habit_id]
    );
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
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
