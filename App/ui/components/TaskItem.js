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

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: screen.width,
  },
  content: {
    width: screen.width * 0.9,
    flexDirection: "row",
    alignItems: "center",  
    marginStart: screen.width * 0.05, 
    borderRadius: 8,
    zIndex: 1,
 
    
  },
  description: {
    fontSize: 16,
    maxWidth: "85%",
    paddingVertical: 24,
  },
  actionRight:{
    width: screen.width * 0.9,
    marginStart: screen.width * 0.05, 
    borderRadius: 8,
    position: "absolute",
    zIndex: 0
  },
  deleteIcon:{
      width: 32,
      position:"absolute",
      top: 0,
      right: 16,
      transform: [{translateY: -16}],   
      zIndex: 0,
  },
  checkbox: {
    marginHorizontal: 16,
  }
  
});

/*

swipe to delete - done

lägga till ny task - done

markera som klar -> stryks  över bock/fyrkant att kryssa i -> done

meny för att radera alla delete list / edit list / delete completed tasks / delete all tasks -> klar 

hemsida med overview över de listor som finns + ikoner för att göra nya listor-> done

bakgrundsbild -> done

themes -> pågående

custom header, byta teman, göra bättre kod angående uppdatera data -> helgen 

testa komponenter -> nästa vecka 

drag and drop för att ordna

huvud meny på hemskärm: backup data, settings, send feedback

setting screen : theme sync data språk?

klicka på task för att ändra beskrivning/delete task/due date / list

*/

export default function TaskItem({ item, onPress, onDelete, onUpdateDone }) {

  const colors = useContext(ColorThemeContext).colors;

  let contentStyle = [styles.content, {backgroundColor: colors.background2}];
  let actionRightStyle = [styles.actionRight, {backgroundColor: "#000"}];
  const deleteIconStyle = [styles.deleteIcon, {color: colors.error}];
  const checkBoxColors = {true: colors.check, false: colors.uncheck};

 

  const db = useContext(DataContext).db;
   const [taskDone, setTaskDone] = useState(item.done === 1? true : false);
   const [descriptionStyle, setDescriptionStyle] = useState([styles.description, {color: colors.text}]);

 
   // const [dateStyle, setDateStyle] = useState(styles.description);
 

    useEffect(()=>{

      if(taskDone){
        setDescriptionStyle([styles.description, {textDecorationLine: "line-through", }, {color: colors.text}]);

      
      }else{
        setDescriptionStyle([styles.description, {color: colors.text}]);
      }


    }, [taskDone])

    // useEffect(()=>{

    //   if(item.dueDate && isPassedDueDate(new Date(item.dueDate))){

      
    //     setDateStyle([{color: "red"}]);

      
    //   }else{
    //     setDateStyle([]);
    //   }


    // }, [])

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

    const numLines = (item.description.length / 20) < 1 ? 1 : Math.floor(item.description.length / 20);
   
    const transX = useSharedValue(0);
    const height = useSharedValue("100%");
    const opacity = useSharedValue(1);

    function adjustHeight(event){


  
      console.log(event.nativeEvent.layout)

      height.value = event.nativeEvent.layout.height + 24;

      contentStyle = [contentStyle, {height: event.nativeEvent.layout.height}];
      actionRightStyle = [actionRightStyle, {height: event.nativeEvent.layout.height}];
    }
   

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


  // function toTimeString(date){

  //   return date.toLocaleTimeString().slice(0, 5);

  // }

  //  function toDisplayDate(date){
  //    let dateObj = new Date(date);
  //    if(isToday(dateObj)){
  //      return `Today ${toTimeString(dateObj)}`;
  //    }
  //    else {
  //      return `${dateObj.toDateString()} ${toTimeString(dateObj)}`;
  //    }
  //  }

  //  function isToday(date){

  //   console.log(date);

  //   let today = new Date();
 

  //   return date.getFullYear() === today.getFullYear() &&
  //         date.getMonth() === today.getMonth() &&
  //         date.getDate() === today.getDate();

  //  }


  //  function isPassedDueDate(date){
  //    let now = new Date();

  //   return now.getTime() >= date.getTime();
  //  }

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
   
    <Animated.View style={[styles.container, animatedHeight]}>
      <PanGestureHandler activeOffsetX={[-20, 100000]} onGestureEvent={gestureHandler} >
        <Animated.View style={[animatedTransX, {zIndex: 1}]} >

          <View style={contentStyle} >
            <CheckBox  tintColors={checkBoxColors} style={styles.checkbox} value={taskDone} 
                onValueChange={updateTaskDone}/>
            <Pressable
            style={styles.list}
              onPress={() => {
                onPress();
              }}>
            <Text style={descriptionStyle} onLayout={adjustHeight}>{item.description}</Text>
          
            </Pressable>
          </View>
        </Animated.View>

      </PanGestureHandler>
      
      <Animated.View style={[actionRightStyle, animatedOpacity]}>
      
        <Icon style={deleteIconStyle} name="delete" size={32} />

      </Animated.View>
  
    </Animated.View>
);}


