import React from "react";
import Icon from "react-native-vector-icons/AntDesign";

import {StyleSheet, TouchableOpacity, FlatList} from "react-native";
import MenuItem from "./MenuItem";

/*

Delete list -> först popup som ska bekräfta att användaren är säker -> 
sedan delete list + tasks och navigera tillbaka till listan av listor
Edit list -> navigera till popup edit list 
___________
Delete completed tasks -> deletar nuvarande tasks listan för alla som är lediga

By using navigation.setOptions inside the screen component, we get access to screen's props, state, context etc.


menu object: [{title, icon, action}, ]

*/ 

// const styles = StyleSheet.create({

//     menuIcon: {
//       color: "#000",
//       transform: [{rotate: "90deg"}],
//       marginEnd: 16,
//     }
//   });

/**
 * @props items :
 * Array<{icon: AntDesign 'name' attribute, title: description of item, action: Function to execute when selected }>
 */
export default function Menu({items}){

    console.log(items)

    function renderItem({item}){
        return(
            <MenuItem content={item}/>
        )
    }

    return (
        <FlatList data={items} keyExtractor={(item) => item.title}  
        renderItem={renderItem}/>)
}