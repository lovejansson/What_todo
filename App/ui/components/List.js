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
import Icon from "react-native-vector-icons/AntDesign";
import TaskItem from "./TaskItem";
import ListHeader from "./ListHeader";
import HeaderActionRight from "./HeaderActionRight";
import NewTask from "./NewTask.js";
import Menu from "./Menu";
import ConfirmAction from "./popups/ConfirmAction";
import { useLayoutEffect } from "react";



const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
      resizeMode:"cover", 
    },

    container: {flex: 1},

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
}
});


export default function List({ navigation, route }) {
const colors = useContext(ColorThemeContext).colors;
const db = useContext(DataContext).db;
const setTasks= useContext(DataContext).setTasks;
const setLists = useContext(DataContext).setLists;
 
  const setListId = useContext(DataContext).setListId;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;

  const iconStyle = [styles.icon, {color: colors.icon}];
  const buttonStyle= [styles.button, {backgroundColor: colors.mainButton}];
  const containerStyle = [styles.container, {backgroundColor: colors.background}]


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
    navigation.navigate("NewList", {list: route.params.list})
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
    navigation.setOptions({ headerShown: false, headerStyle: {backgroundColor: "#0000"}, headerTitle: props => 
    <ListHeaderTitle {...props} title={route.params.list.name} 
    emoji={route.params.list.icon}/>});
  }, [showMenu])



  useEffect(() => {
   
     setListId(route.params.list.id);
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
      deleted = await db.deleteList(route.params.list.id);
    }catch(error){
      console.error(error);
    }

    if(deleted){
      navigation.goBack();
      setLists(oldLists => {

        let newLists = oldLists.filter(list => { return list.id !== route.params.list.id});

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
   
    <View style={containerStyle}>
      {/* // <ImageBackground source={require("../../images/background_black_even.png")} style={styles.backgroundImage}> */}
      <StatusBar backgroundColor={colors.background}/>
      <ListHeader name={route.params.list.name} emoji={route.params.list.icon} navigation={navigation}
      actionRight={toggleShowMenu} />

<View style={{flex: 1}}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList

          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString() }
        />
      )}
      </View>

      <NewTask list={route.params.list}/>

      {showMenu && 
        <Pressable onPress={toggleShowMenu} style={styles.overlay}>
          <Menu items={menuItems}/>
        </Pressable>}
     
      {showConfirmActionDialog && 
      <Pressable style={[styles.overlay, {zIndex: 4}]} onPress={toggleShowConfirmationDialog}>
        <ConfirmAction title="Do you want to delete this list?" message="The added items will also be deleted." actionCancel={toggleShowConfirmationDialog} actionOk={deleteList}/>
      </Pressable>}
     {/* </ImageBackground> */}
      </View>
 
  );
}
