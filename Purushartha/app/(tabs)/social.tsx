import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { usePersistedState } from '../hooks/usePersistedState';

type Contact = {
  id: string;
  name: string;
  role: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
};

// Helper function to calculate days until follow-up
const getDaysUntilFollowUp = (date: string): number => {
  const today = new Date();
  const followUp = new Date(date);
  const diffTime = followUp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ContactCard = ({ contact }: { contact: Contact }) => {
  const daysUntilFollowUp = getDaysUntilFollowUp(contact.nextFollowUp);
  
  const getFollowUpStatus = (): { text: string; color: string } => {
    if (daysUntilFollowUp < 0) return { text: `Overdue by ${Math.abs(daysUntilFollowUp)} days`, color: '#dc3545' };
    if (daysUntilFollowUp === 0) return { text: 'Follow up today!', color: '#fd7e14' };
    if (daysUntilFollowUp <= 2) return { text: `Follow up in ${daysUntilFollowUp} days`, color: '#ffc107' };
    return { text: `Follow up in ${daysUntilFollowUp} days`, color: '#28a745' };
  };

  const status = getFollowUpStatus();

  return (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={[styles.followUpStatus, { color: status.color }]}>
          {status.text}
        </Text>
      </View>
      <Text style={styles.contactRole}>{contact.role}</Text>
      {contact.notes ? (
        <Text style={styles.contactNotes}>📝 {contact.notes}</Text>
      ) : null}
      <View style={styles.contactMeta}>
        <Text style={styles.contactMetaText}>
          Last contact: {new Date(contact.lastContact).toLocaleDateString()}
        </Text>
        <Text style={styles.contactMetaText}>
          Next follow-up: {new Date(contact.nextFollowUp).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => {}}
      >
        <Text style={styles.contactButtonText}>Mark Contacted</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function SocialTracker() {
  const [contacts, setContacts, contactsLoading] = usePersistedState<Contact[]>('@contacts', [
    {
      id: '1',
      name: 'John Doe',
      role: 'Senior PM at Tech Co',
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Discuss AI product trends'
    },
    {
      id: '2', 
      name: 'Jane Smith',
      role: 'Startup Founder',
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Follow up on collaboration'
    },
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    notes: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const addContact = () => {
    if (newContact.name.trim()) {
      const today = new Date();
      const nextFollowUp = new Date();
      nextFollowUp.setDate(today.getDate() + 14);
      
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        role: newContact.role,
        lastContact: today.toISOString().split('T')[0],
        nextFollowUp: nextFollowUp.toISOString().split('T')[0],
        notes: newContact.notes
      };
      
      setContacts((current: Contact[]) => [...current, contact]);
      setNewContact({ name: '', role: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const updateLastContact = (contactId: string) => {
    const today = new Date();
    const nextFollowUp = new Date();
    nextFollowUp.setDate(today.getDate() + 14);
    
    setContacts((current: Contact[]) => current.map((contact: Contact) => 
      contact.id === contactId 
        ? { 
            ...contact, 
            lastContact: today.toISOString().split('T')[0],
            nextFollowUp: nextFollowUp.toISOString().split('T')[0]
          }
        : contact
    ));
  };

  const overdueContacts = contacts.filter((contact: Contact) => getDaysUntilFollowUp(contact.nextFollowUp) < 0);
  const dueSoonContacts = contacts.filter((contact: Contact) => {
    const days = getDaysUntilFollowUp(contact.nextFollowUp);
    return days >= 0 && days <= 7;
  });
  const otherContacts = contacts.filter((contact: Contact) => {
    const days = getDaysUntilFollowUp(contact.nextFollowUp);
    return days > 7;
  });

  if (contactsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Networking & Social</Text>

      {/* Quick Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{contacts.length}</Text>
            <Text style={styles.statLabel}>Total Contacts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, styles.overdue]}>{overdueContacts.length}</Text>
            <Text style={styles.statLabel}>Need Follow-up</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, styles.dueSoon]}>{dueSoonContacts.length}</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
        </View>
      </View>

      {/* Add New Contact */}
      {!showAddForm ? (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Contact</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add New Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name *"
            value={newContact.name}
            onChangeText={(text) => setNewContact({...newContact, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Role/Company"
            value={newContact.role}
            onChangeText={(text) => setNewContact({...newContact, role: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={newContact.notes}
            onChangeText={(text) => setNewContact({...newContact, notes: text})}
          />
          <View style={styles.formActions}>
            <TouchableOpacity 
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setShowAddForm(false);
                setNewContact({ name: '', role: '', notes: '' });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.formButton, styles.saveButton]}
              onPress={addContact}
              disabled={!newContact.name.trim()}
            >
              <Text style={styles.saveButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.contactsList}>
        {/* Overdue Follow-ups */}
        {overdueContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.overdueTitle]}>🚨 Follow-up Needed</Text>
            {overdueContacts.map((contact: Contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        )}

        {/* Due Soon */}
        {dueSoonContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.dueSoonTitle]}>📅 Follow-up Soon</Text>
            {dueSoonContacts.map((contact: Contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        )}

        {/* All Contacts */}
        {otherContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 All Contacts ({otherContacts.length})</Text>
            {otherContacts.map((contact: Contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        )}

        {contacts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No contacts yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first contact to start building your network
            </Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  overdue: {
    color: '#dc3545',
  },
  dueSoon: {
    color: '#ffc107',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    minHeight: 44,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  contactsList: {
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
    color: '#333',
  },
  overdueTitle: {
    color: '#dc3545',
  },
  dueSoonTitle: {
    color: '#ffc107',
  },
  contactCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  followUpStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contactNotes: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  contactMeta: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    marginBottom: 12,
  },
  contactMetaText: {
    fontSize: 12,
    color: '#999',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});