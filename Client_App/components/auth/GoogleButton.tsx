import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View, Alert } from "react-native";

import { useRouter } from "expo-router";
import { useClientAuth } from "@/contexts/ClientAuthContext";

export default function GoogleButton() {
  const { loginWithGoogle } = useClientAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();           // does everything
      router.replace("/(dashboard)");    // navigate on success
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Google login failed.");
    }
  };

  return (
    <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
});