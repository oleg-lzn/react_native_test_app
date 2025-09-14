import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef } from "react";
import { Duration, isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/asyncstorage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

// 2 weeks from now
const frequency = 14 * 24 * 60 * 60 * 1000;
export const COUNTDOWN_STORAGE_KEY = "taskly-countdown";

export default function CounterScreen() {
  const { width } = useWindowDimensions();
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const lastCompletedtimestamp = countdownState?.completedAtTimestamps[0];
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    const init = async () => {
      const data = await getFromStorage(COUNTDOWN_STORAGE_KEY);
      setCountdownState(data as PersistedCountdownState);
    };
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = lastCompletedtimestamp
        ? lastCompletedtimestamp + frequency
        : Date.now();
      setIsLoading(false);
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastCompletedtimestamp]);

  const scheduleNotification = async () => {
    confettiRef?.current?.start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to wash the motorcycle!",
          body: "WASH IT NOW!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: frequency / 1000,
          repeats: false,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "unable to schedule notification",
          "Ensure you have granted permission to receive notifications"
        );
      }
    }
    // Cancel the previous notification
    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState?.currentNotificationId
      );
    }
    // Update the countdown state
    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState?.completedAtTimestamps]
        : [Date.now()],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(COUNTDOWN_STORAGE_KEY, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colorCerulean} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, status.isOverdue && styles.overdueContainer]}
    >
      {status.isOverdue ? (
        <Text style={[styles.titleText, styles.whiteText]}>
          Motorcycle washing overdue by
        </Text>
      ) : (
        <Text style={styles.titleText}>Motorcycle washing due in...</Text>
      )}
      <View style={styles.timeContainer}>
        <TimeSegment
          number={status.distance.days ?? 0}
          unit="days"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.hours ?? 0}
          unit="hours"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.minutes ?? 0}
          unit="minutes"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          number={status.distance.seconds ?? 0}
          unit="seconds"
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>I washed the motorcycle!</Text>
      </TouchableOpacity>
      <ConfettiCannon
        count={50}
        origin={{ x: width / 2, y: -20 }}
        autoStart={false}
        fadeOut={true}
        ref={confettiRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  overdueContainer: {
    backgroundColor: theme.colorRed,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
