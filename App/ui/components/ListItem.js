import React, { useContext } from "react";

import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  ImageBackground
} from "react-native";

import Emoji from 'react-native-emoji';

import {ColorThemeContext} from "../../contexts/ColorTheme";



const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {

    backgroundColor:"#121212",
    paddingVertical: 16,
    paddingHorizontal:16,
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
    fontSize: 48,
    marginEnd: 24,
  },

  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    
  },
});

export default function ListItem({ item, onPress }) {
  const colors = useContext(ColorThemeContext).colors;

  const nameStyle = [styles.name, {color: colors.text}];
  const countStyle = [styles.count, {color: colors.text2}];

  return (
      <Pressable style={styles.container} onPress={onPress}>
        <Emoji style={styles.emoji} name={item.icon}/>

        <View style={styles.info}>
          <Text style={nameStyle}>{item.name}</Text>
          <Text style={countStyle}>{item.count} Tasks</Text>
        </View>
      </Pressable>
  );
}
