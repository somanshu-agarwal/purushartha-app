import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';

type Contact = {
  id: string;
  name: string;
  role: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
};

export default function SocialTracker() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Senior PM at Tech Co',
      lastContact: '2024-01-10',
      nextFollowUp: '2024-01-24',
      notes: 'Discuss AI product trends'
    },
    {
      id: '2', 
      name: 'Jane Smith',
      role: 'Startup Founder',
      lastContact: '2024-01-12',
      nextFollowUp: '2024-01-26',
      notes: 'Follow up on collaboration'
    },
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    notes: ''
  });

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
      
      setContacts([...contacts, contact]);
      setNewContact({ name: '', role: '', notes: '' });
    }
  };

  const getDaysUntilFollowUp = (date: string) => {
    const today = new Date();
    const followUp = new Date(date);
    const diffTime = followUp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const overdueContacts = contacts.filter(contact => getDaysUntilFollowUp(contact.nextFollowUp) < 0);
  const dueSoonContacts = contacts.filter(contact => {
    const days = getDaysUntilFollowUp(contact.nextFollowUp);
    return days >= 0 && days <= 7;
  });

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
      <View style={styles.addCard}>
        <Text style={styles.addTitle}>Add New Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
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
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contactsList}>
        {/* Overdue Follow-ups */}
        {overdueContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.overdueTitle]}>🚨 Follow-up Needed</Text>
            {overdueContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        )}

        {/* Due Soon */}
        {dueSoonContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.dueSoonTitle]}>📅 Follow-up Soon</Text>
            {dueSoonContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </View>
        )}

        {/* All Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 All Contacts ({contacts.length})</Text>
          {contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const ContactCard = ({ contact }: { contact: Contact }) => {
  const daysUntilFollowUp = getDaysUntilFollowUp(contact.nextFollowUp);
  
  const getFollowUpStatus = () => {
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
    </View>
  );
};

// Helper function (would be defined in the same file)
const getDaysUntilFollowUp = (date: string) => {
  const today = new Date();
  const followUp = new Date(date);
  const diffTime = followUp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
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
  },
  contactMetaText: {
    fontSize: 12,
    color: '#999',
  },
});