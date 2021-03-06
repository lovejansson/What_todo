import React, {useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Emoji from "react-native-emoji";
import Icon from "react-native-vector-icons/AntDesign";
import HeaderActionRight from "./HeaderActionRight";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import { DataContext } from "../../contexts/Data";

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
        justifyContent: "center",
        flex: 1,      
    },
    emoji: {
        fontSize: 28,
    },
    name:{
        fontSize: 32,
        color: "#fff",
        fontFamily: "Lateef-Regular",
        marginEnd: 8
    },
    icon: {
        color: "#fff",
        marginStart: 16,   
    }
});

export default function ListHeader({navigation, actionRight}){

    const colors = useContext(ColorThemeContext).colors;
    const currentList = useContext(DataContext).currentList;

    const containerStyle = [styles.container, {backgroundColor: colors.background}];
    const iconStyle = [styles.icon, {color: colors.icon}];
    const nameStyle = [styles.name, {color: colors.text}]

    function navigateBack(){
        navigation.goBack();
    }

    return(
        <View style={containerStyle}> 
            <TouchableOpacity onPress={navigateBack}> 
                <Icon style={iconStyle} name="arrowleft" size={28} />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
                <Text style={nameStyle}>{currentList.name}</Text>
                <Emoji name={currentList.icon} style={styles.emoji}/>
            </View>
            <HeaderActionRight onPress={actionRight}/>
        </View>
    )
}