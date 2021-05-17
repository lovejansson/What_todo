import React, { useState } from "react";
import { Keyboard } from "react-native";
import { runOnJS, useAnimatedReaction} from "react-native-reanimated";
import { useEffect } from "react/cjs/react.development";
import TaskDetails from "./TaskDetails";
import TaskEdit from "./TaskEdit";

/*

list context som håller reda på tasks samt om listan är i editMode eller ej (toggla new task + se till så att andra tasks
    inte editas samtidigt)

*/

export default function TaskItem({navigation, task, index, listEditMode, toggleEditMode, activateDrag}){
   const [editMode, setEditMode] = useState(false);

   const [taskLocal, setTaskLocal] = useState(task);


   useEffect(()=>{

     console.log("use effect task item")
   
    
}, )

    useAnimatedReaction(()=>{return listEditMode.value}, 
    (curr, prev)=>{
            console.log("second ")
            console.log(curr)
            if(curr === false && editMode){
                runOnJS(setEditMode)(false);
            }
        }
    , [editMode])

   function openEditMode(){
       if(!listEditMode.value){
        setEditMode(true);
        toggleEditMode();
   
       }else{
            toggleEditMode();
       } 
   }

   function closeEditMode(data){

    if(data.task){
        setTaskLocal(data.task) 
    }

    setEditMode(false);
    toggleEditMode();
     
   }
 
    return editMode ? <TaskEdit task={taskLocal} closeEditMode={closeEditMode}/> 
        : <TaskDetails navigation={navigation} activateDrag={activateDrag} task={taskLocal} index={index} openEditMode={openEditMode}/>;

}