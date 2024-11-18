import axios from "axios";
// @ts-ignore
// import {BASE_URL} from "@env";
const BASE_URL = "http://10.0.2.2:8787";

const timeoutDuration = 5000;

export const login = async (username: string, password: string) => {
    try {
        const path = `${BASE_URL}/api/login`;
        console.log("login sent", path, password);
        const response = await axios.post(path, {
            username,
            password,
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Connection error - Fail to login", error);
        return false;
    }
};

export const register = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/register`, {
            username,
            password,
        });
        return response.data
    } catch (error) {
        console.log("register:", error);
        return [null, 400]
    }
};
