import React from "react";
import Home from "../components/Home";
import List from "../components/List";
import { createStackNavigator } from "@react-navigation/stack";


const slideInRightAnimation = ({current, layouts})=>{
  return({
    cardStyle: {
        transform:[{ translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),}],
        backgroundColor: "#121212",
    }

  });

}

// const fadeOutAnimation =  ({current, layouts})=>{
//   return({
//     cardStyle: {
//       opacity: current.progress,
//       backgroundColor: "#121212",
//     }
//   });

// }

const Stack = createStackNavigator();

export default function Main() {
  return (
    <Stack.Navigator>
      <Stack.Screen  name="Home" component={Home} 
      options={{headerShown: false}}/>
      <Stack.Screen
        name="List"
        component={List}
        options={{headerShown: false, cardStyleInterpolator: slideInRightAnimation}}
       />
    </Stack.Navigator>
  );
}
