import { useFocusEffect } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Card, Text } from "react-native-paper";
import { awDatabase } from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";
import { Habit, HabitCompletion, StreakData } from "../../lib/types";
import { gatDayDifference, getEnvVar } from "../../lib/utils";

export default function StreaksScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>(
    []
  );

  useFocusEffect(() => {
    if (!user) {
      return;
    }
    void fetchHabits();
    void fetchHabitCompletions();
  });

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

  const fetchHabitCompletions = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await awDatabase.listRows<HabitCompletion>({
        databaseId: getEnvVar("APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("APPWRITE_DATABASE_HABIT_COMPLETIONS_TABLE_ID"),
        queries: [
          Query.equal("userId", user.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(250),
        ],
      });
      setHabitCompletions(response.rows);
    } catch (error) {
      console.warn(error);
    }
  };

  const getStreakData = (habitId: string) => {
    const streakData: StreakData = {
      streak: 0,
      bestStreak: 0,
      total: 0,
    };

    const completions = habitCompletions
      .filter((completion) => completion.habitId === habitId)
      .sort(
        (a, b) =>
          new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
      );

    if (completions.length === 0) {
      return streakData;
    }

    let streak = 0;
    let bestStreak = 0;
    let total = completions.length;
    let lastCompleted: Date | null = null;
    let currentStreak = 0;

    completions.forEach((completion) => {
      const completionDate = new Date(completion.$createdAt);
      if (lastCompleted === null) {
        currentStreak = 1;
      } else {
        const daysDiff = gatDayDifference(completionDate, lastCompleted);
        if (daysDiff === 0) {
        } else if (daysDiff === 1) {
          currentStreak += 1;
        } else {
          if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
          }
          currentStreak = 1;
        }
      }
      lastCompleted = completionDate;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    });

    streak = currentStreak;
    streakData.streak = streak;
    streakData.bestStreak = bestStreak;
    streakData.total = total;

    return streakData;
  };

  const habitStreaks = habits.map((habit) => {
    const streakData = getStreakData(habit.$id);
    return { ...habit, ...streakData };
  });

  const rankedHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);

  return (
    <View style={styles.mainWrapper}>
      <Text>Habit Streaks</Text>
      {habits.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyLabel}>
            No habits yet. Add your first habit
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {rankedHabits.map((habit, habitIndex) => (
            <Card
              key={habit.$id}
              style={[
                styles.habitWrapper,
                habitIndex === 0 && styles.topHabitWrapper,
              ]}
            >
              <Card.Content>
                <Text variant="titleMedium" style={styles.habitTitle}>
                  {habit.title}
                </Text>
                <Text style={styles.habitDescription}>{habit.description}</Text>
                <View style={styles.streakWrapper}>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakBadgeText}>
                      🔥 {habit.streak}
                    </Text>
                    <Text style={styles.streakBadgeLabel}>Current</Text>
                  </View>
                  <View style={styles.streakBestBadge}>
                    <Text style={styles.streakBadgeText}>
                      🏆 {habit.bestStreak}
                    </Text>
                    <Text style={styles.streakBadgeLabel}>Best</Text>
                  </View>
                  <View style={styles.streakTotalBadge}>
                    <Text style={styles.streakBadgeText}>✅ {habit.total}</Text>
                    <Text style={styles.streakBadgeLabel}>Total</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
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
  habitWrapper: {
    width: "98%",
    marginHorizontal: "auto",
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  topHabitWrapper: {
    borderWidth: 2,
    borderColor: "#7c4dff",
  },
  habitTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  habitDescription: {
    color: "#6c6c80",
    marginBottom: 16,
  },
  streakWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  streakBadge: {
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 80,
  },
  streakBestBadge: {
    backgroundColor: "#fffde7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 80,
  },
  streakTotalBadge: {
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    minWidth: 80,
  },
  streakBadgeText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#22223b",
  },
  streakBadgeLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontWeight: "500",
  },
});
