import React, {useContext} from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground, TouchableOpacity} from "react-native";
import {ColorThemeContext} from "../../../contexts/ColorTheme";

const window = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: window.height / 3,
        left: window.width / 2,
        width: 240,
        transform: [{translateX: -120}],
        paddingVertical: 16,
        paddingHorizontal: 24,
       
        borderColor: "#000",
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderEndWidth: 2,
    },

    title: {
        fontSize: 20,
        marginBottom: 8,
        fontWeight: "bold"
    },
    
    message: {
        fontSize: 16,   
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        fontWeight: "bold",
        paddingHorizontal: 8,
        marginTop: 16,
        fontSize: 18,
        textTransform: "uppercase"
    }
})

export default function ConfirmationDialog({title, message, actionOk, actionCancel}){
    const colors = useContext(ColorThemeContext).colors;
    const titleStyle = [styles.title, {color: colors.heading}];
    const messageStyle = [styles.message, {color: colors.text}];
    const buttonStyle = [styles.button, {color: colors.buttonText}];
    const containerStyle = [styles.container, {backgroundColor: colors.background2}];

    return(
        <View style={containerStyle}>
            <Text style={titleStyle}>{title}</Text>
            <Text style={messageStyle}>{message}</Text>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={actionOk}>
                    <Text style={buttonStyle}>Ok</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={actionCancel}>
                    <Text style={buttonStyle}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View> 
    )
}