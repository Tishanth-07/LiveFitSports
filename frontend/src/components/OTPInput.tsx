import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";

type Props = {
  length?: number;
  onComplete: (code: string) => void;
  countdown?: number; // seconds
  onResend?: () => void;
  onChangeCode?: (code: string) => void;
};

export default function OTPInput({
  length = 6,
  onComplete,
  countdown = 120,
  onResend,
  onChangeCode,
}: Props) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<Array<TextInput | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(countdown);
  const [running, setRunning] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    setSecondsLeft(countdown);
    setRunning(true);
  }, [countdown]);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const handleChange = (text: string, i: number) => {
    if (!/^\d*$/.test(text)) {
      // Shake animation for invalid input
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    const newVals = [...values];
    newVals[i] = text.slice(-1);
    setValues(newVals);
    if (text && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
    const code = newVals.join("");
    onChangeCode?.(code);
    if (code.length === length && !newVals.includes("")) {
      onComplete(code);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const clearAll = () => {
    const empty = Array(length).fill("");
    setValues(empty);
    refs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.row, { transform: [{ translateX: shakeAnimation }] }]}
      >
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={styles.inputContainer}>
            <TextInput
              ref={(r) => {
                refs.current[i] = r;
              }}
              value={values[i]}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.input,
                focusedIndex === i && styles.inputFocused,
                values[i] && styles.inputFilled,
              ]}
              returnKeyType="next"
              selectTextOnFocus
            />
            {focusedIndex === i && <View style={styles.focusIndicator} />}
          </View>
        ))}
      </Animated.View>

      {/* Timer Section */}
      <View style={styles.timerContainer}>
        {running ? (
          <View style={styles.timerBox}>
            <Text style={styles.timerIcon}>⏱️</Text>
            <Text style={styles.timerText}>
              Code expires in{" "}
              <Text style={styles.timerHighlight}>
                {formatTime(secondsLeft)}
              </Text>
            </Text>
          </View>
        ) : (
          <View style={styles.expiredBox}>
            <Text style={styles.expiredIcon}>⚠️</Text>
            <Text style={styles.expiredText}>Code expired</Text>
          </View>
        )}
      </View>

      {/* Resend Button */}
      <TouchableOpacity
        onPress={() => {
          if (onResend) {
            onResend();
            setSecondsLeft(countdown);
            setRunning(true);
            clearAll();
          }
        }}
        disabled={!onResend || running}
        style={[
          styles.resendButton,
          (!onResend || running) && styles.resendButtonDisabled,
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.resendText,
            (!onResend || running) && styles.resendTextDisabled,
          ]}
        >
          {running ? "Resend available soon" : "Resend Code"}
        </Text>
      </TouchableOpacity>

      {/* Clear Button */}
      {values.some((v) => v !== "") && (
        <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    width: 50,
    height: 60,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    color: "#1A1A1A",
  },
  inputFocused: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F2",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFilled: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F2",
  },
  focusIndicator: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B35",
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  timerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  timerText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
  },
  timerHighlight: {
    fontWeight: "700",
    color: "#1B5E20",
  },
  expiredBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EF5350",
  },
  expiredIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  expiredText: {
    fontSize: 14,
    color: "#C62828",
    fontWeight: "600",
  },
  resendButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  resendButtonDisabled: {
    backgroundColor: "#E0E0E0",
    shadowOpacity: 0,
  },
  resendText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  resendTextDisabled: {
    color: "#999999",
  },
  clearButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  clearText: {
    color: "#666666",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
