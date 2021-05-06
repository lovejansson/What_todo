
import React from "react"
import {ColorThemeProvider} from "./contexts/ColorTheme";
import {DataProvider} from "./contexts/Data";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NewList from "./popups/NewList";
import NewTask from "./popups/NewTask";
import Main from "./screens/Main";

const Stack = createStackNavigator();

export default function App() {
  return (
   
    <DataProvider>
      <ColorThemeProvider>
      <NavigationContainer>
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
            name="NewTask"
            component={NewTask}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </ColorThemeProvider>
    </DataProvider>
  );

}
