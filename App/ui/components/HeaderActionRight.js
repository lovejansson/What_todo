import React, {useContext} from "react";
import Icon from "react-native-vector-icons/AntDesign";

import {StyleSheet, TouchableOpacity} from "react-native";

import {ColorThemeContext} from "../../contexts/ColorTheme";


const styles = StyleSheet.create({

    menuIcon: {
      transform: [{rotate: "90deg"}],
      marginEnd: 12,
      alignSelf: "flex-end",
      marginStart : "auto",
    },
 
  });

/**
 * @props onPress : action for button
 * 
 */
export default function HeaderActionRight({onPress}){
  const colors = useContext(ColorThemeContext).colors;

  const iconStyle = [styles.menuIcon, {color: colors.icon}];

  return (
      <TouchableOpacity onPress={onPress}>
      <Icon
        name="ellipsis1"
        size={28}
        style={iconStyle}/>     
        </TouchableOpacity>
  )
}