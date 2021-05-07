import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
  Keyboard
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { DataContext } from "../../../contexts/Data";
import { ColorThemeContext } from "../../../contexts/ColorTheme";
import DateTimePicker from '@react-native-community/datetimepicker';

const window = Dimensions.get("window")

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start",
  },

  label: {
    fontSize: 20,
    fontWeight: "bold",
  },

  input: {
    fontSize: 20,
    width: window.width - 32,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },

  icon: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  buttonSave: {
    position: "absolute",
    end: 24,
    bottom: 24,
    borderRadius: 50,
  },

  buttonClose: {
    alignSelf: "flex-end",
    marginVertical: 16,
  }


});


export default function NewTask({ navigation, route }) {
  const db = useContext(DataContext).db;
  const setTasks = useContext(DataContext).setTasks;
  const [dueDate, setDueDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [hasSetDueDate, setHasSetDueDate] = useState(false);
  const setLists = useContext(DataContext).setLists;

  const colors = useContext(ColorThemeContext).colors;
  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  const inputStyle= [styles.input, {backgroundColor: colors.background2, color: colors.text}];
  const buttonSaveStyle = [styles.buttonSave, {backgroundColor: colors.mainButton}];
  const buttonCloseStyle = [styles.buttonClose, {color: colors.textButton}];
  const iconStyle = [styles.icon, {color: colors.icon}];
  const labelStyle = [styles.label, {color: colors.text}];

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

  function dismissKeyboard(){
    Keyboard.dismiss();
  }



  return (
    <Pressable style={containerStyle} onPress={dismissKeyboard}>
      <TouchableOpacity
        style={buttonCloseStyle}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon
          style={iconStyle}
          name="close"
          size={36}
        />
      </TouchableOpacity>
      <View >
        <TextInput
          // style={inputStyle}
          style={inputStyle}
          placeholder="What todo..."
          keyboardType="ascii-capable"
          placeholderTextColor={colors.text}
          selectionColor={colors.text}
          multiline={true}
          
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
        style={buttonSaveStyle}
        onPress={async() => {
          console.log("onpress")
           saveTask();
          navigation.goBack();
        }}
      >
        <Icon
          style={iconStyle}
          name="check"
          size={32}
          color="black"
        />
      </TouchableOpacity>
      {/* {show  && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode={mode}
          is24Hour={true}
          display="spinner"
          onChange={onChangeDueDate}
        />
      )} */}
    </Pressable>
  );
}
