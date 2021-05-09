import React, { useContext } from "react";
import {StyleSheet, FlatList, View} from "react-native";
import MenuItem from "./MenuItem";
import {ColorThemeContext} from "../../contexts/ColorTheme";

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

    const containerStyle = [styles.container, {backgroundColor: colors.background3}];

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