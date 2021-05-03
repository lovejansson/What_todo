import React, {useState} from "react";
import Icon from "react-native-vector-icons/AntDesign";

import {StyleSheet, Pressable, View,TouchableOpacity} from "react-native";

/*

Delete list -> först popup som ska bekräfta att användaren är säker -> 
sedan delete list + tasks och navigera tillbaka till listan av listor
Edit list -> navigera till popup edit list 
___________
Delete completed tasks -> deletar nuvarande tasks listan för alla som är lediga


*/ 

const styles = StyleSheet.create({

    menuIcon: {
      color: "#000",
      transform: [{rotate: "90deg"}],
      marginEnd: 16,
    },
 
  });

/**
 * @props children : <Menu/>
 * 
 */
export default function MenuRight({onPress}){

    return (
       
        <TouchableOpacity onPress={onPress}>
        <Icon
          name="ellipsis1"
          size={26}
          style={styles.menuIcon}
          color="#000"/>     
          </TouchableOpacity>
    )
}