import { Link, Stack } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Pressable } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => {
            return (
              <Link href="/counter/history" asChild>
                <Pressable hitSlop={30}>
                  <Fontisto name="history" size={24} color="black" />
                </Pressable>
              </Link>
            );
          },
        }}
      />
    </Stack>
  );
}
