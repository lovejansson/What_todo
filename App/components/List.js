import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { DataContext } from "../data/DataContext";
import Icon from "react-native-vector-icons/AntDesign";
import TaskItem from "../components/TaskItem";
import HeaderActionRight from "./HeaderActionRight";
import Menu from "../components/Menu";
import ConfirmationDialog from "../popups/ConfirmationDialog";
import { useLayoutEffect } from "react";



const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
   
  },
  button: {
    position: "absolute",
    backgroundColor: "#000",
    borderRadius: 50,
    end: 24,
    bottom: 32,
  },
  icon: {
    color: "#fff",

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
}
});


export default function List({ navigation, route }) {
const db = useContext(DataContext).db;
const setTasks= useContext(DataContext).setTasks;
const setLists = useContext(DataContext).setLists;
 
  const setListId = useContext(DataContext).setListId;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;


  const deleteListItem = {icon: "delete", title: "Delete list", action: toggleShowConfirmationDialog};
  const editListItem = {icon: "edit", title: "Edit list", action: ()=> console.log("todo edit list")};
  const deleteCompletedItem =  {icon: "closecircleo", title: "Delete completed tasks", action: deleteCompletedTasks};

  const menuItems = [deleteListItem, editListItem,deleteCompletedItem ]

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmActionDialog, setShowConfirmationDialog] = useState(false);

  function toggleShowMenu(){
      setShowMenu(!showMenu);
  }

  function toggleShowConfirmationDialog(){ 
    setShowConfirmationDialog(!showConfirmActionDialog);
  }

  async function deleteCompletedTasks(){

    toggleShowMenu();
    
    let deleted;

    try{
       deleted = await db.deleteCompletedTasks();
    }catch(error){
        console.log(error);
    }


    if(deleted){
        let newTasks = tasks.filter(t => { return t.done === false || t.done === 0})
        console.log(newTasks);
        setTasks(newTasks);
    }

  }

  useLayoutEffect(()=>{
    navigation.setOptions({ title: route.params.listName,  headerRight: () => <HeaderActionRight onPress={toggleShowMenu}/>});
  }, [showMenu])



  useEffect(() => {
   
     setListId(route.params.listId);
     return ()=>{
       setListId(null);
       setTasks([]);
     }
  }, []);


  async function deleteTask(task){
 
    let deleted;

    try{
       deleted = await db.deleteTask(task.id);
    }catch(error){

        console.log(error);
    }

    if(deleted){
        setTasks(oldTasks => {

            return oldTasks.filter(t => { return t.id != task.id})
        });
    }
  }

  async function deleteList(){
    let deleted;

    try{
      deleted = await db.deleteList(route.params.listId);
    }catch(error){
      console.error(error);
    }

    if(deleted){
      navigation.goBack();
      setLists(oldLists => {

        let newLists = oldLists.filter(list => { return list.id !== route.params.listId});

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
          
            deleteTask(item);
        }}
        />
      );


  }

  return (
    <View style={styles.container}>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString() }
        />
      )}

      <TouchableOpacity
        style={styles.button}
       
        onPress={() => {
         
          navigation.navigate("NewTask", { listId: route.params.listId });
        }}
      >
        {/* <Text style={styles.newListBtnText}>New list</Text> */}
        <Icon style={styles.icon} name="plus" size={32} color="white" />
      </TouchableOpacity>

      {showMenu && <Pressable onPress={toggleShowMenu} style={styles.overlay}><Menu items={menuItems}/></Pressable>}
      {showConfirmActionDialog && 
      <Pressable style={[styles.overlay, {zIndex: 4}]} onPress={toggleShowConfirmationDialog}>
        <ConfirmationDialog title="Do you want to delete this list?" message="Deleting this list will
      also delete all tasks." actionCancel={toggleShowConfirmationDialog} actionOk={deleteList}/>
      </Pressable>}
    </View>
  );
}
