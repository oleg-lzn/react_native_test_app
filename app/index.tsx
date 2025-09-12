import { StyleSheet, View, TextInput } from "react-native";
import { theme } from "../theme";
import ShoppingListItem from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
};

const initialItems: ShoppingListItemType[] = [
  { id: "1", name: "Coffee", isCompleted: false },
  { id: "2", name: "Tea", isCompleted: false },
  { id: "3", name: "Sugar", isCompleted: false },
];

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingListItems, setShoppingListItems] =
    useState<ShoppingListItemType[]>(initialItems);

  const handleSubmit = () => {
    if (value) {
      const newShoppingList = [
        { id: new Date().toString(), name: value, isCompleted: false },
        ...shoppingListItems,
      ];
      setShoppingListItems(newShoppingList);
      setValue("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
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

      {shoppingListItems.map(
        ({ id, name, isCompleted }: ShoppingListItemType) => (
          <ShoppingListItem key={id} name={name} isCompleted={isCompleted} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingTop: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: theme.colorLightGray,
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
  },
});
