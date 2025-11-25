import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useAuthStore } from '../state/auth-store';

export default function RootLayout() {
    const { username } = useAuthStore();

    return (
        <Stack>
            <StatusBar />
            <Stack.Protected guard={!!username}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!username}>
                <Stack.Screen name="auth" options={{ title: 'Authentication' }} />
            </Stack.Protected>
        </Stack>
    );
}
