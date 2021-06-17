import React, { useState, useEffect, useContext } from "react";
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
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, useAnimatedReaction, useAnimatedRef,
useAnimatedScrollHandler} from "react-native-reanimated";
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


  const scrollY = useSharedValue(0);
  const scrollView = useAnimatedRef(null);




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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {y}}) => { scrollY.value = y;}
  })


  /*
  
givet transY och scroll så kanske man är påväg att scrolla utanför och då ska det scrollas ett snäpp samtidigt som positionen ändras
  
  */



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


    for(let i = 0; i < values.length; ++i){
      if(values[i] === newPos ){
        positionsCopy[ids[i]] -= direction;
        break;
      }
    }

    positionsCopy[task.id] += direction; 

    positions.value = positionsCopy;
  

  }

  // detecta om top eller bottom är slickad mot kanten av scroll viewn måste veta abs top/ abs bottom 

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


  function navigateToAddTodos(){
    navigation.navigate("AddTodos");
  }

  return (
 
   
    <View style={containerStyle}>
        <StatusBar backgroundColor={colors.background}  
        barStyle={theme === "white" ? "dark-content" : "light-content"}/>
      <ListHeader navigation={navigation}
      actionRight={toggleShowMenu} />

      { emptyList || tasks === null ? (
        <EmptyData info="Empty list"/>
     
      ) : (

        
       
        <Animated.ScrollView 

          contentContainerStyle={{
        height: 90 * 22,
      }}
        
        ref={scrollView} onScroll={scrollHandler}  keyboardShouldPersistTaps="handled">

            {tasks.map((task, index) => (
         

             <TaskItem task={task} index={index}  key={task.id} positions={positions}  updatePositions={updatePositions}
      task={task} scrollY={scrollY} scrollView={scrollView} index={index} listEditMode={editMode} toggleEditMode={toggleEditMode}/>
            ))}
       
        </Animated.ScrollView>
      
     
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
