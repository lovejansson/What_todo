import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
} from "react-native";

import { DataContext } from "../../contexts/Data";

import { ColorThemeContext } from "../../contexts/ColorTheme";

import {NotificationContext } from "../../contexts/Notification";

import FloatingActionButton from "./FloatingActionButton";

const window = Dimensions.get("window")

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    
  },
  input: {
    fontSize: 18,
    flex: 1,
    padding: 16,
  
    marginEnd: 32,
    borderBottomWidth: 0.75,
  },

});


export default function NewTask() {

  const colors = useContext(ColorThemeContext).colors;
  const notify = useContext(NotificationContext).notify;
  const Status = useContext(NotificationContext).Status;

  const db  = useContext(DataContext).db;
  const currentList = useContext(DataContext).currentList;
  const setLists = useContext(DataContext).setLists;
  const setTasks = useContext(DataContext).setTasks;

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  const inputStyle= [styles.input, {backgroundColor: colors.background, color: colors.text, borderColor: colors.text2}];

  const [description, setDescription] = useState("");

  async function onSave() {
    dismissKeyboard();
    setDescription("");
    insertTask(currentList, description);
   
  }

  async function insertTask(list, description) {

    if(description === ""){
      return;
    }else{
        try{
  
          var insertedId = await db.insertTask(list.id, description, null);
  
        }catch(error){

          notify("Failed to add new task", Status.ERROR);
        }
    
        if(insertedId){
  
          // increase count in list
  
          setLists(oldLists => {
    
            return oldLists.map(l =>{
  
              l.count = l.id === list.id ? ++l.count : l.count;
              return l;
  
            });
          });
  
          // add to current tasks
  
          setTasks((oldTasks) => [
            ...oldTasks,
            { description: description, id: insertedId, done: false, dueDate: null },
          ]);
  
        }else{
         
            notify("Failed to add new task", Status.ERROR);
        
        }
      } 
    }

  function dismissKeyboard(){
    Keyboard.dismiss();
  }

  return (

      <View style={containerStyle}>
        
        <TextInput
          style={inputStyle}
          placeholder="What todo..."
          keyboardType="ascii-capable"
          placeholderTextColor={colors.text2}
          selectionColor={colors.text}
          multiline={true}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
          }}
        />

        <FloatingActionButton action={onSave} icon="check"/>

      </View>
  );
}
