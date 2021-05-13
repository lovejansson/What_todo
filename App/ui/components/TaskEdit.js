import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  View,
  TextInput,
  Keyboard
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import { NotificationContext } from "../../contexts/Notification";
import { useEffect } from "react/cjs/react.development";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",

    height: 90,
    width: screen.width,
    paddingStart: 24,
    paddingEnd: 16,

  },

  input: {
    fontSize: 18,
    fontFamily: "Mukta-Regular",
    flex: 1,
  },

  icon: {
    padding: 8,
  }
  
  
});

/*

swipe to delete - done

lägga till ny task - done

markera som klar -> stryks  över bock/fyrkant att kryssa i -> done

meny för att radera alla delete list / edit list / delete completed tasks / delete all tasks -> klar 

hemsida med overview över de listor som finns + ikoner för att göra nya listor-> done

bakgrundsbild -> done

themes -> done 

göra bättre kod angående uppdatera data -> done

ändra teman via settings och spara nångstans -> done

klicka på task för att ändra beskrivning  -> i morgon

anpassa rutig bakgrund efter skärmar/färger 

testa komponenter -> nästa vecka 

drag and drop för att ordna

huvud meny på hemskärm: backup data, settings, send feedback

setting screen : theme sync data språk?

*/

export default function TaskEdit({task, closeEditMode}){

    const db = useContext(DataContext).db;
    const setTasks = useContext(DataContext).setTasks;

    const colors = useContext(ColorThemeContext).colors;

    const Status = useContext(NotificationContext).Status;
    const notify = useContext(NotificationContext).notify;

    const iconStyle = [styles.icon, {color: colors.text}];
    const inputStyle = [styles.input, {color: colors.text, backgroundColor: "red"}];

   const [newDescription, setNewDescription] = useState(task.description);

   useEffect(()=>{

    const keyBoardHideHandler = ()=>{
      closeEditMode();
    };

    Keyboard.addListener("keyboardDidHide", keyBoardHideHandler );

    return(()=>{Keyboard.removeListener("keyboardDidHide", keyBoardHideHandler)}); 
   },[])
 
   async function updateDescription(){

      if(newDescription === task.description){
        closeEditMode();
        return;
      }else if(newDescription === ""){
        notify("Description cannot be empty", Status.ERROR);
        return;
      }
      

      try{

        var res = await db.updateTaskDescription(task.id, newDescription);

      }catch(error){
        notify("Could not update task", Status.ERROR);
        return;
  
      }

      if(res){
        setTasks(oldTasks => {
          const idx = oldTasks.indexOf(task);
          oldTasks[idx].description = newDescription;
          return oldTasks;
      });
      closeEditMode(false, {id: task.id, done: task.done, description: newDescription, dueDate: null});
    }else{
      closeEditMode(false);
    }
  }

  return (
        <View style={styles.container}>
          <TextInput
          style={inputStyle}
            autoFocus={true}
              defaultValue={task.description}
              keyboardType="ascii-capable"
              selectionColor={colors.text2}
              multiline={true}
              onChangeText={(value) => {
              setNewDescription(value);
              }}/>
          <Pressable onPress={updateDescription}>
            <Icon style={iconStyle} name="check" size={28}/>
          </Pressable>

          <Pressable onPress={closeEditMode}>
            <Icon style={iconStyle} name="close" size={28}/>
          </Pressable>
        </View> );
}


