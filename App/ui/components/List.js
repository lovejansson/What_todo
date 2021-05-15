import React, { useState, useEffect, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  Keyboard,
  Dimensions,
} from "react-native";
import { DataContext } from "../../contexts/Data";
import { ColorThemeContext } from "../../contexts/ColorTheme";
import { NotificationContext } from "../../contexts/Notification";


import TaskItem from "./TaskItem";
import ListHeader from "./ListHeader";
import NewTask from "./NewTask.js";
import Menu from "./Menu";
import ConfirmAction from "./popups/ConfirmAction";
import EmptyData from "./EmptyData";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { transformSync } from "@babel/core";


const window = Dimensions.get("window");

const styles = StyleSheet.create({


    container: {height: "100%", paddingBottom: 16,},


  button: {
    position: "absolute",
    borderRadius: 50,
    end: 24,
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


export default function List({ navigation }) {
  const colors = useContext(ColorThemeContext).colors;
  const theme = useContext(ColorThemeContext).theme;
  const db = useContext(DataContext).db;
  const setTasks= useContext(DataContext).setTasks;
  const setLists = useContext(DataContext).setLists;

  
  const currentList = useContext(DataContext).currentList;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  

  const notify = useContext(NotificationContext).notify;
  const Status = useContext(NotificationContext).Status;


  const deleteListItem = {icon: "delete", title: "Delete list", action: toggleShowConfirmationDialog};
  const editListItem = {icon: "edit", title: "Edit list", action: openEditList};
  const deleteCompletedItem =  {icon: "closecircleo", title: "Delete completed tasks", action: deleteCompletedTasks};

  const menuItems = [deleteListItem, editListItem,deleteCompletedItem ]

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmActionDialog, setShowConfirmationDialog] = useState(false);
  const [flatListStyle, setFlatListStyle] = useState(styles.flatList);

  const [emptyList, setEmptyList] = useState(false);

  const [keyboardShows, setKeyboardShows] = useState(false);

  const posY = useSharedValue(0);
  const transY = useSharedValue(0);

  const animatedPosition = useAnimatedStyle(()=>{
    return({

      top: posY.value,
      left: 0,

    })
  })

  const animatedTransY = useAnimatedStyle(()=> {

    return({
      transform: [{translateY: transY.value}]
    })
  })


  useEffect(()=>{
    if(tasks){

      if(tasks.length > 0){
        setEmptyList(false);

      }else{
        setEmptyList(true);
      }
    }
  }, [tasks]);

  useEffect(()=>{

    const keyboardHideHandler = () => {
      console.log("keyboard shows false list")
      
      setKeyboardShows(false)};
    const keyboardShowHandler = () => setKeyboardShows(true);
    Keyboard.addListener("keyboardDidShow", keyboardShowHandler);
    Keyboard.addListener("keyboardDidHide", keyboardHideHandler);

    return(()=>{
      Keyboard.removeAllListeners("keyBoardDidShow");
      Keyboard.removeAllListeners("keyBoardDidHide");
    });

  }, []);

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
        let newTasks = tasks.filter(t => { return t.done === false || t.done === 0})
        console.log(newTasks);
        setTasks(newTasks);
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

  const [editMode, setEditMode] = useState(false);

  function toggleEditMode(){

    

    if(editMode && keyboardShows){

      console.log("keyboardshows and editmode")
    console.log(editMode);
    console.log(keyboardShows)
        Keyboard.dismiss();

        // waiting to change edit mode so that NewTask is displayed after keyboard is hidden
        const keyboardHideHandler = () => {
          setEditMode(!editMode);
          Keyboard.removeListener("keyboardDidHide", keyboardHideHandler);
        }
        Keyboard.addListener("keyboardDidHide", keyboardHideHandler);

    }else{
      console.log("HEj")
      setEditMode(!editMode);
    }
  }

  function activateDrag(index){
    console.log("activate drag");
    posY.value = index * 90;
    transY.value = 0;

   
    /// synlighet för drag elementet precis ovanför det element som ska draggas?
    // aktivera, positionera,
  }

  function renderItem({item, index}){
   
      return <TaskItem task={item} index={index} listEditMode={editMode} toggleEditMode={toggleEditMode} activateDrag={activateDrag}/>
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {   
      console.log("start pan")      
      },
      onActive: (event, ctx) => {
     
        
        transY.value = event.translationY;
        console.log("active pan")      
      },
    
      

      onEnd: (event, ctx) => {

        console.log("end pan")      
      },
    });

  // måste veta OM drag, VILKET drag samt få events om position

  return (
 
   
    <View style={containerStyle}>
        <StatusBar backgroundColor={colors.background}  barStyle={theme === "white" ? "dark-content" : "light-content"}/>
      <ListHeader navigation={navigation}
      actionRight={toggleShowMenu} />

      { emptyList ? (
        <EmptyData info="Empty list"/>
     
      ) : (
        
        <View>
          <PanGestureHandler  onGestureEvent={gestureHandler}>
          <Animated.View style={[{backgroundColor: "pink", color: "white",
           height: 90, width: "100%", position: "absolute", zIndex: 1000}, animatedPosition, animatedTransY]}></Animated.View>
          </PanGestureHandler>
        <FlatList
          style={flatListStyle}
          data={tasks}
          ListFooterComponent={<View></View>}
          ListFooterComponentStyle={{width: window.width, height: 30}}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString() }
        />
        </View>
      )}

      {!editMode && <NewTask list={currentList}/>}
    
      {showMenu && 
        <Pressable onPress={toggleShowMenu} style={styles.overlay}>
          <Menu items={menuItems}/>
        </Pressable>}
     
      {showConfirmActionDialog && 
      <Pressable style={[styles.overlay, {zIndex: 4}]} onPress={toggleShowConfirmationDialog}>
        <ConfirmAction title="Do you want to delete this list?" message="The added items will also be deleted." actionCancel={toggleShowConfirmationDialog} actionOk={deleteList}/>
      </Pressable>}
   
      </View>
    
 
  );
}
