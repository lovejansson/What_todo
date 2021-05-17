import React, { useState, createContext, useEffect, useContext } from "react";
import {StyleSheet, Text, Dimensions} from "react-native";
import Animated, {useSharedValue, useAnimatedStyle,
     withTiming} from "react-native-reanimated";
import { ColorThemeContext } from "./ColorTheme";

export const NotificationContext = createContext();

const window = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 100,
        left: window.width / 4,
        // transform: [{translateX: - (window.width / 3)}],
    
        width: window.width / 2,
        borderRadius: 50,
      },
    
      msg: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
        
      }
});

export const NotificationProvider = ({children}) => {

 const colors = useContext(ColorThemeContext).colors;

 const Status = Object.freeze({
        ERROR: 0,
        INFO: 1,
 })
 
 const opacity = useSharedValue(0);

 const animatedOpacity = useAnimatedStyle(()=>{
   return (
     {

         opacity: opacity.value,
     }
   )
 })



const [containerStyle, setContainerStyle] = useState([styles.container, animatedOpacity]);
let [msgStyle, setMsgStyle] = useState([styles.msg]);
  
  const [msg, setMsg] = useState("");

  function showMsg(){

    opacity.value = 1;

    setTimeout(()=>{
      opacity.value = withTiming(0, {duration: 500});
    }, 2500);
  }
  
  function notify(msg, status){

    console.log(status)
      switch(status){

        case Status.ERROR:
       
            setContainerStyle([styles.container, animatedOpacity, {backgroundColor: colors.error} ]);
            setMsgStyle([styles.msg, {color: "#fff"}]);
          
            break;

        case Status.INFO:
         
            setContainerStyle([styles.container, animatedOpacity, {backgroundColor: colors.background3} ]);
            setMsgStyle([styles.msg, {color: colors.text}]);
           
            break;
      }
    

    setMsg(msg);
    showMsg();

  }
  return (
    <NotificationContext.Provider value={{setMsg, showMsg, notify, Status}}>

      {children}

      <Animated.View style={containerStyle} >
            <Text style={msgStyle}>{msg}</Text>
        </Animated.View>
    </NotificationContext.Provider>
  );
};
