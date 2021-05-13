import React, { useContext } from "react";
import {StyleSheet, FlatList, View} from "react-native";
import MenuItem from "./MenuItem";
import {ColorThemeContext} from "../../contexts/ColorTheme";

const styles = StyleSheet.create({

    container: {
        position: "absolute",
        right: 4,
        top: 4,
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderEndWidth: 3,
        borderTopWidth: 0.5,
        borderStartWidth: 0.5,
    
    }
  });



/**
 * @props items :
 * Array<{icon: AntDesign 'name' attribute, title: description of item, action: Function to execute when selected }>
 */
export default function Menu({items}){

    const colors = useContext(ColorThemeContext).colors;

    const containerStyle = [styles.container, {backgroundColor: colors.backgroundMenu, borderColor: colors.borderMenu}];
    

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