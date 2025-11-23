import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, Modal } from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';

type FinanceData = {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  monthlyInvestments: number;
};

type EditField = 'monthlyIncome' | 'monthlyExpenses' | 'monthlySavings' | 'monthlyInvestments' | null;

export default function FinanceTracker() {
  const [finance, setFinance, financeLoading] = usePersistedState<FinanceData>('@finance', {
    monthlyIncome: 110000,
    monthlyExpenses: 50000,
    monthlySavings: 21000,
    monthlyInvestments: 10000,
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<EditField>(null);
  const [tempValue, setTempValue] = useState('');

  const remaining = finance.monthlyIncome - finance.monthlyExpenses - finance.monthlySavings - finance.monthlyInvestments;

  const openEditModal = (field: EditField, currentValue: number) => {
    setEditingField(field);
    setTempValue(currentValue.toString());
    setEditModalVisible(true);
  };

  const saveValue = () => {
    if (editingField && tempValue) {
      const numericValue = parseInt(tempValue) || 0;
      setFinance(prev => ({ ...prev, [editingField]: numericValue }));
    }
    setEditModalVisible(false);
    setEditingField(null);
    setTempValue('');
  };

  const QuickEditButton = ({ title, value, field }: { title: string; value: number; field: EditField }) => (
    <TouchableOpacity 
      style={styles.editButton} 
      onPress={() => openEditModal(field, value)}
    >
      <Text style={styles.editButtonText}>{title}</Text>
      <Text style={styles.editButtonValue}>₹{value.toLocaleString('en-IN')}</Text>
      <Text style={styles.editHint}>Tap to edit</Text>
    </TouchableOpacity>
  );

  if (financeLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Artha - Monthly Finance</Text>
      
      {/* Monthly Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>📊 Monthly Overview</Text>
        
        <View style={styles.financeGrid}>
          {/* Income */}
          <TouchableOpacity 
            style={[styles.financeItem, styles.incomeItem]}
            onPress={() => openEditModal('monthlyIncome', finance.monthlyIncome)}
          >
            <Text style={styles.financeLabel}>Income</Text>
            <Text style={styles.financeAmount}>₹{finance.monthlyIncome.toLocaleString('en-IN')}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, styles.incomeFill, { width: '100%' }]} />
            </View>
            <Text style={styles.tapToEdit}>Tap to edit</Text>
          </TouchableOpacity>

          {/* Expenses */}
          <TouchableOpacity 
            style={[styles.financeItem, styles.expenseItem]}
            onPress={() => openEditModal('monthlyExpenses', finance.monthlyExpenses)}
          >
            <Text style={styles.financeLabel}>Expenses</Text>
            <Text style={styles.financeAmount}>₹{finance.monthlyExpenses.toLocaleString('en-IN')}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, styles.expenseFill, { 
                width: `${(finance.monthlyExpenses / finance.monthlyIncome) * 100}%` 
              }]} />
            </View>
            <Text style={styles.tapToEdit}>Tap to edit</Text>
          </TouchableOpacity>

          {/* Savings */}
          <TouchableOpacity 
            style={[styles.financeItem, styles.savingsItem]}
            onPress={() => openEditModal('monthlySavings', finance.monthlySavings)}
          >
            <Text style={styles.financeLabel}>Savings</Text>
            <Text style={styles.financeAmount}>₹{finance.monthlySavings.toLocaleString('en-IN')}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, styles.savingsFill, { 
                width: `${(finance.monthlySavings / finance.monthlyIncome) * 100}%` 
              }]} />
            </View>
            <Text style={styles.tapToEdit}>Tap to edit</Text>
          </TouchableOpacity>

          {/* Investments */}
          <TouchableOpacity 
            style={[styles.financeItem, styles.investmentItem]}
            onPress={() => openEditModal('monthlyInvestments', finance.monthlyInvestments)}
          >
            <Text style={styles.financeLabel}>Investments</Text>
            <Text style={styles.financeAmount}>₹{finance.monthlyInvestments.toLocaleString('en-IN')}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, styles.investmentFill, { 
                width: `${(finance.monthlyInvestments / finance.monthlyIncome) * 100}%` 
              }]} />
            </View>
            <Text style={styles.tapToEdit}>Tap to edit</Text>
          </TouchableOpacity>
        </View>

        {/* Remaining */}
        <View style={[styles.remainingItem, remaining >= 0 ? styles.positiveRemaining : styles.negativeRemaining]}>
          <Text style={styles.remainingLabel}>
            {remaining >= 0 ? '✅ Remaining' : '⚠️ Overspent'}
          </Text>
          <Text style={styles.remainingAmount}>₹{Math.abs(remaining).toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Quick Edit Section */}
      <View style={styles.editSection}>
        <Text style={styles.editTitle}>Quick Access</Text>
        <View style={styles.editGrid}>
          <QuickEditButton 
            title="Income" 
            value={finance.monthlyIncome} 
            field="monthlyIncome"
          />
          <QuickEditButton 
            title="Expenses" 
            value={finance.monthlyExpenses} 
            field="monthlyExpenses"
          />
          <QuickEditButton 
            title="Savings" 
            value={finance.monthlySavings} 
            field="monthlySavings"
          />
          <QuickEditButton 
            title="Investments" 
            value={finance.monthlyInvestments} 
            field="monthlyInvestments"
          />
        </View>
        <Text style={styles.editHelp}>Tap any amount to edit precisely</Text>
      </View>

      {/* Weekly Check-in Reminder */}
      <View style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>📅 Weekly Check-in</Text>
        <Text style={styles.reminderText}>
          Review your monthly budget every Sunday. 
          Track actual spending vs planned.
        </Text>
        <Text style={styles.reminderSubtext}>
          Next check-in: This Sunday
        </Text>
      </View>

      {/* Number Input Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editingField?.replace('monthly', '').replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            
            <TextInput
              style={styles.numberInput}
              value={tempValue}
              onChangeText={setTempValue}
              keyboardType="numeric"
              placeholder="Enter amount"
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveValue}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add some bottom padding for better scrolling */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
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
    marginTop: 20,
    color: '#1a1a1a',
  },
  overviewCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  financeGrid: {
    gap: 12,
  },
  financeItem: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  incomeItem: {
    backgroundColor: '#f0f7ff',
    borderLeftColor: '#007AFF',
  },
  expenseItem: {
    backgroundColor: '#fff3f3',
    borderLeftColor: '#dc3545',
  },
  savingsItem: {
    backgroundColor: '#f0fff4',
    borderLeftColor: '#28a745',
  },
  investmentItem: {
    backgroundColor: '#fffbf0',
    borderLeftColor: '#ffc107',
  },
  financeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  financeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tapToEdit: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  incomeFill: {
    backgroundColor: '#007AFF',
  },
  expenseFill: {
    backgroundColor: '#dc3545',
  },
  savingsFill: {
    backgroundColor: '#28a745',
  },
  investmentFill: {
    backgroundColor: '#ffc107',
  },
  remainingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  positiveRemaining: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  negativeRemaining: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  remainingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  editGrid: {
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  editButtonValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  editHelp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  reminderCard: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
    lineHeight: 20,
  },
  reminderSubtext: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  numberInput: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});