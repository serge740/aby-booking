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
import info from '@/constants/info';
import { router } from 'expo-router';
import { useClientAuth } from '../../contexts/ClientAuthContext';
import GoogleButton from '@/components/auth/GoogleButton';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY_COLOR = '#FF8C42';          // ← Your new primary color
const GRADIENT_START = '#FF8C42';         // matching gradient start
const GRADIENT_END = '#FF6B00';           // slightly darker for depth
const LIGHT_BG = '#FFF8F0';               // very light peach
const INPUT_BORDER = '#FFDAC1';           // soft peach
const DISABLED_BG = '#FFDAC1';            // muted peach
const ERROR_COLOR = '#FF375F';            // vibrant red for errors

const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register } = useClientAuth();

  const validateName = (value: string) => {
    if (!value.trim()) return t('registerAuth.error_name_required');
    return '';
  };
  const validateEmail = (value: string) => {
    if (!value.trim()) return t('registerAuth.error_email_required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return t('registerAuth.error_email_invalid');
    return '';
  };
  const validatePhoneNumber = (value: string) => {
    if (!value.trim()) return t('registerAuth.error_phone_required');
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(value)) return t('registerAuth.error_phone_invalid');
    return '';
  };
  const validatePassword = (value: string) => {
    if (!value) return t('registerAuth.error_password_required');
    if (value.length <= 6) return t('registerAuth.error_password_length');
    return '';
  };
  const validateConfirmPassword = (value: string) => {
    if (!value) return t('registerAuth.error_confirm_required');
    if (value !== password) return t('registerAuth.error_confirm_mismatch');
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    let setter: (val: string) => void;
    let validator: (val: string) => string;
    switch (field) {
      case 'name':
        setter = setName;
        validator = validateName;
        break;
      case 'email':
        setter = setEmail;
        validator = validateEmail;
        break;
      case 'phoneNumber':
        setter = setPhoneNumber;
        validator = validatePhoneNumber;
        break;
      case 'password':
        setter = setPassword;
        validator = validatePassword;
        break;
      case 'confirmPassword':
        setter = setConfirmPassword;
        validator = validateConfirmPassword;
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
      !name || !email || !phoneNumber || !password || !confirmPassword;
  };

  const handleSignUp = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhoneNumber(phoneNumber);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(confirmPassword);

    setErrors({
      name: nameError,
      email: emailError,
      phoneNumber: phoneError,
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (nameError || emailError || phoneError || passwordError || confirmError) return;

    try {
      await register({ name, email, phoneNumber, password });
      router.replace('/(dashboard)');
    } catch (error: any) {
      Alert.alert(
        t('registerAuth.register_failed'),
        error.message || t('registerAuth.register_failed_message')
      );
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
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
      

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.helloText}>{t('registerAuth.hello')}</Text>
            <Text style={styles.thereText}>{t('registerAuth.there')}</Text>
            <Text style={styles.subtitleText}>{t('registerAuth.register_subtitle')}</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Name */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={18} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('registerAuth.placeholder_name')}
                placeholderTextColor="#999"
                value={name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Email */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail-outline" size={18} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('registerAuth.placeholder_email')}
                placeholderTextColor="#999"
                value={email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="call-outline" size={18} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('registerAuth.placeholder_phone')}
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            {/* Password */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={18} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder={t('registerAuth.placeholder_password')}
                placeholderTextColor="#999"
                value={password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={PRIMARY_COLOR}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={18} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder={t('registerAuth.placeholder_confirm_password')}
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={PRIMARY_COLOR}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <View style={styles.termsBox}>
              <Ionicons name="shield-checkmark" size={16} color={PRIMARY_COLOR} style={styles.shieldIcon} />
              <Text style={styles.termsText}>
                {t('registerAuth.terms')}
                <Text style={styles.termsLink}>{t('registerAuth.terms_service')}</Text>
                {t('registerAuth.and')}
                <Text style={styles.termsLink}>{t('registerAuth.privacy_policy')}</Text>
              </Text>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, hasErrors() && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={hasErrors()}
          >
            <Text style={styles.signUpButtonText}>{t('registerAuth.signup')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('registerAuth.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton />

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>{t('registerAuth.already_have_account')} </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>{t('registerAuth.sign_in')}</Text>
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
    backgroundColor: LIGHT_BG,
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: GRADIENT_END,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: GRADIENT_END,
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
    color: '#FFFFFFCC',
    marginTop: 4,
    fontWeight: '500',
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  helloText: {
    fontSize: 30,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  thereText: {
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
    borderColor: INPUT_BORDER,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_BG,
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
    color: ERROR_COLOR,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 14,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    alignItems: 'flex-start',
  },
  shieldIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  signUpButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: GRADIENT_END,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonDisabled: {
    backgroundColor: DISABLED_BG,
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
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
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: INPUT_BORDER,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signInText: {
    fontSize: 14,
    color: '#666',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  bottomDecoration: {
    position: 'relative',
    height: 80,
    marginTop: 20,
  },
  decorCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: INPUT_BORDER,
    opacity: 0.3,
    bottom: -30,
    left: -20,
  },
  decorCircle2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    right: -15,
    left: 'auto',
    bottom: -15,
    backgroundColor: PRIMARY_COLOR,
    opacity: 0.2,
  },
});

export default RegisterScreen;