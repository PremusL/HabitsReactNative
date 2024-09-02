import AsyncStorage from "@react-native-async-storage/async-storage";

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("Saved: ", key, value);
  } catch (error) {
    console.error("Failed to save data", error);
  }
};

const getData = async (key) => {
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

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Data removed successfully");
  } catch (error) {
    console.error("Failed to remove data", error);
  }
};

export { saveData, getData, removeData };
