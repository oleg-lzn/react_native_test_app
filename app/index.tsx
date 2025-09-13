import { StyleSheet, TextInput, FlatList, Text, View } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState, useCallback } from "react";
import uuid from "react-native-uuid";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAtTimestamp?: number;
};

const initialItems: ShoppingListItemType[] = [
  { id: uuid.v4() as string, name: "Coffee", isCompleted: false },
  { id: uuid.v4() as string, name: "Tea", isCompleted: false },
  { id: uuid.v4() as string, name: "Sugar", isCompleted: false },
];

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingListItems, setShoppingListItems] =
    useState<ShoppingListItemType[]>(initialItems);

  const handleSubmit = useCallback(() => {
    if (value) {
      const newShoppingList = [
        { id: uuid.v4() as string, name: value, isCompleted: false },
        ...shoppingListItems,
      ];
      setShoppingListItems(newShoppingList);
      setValue("");
    }
  }, [value]);

  const handleDelete = useCallback((id: string) => {
    setShoppingListItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleUpdate = useCallback((id: string, name: string) => {
    setShoppingListItems(prevItem =>
      prevItem.map(item => (item.id === id ? { ...item, name } : item))
    );
  }, []);

  const handleToggleComplete = useCallback(
    (id: string) => {
      const newShoppingList = shoppingListItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            completedAtTimestamp: item.completedAtTimestamp
              ? undefined
              : Date.now(),
          };
        }
        return item;
      });
      setShoppingListItems(newShoppingList);
    },
    [shoppingListItems]
  );

  return (
    <FlatList
      data={shoppingListItems}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>Your Shopping List is Empty</Text>
        </View>
      }
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
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
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          id={item.id}
          name={item.name}
          isCompleted={Boolean(item.completedAtTimestamp)}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          onToggleComplete={handleToggleComplete}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
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
