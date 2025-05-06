import { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits } from '@/utils/useHabits';

export default function IncrementScreen() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { incrementHabit } = useHabits();
  const router = useRouter();

  useEffect(() => {
    if (habitId) {
      incrementHabit(habitId)
        .then(() => Alert.alert('Success', 'Habit incremented!'))
        .catch(() => Alert.alert('Error incrementing habit'));
    }
    // Optional: go back to Home after 1s
    setTimeout(() => router.back(), 1000);
  }, [habitId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Incrementing habit…</Text>
    </View>
  );
}
