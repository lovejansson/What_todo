import React, {useContext} from "react";

import NewList from "../modals/NewList.js";
import EditList from "../modals/EditList.js";
import AddTodos from "../components/AddTodos";
import ScreensStack from "./Screens";
import { ColorThemeContext } from "../../contexts/ColorTheme";
import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

  const Stack = createStackNavigator();
  const slideInRightAnimation = ({current, layouts})=>{
    return({
      cardStyle: {
          transform:[{ translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),}],
          backgroundColor: "#fff",
      }
  
    });
  
  }

export default function Navigation(){

    const colors = useContext(ColorThemeContext).colors;
    return(
        <NavigationContainer>
        <Stack.Navigator mode="modal" >
            <Stack.Screen 
              name="Screens"
              component={ScreensStack}
              options={{ headerShown: false, cardStyle: {backgroundColor: colors.background}}}
              
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
             <Stack.Screen
              name="AddTodos"
              component={AddTodos}
              options={{ headerShown: false}}
            />
              
          </Stack.Navigator>
        </NavigationContainer>
    )
}