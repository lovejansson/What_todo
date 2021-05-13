import React, {useContext} from "react";

import NewList from "../modals/NewList.js";
import EditList from "../modals/EditList.js";
import ScreensStack from "./Screens";
import { ColorThemeContext } from "../../contexts/ColorTheme";
import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

  const Stack = createStackNavigator();

export default function Navigation(){

    const colors = useContext(ColorThemeContext).colors;
    return(
        <NavigationContainer>
        <Stack.Navigator >
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
              
          </Stack.Navigator>
        </NavigationContainer>
    )
}