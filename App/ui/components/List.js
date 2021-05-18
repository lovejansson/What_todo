import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { DataContext } from "../../contexts/Data";
import { ColorThemeContext } from "../../contexts/ColorTheme";
import { NotificationContext } from "../../contexts/Notification";


import TaskItem from "./TaskItem";
import ListHeader from "./ListHeader";
import AddTodos from "./AddTodos";
import Menu from "./Menu";
import ConfirmAction from "./popups/ConfirmAction";
import EmptyData from "./EmptyData";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import FloatingActionButton from "./FloatingActionButton";



const window = Dimensions.get("window");

const statusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({


    container: {flex: 1},

    buttonContainer: {
    //   position: "absolute",
    //   backgroundColor: "red",
    
    // left: 0,
    // top: window.height - 135,
  
    // right: 0,
    // bottom: 0,
    // height: 110,
    // borderColor: "green",
    // borderBottomWidth: 4,
    

    }

,
button: {
  position: "absolute",
  top: window.height - 52 - statusBarHeight- 32,

  right: 24,
  bottom: 32,

},
  icon: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
 overlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent"
},
});

function toPositions(tasks){
  let positions = {}
  tasks.forEach((task, idx) =>{
      positions[task.id] = idx;
  });

  return positions;

}


export default function List({ navigation }) {
  const colors = useContext(ColorThemeContext).colors;
  const theme = useContext(ColorThemeContext).theme;
  const db = useContext(DataContext).db;
  const setLists = useContext(DataContext).setLists;
  const refreshTasks = useContext(DataContext).refreshTasks;

 

  
  const currentList = useContext(DataContext).currentList;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;
  const positions = useSharedValue(null);

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  

  const notify = useContext(NotificationContext).notify;
  const Status = useContext(NotificationContext).Status;


  const deleteListItem = {icon: "delete", title: "Delete list", action: toggleShowConfirmationDialog};
  const editListItem = {icon: "edit", title: "Edit list", action: openEditList};
  const deleteCompletedItem =  {icon: "closecircleo", title: "Delete completed tasks", action: deleteCompletedTasks};

  const menuItems = [deleteListItem, editListItem,deleteCompletedItem ];

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmActionDialog, setShowConfirmationDialog] = useState(false);
  

  const [emptyList, setEmptyList] = useState(false);

  useEffect(()=>{
  
    if(tasks){

      if(tasks.length > 0){
        setEmptyList(false);
        positions.value = toPositions(tasks);

      }else{
        setEmptyList(true);
      }
    }else{
      setEmptyList(true)
    }
  }, [tasks]);

  useEffect(()=>{

    const keyboardHideHandler = () => {
      console.log("keyboard shows false list")
      if(editMode.value === true){
        editMode.value = false
      }
   };

    Keyboard.addListener("keyboardDidHide", keyboardHideHandler);

    return(()=>{
   
      Keyboard.removeAllListeners("keyBoardDidHide");
    });

  }, []);


  function updatePositions(task, direction){
    

    "worklet";

    let positionsCopy = JSON.parse(JSON.stringify(positions.value));
    

    let newPos = positionsCopy[task.id] + direction;

    if(newPos < 0){
      return;
    }
    
    

    let values = Object.values(positionsCopy);
    let ids = Object.keys(positionsCopy);

    if(newPos > values.length - 1){
      return;
    }

    console.log(newPos)

    for(let i = 0; i < values.length; ++i){
      if(values[i] === newPos ){
        positionsCopy[ids[i]] -= direction;
        break;
      }
    }

    positionsCopy[task.id] += direction; 

    positions.value = positionsCopy;
  

  }

  function toggleShowMenu(){
      setShowMenu(!showMenu);
  }

  function openEditList(){
    navigation.navigate("EditList");
  }

  function toggleShowConfirmationDialog(){ 
    setShowMenu(false)
    setShowConfirmationDialog(!showConfirmActionDialog);
  }

  async function deleteCompletedTasks(){

    toggleShowMenu();
    
    let deleted;

    try{
       deleted = await db.deleteCompletedTasks(currentList.id);
    }catch(error){
        notify("Failed to delete completed tasks", Status.ERROR);
    }

    if(deleted){
        refreshTasks();
    }

  }

  async function deleteList(){
    let deleted;

    try{
      deleted = await db.deleteList(currentList.id);
    }catch(error){
      console.error(error);
    }

    if(deleted){
      navigation.goBack();
      setLists(oldLists => {

        let newLists = oldLists.filter(list => { return list.id !== currentList.id});

        console.log(newLists);

        return newLists;
    });
      console.log("deleted list")
    }
  }

  // const [editMode, setEditMode] = useState(false);

  const editMode = useSharedValue(false);

  function toggleEditMode(){
    editMode.value = !editMode.value;
  }


   
  /*
  
  listan ska hålla reda på en array av positioner/sorteringen -> sharedValue
  
  TaskItem "lyssnar på" arrayen och om just dens position ändras så ändrar man translateY (sharedValue)
  antingen += 90 eller -= 90 (HEIGHT av ett item)

  TaskItem som rör på sig kommer att aktiver "onActive" metoden där man kan kolla translateY värdet. 
  Om detta är antingen större än 45 eller mindre än -45 så ska man anropa en funktion som swapar positioner i positions arrayen
    TransY värdet uppdateras alltid efter hand i onActive

    onEnd: placera elementet enligt ny position + uppdatera sorteringen i db enligt positions (item id och positionering)
  
  */
  function renderItem({item, index}){
   
      return <TaskItem navigation={navigation} 
      task={item} index={index} listEditMode={editMode} toggleEditMode={toggleEditMode} activateDrag={activateDrag}/>
  }

  function navigateToAddTodos(){
    navigation.navigate("AddTodos");
  }
  // måste veta OM drag, VILKET drag samt få events om position

  return (
 
   
    <View style={containerStyle}>
        <StatusBar backgroundColor={colors.background}  
        barStyle={theme === "white" ? "dark-content" : "light-content"}/>
      <ListHeader navigation={navigation}
      actionRight={toggleShowMenu} />

      { emptyList|| tasks === null ? (
        <EmptyData info="Empty list"/>
     
      ) : (

        
       
        <ScrollView  contentContainerStyle={{height: window.height,backgroundColor: colors.backgroundDark}} keyboardShouldPersistTaps="handled">

            {tasks.map((task, index) => (
             <TaskItem task={task} index={index} positions={positions} updatePositions={updatePositions}
             listEditMode={editMode} 
             toggleEditMode={toggleEditMode} />
            ))}
       
        </ScrollView>
      
     
      )}

    <FloatingActionButton action={navigateToAddTodos} style={styles.button} icon="plus"/>
 
    
      {showMenu && 
        <Pressable onPress={toggleShowMenu} style={styles.overlay}>
          <Menu items={menuItems}/>
        </Pressable>}
     
      {showConfirmActionDialog && 
      <Pressable style={[styles.overlay, {zIndex: 4}]} onPress={toggleShowConfirmationDialog}>
        <ConfirmAction title="Do you want to delete this list?" message="The added items will also be deleted." 
        actionCancel={toggleShowConfirmationDialog} actionOk={deleteList}/>
      </Pressable>}
      </View>
  );
}
