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
    
      color: "#fff",
      transform: [{rotate: "90deg"}],
      marginEnd: 8,
      alignSelf: "flex-end",
      marginStart : "auto",
    },
 
  });

/**
 * @props children : <Menu/>
 * 
 */
export default function HeaderActionRight({onPress}){

    return (
       
        <TouchableOpacity onPress={onPress}>
        <Icon
          name="ellipsis1"
          size={28}
          style={styles.menuIcon}/>     
          </TouchableOpacity>
    )
}