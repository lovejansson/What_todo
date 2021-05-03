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
    flexDirection: "row",

    width: screen.width,

    backgroundColor: "blue",
  },
  list: {
    backgroundColor:"#fff",
    width: screen.width,
    
paddingVertical: 16,
    zIndex: 1,
  },

  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    marginHorizontal: 16,
  },
});

export default function ListItem({ item, onPress, onDelete }) {
  console.log(item);
  return (
 <Pressable style={styles.list} onPress={onPress}><Text>{item.name}</Text></Pressable>
  );
}
