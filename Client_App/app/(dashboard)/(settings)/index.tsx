import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Switch,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ENV from '@/env';

// ---------- NEW ----------
import { LanguageModal } from '@/components/modal/LanguageModal';
import i18n from '@/i18n';
import type { Language } from '@/i18n';
// -------------------------

const SettingsProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { client, logout, deleteAccount } = useClientAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // ---- Language Modal state ----
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('rw');
  // ------------------------------

  // Keep UI in sync with i18n (useful when language is changed elsewhere)
  useEffect(() => {
    const listener = (lng: string) => setCurrentLanguage(lng as Language);
    i18n.on('languageChanged', listener);
    setCurrentLanguage(i18n.language as Language);
    return () => i18n.off('languageChanged', listener);
  }, []);

  // ---- Handlers ----
  const handleLogout = () => {
    Alert.alert(
      t('dashboard.settings.alerts.logout_title'),
      t('dashboard.settings.alerts.logout_message'),
      [
        { text: t('dashboard.settings.alerts.logout_cancel'), style: 'cancel' },
        {
          text: t('dashboard.settings.alerts.logout_confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', t('dashboard.settings.alerts.error_logout'));
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('dashboard.settings.alerts.delete_title'),
      t('dashboard.settings.alerts.delete_message'),
      [
        { text: t('dashboard.settings.alerts.delete_cancel'), style: 'cancel' },
        {
          text: t('dashboard.settings.alerts.delete_confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', t('dashboard.settings.alerts.error_delete'));
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/profile');
  };

  // ---- Language selection ----
  const openLanguageModal = () => setLanguageModalVisible(true);
  const handleLanguageSelect = async (lng: Language) => {
    await i18n.changeLanguage(lng);          // <-- persists automatically (see i18n.ts)
    setLanguageModalVisible(false);
  };
  // ----------------------------

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return '#10B981';
      case 'INACTIVE': return '#EF4444';
      case 'SUSPENDED': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'checkmark-circle';
      case 'INACTIVE': return 'close-circle';
      case 'SUSPENDED': return 'warning';
      default: return 'help-circle';
    }
  };

  const quickActions = [
    {
      icon: 'receipt-outline',
      label: t('dashboard.settings.quick_items.orders'),
      count: '12',
      color: '#0e8a74',
      onPress: () => router.push('/orders'),
    },
    {
      icon: 'heart-outline',
      label: t('dashboard.settings.quick_items.favorites'),
      count: '28',
      color: '#EF4444',
      onPress: () => router.push('/favorites'),
    },
    {
      icon: 'wallet-outline',
      label: t('dashboard.settings.quick_items.wallet'),
      count: '5.2K RWF',
      color: '#F59E0B',
      onPress: () => router.push('/wallet'),
    },
    {
      icon: 'gift-outline',
      label: t('dashboard.settings.quick_items.rewards'),
      count: '450',
      color: '#8B5CF6',
      onPress: () => router.push('/rewards'),
    },
  ];

  // ---- Language name for the right-text ----
  const languageNames: Record<Language, string> = {
    rw: 'Kinyarwanda',
    en: 'English',
    fr: 'Français',
  };
  // -----------------------------------------

  const menuSections = [
    {
      title: t('dashboard.settings.account_management'),
      items: [
        { icon: 'person-outline', label: t('dashboard.settings.edit_profile'), onPress: handleEditProfile, showChevron: true, color: '#0e8a74' },
        { icon: 'lock-closed-outline', label: t('dashboard.settings.change_password'), onPress: () => router.push('/profile/change-password'), showChevron: true, color: '#3B82F6' },
        { icon: 'shield-checkmark-outline', label: t('dashboard.settings.privacy_security'), onPress: () => router.push('/profile/privacy'), showChevron: true, color: '#8B5CF6' },
        { icon: 'location-outline', label: t('dashboard.settings.saved_addresses'), onPress: () => router.push('/profile/addresses'), showChevron: true, color: '#F59E0B' },
      ],
    },
    {
      title: t('dashboard.settings.preferences'),
      items: [
        { icon: 'notifications-outline', label: t('dashboard.settings.push_notifications'), showSwitch: true, value: notificationsEnabled, onValueChange: setNotificationsEnabled, color: '#0e8a74' },
        { icon: 'mail-outline', label: t('dashboard.settings.email_notifications'), showSwitch: true, value: emailNotifications, onValueChange: setEmailNotifications, color: '#3B82F6' },
        {
          icon: 'language-outline',
          label: t('dashboard.settings.language'),
          onPress: openLanguageModal,
          showChevron: true,
          rightText: languageNames[currentLanguage],   // <-- dynamic
          color: '#8B5CF6',
        },
        { icon: 'moon-outline', label: t('dashboard.settings.dark_mode'), showSwitch: true, value: false, onValueChange: () => {}, color: '#6B7280' },
      ],
    },
    {
      title: t('dashboard.settings.support_info'),
      items: [
        { icon: 'help-circle-outline', label: t('dashboard.settings.help_center'), onPress: () => router.push('/support/help'), showChevron: true, color: '#0e8a74' },
        { icon: 'chatbubble-ellipses-outline', label: t('dashboard.settings.contact_support'), onPress: () => router.push('/support/contact'), showChevron: true, color: '#3B82F6' },
        { icon: 'star-outline', label: t('dashboard.settings.rate_app'), onPress: () => Alert.alert('Rate App', 'Thank you for your support!'), showChevron: true, color: '#F59E0B' },
        { icon: 'document-text-outline', label: t('dashboard.settings.terms_conditions'), onPress: () => router.push('/support/terms'), showChevron: true, color: '#6B7280' },
        { icon: 'shield-outline', label: t('dashboard.settings.privacy_policy'), onPress: () => router.push('/support/privacy-policy'), showChevron: true, color: '#6B7280' },
      ],
    },
  ];

  if (!client) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ... (Header, Profile Card, Quick Actions, Menu Sections, Danger Zone, Footer) ... */}
        {/* The UI you already have – unchanged except the language item above */}
        {/* ------------------------------------------------------------------- */}
        {/* Header */}
        <View style={styles.headerWrapper}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80' }}
            style={styles.coverPhoto}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(14,138,116,0.8)']}
              style={styles.coverGradient}
            >
              <SafeAreaView>
                <View style={styles.headerTop}>
                  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingsButton} onPress={() => Alert.alert('Settings', 'Additional settings')}>
                    <Ionicons name="settings-outline" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageSection}>
              {client.profileImage ? (
                <Image source={{ uri: `${ENV.API_URL}${client.profileImage}` }} style={styles.profileImage} />
              ) : (
                <LinearGradient colors={['#0e8a74', '#0a6d5c']} style={styles.profileImagePlaceholder}>
                  <Text style={styles.initialsText}>{getInitials(client.name)}</Text>
                </LinearGradient>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={handleEditProfile}>
                <Ionicons name="camera" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{client.name}</Text>
              <Text style={styles.profileEmail}>{client.email}</Text>
              {client.phoneNumber && (
                <View style={styles.phoneRow}>
                  <Ionicons name="call-outline" size={14} color="#666" />
                  <Text style={styles.profilePhone}>{client.phoneNumber}</Text>
                </View>
              )}

              <View style={styles.statusBadge}>
                <Ionicons name={getStatusIcon(client.status) as any} size={16} color={getStatusColor(client.status)} />
                <Text style={[styles.statusText, { color: getStatusColor(client.status) }]}>
                  {client.status}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={18} color="#0e8a74" />
              <Text style={styles.editProfileText}>{t('dashboard.settings.edit_profile')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>{t('dashboard.settings.quick_actions')}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard} onPress={action.onPress}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionCount}>{action.count}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.content}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={item.onPress}
                      disabled={!!item.showSwitch}
                    >
                      <View style={styles.menuItemLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                          <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </View>

                      <View style={styles.menuItemRight}>
                        {item.rightText && <Text style={styles.rightText}>{item.rightText}</Text>}
                        {item.showSwitch && (
                          <Switch
                            value={item.value}
                            onValueChange={item.onValueChange}
                            trackColor={{ false: '#E5E7EB', true: '#0e8a7440' }}
                            thumbColor={item.value ? '#0e8a74' : '#9CA3AF'}
                          />
                        )}
                        {item.showChevron && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
                      </View>
                    </TouchableOpacity>
                    {itemIndex < section.items.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dashboard.settings.danger_zone')}</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, styles.iconDanger]}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuItemText, styles.dangerText]}>{t('dashboard.settings.logout')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#EF4444" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, styles.iconDanger]}>
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuItemText, styles.dangerText]}>{t('dashboard.settings.delete_account')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Image source={require('../../../assets/logo/logo.png')} style={styles.footerLogo} />
            <Text style={styles.footerBrand}>{t('dashboard.settings.footer_brand')}</Text>
            <Text style={styles.footerVersion}>{t('dashboard.settings.footer_version')}</Text>
            <Text style={styles.footerText}>
              {t('dashboard.settings.footer_member_since')}{' '}
              {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <Text style={styles.footerCopyright}>{t('dashboard.settings.footer_copyright')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ---------- LANGUAGE MODAL ---------- */}
      <LanguageModal
        visible={languageModalVisible}
        onSelect={handleLanguageSelect}
      />
      {/* ------------------------------------ */}
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Styles – unchanged (copy-paste the same StyleSheet you already have) */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#6B7280' },
  headerWrapper: { marginBottom: 24 },
  coverPhoto: { height: 180, width: '100%' },
  coverGradient: { flex: 1, justifyContent: 'space-between' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  settingsButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  profileCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginTop: -60, borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  profileImageSection: { position: 'relative', marginBottom: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF' },
  profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFF' },
  initialsText: { fontSize: 36, fontWeight: '700', color: '#FFF' },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#0e8a74', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF' },
  profileDetails: { alignItems: 'center', marginBottom: 16 },
  profileName: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  profileEmail: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  profilePhone: { fontSize: 14, color: '#6B7280' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 20 },
  statusText: { fontSize: 13, fontWeight: '600' },
  editProfileButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#0e8a7410', borderRadius: 25, borderWidth: 1, borderColor: '#0e8a74' },
  editProfileText: { fontSize: 15, fontWeight: '600', color: '#0e8a74' },
  quickActionsSection: { paddingHorizontal: 16, marginBottom: 24 },
  quickActionsTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', gap: 12 },
  quickActionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, width: '48%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  quickActionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickActionCount: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  quickActionLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12, marginLeft: 4 },
  menuCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  iconDanger: { backgroundColor: '#FEE2E2' },
  menuItemText: { fontSize: 15, fontWeight: '500', color: '#1F2937', flex: 1 },
  dangerText: { color: '#EF4444' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rightText: { fontSize: 14, color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 74 },
  footer: { alignItems: 'center', paddingTop: 32, paddingBottom: 16 },
  footerLogo: { width: 60, height: 60, resizeMode: 'contain', marginBottom: 12 },
  footerBrand: { fontSize: 18, fontWeight: '700', color: '#0e8a74', marginBottom: 4 },
  footerVersion: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },
  footerText: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  footerCopyright: { fontSize: 11, color: '#9CA3AF' },
});

export default SettingsProfileScreen;