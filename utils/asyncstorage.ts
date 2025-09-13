import AsyncStorage from "@react-native-async-storage/async-storage";

const getFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    if (!key) throw new Error("Key is required");
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch (err) {
    console.error("Error getting item from AsyncStorage:", err);
    return null;
  }
};

const saveToStorage = async (key: string, data: object): Promise<boolean> => {
  try {
    if (!key) throw new Error("Key is required");
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    console.log("Item stored successfully for key:", key);
    return true;
  } catch (err) {
    console.error("Error setting item in AsyncStorage:", err);
    return false;
  }
};

export { getFromStorage, saveToStorage };
