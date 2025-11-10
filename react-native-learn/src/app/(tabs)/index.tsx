import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../lib/auth-context";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View style={styles.view}>
      <Text>Activity Tracker</Text>
      <Button icon="logout" onPress={signOut}>
        Sign out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    textAlign: "center",
    backgroundColor: "lime",
    borderRadius: 4,
  },
});
