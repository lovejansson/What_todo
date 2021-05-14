import React, { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import TaskDetails from "./TaskDetails";
import TaskEdit from "./TaskEdit";


export default function TaskItem({task, editMode, toggleEditMode}){
   const [editModeLocal, setEditModeLocal] = useState(false);

   let taskk = task;

   useEffect(()=>{
       if(!editMode){
           setEditModeLocal(false);  
       }

   }, [editMode])


   function openEditMode(){
       console.log("openEditMode")
       if(editMode){

        Keyboard.dismiss();
        toggleEditMode(false);

       }else{
        setEditModeLocal(true);
        toggleEditMode(true);
       }
     
   }

   function closeEditMode(newTask){

    if(newTask){
        taskk = newTask;
        
    }

    console.log("close edit mode")
     setEditModeLocal(false);
     toggleEditMode(false);
     
   }
 
    return (editModeLocal ? <TaskEdit task={taskk} closeEditMode={closeEditMode}/> 
        : <TaskDetails task={taskk} openEditMode={openEditMode}/>);

}

