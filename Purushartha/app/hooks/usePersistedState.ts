import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredValue();
  }, []);

  const loadStoredValue = async () => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const setPersistedState = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  return [state, setPersistedState, loading];
}