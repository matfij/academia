import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/auth-context";
import { ComponentProps } from "../lib/types";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RouteGuard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </RouteGuard>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const RouteGuard = (props: ComponentProps) => {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoadingUser } = useAuth();

  useEffect(() => {
    return;
    if (!user && !isLoadingUser && segments[0] !== "auth") {
      router.replace("/auth");
    } else if (user && !isLoadingUser && segments[0] === "auth") {
      router.replace("/");
    }
  }, [user, segments, isLoadingUser]);

  return <>{props.children}</>;
};

// New way to implement auth guard

// <Stack>
//   <StatusBar />
//   <Stack.Protected guard={!!user}>
//     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//   </Stack.Protected>

//   <Stack.Protected guard={!user}>
//     <Stack.Screen name="auth" options={{ title: "Authentication" }} />
//   </Stack.Protected>
// </Stack>;
