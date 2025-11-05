// src/components/LanguageModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import i18n from '@/i18n';

type Props = {
  visible: boolean;
  onSelect: (lng: 'rw' | 'en' | 'fr') => void;
};

const flags = {
  rw: 'Rwanda',
  en: 'United States',
  fr: 'France',
};

export const LanguageModal = ({ visible, onSelect }: Props) => {
  const options: Array<{ code: 'rw' | 'en' | 'fr'; name: string }> = [
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.card}>
          <Text style={styles.title}>Select Language</Text>

          {options.map(opt => (
            <TouchableOpacity
              key={opt.code}
              style={styles.row}
              onPress={() => onSelect(opt.code)}
            >
              <Text style={styles.flag}>{flags[opt.code]}</Text>
              <Text style={styles.label}>{opt.name}</Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
});