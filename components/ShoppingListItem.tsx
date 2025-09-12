import { Alert, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  id: string;
  name: string;
  isCompleted?: boolean;
  handleDelete: (id: string) => void;
};

export default function ShoppingListItem({
  id,
  name,
  isCompleted,
  handleDelete,
}: Props) {
  const onDelete = (id: string) => {
    Alert.alert("Delete", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          console.log("Deleting", name);
          handleDelete(id);
        },
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
      <TouchableOpacity onPress={() => onDelete(id)} activeOpacity={0.8}>
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
