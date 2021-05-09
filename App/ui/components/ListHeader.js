import React, {useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Emoji from "react-native-emoji";
import Icon from "react-native-vector-icons/AntDesign";
import HeaderActionRight from "./HeaderActionRight";
import {ColorThemeContext} from "../../contexts/ColorTheme";

const styles= StyleSheet.create({

    container: {
        width: "100%",
        height: 75,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerTitle: {
        flexDirection:"row",
        alignItems: "center",
        flex: 1,
        marginStart: 24,
    },

    emoji: {
        fontSize: 28,
        marginEnd: 8,
    },

    name:{
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold"
    },

    icon: {
        color: "#fff",
        marginStart: 16,   
    }
});

export default function ListHeader(props){

    const colors = useContext(ColorThemeContext).colors;

    const containerStyle = [styles.container, {backgroundColor: colors.background}];

    function navigateBack(){
        props.navigation.goBack();
    }

    return(
        <View style={containerStyle}> 

            <TouchableOpacity onPress={navigateBack}> 
                <Icon style={styles.icon} name="arrowleft" size={28} />
            </TouchableOpacity>

            <View style={styles.headerTitle}>
                <Emoji name={props.emoji} style={styles.emoji}/>
                <Text style={styles.name}>{props.name}</Text>
            </View>

            <HeaderActionRight onPress={props.actionRight}/>
        </View>
    )
}