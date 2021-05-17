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


export default function List({ navigation }) {
  const colors = useContext(ColorThemeContext).colors;
  const theme = useContext(ColorThemeContext).theme;
  const db = useContext(DataContext).db;
  const setTasks= useContext(DataContext).setTasks;
  const setLists = useContext(DataContext).setLists;
  const refreshTasks = useContext(DataContext).refreshTasks;

  const positions = useSharedValue(tasks);

  
  const currentList = useContext(DataContext).currentList;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  

  const notify = useContext(NotificationContext).notify;
  const Status = useContext(NotificationContext).Status;


  const deleteListItem = {icon: "delete", title: "Delete list", action: toggleShowConfirmationDialog};
  const editListItem = {icon: "edit", title: "Edit list", action: openEditList};
  const deleteCompletedItem =  {icon: "closecircleo", title: "Delete completed tasks", action: deleteCompletedTasks};

  const menuItems = [deleteListItem, editListItem,deleteCompletedItem ];

  const panRef = useRef();

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
        // let newTasks = tasks.filter(t => { return t.done === false || t.done === 0})
        // console.log(newTasks);
        // setTasks(newTasks);
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
    // if(editMode && keyboardShows){

    //   console.log("keyboardshows and editmode")
    // console.log(editMode);
    // console.log(keyboardShows)
    //     Keyboard.dismiss();

    //     // waiting to change edit mode so that NewTask is displayed after keyboard is hidden
    //     const keyboardHideHandler = () => {
    //       setEditMode(!editMode);
    //       Keyboard.removeListener("keyboardDidHide", keyboardHideHandler);
    //     }
    //     Keyboard.addListener("keyboardDidHide", keyboardHideHandler);

    // }else{
    //   console.log("HEj")
    //   setEditMode(!editMode);
    // }
  }

  function activateDrag(index){
    console.log("activate drag");
    posY.value = index * 90;
    transY.value = 0;

   
    /// synlighet för drag elementet precis ovanför det element som ska draggas?
    // aktivera, positionera,
  }

  function renderItem({item, index}){
   
      return <TaskItem navigation={navigation} 
      task={item} index={index} listEditMode={editMode} toggleEditMode={toggleEditMode} activateDrag={activateDrag}/>
  }

  function navigateToAddTodos(){
    navigation.navigate("AddTodos");
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
        <StatusBar backgroundColor={colors.background}  
        barStyle={theme === "white" ? "dark-content" : "light-content"}/>
      <ListHeader navigation={navigation}
      actionRight={toggleShowMenu} />

      { emptyList|| tasks === null ? (
        <EmptyData info="Empty list"/>
     
      ) : (
        
//         <ScrollView style={{flex: 1}}>

// {tasks.map((task, index) => (
//              <TaskItem task={task} index={index} 
//              listEditMode={editMode} 
//              toggleEditMode={toggleEditMode} activateDrag={activateDrag}/>
//             ))}
      
        <FlatList
          style={{flex: 1,}}
          data={tasks}
         
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString() }
        />
       
      //  </ScrollView>
      )}
{/* <NewTask list={currentList}/> */}
{/* <View style={styles.buttonContainer}> */}
 <FloatingActionButton action={navigateToAddTodos} style={styles.button} icon="plus"/>
 {/* </View> */}
    
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
