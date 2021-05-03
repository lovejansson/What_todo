import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: screen.width,
    height: screen.height,
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#000",
    color: "#fff",
    width: screen.width * 0.75,
    height: screen.width * 0.75,
    alignSelf: "center",
  },
});

export default function Icons({ dismiss, setChosenIcon }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        dismiss();
      }}
    >
      <Text
        style={styles.content}
        onPress={() => {
          setChosenIcon("new icon");
          dismiss();
        }}
      >
        Icons
      </Text>
    </Pressable>
  );
}
