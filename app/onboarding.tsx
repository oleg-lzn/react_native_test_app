import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { theme } from "../theme";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { signin } from "../api/api";

export default function OnboardingScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signin(email, password);
      if (result.success) {
        router.replace("/");
      } else {
        Alert.alert("Ошибка", result.error || "Неверный логин или пароль");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при входе");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[theme.colorGreen, theme.colorAppleGreen, theme.colorLimeGreen]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Taskly</Text>
          <Text style={styles.tagline}>Manage your tasks</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Логин"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Вход..." : "Войти"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.credentials}>
          <Text style={styles.credentialsTitle}>Тестовые данные:</Text>
          <Text style={styles.credentialsText}>Логин: admin</Text>
          <Text style={styles.credentialsText}>Пароль: 1234</Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
  },
  heading: {
    fontSize: 42,
    fontWeight: "bold",
    color: theme.colorWhite,
    marginBottom: 12,
    textAlign: "center",
  },
  tagline: {
    paddingHorizontal: 12,
    fontSize: 34,
    color: theme.colorWhite,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Caveat-Regular",
      android: "Caveat_400Regular",
    }),
  },
  form: {
    width: "100%",
    maxWidth: 300,
  },
  input: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: theme.colorWhite,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  buttonDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonText: {
    color: theme.colorWhite,
    fontSize: 18,
    fontWeight: "600",
  },
  credentials: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "rgba(255,255,255,0.5)",
    width: "100%",
    maxWidth: 300,
  },
  credentialsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.colorWhite,
  },
  credentialsText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
});
