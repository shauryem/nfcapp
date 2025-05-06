import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import uuid from 'react-native-uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHabits, Habit } from '@/utils/useHabits';
import { initNfc, writeNfcTag } from '@/utils/nfc';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const tabBarHeight = useBottomTabBarHeight();
  const { habits, addHabit, incrementHabit } = useHabits();

  React.useEffect(() => {
    initNfc();
  }, []);

  const handleAdd = () => {
    Alert.prompt('Add Habit', 'Name your habit', async (name) => {
      if (!name) return;
      const newHabit: Habit = {
        id: uuid.v4().toString(),
        name,
        createdAt: new Date().toISOString(),
        count: 0,
      };

      // 1️⃣ write to NFC
      await writeNfcTag(newHabit.id);

      // 2️⃣ add to list
      await addHabit(newHabit);
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.habitsList}>
        {habits.map((h) => (
          <View
            key={h.id}
            style={[
              styles.habitItem,
              { backgroundColor: colors.card ?? (colorScheme === 'dark' ? '#333' : '#eee') },
            ]}
          >
            <Text style={{ color: colors.text }}>
              {h.name} — count: {h.count}
            </Text>
            <TouchableOpacity onPress={() => incrementHabit(h.id)}>
              <Text style={{ color: colors.tint, marginTop: 4 }}>+1</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: tabBarHeight + 80 }} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, bottom: tabBarHeight + 16 }]}
        onPress={handleAdd}
      >
        <Text style={[styles.buttonText, { color: colors.background }]}>Add Habit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  habitsList: { paddingTop: 64 },
  habitItem: { padding: 12, marginBottom: 10, borderRadius: 8 },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: { fontSize: 18, fontWeight: '600' },
});
