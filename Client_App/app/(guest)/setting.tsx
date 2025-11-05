import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function Setting() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLanguageChange = () => {
    Alert.alert('Change Language', 'Language settings will be available soon.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? '#10B981' : '#9CA3AF'}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#10B981' : '#9CA3AF'}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLanguageChange}>
          <Text style={styles.buttonText}>Change Language</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: '#EF4444' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>App Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  button: {
    marginTop: 8,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 10,
  },
});
