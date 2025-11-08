import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Text>Activity Tracker</Text>
      <Link href="/login" style={styles.button}>
        Login
      </Link>
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
