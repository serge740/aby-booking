import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useClientAuth } from "../../contexts/ClientAuthContext";

interface Props {
  children: React.ReactNode;
}

export default function ClientUserOnly({ children }: Props) {
  const { isAuthenticated, loading } = useClientAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/(auth)/login"); // redirect guests to client login
    }
  }, [isAuthenticated, loading]);

  if (loading || !isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
