import React, { useState, useRef } from "react";

import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
} from "react-native";

import Emoji from 'react-native-emoji';



const screen = Dimensions.get("window");

const styles = StyleSheet.create({



  container: {

    backgroundColor:"#fff",
    width: screen.width / 2 - 16,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal:8,
    flexDirection: "row",
    alignItems: "center"
   
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

  emoji:{
    fontSize: 40,
    marginEnd: 8,
  },

  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    
  },
});

export default function ListItem({ item, onPress, onDelete }) {
  return (
   
 <Pressable style={styles.container} onPress={onPress}>
   <Emoji style={styles.emoji} name={item.icon}/>
   <View style={styles.info}>
   <Text style={styles.name}>{item.name}</Text>
   <Text style={styles.count}>{item.count} Tasks</Text>
   </View>
  </Pressable>

  );
}
