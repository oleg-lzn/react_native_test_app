import { Text, View, StyleSheet, FlatList } from "react-native";
import { COUNTDOWN_STORAGE_KEY, PersistedCountdownState } from "./index";
import { useState, useEffect } from "react";
import { getFromStorage } from "../../utils/asyncstorage";
import { format } from "date-fns";
import { theme } from "../../theme";

export default function HistoryScreen() {
  const [countdownState, setCountdownState] = useState<
    PersistedCountdownState[]
  >([]);

  const dateFormat = "LLL d yyyy, h:mm aaa";

  useEffect(() => {
    const fetchCountdownState = async () => {
      const data = await getFromStorage(COUNTDOWN_STORAGE_KEY);
      setCountdownState(data as PersistedCountdownState[]);
    };
    fetchCountdownState();
  }, []);

  return (
    <FlatList
      data={countdownState?.completedAtTimestamps}
      contentContainerStyle={styles.contentContainer}
      style={styles.flatList}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text style={styles.emptyText}>No updates yet</Text>
        </View>
      }
      renderItem={({ item }) => {
        return (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{format(item, dateFormat)}</Text>
          </View>
        );
      }}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    marginTop: 10,
  },
  flatList: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  listItem: {
    backgroundColor: theme.colorLightGray,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  listEmptyContainer: {
    marginVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
