import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';

type Habit = {
  id: string;
  name: string;
  completed: boolean;
  time: string;
  streak: number;
  category: 'morning' | 'evening' | 'night';
};

export default function HabitsTracker() {
  const [habits, setHabits, habitsLoading] = usePersistedState<Habit[]>('@habits', [
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

  const [lastReset, setLastReset] = usePersistedState('@lastReset', new Date().toDateString());

  // Reset habits at midnight
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      resetDailyHabits();
      setLastReset(today);
    }
  }, [lastReset]);

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
  };

  const resetDailyHabits = () => {
    const resetHabits = habits.map(habit => ({
      ...habit,
      completed: false,
    }));
    setHabits(resetHabits);
  };

  const getTotalCompleted = () => {
    return habits.filter(habit => habit.completed).length;
  };

  const getDailyProgress = () => {
    return (getTotalCompleted() / habits.length) * 100;
  };

  // Group habits by category for better organization
  const morningHabits = habits.filter(h => h.category === 'morning');
  const eveningHabits = habits.filter(h => h.category === 'evening');
  const nightHabits = habits.filter(h => h.category === 'night');

  const getCurrentTimeSection = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'evening';
    return 'night';
  };

  const currentSection = getCurrentTimeSection();

  const renderHabitSection = (title: string, habitList: Habit[], emoji: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {emoji} {title} {currentSection === title.toLowerCase() && '• Now'}
      </Text>
      {habitList.map((habit) => (
        <TouchableOpacity
          key={habit.id}
          style={[
            styles.habitItem,
            habit.completed && styles.habitItemCompleted,
            currentSection === habit.category && styles.currentTimeHabit
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
    </View>
  );

  if (habitsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your habits...</Text>
      </View>
    );
  }

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
        {getDailyProgress() === 100 && (
          <Text style={styles.perfectDay}>🎉 Perfect day! Well done!</Text>
        )}
      </View>

      {/* Habits List by Category */}
      <ScrollView style={styles.habitsList}>
        {renderHabitSection('Morning Dharma', morningHabits, '🌅')}
        {renderHabitSection('Evening Artha', eveningHabits, '🌇')}
        {renderHabitSection('Night Self-Care', nightHabits, '🌙')}
      </ScrollView>

      {/* Daily Reset Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Resets daily at midnight • Tap to mark complete
        </Text>
        <Text style={styles.footerSubtext}>
          Current focus: {currentSection} routines
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
  perfectDay: {
    fontSize: 14,
    color: '#28a745',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  habitsList: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
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
    minHeight: 44,
  },
  habitItemCompleted: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  currentTimeHabit: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
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
  footerSubtext: {
    fontSize: 11,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
});