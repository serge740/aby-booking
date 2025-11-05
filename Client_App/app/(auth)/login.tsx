import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // <-- ADD THIS
import info from '../../constants/info';
import { router } from 'expo-router';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import GoogleButton from '@/components/auth/GoogleButton';

const LoginScreen: React.FC = () => {
  const { t } = useTranslation(); // <-- ADD THIS
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useClientAuth();

  const validateIdentifier = (value: string) => {
    if (!value.trim()) {
      return t('loginAuth.error_identifier_required');
    }
    const trimmed = value.trim();
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phoneRegex.test(trimmed) && !emailRegex.test(trimmed)) {
      return t('loginAuth.error_identifier_invalid');
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return t('loginAuth.error_password_required');
    }
    if (value.length <= 6) {
      return t('loginAuth.error_password_length');
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    let setter: (val: string) => void;
    let validator: (val: string) => string;
    switch (field) {
      case 'identifier':
        setter = setIdentifier;
        validator = validateIdentifier;
        break;
      case 'password':
        setter = setPassword;
        validator = validatePassword;
        break;
      default:
        return;
    }
    setter(value);
    const error = validator(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== '') ||
      !identifier || !password;
  };

  const handleSignIn = async () => {
    const identifierError = validateIdentifier(identifier);
    const passwordError = validatePassword(password);
    setErrors({
      identifier: identifierError,
      password: passwordError,
    });
    if (identifierError || passwordError) return;

    try {
      await login(identifier.trim(), password);
      router.replace('/(dashboard)');
    } catch (error: any) {
      Alert.alert(
        t('loginAuth.login_failed'),
        error.message || t('loginAuth.login_failed_message')
      );
    }
  };

  const handleContinueAsGuest = () => {
    router.push('/(guest)');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    // router.push('/(auth)/forgot-password');
  };

  const getDynamicPlaceholder = () => {
    const trimmed = identifier.trim();
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed === '') return t('loginAuth.placeholder_identifier');
    if (phoneRegex.test(trimmed)) return t('loginAuth.placeholder_phone');
    if (emailRegex.test(trimmed)) return t('loginAuth.placeholder_email');
    return t('loginAuth.placeholder_identifier');
  };

  const getDynamicIcon = () => {
    const trimmed = identifier.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed) ? 'mail-outline' : 'call-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>{t('loginAuth.welcome')}</Text>
            <Text style={styles.welcomeBackText}>{t('loginAuth.back')}</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>{t('loginAuth.subtitle')}</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Identifier Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name={getDynamicIcon()} size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={getDynamicPlaceholder()}
                placeholderTextColor="#999"
                value={identifier}
                onChangeText={(value) => handleInputChange('identifier', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.identifier && <Text style={styles.errorText}>{errors.identifier}</Text>}

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder={t('loginAuth.placeholder_password')}
                placeholderTextColor="#999"
                value={password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.rememberMeContainer}>
              <View style={styles.checkbox} />
              <Text style={styles.rememberMeText}>{t('loginAuth.remember_me')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: info.primary[500] }]}>
                {t('loginAuth.forgot_password')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: info.primary[500] }]}
            onPress={handleSignIn}
            disabled={hasErrors()}
          >
            <Text style={styles.signInButtonText}>{t('loginAuth.sign_in')}</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('loginAuth.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton />

          {/* Guest Button */}
          <TouchableOpacity style={styles.guestButton} onPress={handleContinueAsGuest}>
            <MaterialIcons name="person" size={20} color="#000" style={styles.guestIcon} />
            <Text style={styles.guestButtonText}>{t('loginAuth.continue_as_guest')}</Text>
          </TouchableOpacity>

          {/* Create Account Link */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>{t('loginAuth.no_account')} </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={[styles.createAccountLink, { color: info.primary[500] }]}>
                {t('loginAuth.create_account')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/* Styles – unchanged                                                 */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 40,
  },
  welcomeContainer: { marginBottom: 12 },
  welcomeText: { fontSize: 32, fontWeight: '700', color: info.primary[500] },
  welcomeBackText: { fontSize: 32, fontWeight: '700', color: '#000' },
  subtitleText: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 32 },
  inputContainer: { marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#000' },
  passwordInput: { paddingRight: 40 },
  eyeIcon: { position: 'absolute', right: 16, padding: 4 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 10 },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 8,
  },
  rememberMeText: { fontSize: 14, color: '#666' },
  forgotPasswordText: { fontSize: 14, fontWeight: '500' },
  signInButton: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E5E5' },
  dividerText: { marginHorizontal: 16, fontSize: 14, color: '#999' },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 24,
  },
  guestIcon: { marginRight: 10 },
  guestButtonText: { fontSize: 15, color: '#000', fontWeight: '500' },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountText: { fontSize: 14, color: '#666' },
  createAccountLink: { fontSize: 14, fontWeight: '600' },
});

export default LoginScreen;