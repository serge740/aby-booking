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
import { Ionicons } from '@expo/vector-icons';
// Import info
import info from '@/constants/info';
import { router } from 'expo-router';
import { useClientAuth } from '../../contexts/ClientAuthContext'; // Adjust the path as necessary
import GoogleButton from '@/components/auth/GoogleButton';

const RegisterScreen: React.FC = () => {
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
    if (!value.trim()) {
      return 'Name is required';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePhoneNumber = (value: string) => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(value)) {
      return 'Invalid phone number format';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length <= 6) {
      return 'Password must be more than 6 characters';
    }
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return 'Confirm password is required';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
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
    // Validate all fields before submission
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

    if (nameError || emailError || phoneError || passwordError || confirmError) {
      return;
    }

    try {
      await register({ name, email, phoneNumber, password });
      router.replace('/(dashboard)');
    } catch (error:any) {
      Alert.alert('Registration Failed', error.message  || 'Please check your details and try again.');
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
          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.thereText}>there!</Text>
          </View>
          {/* Subtitle */}
          <Text style={styles.subtitleText}>
            Just few clicks and we become friends and let's enjoy every day get updates on all your shipments
          </Text>
          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            {/* Phone Number Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Create password"
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
            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Re-type your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>
          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={[styles.termsLink, { color: info.primary[500] }]}>
                Terms of Service
              </Text>
              {' '}and{'\n'}
              <Text style={[styles.termsLink, { color: info.primary[500] }]}>
                Privacy Policy
              </Text>
            </Text>
          </View>
          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, { backgroundColor: info.primary[500] }]}
            onPress={handleSignUp}
            disabled={hasErrors()}
          >
            <Text style={styles.signUpButtonText}>Signup</Text>
          </TouchableOpacity>
          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton />

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={[styles.signInLink, { color: info.primary[500] }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 30,
    justifyContent: 'center',
  },
  welcomeContainer: {
    marginBottom: 12,
  },
  helloText: {
    fontSize: 32,
    fontWeight: '700',
    color: info.primary[500],
  },
  thereText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  subtitleText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    fontWeight: '600',
  },
  signUpButton: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#666',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;