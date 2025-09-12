import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { theme } from "./theme";

export default function App() {

const handleDelete = () => {
  Alert.alert("Delete", "Are you sure you want to delete this item?", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", onPress: () => console.log("Delete"), style: "destructive" },
  ]);
}

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Coffee</Text>
        <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}
          style={styles.button}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      </View>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
    },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
  },
});
