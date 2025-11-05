import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';

export default function Support() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Support Center</Text>
      <Text style={styles.subheader}>We’re here to help you with any issues or questions.</Text>

      <View style={styles.section}>
        <Text style={styles.title}>📞 Contact Us</Text>
        <Text style={styles.text}>Phone: +250 788 123 456</Text>
        <Text style={styles.text}>Email: support@rwandabus.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>💬 WhatsApp Support</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/250788123456')}>
          <Text style={styles.link}>Chat with us on WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>❓ Frequently Asked Questions</Text>
        <Text style={styles.text}>• How do I book a bus ticket?</Text>
        <Text style={styles.text}>• Can I cancel or change my trip?</Text>
        <Text style={styles.text}>• How can I get a refund?</Text>
        <Text style={styles.text}>• What should I do if I lose my ticket?</Text>
      </View>

      <Text style={styles.footer}>Thank you for traveling with us!</Text>
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
