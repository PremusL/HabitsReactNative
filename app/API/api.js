const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Constants } = require("../UI/components/Constants");

const app = express();
const port = 3001;
const host = "192.168.1.103";

const tableName = "habits";
const tableColumns =
  "habit_id, name, description, date, time, color, icon, intensity, good, frequency, change_time_stamp";
const selectColumns = tableColumns
  .split(", ")
  .map((column) => column)
  .join(", ");
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// PostgreSQL connection
const client = new Client({
  user: "postgres", // Replace with your PostgreSQL username
  host: "192.168.1.103",
  database: "postgres", // Replace with your database name
  password: "new_password", // Replace with your PostgreSQL password
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error("PostgreSQL connection error:", err);
  } else {
    console.log("PostgreSQL connected");
  }
});

// Example route to get data
app.get("/api/readHabits", async (req, res) => {
  console.log("Request to get");
  try {
    const result = await client.query(
      `SELECT ${selectColumns} FROM ${tableName}`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/updateHabits", async (req, res) => {
  console.log(req.body);
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
    frequency,
    change_time_stamp,
  } = req.body;

  try {
    const query = `UPDATE habits 
       SET 
         name = '${name}',
         description = '${description}',
         date = '${date}',
         time = '${time}',
         color = '${color}',
         icon = '${icon}',
         intensity = ${intensity},
         good = '${good}',
         frequency = ${frequency},
         change_time_stamp = '${change_time_stamp}'
       WHERE habit_id = ${habit_id}`;

    console.log("query", query);

    const result = await client.query(query);
    console.log("result", result);
    // const result = await client.query(query, [
    //   name,
    //   description,
    //   date,
    //   time,
    //   color,
    //   icon,
    //   intensity,
    //   good,
    //   frequency,
    //   change_time_stamp,
    //   habit_id,
    // ]);
    res.json({ message: "Data updated successfully" });
  } catch (error) {}
});

// Example route to add data
app.post("/api/writeHabits", async (req, res) => {
  // const { name, surname } = req.body;
  console.log("Request to post");
  console.log("req.body", req.body);
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
    frequency,
    change_time_stamp,
  } = req.body;
  const keys = Object.keys(req.body);
  try {
    const result = await client.query(
      `INSERT INTO ${tableName} (
        habit_id,
        name,
        description,
        date,
        time,
        color,
        icon,
        intensity,
        good,
        frequency,
        change_time_stamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        habit_id,
        name,
        description,
        date,
        time,
        color,
        icon,
        intensity,
        good,
        frequency,
        change_time_stamp,
      ]
    );
    res.json({ message: "Data added successfully" });
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

app.listen(port, host, () => {
  console.log(`Server running at ${host}:${port}`);
});

//? LOGIN - REGISTER

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query(
      `SELECT * FROM ${Constants.userRemoteTable} WHERE username = $1`,
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.user_id }, secretKey, {
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
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query(
      `INSERT INTO ${Constants.userRemoteTable} (username, password) VALUES ($1, $2)`,
      [username, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
