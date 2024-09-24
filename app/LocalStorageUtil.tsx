import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types";

const saveData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("Saved: ", key, value);
  } catch (error) {
    console.error("Failed to save data", error);
  }
};

export default saveData;
// 1. opcija mergeData function
// 2. opcija getAll keys in pol multiget

// Function to get all keys from AsyncStorage
const getAllKeys = async (): Promise<readonly string[]| undefined> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    
    return keys;
  } catch (error) {
    console.error("Failed to get all keys", error);
  }
};

const multiGet = async (keys: readonly string[]): Promise<readonly KeyValuePair[] | undefined> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    // console.log("Values:", values);
    return values;
  } catch (error) {
    console.error("Failed to get data", error);
  }
};

const getData = async (key: string): Promise<string | undefined> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log("Data retrieved successfully", value);
      return value;
    }
  } catch (error) {
    console.error("Failed to retrieve data", error);
  }
};

const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Data removed successfully");
  } catch (error) {
    console.error("Failed to remove data", error);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All data cleared");
  } catch (error) {
    console.error("Failed to clear data", error);
  }
};

export { saveData, getData, removeData, getAllKeys, multiGet, clearAll };
