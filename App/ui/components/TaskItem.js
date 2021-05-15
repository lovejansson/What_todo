import React, { useState } from "react";
import { Keyboard } from "react-native";
import TaskDetails from "./TaskDetails";
import TaskEdit from "./TaskEdit";


export default function TaskItem({task, index, listEditMode, toggleEditMode, activateDrag}){
   const [editMode, setEditMode] = useState(false);

   const [taskLocal, setTaskLocal] = useState(task);

   function openEditMode(){
       if(listEditMode){
        Keyboard.dismiss();

       }else{
        setEditMode(true);
        toggleEditMode();
       } 
   }

   function closeEditMode(data){

    if(data.task){
        setTaskLocal(data.task) // quicker ui update than waiting for DataContext to adjusts    
    }

    setEditMode(false);
    toggleEditMode();
     
   }
 
    return editMode ? <TaskEdit task={taskLocal} closeEditMode={closeEditMode}/> 
        : <TaskDetails activateDrag={activateDrag} task={taskLocal} index={index} openEditMode={openEditMode}/>;

}