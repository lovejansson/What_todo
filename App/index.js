
import React from "react";
import TodoDb from "./db/TodoDb";
import {openDatabase} from "react-native-sqlite-storage";
import {ColorThemeProvider} from "./contexts/ColorTheme";
import {DataProvider} from "./contexts/Data";
import { NotificationProvider} from "./contexts/Notification";
import Navigation from "./ui/screens/Navigation";

export default function App() {
  const db = new TodoDb(openDatabase({name: "db.todo",createFromLocation: 1}));
  return (
    <DataProvider db={db} >
      <ColorThemeProvider>
      <NotificationProvider >
    
        <Navigation/>
   
      </NotificationProvider>

      </ColorThemeProvider>
    
    </DataProvider>
  );

}
