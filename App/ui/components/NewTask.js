import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { DataContext } from "../../contexts/Data";
import { ColorThemeContext } from "../../contexts/ColorTheme";

const window = Dimensions.get("window")

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginStart: 16,
    
  },
  input: {
    fontSize: 18,
    flex: 1,
    padding: 16,
    marginEnd: 32,
    borderBottomWidth: 0.75,
    borderColor: "#c8c8c8"
   
   
  },

  icon: {
   
  },
  button:{
    justifyContent: "center",
    padding: 10,
    transform: [{translateX: -5}, {translateY: -5}],
  },

  buttonContainer: {
    backgroundColor: "#123c6b",
    transform: [{translateX: -5}, {translateY: 6}],
    marginEnd: 8,
    
  }
});


export default function NewTask({ list }) {
  const db = useContext(DataContext).db;
  const insertTask = useContext(DataContext).insertTask;
  const setTasks = useContext(DataContext).setTasks;
  const [dueDate, setDueDate] = useState(new Date());
  const [hasSetDueDate, setHasSetDueDate] = useState(false);
  const setLists = useContext(DataContext).setLists;

  const colors = useContext(ColorThemeContext).colors;
  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  const inputStyle= [styles.input, {backgroundColor: colors.background, color: colors.text}];
  const buttonStyle = [styles.button, {backgroundColor: colors.mainButton}];
  const iconStyle = [styles.icon, {color: colors.icon}];

  const [description, setDescription] = useState("");


  async function saveTask() {

    insertTask(list, description);
    dismissKeyboard();
    setDescription("");

    // if(description !== ""){
    //   try{

    //     var newId = await db.insertTask(list.id, description, hasSetDueDate? dueDate.getTime() : null);
    //   }catch(error){
    //     console.error(error);
    //   }
  
    //   if(newId){
    //     setLists((oldLists) => {
  
    //       return oldLists.map(list =>{
  
    //         if(list.id === list.id){
    //           list.count += 1;
           
    //         }
    //         return list;
    //       })
  
  
    //     })
    //     setTasks((oldTasks) => [
    //       ...oldTasks,
    //       { description: description, id: newId, done: false, dueDate: hasSetDueDate? dueDate : null },
    //     ]);
  

    //   }else{
  
    //     console.error("New task not added");
    //   }
    // } 
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
          placeholderTextColor="#c8c8c8"
          selectionColor={colors.text}
          multiline={true}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
          }}
        />
        <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={saveTask}>
        <Icon
          style={iconStyle}
          name="check"
          size={32}
          color="black"
        />
      </TouchableOpacity>
      </View>
      </View>
  );
}
