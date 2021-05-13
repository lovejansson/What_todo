
import React,{useContext, useState, useEffect} from "react";
import {View, Text, StyleSheet, StatusBar} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


import {ColorThemeContext}from "../../contexts/ColorTheme";

import Select from "../components/Select";

import SettingsHeader from "../components/SettingsHeader"
import { notify, Status } from "../../contexts/Notification";


const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    },
    label: {
        padding: 16,
        fontSize: 20,
        fontWeight:"bold"

    },

    setting: {
        padding: 16,
        flexDirection: "row",
    },

    
})

// tema, backup data About (policies feedback rate/review)


export default function Settings({navigation}){
    const colors = useContext(ColorThemeContext).colors;
    const theme = useContext(ColorThemeContext).theme;
    const setTheme = useContext(ColorThemeContext).setTheme;
    const labelStyle = [styles.label, {color: colors.heading}];
   
    const containerStyle = [styles.container, {backgroundColor: colors.background}]

    const items =  [{label: "Black", value: "black"}, {label: "Grey", value: "grey"},
    {label: "White", value: "white"}];

  async function updateTheme(value){

        try{
            await AsyncStorage.setItem("theme", value);
        }catch(error) {

            notify("could not update theme", Status.ERROR);
        }

        setTheme(value);
    }

    return(<View style={containerStyle}>
        
        <StatusBar backgroundColor={colors.background}  barStyle={theme === "white" ? "dark-content" :  "light-content"}/>
      <SettingsHeader navigation={navigation}/> 

    <View style={styles.setting}>
        <Text style={labelStyle}>Theme</Text>
        <Select
        items={items}
        onChange={updateTheme}
        initialValue={theme}
      
        />
        
    </View>
    </View>)
}

