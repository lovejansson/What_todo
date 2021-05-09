import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  StatusBar,

  ImageBackground,
  requireNativeComponent
} from "react-native";
import { DataContext } from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import {NotificationContext} from "../../contexts/Notification";
import Icon from "react-native-vector-icons/AntDesign";
import TaskItem from "./TaskItem";
import ListHeader from "./ListHeader";
import HeaderActionRight from "./HeaderActionRight";
import NewTask from "./NewTask.js";
import Menu from "./Menu";
import ConfirmAction from "./popups/ConfirmAction";
import { useLayoutEffect } from "react";



const styles = StyleSheet.create({


    container: {flex: 1},

    loadingView: {
      flex: 1,
      backgroundColor: "#121212"
    },

    flatList: {
      flex: 1,
      
    },

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
  const db = useContext(DataContext).db;
  const setTasks= useContext(DataContext).setTasks;
  const setLists = useContext(DataContext).setLists;
  
  const currentList = useContext(DataContext).currentList;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;

  const iconStyle = [styles.icon, {color: colors.icon}];
  const buttonStyle= [styles.button, {backgroundColor: colors.mainButton}];
  const containerStyle = [styles.container, {backgroundColor: colors.background}];

  const notify = useContext(NotificationContext).notify;
  const Status = useContext(NotificationContext).Status;


  const deleteListItem = {icon: "delete", title: "Delete list", action: toggleShowConfirmationDialog};
  const editListItem = {icon: "edit", title: "Edit list", action: openEditList};
  const deleteCompletedItem =  {icon: "closecircleo", title: "Delete completed tasks", action: deleteCompletedTasks};

  const menuItems = [deleteListItem, editListItem,deleteCompletedItem ]

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmActionDialog, setShowConfirmationDialog] = useState(false);

  function toggleShowMenu(){
      setShowMenu(!showMenu);
  }

  function openEditList(){
    navigation.navigate("EditList");
  }

  function toggleShowConfirmationDialog(){ 
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

  function renderItem({item}){
    return (
        <TaskItem
          item={item}
          onUpdateDone={(newValue)=> {
            let idx = tasks.indexOf(item);
            setTasks(oldTasks => {
              oldTasks[idx].done = newValue;
              return oldTasks;
            })  
          }}
          onPress={() => {
       
          }}
          onDelete={()=>{
         
        }}
        />
      );
  }

  return (
   
    <View style={containerStyle}>
      <StatusBar backgroundColor={colors.background}/>
      <ListHeader navigation={navigation}
      actionRight={toggleShowMenu} />

      {loading ? (
        <View style={styles.loadingView}>
        <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString() }
        />
      )}

      <NewTask list={currentList}/>

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
