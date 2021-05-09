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

  async function deleteTask(task){
 
    let deleted;

    try{
       deleted = await db.deleteTask(task.id);
    }catch(error){

        console.log(error);
    }

    if(deleted){
        setTasks(oldTasks => {

            return oldTasks.filter(t => { return t.id != task.id})
        });
    }
  }

  function dismissKeyboard(){
    Keyboard.dismiss();
  }

  return (
      <View style={styles.container}>
      <TouchableOpacity
      style={buttonDeleteStyle}
        onPress={deleteTask}>
        <Icon style={iconStyle} name="delete" size={32}></Icon>
      </TouchableOpacity>
      <View>
      <CheckBox  tintColors={checkBoxColors} style={styles.checkbox} value={taskDone} 
                onValueChange={updateTaskDone}/>
        <TextInput
          style={inputStyle}
          value = {chosenListName}
          placeholder="Name"
          placeholderTextColor={colors.text}
          selectionColor={colors.text}
          keyboardType="ascii-capable"
          onChangeText={(value) => {
            setChosenListName(value);
          }}
        />
        </View>
        <TouchableOpacity
        style={buttonStyleSave}
        onPress={saveTask}>
        <Icon
          style={iconStyle}
          name="check"
          size={32}
          color="black"
        />
      </TouchableOpacity>
        
    </View>
  );
}