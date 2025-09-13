import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Text,
  View,
  TextInput,
} from "react-native";
import { theme } from "../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";

type Props = {
  id: string;
  name: string;
  isCompleted?: boolean;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string, name: string, isCompleted?: boolean) => void;
};

export default function ShoppingListItem({
  id,
  name,
  isCompleted,
  handleDelete,
  handleUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const onEdit = () => {
    console.log("Editing item:", name);
    setIsEditing(true);
    setEditedName(name);
  };

  const onSave = () => {
    if (editedName.trim()) {
      handleUpdate(id, editedName.trim(), isCompleted);
      setIsEditing(false);
    }
  };

  const onDelete = () => {
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
    <Pressable
      style={[styles.itemContainer, isCompleted && styles.completedContainer]}
    >
      {isEditing ? (
        <TextInput
          style={[styles.input, isCompleted && styles.completedText]}
          value={editedName}
          onChangeText={setEditedName}
          onSubmitEditing={onSave}
          onBlur={onSave}
          autoFocus
          selectTextOnFocus
        />
      ) : (
        <Text style={[styles.itemText, isCompleted && styles.completedText]}>
          {name}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        {!isEditing && (
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.8}
            style={styles.button}
          >
            <AntDesign
              name="edit"
              size={20}
              color={isCompleted ? theme.colorGray : theme.colorCerulean}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDelete} activeOpacity={0.8}>
          <AntDesign
            name="close-circle"
            size={24}
            color={isCompleted ? theme.colorGray : theme.colorRed}
          />
        </TouchableOpacity>
      </View>
    </Pressable>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "200",
  },
  button: {
    padding: 8,
  },
});
