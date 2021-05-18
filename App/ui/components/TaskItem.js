import React, { useState } from "react";
import { Keyboard } from "react-native";
import { runOnJS, useAnimatedReaction, useSharedValue} from "react-native-reanimated";
import { useEffect } from "react/cjs/react.development";
import TaskDetails from "./TaskDetails";
import TaskEdit from "./TaskEdit";


/*

list context som håller reda på tasks samt om listan är i editMode eller ej (toggla new task + se till så att andra tasks
    inte editas samtidigt)

*/

export default function TaskItem({navigation, task, index, listEditMode, toggleEditMode, positions, updatePositions}){
   const [editMode, setEditMode] = useState(false);

   const [taskLocal, setTaskLocal] = useState(task);

   const topPos = useSharedValue(positions.value[task.id]);

   useAnimatedReaction(()=>{
    return positions.value[task.id];
  }, (curr, prev) => {

    if(curr !== prev){
     
      
          topPos.value = curr * 90;
      
    
    }
});
 


    useAnimatedReaction(()=>{return listEditMode.value}, 
    (curr, prev)=>{
            
            if(curr === false && editMode){
                runOnJS(setEditMode)(false);
            }
        }
    , [editMode]);

 

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
 
    return editMode ? <TaskEdit task={taskLocal} topPos={topPos} closeEditMode={closeEditMode}/> 
        : <TaskDetails positions={positions} updatePositions={updatePositions} navigation={navigation} task={taskLocal} index={index} openEditMode={openEditMode}/>;

}