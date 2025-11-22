import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Chore = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly';
  lastDone: string | null;
  nextDue: string;
  estimatedTime: string;
};

export default function ChoresTracker() {
  const [chores, setChores] = useState<Chore[]>([
    {
      id: '1',
      name: 'Laundry (Wash & Dry)',
      frequency: 'weekly',
      lastDone: null,
      nextDue: '2024-01-17',
      estimatedTime: '1.5 hours'
    },
    {
      id: '2',
      name: 'House Cleaning (Floor & Toilet)',
      frequency: 'weekly',
      lastDone: null,
      nextDue: '2024-01-20',
      estimatedTime: '1 hour'
    },
    {
      id: '3',
      name: 'Change Bed Sheets',
      frequency: 'bi-weekly',
      lastDone: null,
      nextDue: '2024-01-15',
      estimatedTime: '20 mins'
    },
    {
      id: '4',
      name: 'Grocery Shopping',
      frequency: 'weekly',
      lastDone: null,
      nextDue: '2024-01-21',
      estimatedTime: '2 hours'
    },
    {
      id: '5',
      name: 'Kitchen Deep Clean',
      frequency: 'weekly',
      lastDone: null,
      nextDue: '2024-01-19',
      estimatedTime: '45 mins'
    },
  ]);

  const markChoreDone = (choreId: string) => {
    const updatedChores = chores.map(chore => {
      if (chore.id === choreId) {
        const today = new Date().toISOString().split('T')[0];
        let nextDue = new Date();
        
        if (chore.frequency === 'daily') {
          nextDue.setDate(nextDue.getDate() + 1);
        } else if (chore.frequency === 'weekly') {
          nextDue.setDate(nextDue.getDate() + 7);
        } else if (chore.frequency === 'bi-weekly') {
          nextDue.setDate(nextDue.getDate() + 14);
        }
        
        return {
          ...chore,
          lastDone: today,
          nextDue: nextDue.toISOString().split('T')[0]
        };
      }
      return chore;
    });
    
    setChores(updatedChores);
    saveChores(updatedChores);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDueStatus = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue === 0) return 'due-today';
    if (daysUntilDue <= 2) return 'due-soon';
    return 'upcoming';
  };

  const saveChores = async (updatedChores: Chore[]) => {
    try {
      await AsyncStorage.setItem('@chores', JSON.stringify(updatedChores));
    } catch (error) {
      console.error('Error saving chores:', error);
    }
  };

  const loadChores = async () => {
    try {
      const savedChores = await AsyncStorage.getItem('@chores');
      if (savedChores) {
        setChores(JSON.parse(savedChores));
      }
    } catch (error) {
      console.error('Error loading chores:', error);
    }
  };

  useEffect(() => {
    loadChores();
  }, []);

  const overdueChores = chores.filter(chore => getDaysUntilDue(chore.nextDue) < 0);
  const dueSoonChores = chores.filter(chore => {
    const days = getDaysUntilDue(chore.nextDue);
    return days >= 0 && days <= 2;
  });
  const upcomingChores = chores.filter(chore => getDaysUntilDue(chore.nextDue) > 2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Chores</Text>

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, styles.overdue]}>{overdueChores.length}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, styles.dueSoon]}>{dueSoonChores.length}</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, styles.total]}>{chores.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.choresList}>
        {/* Overdue Section */}
        {overdueChores.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.overdueTitle]}>🚨 Overdue</Text>
            {overdueChores.map(chore => (
              <ChoreCard 
                key={chore.id} 
                chore={chore} 
                onMarkDone={markChoreDone}
                status="overdue"
              />
            ))}
          </View>
        )}

        {/* Due Soon Section */}
        {dueSoonChores.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.dueSoonTitle]}>📅 Due Soon</Text>
            {dueSoonChores.map(chore => (
              <ChoreCard 
                key={chore.id} 
                chore={chore} 
                onMarkDone={markChoreDone}
                status="due-soon"
              />
            ))}
          </View>
        )}

        {/* Upcoming Section */}
        {upcomingChores.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.upcomingTitle]}>📋 Upcoming</Text>
            {upcomingChores.map(chore => (
              <ChoreCard 
                key={chore.id} 
                chore={chore} 
                onMarkDone={markChoreDone}
                status="upcoming"
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const ChoreCard = ({ chore, onMarkDone, status }: { chore: Chore; onMarkDone: (id: string) => void; status: string }) => {
  const daysUntilDue = Math.ceil((new Date(chore.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getStatusColor = () => {
    switch (status) {
      case 'overdue': return '#dc3545';
      case 'due-soon': return '#ffc107';
      case 'due-today': return '#fd7e14';
      default: return '#28a745';
    }
  };

  const getStatusText = () => {
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <View style={[styles.choreCard, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.choreInfo}>
        <Text style={styles.choreName}>{chore.name}</Text>
        <View style={styles.choreMeta}>
          <Text style={styles.choreFrequency}>🔄 {chore.frequency}</Text>
          <Text style={styles.choreTime}>⏱️ {chore.estimatedTime}</Text>
        </View>
        <Text style={[styles.dueText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        {chore.lastDone && (
          <Text style={styles.lastDone}>Last done: {new Date(chore.lastDone).toLocaleDateString()}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.doneButton, { backgroundColor: getStatusColor() }]}
        onPress={() => onMarkDone(chore.id)}
      >
        <Text style={styles.doneButtonText}>Mark Done</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  statsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overdue: {
    color: '#dc3545',
  },
  dueSoon: {
    color: '#ffc107',
  },
  total: {
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  choresList: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  overdueTitle: {
    color: '#dc3545',
  },
  dueSoonTitle: {
    color: '#ffc107',
  },
  upcomingTitle: {
    color: '#28a745',
  },
  choreCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 1,
  },
  choreInfo: {
    flex: 1,
  },
  choreName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  choreMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  choreFrequency: {
    fontSize: 12,
    color: '#666',
  },
  choreTime: {
    fontSize: 12,
    color: '#666',
  },
  dueText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastDone: {
    fontSize: 12,
    color: '#999',
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});