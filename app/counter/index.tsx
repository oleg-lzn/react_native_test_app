import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState, useEffect } from "react";
import { Duration, isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

// 10 seconds from now
const timeStamp = Date.now() + 10 * 1000;

export default function CounterScreen() {
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  console.log(status);

  useEffect(() => {
    const interval = setInterval(() => {
      const isOverdue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timeStamp, end: Date.now() }
          : { start: Date.now(), end: timeStamp }
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hello, I'm a notification from your app",
          body: "This is a test notification",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
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
  };

  return (
    <View
      style={[styles.container, status.isOverdue && styles.overdueContainer]}
    >
      {status.isOverdue ? (
        <Text style={[styles.titleText, styles.whiteText]}>
          Thing overdue by
        </Text>
      ) : (
        <Text style={styles.titleText}>Thing due in...</Text>
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
        <Text style={styles.buttonText}>I have done it!</Text>
      </TouchableOpacity>
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
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
