import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next'; // ADD THIS

export default function Support() {
  const { t } = useTranslation(); // ADD THIS

  const faqItems = t('guest.support.faq', { returnObjects: true }) as string[];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('guest.support.header')}</Text>
      <Text style={styles.subheader}>{t('guest.support.subheader')}</Text>

      <View style={styles.section}>
        <Text style={styles.title}>{t('guest.support.contact_title')}</Text>
        <Text style={styles.text}>{t('guest.support.phone')}</Text>
        <Text style={styles.text}>{t('guest.support.email')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>{t('guest.support.whatsapp_title')}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/250788123456')}>
          <Text style={styles.link}>{t('guest.support.whatsapp_link')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>{t('guest.support.faq_title')}</Text>
        {faqItems.map((item, index) => (
          <Text key={index} style={styles.text}>• {item}</Text>
        ))}
      </View>

      <Text style={styles.footer}>{t('guest.support.footer')}</Text>
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
    marginBottom: 8,
    color: '#111827',
  },
  subheader: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  text: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },
  link: {
    fontSize: 15,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 13,
  },
});