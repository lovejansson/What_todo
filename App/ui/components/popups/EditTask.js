import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Keyboard,
  Pressable
} from "react-native";

import { DataContext } from "../../../contexts/Data";
import { ColorThemeContext } from "../../../contexts/ColorTheme";

import Icon from "react-native-vector-icons/AntDesign";

const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    justifyContent: "flex-start",

  },

});

export default function EditTask(props) {
  const colors = useContext(ColorThemeContext).colors;
  const db = useContext(DataContext).db;
  

  async function updateTaskDone(newValue){

    setTaskDone(newValue);

    try{

      var res = await db.updateTaskDone(item.id, newValue);

    }catch(error){
      console.error(error);
    }
    if(!res){
      console.error("updateTaskDone: task not updated");
    }else{
      onUpdateDone(newValue);

    }

  }

  function dismissKeyboard(){
    Keyboard.dismiss();
  }

  return (
      <View style={styles.container}>
        

    </View>
  );
}