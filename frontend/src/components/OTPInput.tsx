import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    if (!/^\d*$/.test(text)) return;
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

  const clearAll = () => {
    const empty = Array(length).fill("");
    setValues(empty);
    refs.current[0]?.focus();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              refs.current[i] = r;
            }}
            value={values[i]}
            onChangeText={(t) => handleChange(t, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            returnKeyType="next"
          />
        ))}
      </View>

      <Text style={{ marginTop: 10 }}>
        {running
          ? `Expires in ${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60)
              .toString()
              .padStart(2, "0")}`
          : "Code expired"}
      </Text>

      <TouchableOpacity
        onPress={() => {
          if (onResend) {
            onResend();
            setSecondsLeft(countdown);
            setRunning(true);
            clearAll();
          }
        }}
        style={{ marginTop: 10 }}
      >
        <Text style={{ color: onResend ? "#007bff" : "#999" }}>
          Resend Code
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 45,
    height: 55,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
