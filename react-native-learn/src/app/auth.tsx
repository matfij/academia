import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const theme = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onAuth = () => {
    if (!email || !password) {
      setError("Provide email and password");
    }  
  };

  const onSignIn = () => {};

  const onSignUp = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.wrapper}>
        <Text variant="headlineMedium" style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example.@gmail.com"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
        />
        <Button mode="contained" style={{ marginTop: 16 }} onPress={onAuth}>
          Enter
        </Button>
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        <Button mode="text" onPress={() => setIsSignUp((prev) => !prev)}>
          {isSignUp
            ? "Already have account? Sign in."
            : "Don't have an account? Sign up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    marginVertical: "30%",
    gap: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
});
