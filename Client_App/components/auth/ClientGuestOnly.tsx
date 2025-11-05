import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useClientAuth } from "@/contexts/ClientAuthContext";

interface Props {
  children: React.ReactNode;
}

export default function ClientGuestOnly({ children }: Props) {
  const { isAuthenticated, loading } = useClientAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(dashboard)"); // redirect logged-in users to client dashboard
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
