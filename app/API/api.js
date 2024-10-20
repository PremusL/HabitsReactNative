const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
const port = 3001;

const tableName = "habits";
const tableColumns =
  "habit_key, name, description, date, time, color, icon, intensity, good, frequency";
const selectColumns = tableColumns
  .split(", ")
  .map((column) => "(habit)." + column)
  .join(", ");
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// PostgreSQL connection
const client = new Client({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost",
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
    ); // Replace with your SQL query\
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
    habit_key,
    name,
    description,
    date,
    time,
    color,
    icon,
    intensity,
    good,
    frequency,
  } = req.body;

  console.log("Request to update, update");
  try {
    const query = `UPDATE habits 
       SET habit = ROW (
         ${habit_key},
         '${name}',
         '${description}',
         '${date}',
         '${time}',
         '${color}',
         '${icon}',
         ${intensity},
         '${good}',
         ${frequency}
       )
       WHERE (habit).habit_key = ${habit_key}`;
    console.log("query", query);

    const result = await client.query(query);
    console.log("result", result);
    res.json({ message: "Data updated successfully" });
  } catch (error) {}
});

// Example route to add data
app.post("/api/writeHabits", async (req, res) => {
  // const { name, surname } = req.body;
  console.log("Request to post");
  console.log("req.body", req.body);
  const {
    habit_key,
    name,
    description,
    date,
    time,
    color,
    icon,
    intensity,
    good,
    frequency,
  } = req.body;
  const keys = Object.keys(req.body);
  try {
    const result = await client.query(
      `INSERT INTO ${tableName} (habit)
       VALUES (ROW (${habit_key}, '${name}', '${description}', '${date}',
        '${time}', '${color}', '${icon}', ${intensity}, '${good}', ${frequency}))`
    ); // Replace with your SQL query
    res.json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.delete("/api/deleteHabits/:habit_key", async (req, res) => {
  console.log("Request to delete");
  const { habit_key } = req.params;

  if (!habit_key) {
    return res.status(400).json({ error: "habit_key is required" });
  }

  try {
    const result = await client.query(
      `DELETE FROM ${tableName} WHERE (habit).habit_key = $1`,
      [habit_key]
    );
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error executing query:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
