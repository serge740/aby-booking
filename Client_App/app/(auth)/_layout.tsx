import ClientGuestOnly from '@/components/auth/ClientGuestOnly'
import { Stack } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
  return (
    <ClientGuestOnly>

    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='login' />
        <Stack.Screen name='register' />
    </Stack>
    </ClientGuestOnly>
  )
}

export default AuthLayout