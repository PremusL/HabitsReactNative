import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {neon} from "@neondatabase/serverless";

interface HabitType {
	habit_id: number;
	name: string;
	date: string;
	time: string | undefined;
	description: string | undefined;
	color: string | undefined;
	icon: string | undefined;
	intensity: number;
	good: string;
	version: number;
	change_time_stamp?: string | undefined;
}

interface UpdateHabitType {
	habit_id_old: number;
	habit_id_new: number;
}

interface DeleteHabitType {
	habit_id: number;
}


export interface Env {
	DB_USER: string;
	DB_HOST: string;
	DB_NAME: string;
	DB_PASSWORD: string;
	DB_PORT: string;
	DB_SSL_REJECT_UNAUTHORIZED: string;
	DATABASE_URL: string;
	SECRET_KEY: string;
}

// TypeScript types for request bodies
interface LoginRequestBody {
	username: string;
	password: string;
}

interface RegisterRequestBody {
	username: string;
	password: string;
}

const Constants = {
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

const getUserId = (url: URL): number => {
	const params = url.pathname.split("/").filter(Boolean);
	return parseInt(params[params.indexOf("api") + 2]);
}

// Helper function to handle JSON responses with CORS headers
const jsonResponse = (data: unknown, status: number = 200): Response => {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*", // Allow all origins
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow specific HTTP methods
			"Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
		},
	});
};

// Main API handler
async function handleRequest(
	request: Request,
	sql: any,
	JWT_SECRET: string
): Promise<Response> {
	const url = new URL(request.url);
	const {pathname} = url;

	// Handle preflight OPTIONS requests
	if (request.method === "OPTIONS") {
		return jsonResponse(null, 204); // Return empty response for OPTIONS
	}

	if (pathname === "/api/login" && request.method === "POST") {
		return handleLogin(request, sql, JWT_SECRET);
	}

	if (pathname === "/api/register" && request.method === "POST") {
		return handleRegister(request, sql);
	}

	if (pathname.startsWith("/api/readHabits") && request.method === "GET") {
		return handleReadHabits(request, sql);
	}

	if (pathname.startsWith("/api/writeHabit") && request.method === "POST") {
		return handleWriteHabits(request, sql);
	}

	// if (pathname.startsWith("/api/updateHabit") && request.method === "POST") {
	// 	return handleUpdateHabit(request, sql);
	// }

	if (pathname.startsWith("/api/updateHabits") && request.method === "POST") {
		return handleUpdateHabits(request, sql);
	}

	if (pathname.startsWith("/api/deleteHabit") && request.method === "POST") {
		return handleDeleteHabit(request, sql);
	}

	return jsonResponse({error: "Not Found"}, 404);
}

// Login endpoint
async function handleLogin(
	request: Request,
	sql: any,
	JWT_SECRET: string
): Promise<Response> {
	try {
		const {username, password}: LoginRequestBody = await request.json();

		const query = `SELECT *
					   FROM ${Constants.userRemoteTable}
					   WHERE username = '${username}'`;
		const result = await sql(query);

		if (!result || result.length === 0) {
			return jsonResponse({error: "Invalid credentials"}, 401);
		}

		const user = result[0];
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return jsonResponse({error: "Invalid credentials"}, 401);
		}

		const token = jwt.sign({userId: user.user_id}, JWT_SECRET, {
			expiresIn: "8h",
		});

		return jsonResponse({token, user_id: user.user_id});
	} catch (error) {
		console.error("Error during login:", error);
		return jsonResponse({error: "Internal Server Error"}, 500);
	}
}

// Register endpoint
async function handleRegister(request: Request, sql: any): Promise<Response> {
	try {
		const {username, password}: RegisterRequestBody = await request.json();

		const queryCheckExisting = `SELECT *
									FROM ${Constants.userRemoteTable}
									WHERE username = '${username}'`;
		const resultExisting = await sql(queryCheckExisting);

		if (resultExisting && resultExisting.length > 0) {
			return jsonResponse({user_id: null, error: 409});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const query = `
			INSERT INTO ${Constants.userRemoteTable} (username, password)
			VALUES ('${username}', '${hashedPassword}') RETURNING user_id;
		`;
		const result = await sql(query);

		return jsonResponse({user_id: result[0].user_id, error: 0}, 201);
	} catch (error) {
		console.error("Error during registration:", error);
		return jsonResponse({error: "Internal Server Error"}, 500);
	}
}

async function handleWriteHabits(
	req: Request,
	sql: any
): Promise<Response> {
	const user_id = getUserId(new URL(req.url));
	console.log("Request to write, user_id:", user_id);
	try {
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
		}: HabitType = await req.json();

		const query_habit = `
			INSERT INTO ${Constants.habit}
				(${HabitTypeConstants.user_id}, ${HabitTypeConstants.version})
			VALUES (${user_id}, 0)
				RETURNING ${HabitTypeConstants.habit_id};`;


		console.log("Executing query_HABIT:", query_habit);

		const habit_id_inserted = await sql(query_habit);
		console.log("habit_id_inserted", habit_id_inserted[0].habit_id);
		const query_habit_instance = `
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
			VALUES (${habit_id_inserted[0].habit_id}, '${name}', '${description}', '${date}', '${time}',
					'${color}', '${icon}', '${intensity}', '${good}', ${version})`;
		await sql(query_habit_instance);
		return jsonResponse({habit_id: habit_id_inserted[0].habit_id, message: "Data added successfully"});
	} catch (error) {
		console.error("Error executing query:", error);
		return jsonResponse({error: "Internal Server Error"}, 500);
	}
}

async function handleReadHabits(req: Request,
								sql: any
): Promise<Response> {
	const user_id = getUserId(new URL(req.url));
	console.log("Request to write, user_id:", user_id);

	try {// TODO ADD USER ID
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
						 AND h.${HabitTypeConstants.user_id} = ${user_id};`;

		const result = await sql(query);
		return jsonResponse(result);
	} catch (error) {
		console.error("Error executing query:", error);

		return jsonResponse({error: "Internal Server Error"});
	}
}

async function handleDeleteHabit(req: Request,
								 sql: any
): Promise<Response> {
	const user_id = getUserId(new URL(req.url));
	console.log("Request to write, user_id:", user_id);

	try {// TODO ADD USER ID
		const {habit_id}: DeleteHabitType = await req.json();

		const query_habit_table = `
			DELETE
			FROM ${Constants.habit}
			WHERE ${HabitTypeConstants.habit_id} = ${habit_id}
			  AND ${HabitTypeConstants.user_id} = ${user_id} RETURNING ${HabitTypeConstants.habit_id};`;
		const query_habit_instance_table = `
			DELETE
			FROM ${Constants.habit_instance}
			WHERE ${HabitTypeConstants.habit_id} = ${habit_id}`;
		const habit_id_deleted = await sql(query_habit_table);
		if (habit_id && habit_id_deleted.length > 0) {
			await sql(query_habit_instance_table);
		}
		return jsonResponse({message: "Data deleted successfully"});
	} catch (error) {
		console.error("Error executing query:", error);

		return jsonResponse({error: "Internal Server Error"});
	}
}


async function handleUpdateHabits(req: Request,
								  sql: any
): Promise<Response> {
	const user_id = getUserId(new URL(req.url));
	console.log("Request to update, user_id:", user_id);

	try {
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
		}: HabitType = await req.json();
		const query = `UPDATE ${Constants.habit_instance}
					   SET name              = '${name}',
						   description       = '${description}',
						   date              = '${date}',
						   time              = '${time}',
						   color             = '${color}',
						   icon              = '${icon}',
						   intensity         = ${intensity},
						   good              = '${good}',
						   version           = ${version},
						   change_time_stamp = CURRENT_TIMESTAMP
					   WHERE habit_id = ${habit_id}
						 AND version = ${version}
						 AND habit_id IN (SELECT habit_id
										  FROM ${Constants.habit}
										  WHERE user_id = ${user_id}); `;

		console.log("query", query);

		await sql(query);

		return jsonResponse({message: "Data updated successfully"});
	} catch (error) {
		console.log("Error while updating:", error);
		return jsonResponse({error: "Internal Server Error"});
	}
}

// async function handleUpdateHabit(req: Request,
// 								 sql: any
// ): Promise<Response> {
// 	const user_id = getUserId(new URL(req.url));
// 	console.log("Request to update, user_id:", user_id);
//
// 	try {
// 		const {habit_id_old, habit_id_new}: UpdateHabitType = await req.json();
// 		const query_habit = `
// 			UPDATE ${Constants.habit}
// 			SET habit_id = ${habit_id_new}
// 			WHERE habit_id = ${habit_id_old}
// 			  AND user_id = ${user_id};
// 			RETURNING
// 			*;`;
//
// 		const query_habit_instance = `
// 			UPDATE ${Constants.habit_instance}
// 			SET habit_id = ${habit_id_new}
// 			WHERE habit_id = ${habit_id_old};`;
//
// 		console.log("queries", query_habit, query_habit_instance);
//
// 		const habit_id_updated = await sql(query_habit_instance);
// 		if (habit_id_updated.length > 0) {
// 			await sql(query_habit);
// 		}
//
//
// 		return jsonResponse({message: "Data updated successfully"});
// 	} catch (error) {
// 		console.log("Error while updating single habit", error);
// 		return jsonResponse({error: "Internal Server Error"});
// 	}
// }

// Export the handler for Cloudflare Workers
export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const sql = neon(env.DATABASE_URL || "");
		const JWT_SECRET = env.SECRET_KEY || "";
		return handleRequest(request, sql, JWT_SECRET);
	},
};
