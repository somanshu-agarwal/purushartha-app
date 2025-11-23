import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';

type Skill = {
  id: string;
  name: string;
  currentLevel: number;
  targetLevel: number;
  dailyProgress: number;
  dailyGoal: string;
  weeklyTarget: number;
};

export default function GrowthTracker() {
  const [skills, setSkills, skillsLoading] = usePersistedState<Skill[]>('@skills', [
    {
      id: '1',
      name: 'AI Product Management',
      currentLevel: 40,
      targetLevel: 90,
      dailyProgress: 0,
      dailyGoal: '30 mins study',
      weeklyTarget: 5
    },
    {
      id: '2', 
      name: 'Technical Architecture',
      currentLevel: 30,
      targetLevel: 80,
      dailyProgress: 0,
      dailyGoal: 'Read 1 article',
      weeklyTarget: 4
    },
    {
      id: '3',
      name: 'Blog Writing',
      currentLevel: 20, 
      targetLevel: 85,
      dailyProgress: 0,
      dailyGoal: 'Write 250 words',
      weeklyTarget: 3
    },
    {
      id: '4',
      name: 'Portfolio Building',
      currentLevel: 15,
      targetLevel: 95,
      dailyProgress: 0,
      dailyGoal: 'Update 1 section',
      weeklyTarget: 4
    },
    {
      id: '5',
      name: 'Networking',
      currentLevel: 25,
      targetLevel: 75,
      dailyProgress: 0,
      dailyGoal: 'Reach out to 1 person',
      weeklyTarget: 2
    },
  ]);

  const [lastReset, setLastReset] = usePersistedState('@lastGrowthReset', new Date().toDateString());

  // Reset weekly progress on Monday
  React.useEffect(() => {
    const today = new Date();
    const lastResetDate = new Date(lastReset);
    const daysSinceReset = Math.floor((today.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 7 || today.getDay() === 1) { // Monday or 7 days passed
      const resetSkills = skills.map((skill: Skill) => ({
        ...skill,
        dailyProgress: 0
      }));
      setSkills(resetSkills);
      setLastReset(today.toDateString());
    }
  }, [lastReset]);

  const updateDailyProgress = (skillId: string) => {
    setSkills((current: Skill[]) => current.map((skill: Skill) => 
      skill.id === skillId 
        ? { ...skill, dailyProgress: Math.min(skill.dailyProgress + 1, skill.weeklyTarget) }
        : skill
    ));
  };

  const getWeeklyProgress = (): number => {
    const totalProgress = skills.reduce((sum: number, skill: Skill) => sum + skill.dailyProgress, 0);
    const totalTarget = skills.reduce((sum: number, skill: Skill) => sum + skill.weeklyTarget, 0);
    return totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
  };

  const getMotivationalMessage = (): string => {
    const progress = getWeeklyProgress();
    if (progress === 0) return "Start your week strong! 🚀";
    if (progress < 30) return "Great start! Keep building momentum. 💪";
    if (progress < 70) return "You're making solid progress! 📈";
    if (progress < 100) return "Almost there! Finish strong! 🔥";
    return "Amazing! You crushed your weekly goals! 🎉";
  };

  if (skillsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your growth tracker...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artha - Skill Growth</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Weekly Progress</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getWeeklyProgress()}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(getWeeklyProgress())}% of weekly goals</Text>
        <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{skills.length}</Text>
            <Text style={styles.statLabel}>Skills</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {skills.reduce((sum: number, skill: Skill) => sum + skill.dailyProgress, 0)}
            </Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {skills.reduce((sum: number, skill: Skill) => sum + skill.weeklyTarget, 0)}
            </Text>
            <Text style={styles.statLabel}>Weekly Goal</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.skillsList}>
        {skills.map((skill: Skill) => (
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
              <View>
                <Text style={styles.dailyGoal}>Daily: {skill.dailyGoal}</Text>
                <Text style={styles.weeklyProgress}>
                  Weekly: {skill.dailyProgress}/{skill.weeklyTarget} sessions
                </Text>
              </View>
              <TouchableOpacity 
                style={[
                  styles.completeButton,
                  skill.dailyProgress >= skill.weeklyTarget && styles.completeButtonDisabled
                ]}
                onPress={() => updateDailyProgress(skill.id)}
                disabled={skill.dailyProgress >= skill.weeklyTarget}
              >
                <Text style={styles.completeButtonText}>
                  {skill.dailyProgress >= skill.weeklyTarget ? '🎯 Done' : 'Mark Done'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {skill.dailyProgress > 0 && (
              <Text style={styles.progressText}>
                ✅ Completed {skill.dailyProgress} times this week
                {skill.dailyProgress >= skill.weeklyTarget && ' - Goal achieved! 🎉'}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Progress resets weekly • Tap to mark daily sessions
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
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
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
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
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
  skillActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dailyGoal: {
    fontSize: 14,
    color: '#666',
  },
  weeklyProgress: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: '#28a745',
  },
  completeButtonText: {
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