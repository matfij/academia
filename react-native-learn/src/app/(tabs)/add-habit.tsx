import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Button,
  SegmentedButtons,
  TextInput,
  useTheme,
} from "react-native-paper";
import { awDatabase } from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";
import { HabitFrequency, HabitInput } from "../../lib/types";
import { generateId, getEnvVar } from "../../lib/utils";

const frequencies = ["Hourly", "Daily", "Weekly", "Monthly"] as const;

export default function AddHabitScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("Daily");
  const [error, setError] = useState("");

  const isHabitInvalid = !title.length || !description.length;

  const onAddHabit = async () => {
    setError("");
    if (isHabitInvalid) {
      return;
    }

    try {
      await awDatabase.createRow({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABITS_TABLE_ID"),
        rowId: generateId(),
        data: {
          userId: user?.$id,
          title,
          description,
          frequency,
          streakCount: 0,
          lastCompleted: 0,
        } as HabitInput,
      });
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("Unable to add habit");
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.mainTitle}>Add Habit</Text>
      <TextInput
        label="Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.frequencyWrapper}>
        <SegmentedButtons
          value={frequency}
          onValueChange={setFrequency}
          buttons={frequencies.map((frequency) => ({
            value: frequency,
            label: frequency,
          }))}
        />
      </View>
      <Button
        mode="contained"
        disabled={isHabitInvalid}
        style={styles.addButton}
        onPress={onAddHabit}
      >
        Add habit
      </Button>
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    gap: 16,
    backgroundColor: "#f5f5f5",
  },
  mainTitle: {
    width: "98%",
    marginHorizontal: "auto",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  frequencyWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  addButton: {},
});
