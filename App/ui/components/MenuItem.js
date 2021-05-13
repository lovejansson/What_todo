import React, {useContext} from "react";
import Icon from "react-native-vector-icons/AntDesign";

import {StyleSheet, TouchableOpacity, Text} from "react-native";

import {ColorThemeContext} from "../../contexts/ColorTheme";

/*

Delete list -> först popup som ska bekräfta att användaren är säker -> 
sedan delete list + tasks och navigera tillbaka till listan av listor
Edit list -> navigera till popup edit list 
___________
Delete completed tasks -> deletar nuvarande tasks listan för alla som är lediga

*/ 

const styles = StyleSheet.create({

    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    icon:{
      marginEnd: 16,
    },
    text: {
      fontSize: 18,
      fontFamily: "Mukta-Regular",
    }
  });

/**
 * @props content :
 * {icon: AntDesign 'name' attribute, title: description of item, action: Function to execute when selected }
 */
export default function MenuItem({content}){
  const colors = useContext(ColorThemeContext).colors;
  const iconStyle = [styles.icon, {color: colors.icon}];
  const textStyle = [styles.text, {color: colors.text}];

    return (
        <TouchableOpacity style={styles.container} onPress={content.action}>
          <Icon name={content.icon} size={20} style={iconStyle} />
          <Text style={textStyle}>{content.title}</Text>
          </TouchableOpacity>)
}