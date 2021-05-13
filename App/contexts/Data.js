import React, { useState, createContext, useEffect } from "react";
import TodoDb from "../db/TodoDb";
import {openDatabase} from "react-native-sqlite-storage";


export const DataContext = createContext();

export const DataProvider = (props) => {

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState(null);

  const [currentList, setCurrentList] = useState(null);

  const [scrollOffset, setScrollOffset] = useState(null);

  let db = props.db;

  console.log(db)


useEffect(() => {
    setLoading(true);
    db.createListsTable().then(() => {
      db.createTasksTable().then(()=> {
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
         currentList, setCurrentList, scrollOffset, setScrollOffset}}>
      {props.children}
    </DataContext.Provider>
  );

};
