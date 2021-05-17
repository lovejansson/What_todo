import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableOpacity
} from "react-native";

import { DataContext } from "../../contexts/Data";

import { ColorThemeContext } from "../../contexts/ColorTheme";

import { NotificationContext } from "../../contexts/Notification";

import FloatingActionButton from "./FloatingActionButton";

import Icon from "react-native-vector-icons/AntDesign"



const window = Dimensions.get("window")

const styles = StyleSheet.create({

  container: {
    padding: 24,
    flex: 1,
  },
  input: {
    fontSize: 18,

    padding: 12,
  
    marginEnd: 32,

  },

  
    buttonClose: {
      alignSelf: "flex-end",
      marginVertical: 16,
    },
  

  fab: {
    alignSelf: "flex-end",
    marginTop: "auto"
  }

});


export default function AddTodos({navigation}) {


  const colors = useContext(ColorThemeContext).colors;
  const notify = useContext(NotificationContext).notify;
  const Status = useContext(NotificationContext).Status;

  const db  = useContext(DataContext).db;
  const currentList = useContext(DataContext).currentList;
  const setLists = useContext(DataContext).setLists;
  const setTasks = useContext(DataContext).setTasks;
  

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
    const inputStyle= [styles.input, {backgroundColor: colors.background, color: colors.text, borderColor: colors.text2}];
    const buttonCloseStyle = [styles.buttonClose, {color: colors.text}]

  const [todos, setTodos] = useState("");
  const [btnIcon, setBtnIcon] = useState("plus");

  async function onSave() {
    dismissKeyboard();
    navigation.goBack();

    insertTask(currentList, todos);
   
  }

  async function insertTask(list, todos) {

    if(todos === ""){
      return;
    }else{
        var todosList = todos.split("\n");
        var insertedIds = [];
        if(todosList[todosList.length - 1] === ""){
          todosList.pop();
        }
        try{

          let insertedId;

          insertedIds = await Promise.all(todosList.map(async (todo)=>{
            console.log("for each")
            insertedId = await db.insertTask(list.id,todo, null);
            console.log(insertedId);
            return insertedId;

          }));



  
      
        }catch(error){

          console.log(error)
          notify("Failed to add todos", Status.ERROR);
        }


    
        if(insertedIds.length === todosList.length){

       
          setLists(oldLists => {
    
            return oldLists.map(l =>{
  
              l.count = l.id === list.id ? l.count += insertedIds.length : l.count;
              return l;
  
            });
          });

          setTasks(oldTasks => {
            let newTasks = oldTasks;
            todosList.forEach((todo, index) => {
              newTasks.push({description: todo, id: insertedIds[index],
              dueDate: null,done: false});
            });

            return newTasks;
          })
  
         
        }else{
         
            notify("Failed to add todos", Status.ERROR);
        
        }
      } 
    }

  function dismissKeyboard(){
    Keyboard.dismiss();
  }

  return (
      <View style={containerStyle}>


        
      <TouchableOpacity
      style={buttonCloseStyle}
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon style={{color: colors.text}} name="close" size={32}></Icon>
      </TouchableOpacity>
        
    <TextInput
    
      style={inputStyle}
      placeholder="Type your todos, 1 per entry per line ..."
      keyboardType="ascii-capable"
      placeholderTextColor={colors.text2}
      selectionColor={colors.text}
      multiline={true}
     
      onChangeText={(value)=>{
        setTodos(value)
      }}
     
    />

    <FloatingActionButton style={styles.fab} action={onSave} icon="check"/>

  </View> )
}
