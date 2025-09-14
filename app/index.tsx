import {
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  View,
  LayoutAnimation,
} from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState, useCallback, useEffect } from "react";
import uuid from "react-native-uuid";
import { getFromStorage, saveToStorage } from "../utils/asyncstorage";
import * as Haptics from "expo-haptics";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp?: number;
};

const STORAGE_KEY = "shopping-list";

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingListItems, setShoppingListItems] =
    useState<ShoppingListItemType[]>(initialItems);

  useEffect(() => {
    const fetchShoppingList = async () => {
      const data = await getFromStorage<ShoppingListItemType[]>(STORAGE_KEY);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingListItems(data);
      }
    };
    fetchShoppingList();
  }, []);

  const handleSubmit = useCallback(() => {
    if (value) {
      const newShoppingList = [
        {
          id: uuid.v4() as string,
          name: value,
          isCompleted: false,
          lastUpdatedTimestamp: Date.now(),
        },
        ...shoppingListItems,
      ];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShoppingListItems(newShoppingList);
      saveToStorage(STORAGE_KEY, newShoppingList);
      setValue("");
    }
  }, [value, shoppingListItems]);

  const handleDelete = useCallback(
    (id: string) => {
      const newShoppingList = shoppingListItems.filter(item => item.id !== id);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShoppingListItems(newShoppingList);
      saveToStorage(STORAGE_KEY, newShoppingList);
    },
    [shoppingListItems]
  );

  const handleUpdate = useCallback(
    (id: string, name: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShoppingListItems(prevItem =>
        prevItem.map(item =>
          item.id === id
            ? { ...item, name, lastUpdatedTimestamp: Date.now() }
            : item
        )
      );
      saveToStorage(STORAGE_KEY, shoppingListItems);
    },
    [shoppingListItems]
  );

  const handleToggleComplete = useCallback(
    (id: string) => {
      const newShoppingList = shoppingListItems.map(item => {
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
      setShoppingListItems(newShoppingList);
      saveToStorage(STORAGE_KEY, newShoppingList);
    },
    [shoppingListItems]
  );

  return (
    <FlatList
      data={orderShoppingList(shoppingListItems)}
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

const initialItems: ShoppingListItemType[] = [];

function orderShoppingList(shoppingList: ShoppingListItemType[]) {
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
