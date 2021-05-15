import React, { useState, useContext, useEffect} from "react";
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

const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",

    height: 90,
    width: window.width,
    paddingStart: 24,
    paddingEnd: 16,
  },

  input: {
    fontSize: 18,
    fontFamily: "Mukta-Regular",
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },

  icon: {
    paddingVertical: 16,
    paddingHorizontal: 8,
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
klicka på task för att ändra beskrivning  -> done
anpassa rutig bakgrund efter skärmar/färger 
testa komponenter -> nästa vecka 
drag and drop för att ordna
huvud meny på hemskärm: backup data, settings, send feedback
setting screen : theme sync data språk?

DRAG and DROP

items lagrar order vilket initialt är antalet tex tasks/ lists som redan finns +1 när en task läggs till

vid flytt så måste man switcha order attributet med varandra




*/

export default function TaskEdit({task, closeEditMode}){

    const db = useContext(DataContext).db;
    const setTasks = useContext(DataContext).setTasks;

    const colors = useContext(ColorThemeContext).colors;

    const Status = useContext(NotificationContext).Status;
    const notify = useContext(NotificationContext).notify;

    const iconStyle = [styles.icon, {color: colors.text}];
    const inputStyle = [styles.input, {color: colors.text, backgroundColor: colors.background}];

   const [newDescription, setNewDescription] = useState(task.description);

   useEffect(()=>{

      const keyboardHideHandler = () => closeEditMode(false);

      Keyboard.addListener("keyboardDidHide", keyboardHideHandler);

      return () => Keyboard.removeListener("keyboardDidHide", keyboardHideHandler);

   }, []);

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
      
      let updatedTask = {id: task.id, done: task.done, description: newDescription, dueDate: null};

      if(res){
        setTasks(oldTasks => {
          const idx = oldTasks.indexOf(task);
          oldTasks[idx] = updatedTask;
          return oldTasks;
      });
      closeEditMode({task: updatedTask});
    }else{
      closeEditMode();
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
        </View>
         );
}


