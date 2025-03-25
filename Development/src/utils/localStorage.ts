/**
 * Utility functions for interacting with localStorage with error handling and type safety
 */

/**
 * Store data in localStorage with error handling
 * 
 * @param key The key to store the data under
 * @param data The data to store
 * @returns boolean indicating success or failure
 */
export function setStorageItem<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error storing data in localStorage: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Retrieve data from localStorage with error handling
 * 
 * @param key The key to retrieve data from
 * @param defaultValue Default value to return if data is not found
 * @returns The retrieved data or the default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error retrieving data from localStorage: ${error instanceof Error ? error.message : String(error)}`);
    return defaultValue;
  }
}

/**
 * Remove an item from localStorage with error handling
 * 
 * @param key The key to remove
 * @returns boolean indicating success or failure
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from localStorage: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Check if localStorage is available in the current environment
 * 
 * @returns boolean indicating if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Clear all items from localStorage with error handling
 * 
 * @returns boolean indicating success or failure
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Get all keys from localStorage
 * 
 * @returns Array of keys or empty array if error
 */
export function getStorageKeys(): string[] {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error(`Error getting localStorage keys: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/**
 * Store user-related data in localStorage with proper prefixing
 * 
 * @param userId The user ID
 * @param key The specific data key
 * @param data The data to store
 * @returns boolean indicating success or failure
 */
export function setUserData<T>(userId: string, key: string, data: T): boolean {
  return setStorageItem(`user_${userId}_${key}`, data);
}

/**
 * Retrieve user-related data from localStorage with proper prefixing
 * 
 * @param userId The user ID
 * @param key The specific data key
 * @param defaultValue Default value to return if data is not found
 * @returns The retrieved data or the default value
 */
export function getUserData<T>(userId: string, key: string, defaultValue: T): T {
  return getStorageItem(`user_${userId}_${key}`, defaultValue);
}

/**
 * Remove user-related data from localStorage
 * 
 * @param userId The user ID
 * @param key The specific data key
 * @returns boolean indicating success or failure
 */
export function removeUserData(userId: string, key: string): boolean {
  return removeStorageItem(`user_${userId}_${key}`);
}

/**
 * Clear all data for a specific user
 * 
 * @param userId The user ID to clear all data for
 * @returns boolean indicating success or failure
 */
export function clearUserData(userId: string): boolean {
  try {
    const keys = getStorageKeys();
    const userKeys = keys.filter(key => key.startsWith(`user_${userId}_`));
    userKeys.forEach(key => removeStorageItem(key));
    return true;
  } catch (error) {
    console.error(`Error clearing user data: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}