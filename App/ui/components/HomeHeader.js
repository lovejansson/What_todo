import React, {useContext} from "react";
import {View, Text, StyleSheet, Dimensions, Image} from "react-native";
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
        marginStart: 4,
      
    },

    title: {
       fontSize: 32,
       marginStart: 16,
       marginEnd: 8,
       fontFamily: "Lateef-Regular"
       
    },
    emoji: {
       width: 52,
       height: 52
    },
});

export default function ListHeader(props){
    const colors = useContext(ColorThemeContext).colors;
    const titleStyle = [styles.title, {color: colors.heading}]

    return(
        <View style={styles.container}> 
            <View style={styles.titleContainer}>
            <Text style={titleStyle}>What todo</Text>
                   {/* <Image source={require("../../images/ShrugF_1.png")} style={styles.emoji}/> */}
                   </View>
            <HeaderActionRight onPress={props.actionRight}/>
        </View>
    )
}