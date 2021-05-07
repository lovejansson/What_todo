import React from "react";
import {View, Text, StyleSheet} from "react-native";
import Emoji from "react-native-emoji";

const styles= StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        marginStart: -8,
        backgroundColor: "#fff",
    
        
    },

    emoji: {
        fontSize: 28,
        marginEnd: 8,
    },

    title:{
        fontSize: 20,
        color: "#000",
        fontWeight: "bold"
    }
})

export default function ListHeaderTitle(props){

    console.log(props);


    return(
        <View style={styles.container}>

            <Emoji name={props.emoji} style={styles.emoji}/>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    )
}