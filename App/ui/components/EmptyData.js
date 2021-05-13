import React, { useContext } from "react";
import {View, Text, StyleSheet, Dimensions } from "react-native";
import {ColorThemeContext} from "../../contexts/ColorTheme";

const window = Dimensions.get("window");

const styles = StyleSheet.create({

    container: {
        alignSelf: "center",
        alignItems: "center",
        flex: 1,
        marginTop: window.width / 2,
    },

    text: {
        fontFamily: "Mukta-Regular",
        fontSize: 24,
    },
});

export default function EmptyData({info}){
    const colors = useContext(ColorThemeContext).colors;

    const textStyle = [styles.text, {color: colors.text3}];

    return(
    <View style={styles.container}>
        <Text style={textStyle}>¯\_(ツ)_/¯</Text>
        <Text style={textStyle}>{info}</Text>
    </View>)
}