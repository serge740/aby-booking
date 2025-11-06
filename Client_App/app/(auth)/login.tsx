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
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import GoogleButton from '@/components/auth/GoogleButton';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
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
          {/* Gradient Header */}
            <LinearGradient
                   colors={['#FF6B35', '#FF4757']}
                   style={styles.headerGradient}
                   start={{ x: 1, y: 0 }}
                   end={{ x: 1, y: 1 }}
                 >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <MaterialIcons name="storefront" size={32} color="#FFF" />
              </View>
              <Text style={styles.brandName}>Aby Booking</Text>
              <Text style={styles.tagline}>Your Local Marketplace</Text>
            </View>
          </LinearGradient>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>{t('loginAuth.welcome')}</Text>
            <Text style={styles.welcomeBackText}>{t('loginAuth.back')}</Text>
            <Text style={styles.subtitleText}>{t('loginAuth.subtitle')}</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Identifier Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name={getDynamicIcon()} size={18} color="#FF6B35" />
              </View>
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
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={18} color="#FF6B35" />
              </View>
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
                  color="#FF6B35"
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
              <Text style={styles.forgotPasswordText}>
                {t('loginAuth.forgot_password')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, hasErrors() && styles.signInButtonDisabled]}
            onPress={handleSignIn}
            disabled={hasErrors()}
          >
            <Text style={styles.signInButtonText}>{t('loginAuth.sign_in')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
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
            <MaterialIcons name="person-outline" size={20} color="#FF6B35" style={styles.guestIcon} />
            <Text style={styles.guestButtonText}>{t('loginAuth.continue_as_guest')}</Text>
          </TouchableOpacity>

          {/* Create Account Link */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>{t('loginAuth.no_account')} </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.createAccountLink}>
                {t('loginAuth.create_account')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Decoration */}
          <View style={styles.bottomDecoration}>
            <View style={styles.decorCircle} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF5F0' 
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerGradient: {
    marginHorizontal: -24,
    marginTop: -10,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    backgroundColor: '#FF6B35',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#FF4757',
    
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#FFE8E0',
    marginTop: 4,
    fontWeight: '500',
  },
  welcomeContainer: { 
    marginTop: 32,
    marginBottom: 24,
  },
  welcomeText: { 
    fontSize: 30, 
    fontWeight: '700', 
    color: '#FF6B35',
    marginBottom: 2,
  },
  welcomeBackText: { 
    fontSize: 30, 
    fontWeight: '700', 
    color: '#2C2C2C',
    marginBottom: 8,
  },
  subtitleText: { 
    fontSize: 14, 
    color: '#666', 
    lineHeight: 20,
  },
  inputContainer: { marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFE8E0',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#2C2C2C',
    fontWeight: '500',
  },
  passwordInput: { paddingRight: 40 },
  eyeIcon: { 
    position: 'absolute', 
    right: 16, 
    padding: 4,
  },
  errorText: { 
    color: '#FF4757', 
    fontSize: 12, 
    marginBottom: 8, 
    marginLeft: 14,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FF6B35',
    marginRight: 8,
    backgroundColor: '#FFF5F0',
  },
  rememberMeText: { 
    fontSize: 14, 
    color: '#666',
    fontWeight: '500',
  },
  forgotPasswordText: { 
    fontSize: 14, 
    fontWeight: '600',
    color: '#FF6B35',
  },
  signInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonDisabled: {
    backgroundColor: '#FFCDB8',
    shadowOpacity: 0.1,
  },
  signInButtonText: { 
    color: '#FFF', 
    fontSize: 17, 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#FFE8E0',
  },
  dividerText: { 
    marginHorizontal: 16, 
    fontSize: 14, 
    color: '#999',
    fontWeight: '500',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#FFE8E0',
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestIcon: { marginRight: 8 },
  guestButtonText: { 
    fontSize: 15, 
    color: '#FF6B35', 
    fontWeight: '600',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  createAccountText: { 
    fontSize: 14, 
    color: '#666',
  },
  createAccountLink: { 
    fontSize: 14, 
    fontWeight: '700',
    color: '#FF6B35',
  },
  bottomDecoration: {
    position: 'relative',
    height: 100,
    marginTop: 20,
  },
  decorCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE8E0',
    opacity: 0.3,
    bottom: -40,
    left: -30,
  },
  decorCircle2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    right: -20,
    left: 'auto',
    bottom: -20,
    backgroundColor: '#FF6B35',
    opacity: 0.2,
  },
});

export default LoginScreen;