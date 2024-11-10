const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs"); // Import the fs module
require("dotenv").config("../../.env"); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST || "192.168.1.103";

const tableName = "habits";
const tableColumns =
  "habit_id, name, description, date, time, color, icon, intensity, good, frequency, change_time_stamp";
const userRemoteTable = "users"; // Ensure this matches your database table name
const secretKey = process.env.SECRET_KEY || "your_default_secret_key"; // Use environment variable for secret key

const selectColumns = tableColumns
  .split(", ")
  .map((column) => column)
  .join(", ");
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
  },
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});
// client
//   .connect()
//   .then(() => console.log("Connected to the database successfully!"))
//   .catch((err) => console.error("Connection error", err.stack))
//   .finally(() => client.end());

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

//? LOGIN - REGISTER

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM ${userRemoteTable} WHERE username = $1`,
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
  console.log("req.body", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO ${userRemoteTable} (username, password) VALUES ($1, $2)`;
    console.log("Executing query:", query);
    await pool.query(query, [username, hashedPassword]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Start HTTPS server
https.createServer(httpsOptions, app).listen(port, host, () => {
  console.log(`Server running at https://${host}:${port}/`);
});
