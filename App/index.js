
import React from "react";
import {ColorThemeProvider} from "./contexts/ColorTheme";
import {DataProvider} from "./contexts/Data";
import { NotificationProvider} from "./contexts/Notification";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NewList from "./ui/components/popups/NewList.js";
import EditList from "./ui/components/popups/EditList.js";

import Main from "./ui/screens/Main";

const Stack = createStackNavigator();

export default function App() {
  return (
    <DataProvider >
      <ColorThemeProvider>
      <NotificationProvider >
     
      <NavigationContainer theme={DarkTheme} >
      
      <Stack.Navigator >
          <Stack.Screen 
    
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            
            name="NewList"
            component={NewList}
            options={{ headerShown: false }}
          />
        <Stack.Screen
            name="EditList"
            component={EditList}
            options={{ headerShown: false }}
          />
            
        </Stack.Navigator>
      </NavigationContainer>
   
      </NotificationProvider>

      </ColorThemeProvider>
    
    </DataProvider>
  );

}
