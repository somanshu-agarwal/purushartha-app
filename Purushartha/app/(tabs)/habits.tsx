import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Habit = {
  id: string;
  name: string;
  completed: boolean;
  time: string;
  streak: number;
};

export default function HabitsTracker() {
  // Replace your current habits array with this enhanced version
const [habits, setHabits] = useState<Habit[]>([
  // Morning Dharma (5:30 AM - 8:00 AM)
  { id: '1', name: 'Wake Up & Hydrate', completed: false, time: '5:30 AM', streak: 0, category: 'morning' },
  { id: '2', name: 'Pranayam & Breathwork', completed: false, time: '5:45 AM', streak: 0, category: 'morning' },
  { id: '3', name: 'Morning Pooja/Meditation', completed: false, time: '6:15 AM', streak: 0, category: 'morning' },
  { id: '4', name: 'Exercise (PPL Routine)', completed: false, time: '6:45 AM', streak: 0, category: 'morning' },
  { id: '5', name: 'Vocal Warm-ups', completed: false, time: '7:45 AM', streak: 0, category: 'morning' },
  
  // Evening Artha/Kama (6:00 PM - 10:00 PM)
  { id: '6', name: 'Guitar Practice', completed: false, time: '6:00 PM', streak: 0, category: 'evening' },
  { id: '7', name: 'PM Skill Study', completed: false, time: '7:00 PM', streak: 0, category: 'evening' },
  { id: '8', name: 'Blog Writing', completed: false, time: '8:00 PM', streak: 0, category: 'evening' },
  
  // Night Self-Care (9:00 PM - 10:00 PM)
  { id: '9', name: 'Evening Skin Care', completed: false, time: '9:00 PM', streak: 0, category: 'night' },
  { id: '10', name: 'Hair Care Routine', completed: false, time: '9:15 PM', streak: 0, category: 'night' },
  { id: '11', name: 'Journaling & Reflection', completed: false, time: '9:30 PM', streak: 0, category: 'night' },
  { id: '12', name: 'Plan Tomorrow', completed: false, time: '9:45 PM', streak: 0, category: 'night' },
]);

  // Load habits from storage on app start
  useEffect(() => {
    loadHabits();
  }, []);

  // Reset habits at midnight
  useEffect(() => {
    const checkAndResetHabits = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        resetDailyHabits();
        // Set up next reset
        checkAndResetHabits();
      }, timeUntilMidnight);
    };

    checkAndResetHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('@habits');
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('@habits', JSON.stringify(updatedHabits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const toggleHabit = (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completed;
        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : habit.streak,
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const resetDailyHabits = () => {
    const resetHabits = habits.map(habit => ({
      ...habit,
      completed: false,
    }));
    setHabits(resetHabits);
    saveHabits(resetHabits);
  };

  const getTotalCompleted = () => {
    return habits.filter(habit => habit.completed).length;
  };

  const getDailyProgress = () => {
    return (getTotalCompleted() / habits.length) * 100;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Rituals</Text>
      
      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getDailyProgress()}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {getTotalCompleted()} of {habits.length} completed
        </Text>
      </View>

      {/* Habits List */}
      <ScrollView style={styles.habitsList}>
        {habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            style={[
              styles.habitItem,
              habit.completed && styles.habitItemCompleted
            ]}
            onPress={() => toggleHabit(habit.id)}
          >
            <View style={styles.habitInfo}>
              <Text style={[
                styles.habitName,
                habit.completed && styles.habitNameCompleted
              ]}>
                {habit.name}
              </Text>
              <Text style={styles.habitTime}>{habit.time}</Text>
            </View>
            
            <View style={styles.habitStatus}>
              {habit.completed ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              ) : (
                <View style={styles.incompleteBadge} />
              )}
              {habit.streak > 0 && (
                <Text style={styles.streakText}>🔥 {habit.streak}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Daily Reset Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Resets daily at midnight • Tap to mark complete
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
    color: '#1a1a1a',
  },
  progressCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  habitsList: {
    flex: 1,
  },
  habitItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  habitItemCompleted: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  habitNameCompleted: {
    color: '#007AFF',
    textDecorationLine: 'line-through',
  },
  habitTime: {
    fontSize: 14,
    color: '#666',
  },
  habitStatus: {
    alignItems: 'center',
    gap: 4,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  incompleteBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  streakText: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});