import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  View,
} from "react-native";
import CheckBox from '@react-native-community/checkbox';

import Animated, {useSharedValue, useAnimatedStyle, useAnimatedGestureHandler,
   withSpring, withTiming, withDelay, runOnJS} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";

import {DataContext} from "../data/DataContext";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",

    width: screen.width,
  
    zIndex: 2,
  },
  content: {
    backgroundColor: "#404040",
  
    width: screen.width * 0.9,
    flexDirection: "row",
    alignItems: "center",  
    marginStart: screen.width * 0.05,  

    zIndex: 2,
  },
  description: {
    color: "#fff",
    fontSize: 16,
  },
  actionRight:{
    width: screen.width * 0.9,
    backgroundColor: "#202020",  
    height: "65%",
    position: "absolute",
    marginStart: screen.width * 0.05, 
 
    zIndex: 1 
  },


  icon:{
      color: "#cf6679",
      width: 32,
      position:"absolute",
      top: 0,
      right: 16,
      transform: [{translateY: 16}],   
  },
});

/*

swipe to delete - done

lägga till ny task - done

markera som klar -> stryks  över bock/fyrkant att kryssa i -> done

meny för att radera alla delete list / edit list / delete completed tasks / delete all tasks -> klar 

hemsida med overview över de listor som finns + ikoner för att göra nya listor-> done

bakgrundsbild -> i morgon 

drag and drop to order items -> helgen

TESTA/styla innan resten 

huvud meny med: Settings Send feedback 

setting screen : theme sync data

klicka på task för att ändra beskrivning/delete task/due date / list

*/

export default function TaskItem({ item, onPress, onDelete, onUpdateDone }) {

  const db = useContext(DataContext).db;
   const [taskDone, setTaskDone] = useState(item.done === 1? true : false);

    const [descriptionStyle, setDescriptionStyle] = useState(styles.description);
    const [dateStyle, setDateStyle] = useState(styles.description);
 

    useEffect(()=>{

      if(taskDone){

        setDescriptionStyle([styles.description, {textDecorationLine: "line-through", }]);

      
      }else{
        setDescriptionStyle(styles.description);
      }


    }, [taskDone])

    useEffect(()=>{

      if(item.dueDate && isPassedDueDate(new Date(item.dueDate))){

      
        setDateStyle([{color: "red"}]);

      
      }else{
        setDateStyle([]);
      }


    }, [])



    async function updateTaskDone(newValue){

      setTaskDone(newValue);

      try{

        var res = await db.updateTaskDone(item.id, newValue);

      }catch(error){
        console.error(error);
      }
      if(!res){
        console.error("updateTaskDone: task not updated");
      }else{
        onUpdateDone(newValue);

      }

    }
   
    const transX = useSharedValue(0);
    const height = useSharedValue(100);
    const opacity = useSharedValue(1);

    const animatedTransX = useAnimatedStyle(()=> {
        return ({

            transform: [{translateX: transX.value}]
        })
    })

    const animatedHeight = useAnimatedStyle(()=> {

        return (
            {

                height: height.value,
            }
        )
    })

    const animatedOpacity = useAnimatedStyle(()=>{
      return (
        {

            opacity: opacity.value,
        }
    )
    })


  function toTimeString(date){

    return date.toLocaleTimeString().slice(0, 5);

  }

   function toDisplayDate(date){
     let dateObj = new Date(date);
     if(isToday(dateObj)){
       return `Today ${toTimeString(dateObj)}`;
     }
     else {
       return `${dateObj.toDateString()} ${toTimeString(dateObj)}`;
     }
   }

   function isToday(date){

    console.log(date);

    let today = new Date();
 

    return date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

   }


   function isPassedDueDate(date){
     let now = new Date();

    return now.getTime() >= date.getTime();
   }

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {         
          },
          onActive: (event, ctx) => {
          
          
           if(event.translationX < 0){
            transX.value = event.translationX;
         
           }
          },
          onEnd: (event, ctx) => {
          
            if(event.translationX < (screen.width * -0.5)){
                    transX.value = withSpring(-screen.width, {damping: 5, overshootClamping: true}, ()=>{

                    opacity.value = withSpring(0, {damping: 5, overshootClamping: true}, ()=>{
                     
                      height.value = withSpring(0, {damping: 5, overshootClamping: true},runOnJS(onDelete));
                    });
                   
                   
                });
              
            }else{
                transX.value = withSpring(0, {damping: 5, overshootClamping: true});
            }
          },

    });

  return (
   
    <Animated.View style={[styles.container,  animatedHeight]}>
    
    
    <PanGestureHandler activeOffsetX={[-20, 100000]} onGestureEvent={gestureHandler} >
    <Animated.View style={[{flexDirection: "row", zIndex: 2, height: "65%" ,width: screen.width * 0.9 }, animatedTransX]} >

    <View style={styles.content}>
    <CheckBox  tintColors={{true: "green", false: "#eee"}} style={{marginHorizontal: 16}} value={taskDone} 
         onValueChange={updateTaskDone}/>
    <Pressable
    style={styles.list}
      onPress={() => {
        onPress();
      }}
    >
    <Text style={descriptionStyle}>{item.description}</Text>
   
    </Pressable>
    </View>

    
    </Animated.View>
    </PanGestureHandler>
      
    <Animated.View style={[styles.actionRight, animatedOpacity]}>
    
    <Icon style={styles.icon} name="delete" size={32} />

  </Animated.View>
  
   
  
    </Animated.View>
);}


