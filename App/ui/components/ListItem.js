import React, { useContext, useEffect } from "react";

import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";

import Emoji from 'react-native-emoji';

import {ColorThemeContext} from "../../contexts/ColorTheme";

const window = Dimensions.get("window");



const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal:16,
    flexDirection: "row",
    alignItems: "stretch",

    
   
  },
  name: {
    fontSize: 19,
    fontFamily: "Mukta-Bold",
  },

  count: {
    fontSize: 17,
    fontFamily: "Mukta-Regular",
    
  },

  emoji:{
    fontSize: 32,
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

  const containerStyle = [styles.container, {backgroundColor: "red"}];
  const nameStyle = [styles.name, {color: colors.text}];
  const countStyle = [styles.count, {color: colors.text2}];
  useEffect(()=>{

    console.log("list item")
  
  }, [])

  return (
      <TouchableOpacity style={containerStyle} onPress={onPress}>
        <Emoji style={styles.emoji} name={item.icon}/>

        <View style={styles.info}>
          <Text style={nameStyle}>{item.name}</Text>
          <Text style={countStyle}>{item.count} Things</Text>
        </View>
      </TouchableOpacity>
  );
}
