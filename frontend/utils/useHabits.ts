// utils/useHabits.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
  id: string;
  name: string;
  createdAt: string;
  count: number;
};

const STORAGE_KEY = 'habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load on mount
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setHabits(raw ? JSON.parse(raw) : []);
    })();
  }, []);

  // Persist helper
  const persist = async (newList: Habit[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setHabits(newList);
  };

  // Add a new habit
  const addHabit = async (habit: Habit) => {
    const updated = [...habits, habit];
    await persist(updated);
  };

  // Increment count by id
  const incrementHabit = async (id: string) => {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, count: h.count + 1 } : h
    );
    await persist(updated);
  };

  return { habits, addHabit, incrementHabit };
}
