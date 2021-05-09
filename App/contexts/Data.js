import React, { useState, createContext, useEffect } from "react";
import TodoDb from "../db/TodoDb";
import {openDatabase} from "react-native-sqlite-storage";


export const DataContext = createContext();

export const DataProvider = (props) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [listId, setListId] = useState(null);

let db = new TodoDb(openDatabase({name: "db.todo"}));

/*

  hemsidan -> listor namn/antal entries/antal utförda saker

  Lista sidan -> alla saker 

  ny lista -> måste lägga till en lista i lists

  ny task -> måste lägga till en task i en lista

  edit task -> måste uppdatera task inom en lista

  edit list -> måste uppdatera en lista i lists


*/

useEffect(() => {
    setLoading(true);
    db.createListsTable().then(() => {
      db.createTasksTable().then(()=> {
        console.log("created tasks table")
            db.getLists()
            .then((res) => {
              setLists(res);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
      });
        
    });
  }, []);

  useEffect(() => {

    console.log("updated list id use effect")
  
    if (listId) {
      setLoading(true);
      db.getTasksInList(listId)
        .then((res) => {
          setTasks(res);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [listId]);



  async function insertTask(list, description) {

    if(description !== ""){
      try{

        var insertedId = await db.insertTask(list.id, description, null);

      }catch(error){
        console.error(error);
      }
  
      if(insertedId){

        // increase count in list

        setLists(oldLists => {
  
          return oldLists.map(l =>{

            l.count = l.id === list.id ? ++l.count : l.count;
            return l;

          });
        });

        // add to current tasks

        setTasks((oldTasks) => [
          ...oldTasks,
          { description: description, id: insertedId, done: false, dueDate: null },
        ]);

      }else{
  
        console.error("New task not added");
      }
    } 
  }



  return (
    <DataContext.Provider
      value={{ lists, setLists, db, loading, tasks, setTasks,  listId, setListId, insertTask}}
    >
      {props.children}
    </DataContext.Provider>
  );
};
