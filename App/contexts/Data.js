import React, { useState, createContext, useEffect } from "react";
import TodoDb from "./TodoDb";
import {openDatabase} from "react-native-sqlite-storage";


export const DataContext = createContext();

export const DataProvider = (props) => {


  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [listId, setListId] = useState(null);

let db = new TodoDb(openDatabase({name: "db.todo"}));

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

  return (
    <DataContext.Provider
      value={{ lists, setLists, db, loading, tasks, setTasks,  listId, setListId}}
    >
      {props.children}
    </DataContext.Provider>
  );
};
