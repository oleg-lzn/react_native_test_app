import {
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  View,
  LayoutAnimation,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";
import TaskListItem from "../components/TaskListItem";
import { useState, useCallback, useEffect } from "react";
import uuid from "react-native-uuid";
import { getFromStorage, saveToStorage } from "../utils/asyncstorage";
import { logout } from "../api/api";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

type TaskListType = {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp?: number;
};

const STORAGE_KEY = "task-list";

export default function App() {
  const [value, setValue] = useState<string>("");
  const [tasks, setTasks] = useState<TaskListType[]>(initialItems);

  const handleLogout = async () => {
    Alert.alert("Выход", "Вы уверены, что хотите выйти?", [
      {
        text: "Отмена",
        style: "cancel",
      },
      {
        text: "Выйти",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await logout();
            if (result.success) {
              router.replace("/onboarding");
            } else {
              Alert.alert("Ошибка", result.error || "Ошибка при выходе");
            }
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Ошибка", "Ошибка при выходе");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const fetchTaskList = async () => {
      const data = await getFromStorage<TaskListType[]>(STORAGE_KEY);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(data);
      }
    };
    fetchTaskList();
  }, []);

  const handleSubmit = useCallback(() => {
    if (value) {
      const newTask = {
        id: uuid.v4() as string,
        name: value,
        isCompleted: false,
        lastUpdatedTimestamp: Date.now(),
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      saveToStorage(STORAGE_KEY, updatedTasks);
      setValue("");
    }
  }, [value, tasks]);

  const handleDelete = useCallback(
    (id: string) => {
      const newShoppingList = tasks.filter(item => item.id !== id);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTasks(newShoppingList);
      saveToStorage(STORAGE_KEY, newShoppingList);
    },
    [tasks]
  );

  const handleUpdate = useCallback(
    (id: string, name: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const updatedTasks = tasks.map(item =>
        item.id === id
          ? { ...item, name, lastUpdatedTimestamp: Date.now() }
          : item
      );
      setTasks(updatedTasks);
      saveToStorage(STORAGE_KEY, updatedTasks);
    },
    [tasks]
  );

  const handleToggleComplete = useCallback(
    (id: string) => {
      const newShoppingList = tasks.map(item => {
        if (item.id === id) {
          if (item.completedAtTimestamp) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return {
            ...item,
            completedAtTimestamp: item.completedAtTimestamp
              ? undefined
              : Date.now(),
            lastUpdatedTimestamp: Date.now(),
          };
        }
        return item;
      });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasks(newShoppingList);
      saveToStorage(STORAGE_KEY, newShoppingList);
    },
    [tasks]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={orderTaskList(tasks)}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Your Task List is Empty</Text>
          </View>
        }
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
                hitSlop={10}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={24} color={theme.colorCerulean} />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Add an item"
              value={value}
              onChangeText={(e: string) => setValue(e)}
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={() => {
                console.log("submitting", value);
                handleSubmit();
              }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TaskListItem
            id={item.id}
            name={item.name}
            isCompleted={Boolean(item.completedAtTimestamp)}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            onToggleComplete={handleToggleComplete}
          />
        )}
      />
    </SafeAreaView>
  );
}

const initialItems: TaskListType[] = [];

function orderTaskList(shoppingList: TaskListType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return (
        (item2.lastUpdatedTimestamp ?? 0) - (item1.lastUpdatedTimestamp ?? 0)
      );
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 16,
    marginBottom: 8,
    backgroundColor: theme.colorWhite,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colorCerulean,
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: theme.colorLightGray,
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    paddingBottom: 24,
  },
});
