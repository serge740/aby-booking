/* eslint-disable import/first */
/* eslint-disable no-dupe-keys */
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  StatusBar,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ── IMPORT SAME HEADER AS HOMESCREEN ─────────────────────
import { Header } from '../../components/Guest/Header';
import { Colors } from '../../constants/Colors';

// ── HARD-CODED DATA (no i18n) ─────────────────────────────
const FAQ_DATA = [
  {
    question: 'How do I track my order?',
    answer: "Go to 'My Orders' → tap your order → view live tracking.",
  },
  {
    question: 'Can I cancel an order?',
    answer: 'Yes, within 5 minutes of placing. Contact support after that.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Mobile Money, Credit Card, and Cash on Delivery.',
  },
];

/* ────────────────────── MAIN SCREEN ────────────────────── */
export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/250788123456');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        {/* SAME HEADER AS HOMESCREEN */}
        <View style={styles.headerContainer}>
          <Header />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* CURVED WHITE CARD OVERLAP */}
          <View style={styles.curvedCard}>
            {/* CONTACT CARD */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="call-outline" size={22} color={Colors.primary} />
                <Text style={styles.cardTitle}>Contact Us</Text>
              </View>
              <Text style={styles.cardText}>+250 788 123 456</Text>
              <Text style={styles.cardText}>support@grocery.rw</Text>
            </View>

            {/* WHATSAPP CARD */}
            <TouchableOpacity style={styles.whatsappCard} onPress={openWhatsApp}>
              <View style={styles.cardHeader}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                <Text style={styles.cardTitle}>Chat on WhatsApp</Text>
              </View>
              <Text style={styles.whatsappLink}>
                Start chat now <Ionicons name="arrow-forward" size={16} />
              </Text>
            </TouchableOpacity>

            {/* FAQ ACCORDION */}
            <View style={styles.faqCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
              </View>

              {FAQ_DATA.map((item, index) => (
                <AccordionItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onPress={() => toggleAccordion(index)}
                />
              ))}
            </View>

            {/* FOOTER */}
            <Text style={styles.footer}>We’re available 24/7 for your convenience.</Text>
          </View>
        </ScrollView>

        {/* FLOATING WHATSAPP FAB */}
        <TouchableOpacity style={styles.fab} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={28} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ────────────────────── ACCORDION ITEM ────────────────────── */
const AccordionItem = ({
  question,
  answer,
  isOpen,
  onPress,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onPress: () => void;
}) => {
  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.accordionQuestion}>{question}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

/* ────────────────────── STYLES ────────────────────── */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingBottom: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  curvedCard: {
    // marginTop: ,
    backgroundColor: '#FFFFFF',
    // borderTopLeftRadius: 36,
    // borderTopRightRadius: 36,
    paddingTop: 28,
    paddingHorizontal: 20,
    minHeight: 800,
  },

  // ── CARDS ─────────────────────────────────────
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  whatsappCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  cardText: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 22,
  },
  whatsappLink: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '600',
    marginTop: 8,
  },

  // ── ACCORDION ─────────────────────────────────
  accordionItem: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9',
  },
  accordionQuestion: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  accordionContent: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  accordionAnswer: {
    fontSize: 10.5,
    color: '#475569',
    lineHeight: 22,
  },

  // ── FOOTER & FAB ──────────────────────────────
  footer: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 12,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#25D366',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});