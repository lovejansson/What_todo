import React, { useState, useRef } from "react";

import Animated from "react-native-reanimated";

import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
} from "react-native";


const screen = Dimensions.get("window");

const styles = StyleSheet.create({



  container: {

    backgroundColor:"#fff",
    width: screen.width / 2 - 36,
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 24,
   
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4
  },

  count: {
    fontSize: 16,
    fontStyle: "italic"
  },

  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    marginHorizontal: 16,
  },
});

export default function ListItem({ item, onPress, onDelete }) {
  return (
   
 <Pressable style={styles.container} onPress={onPress}>
   <Text style={styles.name}>{item.name}</Text>
   <Text style={styles.count}>{item.count} Tasks</Text>
  </Pressable>

  );
}
