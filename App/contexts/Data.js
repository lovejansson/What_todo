import React, { useState, createContext, useEffect } from "react";
import TodoDb from "../db/TodoDb";
import {openDatabase} from "react-native-sqlite-storage";


export const DataContext = createContext();

export const DataProvider = (props) => {

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [currentList, setCurrentList] = useState(null);

  const [scrollOffset, setScrollOffset] = useState(null);

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

    console.log("useEffect currentList")
  
    if (currentList) {
      setLoading(true);
      db.getTasksInList(currentList.id)
        .then((res) => {
          setTasks(res);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [currentList]);


  return (
    <DataContext.Provider
      value={{ db, loading, lists, setLists, tasks, setTasks,
         currentList, setCurrentList, scrollOffset, setScrollOffset}}
    >
      {props.children}
    </DataContext.Provider>
  );

};
