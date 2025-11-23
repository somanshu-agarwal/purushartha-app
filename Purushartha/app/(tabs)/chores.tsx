import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';

type Chore = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly';
  lastDone: string | null;
  nextDue: string;
  estimatedTime: string;
};

// Helper function to calculate next due date
const getNextDueDate = (frequency: 'daily' | 'weekly' | 'bi-weekly'): string => {
  const today = new Date();
  const nextDue = new Date(today);
  
  switch (frequency) {
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case 'bi-weekly':
      nextDue.setDate(nextDue.getDate() + 14);
      break;
  }
  
  return nextDue.toISOString().split('T')[0];
};

const ChoreCard = ({ 
  chore, 
  onMarkDone, 
  status 
}: { 
  chore: Chore; 
  onMarkDone: (id: string) => void; 
  status: string;
}) => {
  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilDue = getDaysUntilDue(chore.nextDue);
  
  const getStatusColor = (): string => {
    switch (status) {
      case 'overdue': return '#dc3545';
      case 'due-soon': return '#ffc107';
      case 'due-today': return '#fd7e14';
      default: return '#28a745';
    }
  };

  const getStatusText = (): string => {
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  const statusColor = getStatusColor();
  const statusText = getStatusText();

  return (
    <View style={[styles.choreCard, { borderLeftColor: statusColor }]}>
      <View style={styles.choreInfo}>
        <Text style={styles.choreName}>{chore.name}</Text>
        <View style={styles.choreMeta}>
          <Text style={styles.choreFrequency}>🔄 {chore.frequency}</Text>
          <Text style={styles.choreTime}>⏱️ {chore.estimatedTime}</Text>
        </View>
        <Text style={[styles.dueText, { color: statusColor }]}>
          {statusText}
        </Text>
        {chore.lastDone && (
          <Text style={styles.lastDone}>Last done: {new Date(chore.lastDone).toLocaleDateString()}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.doneButton, { backgroundColor: statusColor }]}
        onPress={() => onMarkDone(chore.id)}
      >
        <Text style={styles.doneButtonText}>Mark Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function ChoresTracker() {
  const [chores, setChores, choresLoading] = usePersistedState<Chore[]>('@chores', [
    {
      id: '1',
      name: 'Laundry (Wash & Dry)',
      frequency: 'weekly',
      lastDone: null,
      nextDue: getNextDueDate('weekly'),
      estimatedTime: '1.5 hours'
    },
    {
      id: '2',
      name: 'House Cleaning (Floor & Toilet)',
      frequency: 'weekly',
      lastDone: null,
      nextDue: getNextDueDate('weekly'),
      estimatedTime: '1 hour'
    },
    {
      id: '3',
      name: 'Change Bed Sheets',
      frequency: 'bi-weekly',
      lastDone: null,
      nextDue: getNextDueDate('bi-weekly'),
      estimatedTime: '20 mins'
    },
    {
      id: '4',
      name: 'Grocery Shopping',
      frequency: 'weekly',
      lastDone: null,
      nextDue: getNextDueDate('weekly'),
      estimatedTime: '2 hours'
    },
    {
      id: '5',
      name: 'Kitchen Deep Clean',
      frequency: 'weekly',
      lastDone: null,
      nextDue: getNextDueDate('weekly'),
      estimatedTime: '45 mins'
    },
  ]);

  const markChoreDone = (choreId: string) => {
    const updatedChores = chores.map((chore: Chore) => {
      if (chore.id === choreId) {
        const today = new Date().toISOString().split('T')[0];
        return {
          ...chore,
          lastDone: today,
          nextDue: getNextDueDate(chore.frequency)
        };
      }
      return chore;
    });
    
    setChores(updatedChores);
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const overdueChores = chores.filter((chore: Chore) => getDaysUntilDue(chore.nextDue) < 0);
  const dueSoonChores = chores.filter((chore: Chore) => {
    const days = getDaysUntilDue(chore.nextDue);
    return days >= 0 && days <= 2;
  });
  const upcomingChores = chores.filter((chore: Chore) => getDaysUntilDue(chore.nextDue) > 2);

  if (choresLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your chores...</Text>
      </View>
    );
  }

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
            {overdueChores.map((chore: Chore) => (
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
            {dueSoonChores.map((chore: Chore) => (
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
            {upcomingChores.map((chore: Chore) => (
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tap "Mark Done" to schedule next occurrence
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
    minHeight: 44,
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
    minHeight: 36,
    justifyContent: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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