import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ComponentProps } from "../lib/types";

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RouteGuard>
  );
}

const RouteGuard = (props: ComponentProps) => {
  const isAuth = false;
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      console.log(router);
      router.replace("/auth");
    }
  }, []);

  return <>{props.children}</>;
};
