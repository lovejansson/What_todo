import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,

  TouchableOpacity,
} from "react-native";
import { DataContext } from "../data/DataContext";
import Icon from "react-native-vector-icons/AntDesign";
import TaskItem from "../components/TaskItem";
import MenuRight from "../components/MenuRight";
import Menu from "../components/Menu";
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
  menu: {
    position: "absolute",
    right: 16,
    top: 0,
    height: 100,
    width:100,
    backgroundColor: "blue",

}
});

// swipe to delete list and task

//  meny -> Delete list, Edit list, Ta bort alla tasks, ta bort alla som är klara 

// edit list -> editlistmodal, remove completed tasks -> clears all tasks that is done

// klicka på ett item -> edit description and reminder

export default function List({ navigation, route }) {
const db = useContext(DataContext).db;
const setTasks= useContext(DataContext).setTasks;
 
  const setListId = useContext(DataContext).setListId;
  const loading = useContext(DataContext).loading;

  const tasks = useContext(DataContext).tasks;

  const deleteList = {icon: "delete", title: "Delete list", action: ()=> console.log("delete list")};
  const editList = {icon: "edit", title: "Edit list", action: ()=> console.log("edit list")};
  const deleteCompleted =  {icon: "delete", title: "Delete completed tasks", action: ()=> console.log("delete completed tasks")};

  const menuItems = [deleteList, editList,deleteCompleted ]

  const [showMenu, setShowMenu] = useState(false);

  function displayMenu(){
      console.log("display menu")
  
      if(showMenu){
        console.log("setting false")
        setShowMenu(false);

      }else{
        console.log("settingtrue")
        setShowMenu(true);
      }
      console.log(showMenu);
  }

  useLayoutEffect(()=>{
    navigation.setOptions({ title: route.params.listName,  headerRight: () => <MenuRight onPress={displayMenu}/>});

  }, [])



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
  


  console.log(tasks);

  function renderItem({item}){
    return (
        <TaskItem
          item={item}
          onUpdateDone={()=> {
            console.log("onUpdateDone")
            // setCurrentList({id: route.params.listId, done: !currentList.done})
            
          }}
          onPress={() => {
            console.log("on press");
            //navigation.navigate("List", { listId: item.id });
          }}
          onDelete={()=>{
            
            
            console.log("on delete")
            
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
      {true && <View style={styles.menu}>
          <Menu items={menuItems}/>
          </View>}
    </View>
  );
}
