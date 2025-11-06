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
            style={styles.guestButton}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.guestIcon}
            />
            <Text style={styles.guestButtonText}>Continue with Google</Text>
          </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  guestIcon: { marginRight: 8, width:20,height:20 },
  guestButtonText: { 
    fontSize: 15, 
    color: '#FF6B35', 
    fontWeight: '600',
  },
});