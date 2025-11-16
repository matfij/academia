import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Surface, Text } from "react-native-paper";
import { awClient, awDatabase } from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";
import { Habit, HabitCompletionInput, HabitInput, xD } from "../../lib/types";
import { generateId, getEnvVar } from "../../lib/utils";

export default function Index() {
  const { user, signOut } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsCompletedToday, setHabitsCompletedToday] = useState<string[]>(
    []
  );
  const habitCardRefs = useRef<{
    [key: string]: ComponentRef<typeof Swipeable>;
  }>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    void fetchHabits();
    void fetchHabitsCompletedToday();

    const habitsChannel = `databases.${getEnvVar(
      "APPWRITE_DATABASE_ID"
    )}.tables.${getEnvVar("APPWRITE_DATABASE_HABITS_TABLE_ID")}.rows`;
    const completionsChannel = `databases.${getEnvVar(
      "APPWRITE_DATABASE_ID"
    )}.tables.${getEnvVar(
      "APPWRITE_DATABASE_HABIT_COMPLETIONS_TABLE_ID"
    )}.rows`;

    const habitsSubscription = awClient.subscribe(
      [habitsChannel, completionsChannel],
      (response) => {
        console.log(response);
        if (response.events.includes("databases.*.tables.*.rows.*.create")) {
          void fetchHabits();
          void fetchHabitsCompletedToday();
        } else if (
          response.events.includes("databases.*.tables.*.rows.*.update")
        ) {
          void fetchHabits();
          void fetchHabitsCompletedToday();
        } else if (
          response.events.includes("databases.*.tables.*.rows.*.delete")
        ) {
          void fetchHabits();
        }
      }
    );

    return () => {
      habitsSubscription();
    };
  }, [user]);

  const fetchHabits = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await awDatabase.listRows<Habit>({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABITS_TABLE_ID"),
        queries: [Query.equal("userId", user?.$id)],
      });
      setHabits(response.rows);
    } catch (error) {
      console.warn(error);
    }
  };

  const fetchHabitsCompletedToday = async () => {
    if (!user) {
      return;
    }
    try {
      const todayTimestamp = new Date().setHours(0, 0, 0, 0);
      const response = await awDatabase.listRows<Habit>({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABITS_TABLE_ID"),
        queries: [
          Query.equal("userId", user.$id),
          Query.greaterThanEqual("lastCompleted", todayTimestamp),
        ],
      });
      setHabitsCompletedToday(response.rows.map((row) => row.$id));
    } catch (error) {
      console.warn(error);
    }
  };

  const isHabitCompleted = (id: string) => habitsCompletedToday.includes(id);

  const renderLeftActions = (habitId: string) => (
    <View style={styles.swipeLeftWrapper}>
      {isHabitCompleted(habitId) ? (
        <Text style={{ color: "#fff" }}>Completed</Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color="#f5f5f5"
        />
      )}
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.swipeRightWrapper}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color="#f5f5f5"
      />
    </View>
  );

  const onHabitSwipe = async (id: string, direction: "left" | "right") => {
    if (direction === "right") {
      await onCompleteHabit(id);
    } else {
      await onDeleteHabit(id);
    }
    habitCardRefs.current[id].close();
  };

  const onDeleteHabit = async (id: string) => {
    try {
      await awDatabase.deleteRow({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABITS_TABLE_ID"),
        rowId: id,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const onCompleteHabit = async (id: string) => {
    try {
      const habit = habits.find((x) => x.$id === id);
      if (!user || !habit || habitsCompletedToday.includes(id)) {
        return;
      }
      await awDatabase.createRow({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABIT_COMPLETIONS_TABLE_ID"),
        rowId: generateId(),
        data: {
          userId: user.$id,
          habitId: id,
        } as HabitCompletionInput,
      });
      await awDatabase.updateRow({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABITS_TABLE_ID"),
        rowId: id,
        data: {
          lastCompleted: Date.now(),
          streakCount: habit.streakCount + 1,
        } as Partial<HabitInput>,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.mainTitle}>Today's habits</Text>
      {habits.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyLabel}>
            No habits yet. Add your first habit
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {habits.map((habit) => (
            <Swipeable
              key={habit.$id}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={() => renderLeftActions(habit.$id)}
              renderRightActions={renderRightActions}
              ref={
                ((ref: ComponentRef<typeof Swipeable>) => {
                  habitCardRefs.current[habit.$id] = ref;
                }) as xD
              }
              onSwipeableOpen={(direction) =>
                onHabitSwipe(habit.$id, direction)
              }
            >
              <Surface
                style={[
                  styles.habitWrapper,
                  isHabitCompleted(habit.$id) && styles.habitCompletedWrapper,
                ]}
              >
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitDescription}>{habit.description}</Text>
                <View style={styles.habitFooter}>
                  <View style={styles.habitBadge}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={18}
                      color="#ff9800"
                    />
                    <Text style={styles.streakLabel}>
                      {habit.streakCount} day streak
                    </Text>
                  </View>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyLabel}>{habit.frequency}</Text>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  mainTitle: {
    width: "98%",
    marginHorizontal: "auto",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyLabel: {
    fontWeight: "bold",
    marginBottom: 16,
    color: "#666666",
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
  },
  habitWrapper: {
    flex: 1,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#f7f2fa",
    shadowColor: "#010203",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  habitCompletedWrapper: {
    opacity: 0.6,
  },
  habitTitle: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#22223b",
  },
  habitDescription: {
    fontSize: 16,
    marginBottom: 12,
    color: "#6c6c80",
  },
  habitFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitBadge: {
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff3e0",
  },
  streakLabel: {
    color: "#ff9800",
    fontWeight: "bold",
  },
  frequencyBadge: {
    padding: 8,
    backgroundColor: "#ede7f6",
    borderRadius: 8,
  },
  frequencyLabel: {
    color: "#7c4dff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  swipeLeftWrapper: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#4caf50",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeRightWrapper: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#e53935",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 2,
    paddingRight: 16,
  },
});
