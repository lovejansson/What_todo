import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import { DataContext } from "../data/DataContext";
import DateTimePicker from '@react-native-community/datetimepicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "green",

    justifyContent: "center",
    alignItems: "center",
  },

  inputDescription: {
    backgroundColor: "yellow",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    fontSize: 20,
    width: "90%",
  },
  inputIcon: {
    backgroundColor: "yellow",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 20,
    width: "90%",
  },
  inputIconText: {
    fontSize: 20,
  },
  button: {
    alignSelf: "flex-end",
    margin: 16,
  },
  buttonDismiss: {
    // backgroundColor: "red",
    // position: "absolute",
    // end: 24,
    // top: 32,
    // width: 32,
    // height: 32,
    // borderRadius: 50,
  },
  iconSave: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  iconDismiss: {
    color: "#000",
    transform: [{ rotate: "45 deg" }],

    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  buttonSave: {
    backgroundColor: "red",
    borderRadius: 50,
    marginTop: "auto",
  },
});

export default function NewTask({ navigation, route }) {
  const db = useContext(DataContext).db;
  const setTasks = useContext(DataContext).setTasks;
  const [dueDate, setDueDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [hasSetDueDate, setHasSetDueDate] = useState(false);
  const setLists = useContext(DataContext).setLists;

  console.log(route.params);
  console.log(show);
  async function saveTask() {
    console.log("save task")
    
    try{

      var newId = await db.insertTask(route.params.listId, description, hasSetDueDate? dueDate.getTime() : null);
    }catch(error){
      console.error(error);
    }

    console.log("new id " + newId);
    if(newId){
      console.log("updating old tasks")
      setLists((oldLists) => {

        return oldLists.map(list =>{

          if(list.id === route.params.listId){
            list.count += 1;
         
          }
          return list;
        })


      })
      setTasks((oldTasks) => [
        ...oldTasks,
        { description: description, id: newId, done: false, dueDate: hasSetDueDate? dueDate : null },
      ]);
    }else{

      console.error("New task not added");
    }

  
  }

  const [description, setDescription] = useState("");


  // function onChangeDueDate(_, newDate){
    

  //   if(!hasSetDueDate){
  //     setHasSetDueDate(true);
  //   }
    
  //   console.log(newDate);

  //   const currentDate = newDate || dueDate;

  //   setDueDate(currentDate);
  //   console.log("set show to false")
  //   setShow(false);
  // }

  // function showDateTimePicker(mode){
  
  //   setMode(mode)
  //   setShow(true);
  // }

  // function showTimePicker(){
  //   console.log("show Time picker")
  //   showDateTimePicker("time");
  // }

  // function showDatePicker(){
  //   console.log("show Time picker")
  //   showDateTimePicker("date");
  // }

  // function toTimeString(date){

  //   return date.toLocaleTimeString().slice(0, 5);
  // }




  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon
          style={styles.iconDismiss}
          name="plus"
          size={36}
          color="#000"
        />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputDescription}
          placeholder="What todo..."
          keyboardType="ascii-capable"
          
          onChangeText={(value) => {
            setDescription(value);
          }}
        />
{/* 
        <TouchableOpacity style={styles.inputDescription} onPress={showDatePicker}>

          <Text>{ hasSetDueDate ? dueDate.toDateString() : "Due date not set"}</Text>

        </TouchableOpacity>

        {hasSetDueDate  && (
                <TouchableOpacity style={styles.inputDescription} onPress={showTimePicker}>


                <Text>{toTimeString(dueDate)}</Text>
      
              </TouchableOpacity>
      )} */}
    
      </View>

      <TouchableOpacity
        style={[styles.button, styles.buttonSave]}
        onPress={async() => {
          console.log("onpress")
           saveTask();
          navigation.goBack();
        }}
      >
        <Icon
          style={styles.iconSave}
          name="check"
          size={32}
          color="black"
        />
      </TouchableOpacity>
      {show  && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode={mode}
          is24Hour={true}
          display="spinner"
          onChange={onChangeDueDate}
        />
      )}
    </View>
  );
}
