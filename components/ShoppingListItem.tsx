import { Alert, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  name: string;
  isCompleted?: boolean;
};

export default function ShoppingListItem({ name, isCompleted }: Props) {
  const handleDelete = () => {
    Alert.alert("Delete", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => console.log("Delete"),
        style: "destructive",
      },
    ]);
  };

  return (
    <View
      style={[styles.itemContainer, isCompleted && styles.completedContainer]}
    >
      <Text style={[styles.itemText, isCompleted && styles.completedText]}>
        {name}
      </Text>
      <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
        <AntDesign
          name="close-circle"
          size={24}
          color={isCompleted ? theme.colorGray : theme.colorRed}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorCerulean,
  },
  completedContainer: {
    backgroundColor: theme.colorLightGray,
    borderBottomColor: theme.colorLightGray,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
  },
  completedText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGray,
  },
});
