import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ErrorBoundary from '../components/ErrorBoundary';

export default function TabLayout() {
  return (
    <ErrorBoundary>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          headerShown: false,
          tabBarStyle: {
            minHeight: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 4, // Added margin to prevent cutting
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Meals',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="checkmark-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="growth"
          options={{
            title: 'Growth',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="trending-up" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chores"
          options={{
            title: 'Chores',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: 'Social',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="finance"
          options={{
            title: 'Finance',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="cash" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ErrorBoundary>
  );
}