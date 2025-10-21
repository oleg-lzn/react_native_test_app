import AsyncStorage from "@react-native-async-storage/async-storage";

// Я не стал делать никаких серверов здесь, никаких бэкендов,
// это базовая НЕСЕКЬЮРНАЯ, НЕСЕРЬЕЗНАЯ аутентификация.
// В реальности делается все через node.js, serverless postgres бд типа neon, либо mongo либо supabase
//  и нормальный JWT с созданием токена и его валидацией.
export async function signin(email: string, password: string) {
  try {
    if (email === "admin" && password === "1234") {
      const authData = {
        token: "authenticated",
        user: { email: "admin" },
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem("auth_token", JSON.stringify(authData));

      return {
        success: true,
        token: "authenticated",
        user: { email: "admin" },
      };
    } else {
      return {
        success: false,
        error: "Неверный логин или пароль",
      };
    }
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "Произошла ошибка при входе",
    };
  }
}

export async function checkAuth() {
  try {
    const authData = await AsyncStorage.getItem("auth_token");
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem("auth_token");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Ошибка при выходе" };
  }
}
