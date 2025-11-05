import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { router } from 'expo-router';
import info from '@/constants/info';
import ENV from '@/env';

const SettingsProfileScreen: React.FC = () => {
  const { client, logout, deleteAccount, isAuthenticated } = useClientAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/profile');
  };

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
      case 'ACTIVE':
        return '#10B981';
      case 'INACTIVE':
        return '#EF4444';
      case 'SUSPENDED':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          label: 'Edit Profile',
          onPress: handleEditProfile,
          showChevron: true,
        },
        {
          icon: 'lock-closed-outline',
          label: 'Change Password',
          onPress: () => router.push('/profile/change-password'),
          showChevron: true,
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Privacy & Security',
          onPress: () => router.push('/profile/privacy'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Push Notifications',
          showSwitch: true,
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: 'mail-outline',
          label: 'Email Notifications',
          showSwitch: true,
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
        {
          icon: 'language-outline',
          label: 'Language',
          onPress: () => router.push('/profile/language'),
          showChevron: true,
          rightText: 'English',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Help Center',
          onPress: () => router.push('/support/help'),
          showChevron: true,
        },
        {
          icon: 'chatbubble-outline',
          label: 'Contact Us',
          onPress: () => router.push('/support/contact'),
          showChevron: true,
        },
        {
          icon: 'document-text-outline',
          label: 'Terms & Conditions',
          onPress: () => router.push('/support/terms'),
          showChevron: true,
        },
        {
          icon: 'shield-outline',
          label: 'Privacy Policy',
          onPress: () => router.push('/support/privacy-policy'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          icon: 'information-circle-outline',
          label: 'About',
          onPress: () => router.push('/about'),
          showChevron: true,
          rightText: 'v1.0.0',
        },
        {
          icon: 'star-outline',
          label: 'Rate App',
          onPress: () => Alert.alert('Rate App', 'Thank you for your support!'),
          showChevron: true,
        },
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

        {/* Header with Profile */}
        <LinearGradient
          colors={[info.primary[500], info.primary[600]]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              {client.profileImage ? (
                <Image
                  source={{ uri: `${ENV.API_URL}${client.profileImage}` }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.initialsText}>
                    {getInitials(client.name)}
                  </Text>
                </View>
              )}

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{client.name}</Text>
                <Text style={styles.profileEmail}>{client.email}</Text>
                {client.phoneNumber && (
                  <Text style={styles.profilePhone}>{client.phoneNumber}</Text>
                )}
                <View style={styles.statusContainer}>
                  <View
                    style={[
                        styles.statusDot,
                      { backgroundColor: getStatusColor(client.status) },
                    ]}
                  />
                  <Text style={styles.statusText}>{client.status}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={20} color="info.primary[400]" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            
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
                      disabled={item.showSwitch}
                    >
                      <View style={styles.menuItemLeft}>
                        <View style={styles.iconContainer}>
                          <Ionicons
                            name={item.icon as any}
                            size={22}
                            color={info.primary[400]}
                          />
                        </View>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </View>

                      <View style={styles.menuItemRight}>
                        {item.rightText && (
                          <Text style={styles.rightText}>{item.rightText}</Text>
                        )}
                        {item.showSwitch && (
                          <Switch
                            value={item.value}
                            onValueChange={item.onValueChange}
                            trackColor={{ false:info.primary[200], true: info.primary[100] }}
                            thumbColor={item.value ? info.primary[500] : info.primary[500]}
                          />
                        )}
                        {item.showChevron && (
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={info.primary[500]}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Logout & Delete Account */}
          <View style={styles.section}>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, styles.iconDanger]}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuItemText, styles.dangerText]}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDeleteAccount}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, styles.iconDanger]}>
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuItemText, styles.dangerText]}>
                    Delete Account
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Member since {new Date(client.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.footerTextSmall}>
              Last updated: {new Date(client.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: '700',
    color: info.primary[500],
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: info.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  dangerText: {
    color: '#EF4444',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: info.primary[200],
    marginLeft: 68,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerTextSmall: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default SettingsProfileScreen;