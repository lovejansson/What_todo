import React, { useContext } from "react";
import {StyleSheet, TouchableOpacity, FlatList, View} from "react-native";
import MenuItem from "./MenuItem";
import {ColorThemeContext} from "../../contexts/ColorTheme";

/*

Delete list -> först popup som ska bekräfta att användaren är säker -> 
sedan delete list + tasks och navigera tillbaka till listan av listor
Edit list -> navigera till popup edit list 
___________
Delete completed tasks -> deletar nuvarande tasks listan för alla som är lediga

By using navigation.setOptions inside the screen component, we get access to screen's props, state, context etc.


menu object: [{title, icon, action}, ]

*/ 

const styles = StyleSheet.create({

    container: {
        position: "absolute",
        right: 4,
        top: 4,
        borderColor: "#000",
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderEndWidth: 2,
    
    }
  });



/**
 * @props items :
 * Array<{icon: AntDesign 'name' attribute, title: description of item, action: Function to execute when selected }>
 */
export default function Menu({items}){

    const colors = useContext(ColorThemeContext).colors;

    const containerStyle = [styles.container, {backgroundColor: colors.background2}];

    function renderItem({item}){
        return(
            <MenuItem content={item}/>
        )
    }

    return (
        <View  style={containerStyle}>
        <FlatList data={items} keyExtractor={(item) => item.title}  
        renderItem={renderItem}/>
        </View>
        )
}