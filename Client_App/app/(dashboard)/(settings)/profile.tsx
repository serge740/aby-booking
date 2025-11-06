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
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ENV from '@/env';

const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { client, updateProfile } = useClientAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setEmail(client.email || '');
      setPhoneNumber(client.phoneNumber || '');
      setProfileImage(client.profileImage ? `${ENV.API_URL}${client.profileImage}` : null);
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      const changed =
        name !== client.name ||
        email !== client.email ||
        phoneNumber !== (client.phoneNumber || '') ||
        profileImage !== (client.profileImage ? `${ENV.API_URL}${client.profileImage}` : null);
      setHasChanges(changed);
    }
  }, [name, email, phoneNumber, profileImage, client]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('dashboard.profile.alerts.image_permission_title'),
          t('dashboard.profile.alerts.image_permission_message')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', t('dashboard.profile.alerts.image_error'));
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('dashboard.profile.alerts.image_permission_title'),
          t('dashboard.profile.alerts.camera_permission_message')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', t('dashboard.profile.alerts.photo_error'));
    }
  };

  const handleImagePress = () => {
    Alert.alert(
      t('dashboard.profile.alerts.image_options_title'),
      '',
      [
        { text: t('dashboard.profile.alerts.image_options_take'), onPress: takePhoto },
        { text: t('dashboard.profile.alerts.image_options_library'), onPress: pickImage },
        { text: t('dashboard.profile.alerts.image_options_cancel'), style: 'cancel' },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', t('dashboard.profile.alerts.validation_name'));
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', t('dashboard.profile.alerts.validation_email'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', t('dashboard.profile.alerts.validation_email_format'));
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || null,
      };

      if (profileImage && profileImage !== (client?.profileImage ? `${ENV.API_URL}${client.profileImage}` : null)) {
        const uriParts = profileImage.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop() || 'jpg';
        const mimeType = `image/${fileType}`;

        updateData.profileImage = {
          uri: profileImage,
          name: fileName,
          type: mimeType,
        };
      }

      await updateProfile(updateData);
      
      Alert.alert(
        t('dashboard.profile.alerts.success_title'),
        t('dashboard.profile.alerts.success_message'),
        [{ text: t('dashboard.profile.alerts.success_ok'), onPress: () => router.back() }]
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || t('dashboard.profile.alerts.error_default');
      Alert.alert(t('dashboard.profile.alerts.error_title'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        t('dashboard.profile.alerts.discard_title'),
        t('dashboard.profile.alerts.discard_message'),
        [
          { text: t('dashboard.profile.alerts.discard_keep'), style: 'cancel' },
          { text: t('dashboard.profile.alerts.discard_confirm'), style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!client) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        {/* Header */}
        <LinearGradient
          colors={['#FF6B35', '#FF4757']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('dashboard.profile.header_title')}</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={handleImagePress} style={styles.imageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.initialsText}>{getInitials(name || 'U')}</Text>
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHint}>{t('dashboard.profile.image_hint')}</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('dashboard.profile.full_name_label')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('dashboard.profile.full_name_placeholder')}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('dashboard.profile.email_label')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('dashboard.profile.email_placeholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('dashboard.profile.phone_label')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder={t('dashboard.profile.phone_placeholder')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Account Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('dashboard.profile.account_status')}</Text>
                <View style={styles.statusBadge}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: client.status === 'ACTIVE' ? '#10B981' : '#EF4444' }
                  ]} />
                  <Text style={styles.statusText}>{client.status}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('dashboard.profile.member_since')}</Text>
                <Text style={styles.infoValue}>
                  {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
              </View>
              {client.google_id && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('dashboard.profile.connected')}</Text>
                  <View style={styles.googleBadge}>
                    <Ionicons name="logo-google" size={14} color="#EA4335" />
                    <Text style={styles.googleText}>Google</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, (!hasChanges || loading) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <LinearGradient
                colors={hasChanges ? ['#FF6B35', '#FF4757'] : ['#D1D5DB', '#D1D5DB']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>{t('dashboard.profile.save_button')}</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  keyboardView: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#6B7280' },
  header: { paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  imageSection: { alignItems: 'center', paddingVertical: 30 },
  imageContainer: { position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFF' },
  profileImagePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF6B35', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFF' },
  initialsText: { fontSize: 40, fontWeight: '700', color: '#FFF' },
  cameraIconContainer: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B35', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF' },
  imageHint: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  formSection: { paddingHorizontal: 20, paddingBottom: 100 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#1F2937' },
  infoCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  googleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
  googleText: { fontSize: 12, fontWeight: '600', color: '#EA4335' },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  saveButton: { borderRadius: 12, overflow: 'hidden' },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default EditProfileScreen;