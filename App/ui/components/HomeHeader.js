import React, {useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import HeaderActionRight from "./HeaderActionRight";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import Emoji from "react-native-emoji";

const window = Dimensions.get("window");

const styles= StyleSheet.create({

    container: {
        width:window.width ,
        height: 75,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    titleContainer:{
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
       fontSize: 32,
       
       marginStart: 16,
       marginEnd: 8,
       fontFamily: "Lateef-Regular"
       
    },
    emoji: {

        fontSize: 24,

    },
});

export default function ListHeader(props){
    const colors = useContext(ColorThemeContext).colors;
    
    const titleStyle = [styles.title, {color: colors.heading}]


    return(
        <View style={styles.container}> 
 

            <View style={styles.titleContainer}>
            <Text style={titleStyle}>What todo</Text>
                   <Emoji name="shrug" style={styles.emoji}/>
                   </View>
            <HeaderActionRight onPress={props.actionRight}/>
        </View>
    )
}