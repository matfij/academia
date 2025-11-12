import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Surface, Text } from "react-native-paper";
import { awClient, awDatabase } from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";
import { Habit } from "../../lib/types";
import { getEnvVar } from "../../lib/utils";

export default function Index() {
  const { user, signOut } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const habitCardRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    void fetchHabits();

    const channel = `databases.${getEnvVar(
      "EXPO_PUBLIC_APPWRITE_DATABASE_ID"
    )}.tables.${getEnvVar(
      "EXPO_PUBLIC_APPWRITE_DATABASE_HABITS_TABLE_ID"
    )}.rows`;

    const habitsSubscription = awClient.subscribe(channel, (response) => {
      if (response.events.includes("databases.*.tables.*.rows.*.create")) {
        void fetchHabits();
      } else if (
        response.events.includes("databases.*.tables.*.rows.*.update")
      ) {
        void fetchHabits();
      } else if (
        response.events.includes("databases.*.tables.*.rows.*.delete")
      ) {
        void fetchHabits();
      }
    });

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
        databaseId: getEnvVar("EXPO_PUBLIC_APPWRITE_DATABASE_ID"),
        tableId: getEnvVar("EXPO_PUBLIC_APPWRITE_DATABASE_HABITS_TABLE_ID"),
        queries: [Query.equal("userId", user?.$id)],
      });
      setHabits(response.rows);
    } catch (error) {
      console.warn(error);
    }
  };

  const renderLeftActions = () => (
    <View style={styles.swipeLeftWrapper}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
      />
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.swipeRightWrapper}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  const onDeleteHabit = async (id: string) => {
    console.log("deleting", id);
  };

  const onCompleteHabit = async (id: string) => {
    console.log("completing", id);
  };

  return (
    <View style={styles.mainWrapper}>
      <Text variant="headlineSmall" style={styles.title}>
        Today's habits
      </Text>
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
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
              onSwipeableOpen={(direction) =>
                direction === "left"
                  ? onCompleteHabit(habit.$id)
                  : onDeleteHabit(habit.$id)
              }
              // ref={(_ref) => {
              //   habitCardRefs.current[habit.$id] = _ref;
              // }}
            >
              <Surface style={styles.habitWrapper}>
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
    alignItems: "center",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyLabel: {
    color: "#666666",
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
  },
  habitWrapper: {
    width: "98%",
    padding: 12,
    marginLeft: "1%",
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#f7f2fa",
    shadowColor: "#010203",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#e53935",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 2,
    paddingRight: 16,
  },
});
