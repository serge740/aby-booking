import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next'; // ADD THIS

export default function Setting() {
  const { t } = useTranslation(); // ADD THIS
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLanguageChange = () => {
    Alert.alert(t('guest.settings.change_language'), t('guest.settings.language_alert'));
  };

  const handleLogout = () => {
    Alert.alert(t('guest.settings.logout'), t('guest.settings.logout_confirm'));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('guest.settings.header')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('guest.settings.section_general')}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t('guest.settings.notifications')}</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? '#10B981' : '#9CA3AF'}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('guest.settings.dark_mode')}</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#10B981' : '#9CA3AF'}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLanguageChange}>
          <Text style={styles.buttonText}>{t('guest.settings.change_language')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('guest.settings.section_account')}</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: '#EF4444' }]}>{t('guest.settings.logout')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>{t('guest.settings.footer')}</Text>
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