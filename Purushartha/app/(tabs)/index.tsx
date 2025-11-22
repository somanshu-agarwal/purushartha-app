import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';

export default function MealPlanner() {
  const [selectedBreakfast, setSelectedBreakfast] = useState<string | null>(null);
  const [selectedLunch, setSelectedLunch] = useState<string | null>(null);
  const [selectedDinner, setSelectedDinner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  // Your meal lists
  const breakfastItems = [
    'Almonds with Bananas & Hot Milk',
    'Moong Dal Chilla with Curd',
    'Sprouts with Cucumber Tomato Lemon',
    'Paneer Bhurji with 2 Roti or 2 Breads',
    'Poha (Aloo)',
    'Upma',
    'Idli with Green Chutney (Coriander and Chilli)',
    'Dalia',
    'Besan Chilla',
    'Boiled Channa, Moong & Rajma Sprouts',
    'Aloo Sandwich',
    'Paneer Sandwich',
    'Paneer Paratha with Curd',
    'Aloo Paratha with Curd',
    'Paneer Salad (Cucumber + Tomato + Lemon)',
    'Nuts, Seeds, Fruits, Curd Mix',
    'Flaxseeds + Pumpkin Seeds + Sunflower Seeds',
    'Soak Almond With Walnut',
    'Papaya + Guava + Apple',
    'Uttapam Tomato'
  ];

  const lunchItems = [
    'Roti with one dal, one sabzi and Salad with Curd',
    'Rajma Rice with Salad',
    'Chole Chawal with salad',
    'Pulav with papad + Curd + Salad',
    'Lauki Ki sabzi with Roti + Salad + Curd',
    'Chole Roti + Salad',
    'Aloo Tamatar Sabzi + Roti + Salad + Curd',
    'Khichdi + Dahi',
    'Paneer Tikka Masala + Roti + Salad',
    'Rajma + Paneer Bhurji + Roti',
    'Dal Mixed with Roti',
    'Dal Chawal + Curd + Salad',
    'Moong Sprout + Khichdi',
    'Sambhar + Idli'
  ];

  const dinnerItems = [
    'Rajma Chawal with Saute Green Veggies',
    'Paneer bhurji with 2 Rotis and Saute Veggies',
    'Mix Dal with Roti and Sabzi with Curd',
    'Chole Boiled with Salad',
    'Dry Bhindi with Roti and 100g Paneer',
    'Paneer Tikka with Salad',
    'Moong dal Chilla with Soup',
    'Veg Soup with Paneer Inside',
    'Steamed veggies with Sprouts',
    'Paneer Salad',
    'Pulav with veggies',
    'Khichdi',
    'Daliya',
    'Dal with Rice',
    'Upma with Salad'
  ];

  // Intelligent suggestions based on meal content
  const getMealSuggestions = (meal: string | null): string[] => {
    if (!meal) return [];
    
    const suggestions: string[] = [];
    const lowerMeal = meal.toLowerCase();

    // Soaking requirements
    if (lowerMeal.includes('rajma') || lowerMeal.includes('chole') || lowerMeal.includes('channa')) {
      suggestions.push('🫘 Soak overnight (12+ hours) - check if you have stock');
    }
    if (lowerMeal.includes('almond') || lowerMeal.includes('walnut')) {
      suggestions.push('🌰 Soak nuts overnight for better digestion');
    }
    if (lowerMeal.includes('sprout')) {
      suggestions.push('🌱 Soak sprouts overnight or check if you have ready sprouts');
    }
    if (lowerMeal.includes('moong dal') && lowerMeal.includes('chilla')) {
      suggestions.push('🟡 Soak moong dal for 4-6 hours before making chilla');
    }

    // Ingredient checks
    if (lowerMeal.includes('paneer')) {
      suggestions.push('🧀 Check paneer stock in fridge - buy if needed');
    }
    if (lowerMeal.includes('roti') || lowerMeal.includes('paratha')) {
      suggestions.push('🫓 Check atta/wheat flour stock');
    }
    if (lowerMeal.includes('rice') || lowerMeal.includes('pulav') || lowerMeal.includes('khichdi')) {
      suggestions.push('🍚 Check rice stock');
    }
    if (lowerMeal.includes('curd') || lowerMeal.includes('dahi')) {
      suggestions.push('🥛 Check curd stock or set fresh curd overnight');
    }

    // Vegetable checks
    if (lowerMeal.includes('salad') || lowerMeal.includes('veggie') || lowerMeal.includes('sabzi')) {
      if (lowerMeal.includes('cucumber') || lowerMeal.includes('tomato') || lowerMeal.includes('onion')) {
        suggestions.push('🥒 Check fresh vegetables: cucumber, tomato, onion');
      }
      if (lowerMeal.includes('green')) {
        suggestions.push('🥬 Check green vegetables stock');
      }
    }

    // Specific dish preparations
    if (lowerMeal.includes('poha')) {
      suggestions.push('📝 Poha ingredients: poha, potatoes, onions, peanuts, spices');
      suggestions.push('💧 Wash poha 30 minutes before cooking - don\'t make it mushy');
    }
    if (lowerMeal.includes('upma')) {
      suggestions.push('📝 Upma ingredients: semolina (suji), vegetables, spices');
      suggestions.push('🔥 Roast semolina properly before cooking');
    }
    if (lowerMeal.includes('idli') || lowerMeal.includes('uttapam')) {
      suggestions.push('🍚 Check idli batter availability or prepare batter 8-12 hours before');
    }
    if (lowerMeal.includes('dalia')) {
      suggestions.push('📝 Dalia ingredients: broken wheat, vegetables, spices');
    }
    if (lowerMeal.includes('besan chilla')) {
      suggestions.push('📝 Besan chilla: besan flour, vegetables, spices');
      suggestions.push('💧 Make batter 30 minutes before for better consistency');
    }

    // Cooking time reminders
    if (lowerMeal.includes('rajma') || lowerMeal.includes('chole')) {
      suggestions.push('⏰ Pressure cook for 5-6 whistles until soft');
    }
    if (lowerMeal.includes('sprout') && lowerMeal.includes('boil')) {
      suggestions.push('🔥 Boil sprouts for 10-15 minutes if you prefer them soft');
    }

    // Default reminder if no specific suggestions
    if (suggestions.length === 0) {
      suggestions.push('✅ Check all ingredients availability tonight');
      suggestions.push('🕒 Plan preparation time accordingly');
    }

    return suggestions;
  };

  const pickRandomMeals = () => {
    const randomBreakfast = breakfastItems[Math.floor(Math.random() * breakfastItems.length)];
    const randomLunch = lunchItems[Math.floor(Math.random() * lunchItems.length)];
    const randomDinner = dinnerItems[Math.floor(Math.random() * dinnerItems.length)];
    
    setSelectedBreakfast(randomBreakfast);
    setSelectedLunch(randomLunch);
    setSelectedDinner(randomDinner);
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'breakfast': return breakfastItems;
      case 'lunch': return lunchItems;
      case 'dinner': return dinnerItems;
      default: return breakfastItems;
    }
  };

  const getSelectedMeal = () => {
    switch (activeTab) {
      case 'breakfast': return selectedBreakfast;
      case 'lunch': return selectedLunch;
      case 'dinner': return selectedDinner;
      default: return null;
    }
  };

  const getCurrentSuggestions = () => {
    return getMealSuggestions(getSelectedMeal());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purushartha - Life Manager</Text>
      
      <TouchableOpacity style={styles.button} onPress={pickRandomMeals}>
        <Text style={styles.buttonText}>Plan All Meals for Tomorrow</Text>
      </TouchableOpacity>

      {/* Selected Meals Display */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealSummary}>
        {selectedBreakfast && (
          <View style={styles.mealCard}>
            <Text style={styles.mealCardTitle}>Breakfast</Text>
            <Text style={styles.mealCardText}>{selectedBreakfast}</Text>
            {getMealSuggestions(selectedBreakfast).slice(0, 1).map((suggestion, index) => (
              <Text key={index} style={styles.mealCardSuggestion}>💡 {suggestion}</Text>
            ))}
          </View>
        )}
        {selectedLunch && (
          <View style={styles.mealCard}>
            <Text style={styles.mealCardTitle}>Lunch</Text>
            <Text style={styles.mealCardText}>{selectedLunch}</Text>
            {getMealSuggestions(selectedLunch).slice(0, 1).map((suggestion, index) => (
              <Text key={index} style={styles.mealCardSuggestion}>💡 {suggestion}</Text>
            ))}
          </View>
        )}
        {selectedDinner && (
          <View style={styles.mealCard}>
            <Text style={styles.mealCardTitle}>Dinner</Text>
            <Text style={styles.mealCardText}>{selectedDinner}</Text>
            {getMealSuggestions(selectedDinner).slice(0, 1).map((suggestion, index) => (
              <Text key={index} style={styles.mealCardSuggestion}>💡 {suggestion}</Text>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'breakfast' && styles.activeTab]} 
          onPress={() => setActiveTab('breakfast')}
        >
          <Text style={[styles.tabText, activeTab === 'breakfast' && styles.activeTabText]}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lunch' && styles.activeTab]} 
          onPress={() => setActiveTab('lunch')}
        >
          <Text style={[styles.tabText, activeTab === 'lunch' && styles.activeTabText]}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dinner' && styles.activeTab]} 
          onPress={() => setActiveTab('dinner')}
        >
          <Text style={[styles.tabText, activeTab === 'dinner' && styles.activeTabText]}>Dinner</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Meal for Current Tab */}
      {getSelectedMeal() && (
        <View style={styles.selectedMealContainer}>
          <Text style={styles.selectedMealTitle}>Tomorrow's {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}:</Text>
          <Text style={styles.selectedMealText}>{getSelectedMeal()}</Text>
          
          {/* Intelligent Suggestions */}
          {getCurrentSuggestions().length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Preparation Notes:</Text>
              {getCurrentSuggestions().map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Meal List for Current Tab */}
      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Your {activeTab} Options ({getCurrentItems().length}):</Text>
        <FlatList
          data={getCurrentItems()}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealItemText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
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
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealSummary: {
    marginBottom: 20,
    flexGrow: 0,
  },
  mealCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    width: 220,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mealCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  mealCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  mealCardSuggestion: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  selectedMealContainer: {
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
  selectedMealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  selectedMealText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  suggestionsContainer: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  suggestionItem: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  mealItem: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  mealItemText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});