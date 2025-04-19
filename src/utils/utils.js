export const getLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`❌ Error reading ${key} from localStorage:`, error);
    return null;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`✅ Saved ${key} to localStorage:`, value);
  } catch (error) {
    console.error(`❌ Error saving ${key} to localStorage:`, error);
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    console.log(`✅ Removed ${key} from localStorage`);
  } catch (error) {
    console.error(`❌ Error removing ${key} from localStorage:`, error);
  }
};