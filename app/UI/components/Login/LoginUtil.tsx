import axios from "axios";

const BASE_URL = "http://192.168.1.103:3001"; // Use 'http://localhost:3000' for iOS

const timeoutDuration = 5000;

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login`, {
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
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Connection error - Fail to register", error);
  }
};
