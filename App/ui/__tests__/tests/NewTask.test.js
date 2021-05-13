import React from "react";
import {render, screen, act} from "../utils/MyRenderer";

import NewTask from "../../components/NewTask";



it("first render", async()=>{

   // const dbMock = {
   //    createTasksTable: jest.fn(()=> {return new Promise((resolve, reject)=>{
   //       console.log("createTasksTable")
   //       resolve();
   //    })}),
   //    createListsTable: jest.fn(()=> {return new Promise((resolve, reject)=>{
   //       console.log("createListsTable")
   //       resolve();
   //    })}),
   //    insertTask: jest.fn((listId, description, dueDate) =>{
   //       console.log("in mock")
   //    }),
   //    getTasksInList: jest.fn(listId => {return new Promise((resolve, reject)=>{
   //       resolve([{description: "task1"}]);
   //    })}),
   //    getLists: jest.fn(listId => {return new Promise((resolve, reject)=>{
   //       resolve([{name: "list1", icon: "icon1"}]);
   //    })}),
   // }



 await act(async ()=> render(<NewTask/>));

   // await waitFor(() => expect(getLists).toHaveBeenCalled());

   // getByText("What todo...")

});