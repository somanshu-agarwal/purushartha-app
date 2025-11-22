import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Skill = {
  id: string;
  name: string;
  currentLevel: number;
  targetLevel: number;
  dailyProgress: number;
  dailyGoal: string;
};

export default function GrowthTracker() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'AI Product Management',
      currentLevel: 40,
      targetLevel: 90,
      dailyProgress: 0,
      dailyGoal: '30 mins study'
    },
    {
      id: '2', 
      name: 'Technical Architecture',
      currentLevel: 30,
      targetLevel: 80,
      dailyProgress: 0,
      dailyGoal: 'Read 1 article'
    },
    {
      id: '3',
      name: 'Blog Writing',
      currentLevel: 20, 
      targetLevel: 85,
      dailyProgress: 0,
      dailyGoal: 'Write 250 words'
    },
    {
      id: '4',
      name: 'Portfolio Building',
      currentLevel: 15,
      targetLevel: 95,
      dailyProgress: 0,
      dailyGoal: 'Update 1 section'
    },
    {
      id: '5',
      name: 'Networking',
      currentLevel: 25,
      targetLevel: 75,
      dailyProgress: 0,
      dailyGoal: 'Reach out to 1 person'
    },
  ]);

  const updateDailyProgress = (skillId: string) => {
    setSkills(current => current.map(skill => 
      skill.id === skillId 
        ? { ...skill, dailyProgress: skill.dailyProgress + 1 }
        : skill
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artha - Skill Growth</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Weekly Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Skills</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Hours/week</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Networks</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.skillsList}>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.skillCard}>
            <View style={styles.skillHeader}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>{skill.currentLevel}% → {skill.targetLevel}%</Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${skill.currentLevel}%` }
                ]} 
              />
            </View>
            
            <View style={styles.skillActions}>
              <Text style={styles.dailyGoal}>Daily: {skill.dailyGoal}</Text>
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => updateDailyProgress(skill.id)}
              >
                <Text style={styles.completeButtonText}>
                  {skill.dailyProgress > 0 ? '✓ Completed' : 'Mark Done'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {skill.dailyProgress > 0 && (
              <Text style={styles.progressText}>
                ✅ Completed {skill.dailyProgress} times this week
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
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
  statsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  skillsList: {
    flex: 1,
  },
  skillCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  skillLevel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  skillActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyGoal: {
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 12,
    color: '#00a86b',
    marginTop: 8,
    fontWeight: '500',
  },
});