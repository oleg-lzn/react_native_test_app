import { Text, View, StyleSheet, FlatList } from "react-native";
import { COUNTDOWN_STORAGE_KEY, PersistedCountdownState } from "./index";
import { useState, useEffect } from "react";
import { getFromStorage } from "../../utils/asyncstorage";
import { format } from "date-fns";

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
    <View style={styles.container}>
      <FlatList
        data={countdownState?.completedAtTimestamps}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>{format(item, dateFormat)}</Text>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
