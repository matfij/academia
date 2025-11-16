import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Query } from "react-native-appwrite";
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

  useEffect(() => {
    if (!user) {
      return;
    }

    void fetchHabits();
    void fetchHabitCompletions();
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
    return { habit, streakData };
  });

  const rankedHabits = habitStreaks.sort(
    (a, b) => a.streakData.bestStreak - b.streakData.bestStreak
  );

  return (
    <View>
      <Text>Habit Streaks</Text>
      <Text>
        {JSON.stringify(
          rankedHabits.map((r) => ({
            name: r.habit.title,
            streakData: r.streakData,
          })),
          null,
          2
        )}
      </Text>
    </View>
  );
}
