import React from "react";
import Home from "../components/Home";
import List from "../components/List";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function Main() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen
        name="List"
        component={List}/>
    </Stack.Navigator>
  );
}
