import React from "react";
import Icon from "react-native-vector-icons/AntDesign";

import {StyleSheet, TouchableOpacity, Text} from "react-native";

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
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    icon:{
      marginEnd: 16,
      color: "#fff"
    },
    text: {
      fontSize: 20,
      color: "#fff"
    }
  });

/**
 * @props content :
 * {icon: AntDesign 'name' attribute, title: description of item, action: Function to execute when selected }
 */
export default function MenuItem({content}){

    return (
        <TouchableOpacity style={styles.container} onPress={content.action}>
          <Icon name={content.icon} size={20} style={styles.icon} />
          <Text style={styles.text}>{content.title}</Text>
          </TouchableOpacity>)
}