import React from "react";
import { View, Text, StyleSheet, Dimensions, ImageBackground, TouchableOpacity} from "react-native";

const window = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {

        position: "absolute",
        top: window.height / 3,
        left: window.width / 2,
        width: 240,
        transform: [{translateX: -120}],
        backgroundColor: "#404040",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16
    },

    title: {
        fontSize: 20,
        color: "#fff",
        marginBottom: 8,
        fontWeight: "bold"
    },
    
    message: {
        color: "#ccc",
        fontSize: 16,
        
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        color: "#fff",
        fontWeight: "bold",
        paddingHorizontal: 8,
        marginTop: 16,
        fontSize: 18,
        textTransform: "uppercase"
    }
})

export default function ConfirmationDialog({title, message, actionOk, actionCancel}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={actionOk}>
                    <Text style={styles.button}>Ok</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={actionCancel}>
                    <Text style={styles.button}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View> 
    )
}