import { render } from '@testing-library/react-native'

import React from "react";

import {ColorThemeProvider} from "../../../contexts/ColorTheme";
import {DataProvider} from "../../../contexts/Data";
import { NotificationProvider} from "../../../contexts/Notification";

const dbMock = {
    createTasksTable: jest.fn(()=> {return new Promise((resolve, reject)=>{
       console.log("createTasksTable")
       resolve();
    })}),
    createListsTable: jest.fn(()=> {return new Promise((resolve, reject)=>{
       console.log("createListsTable")
       resolve();
    })}),
    insertTask: jest.fn((listId, description, dueDate) =>{
       console.log("in mock")
    }),
    getTasksInList: jest.fn(listId => {return new Promise((resolve, reject)=>{
       resolve([{description: "task1"}]);
    })}),
    getLists: jest.fn(listId => {return new Promise((resolve, reject)=>{
       resolve([{name: "list1", icon: "icon1"}]);
    })}),
 }


const providers = ({ children }) => {
  return (
    <DataProvider db={dbMock}>
    <ColorThemeProvider>
    <NotificationProvider >
        {children}
    </NotificationProvider>
    </ColorThemeProvider>
    </DataProvider>
  )
}

const myRender = (ui, options) =>
  render(ui, { wrapper: providers, ...options })

// re-export everything
export * from "@testing-library/react-native";

// override render method
export { myRender as render }