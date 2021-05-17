import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Pressable
} from "react-native";
import CheckBox from '@react-native-community/checkbox';

import Animated, {useSharedValue, useAnimatedStyle, useAnimatedGestureHandler,
   withSpring, runOnJS, useAnimatedProps, withTiming} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import { NotificationContext } from "../../contexts/Notification";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    height: 90,
    width: screen.width,

  },
  content: {
    height: 90,
    width: screen.width,
    flexDirection: "row",
    alignItems: "center",     
  },

  description: {
    fontSize: 18,
    width: screen.width * 0.75,
  
    fontFamily: "Mukta-Regular",
  },
  list: {

height: "100%",
justifyContent: "center"
  },
  
  actionRight:{
    height: 90,
    width: screen.width,
    position: "absolute",
    top:0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  deleteIcon:{
      marginEnd: 16,
      padding: 8,
      borderRightWidth: 1,
      borderBottomWidth: 1,

  },
  input: {
    fontSize: 18,
    fontFamily: "Mukta-Regular"
  },
  icon: {
    padding: 8,
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
themes -> done 
göra bättre kod angående uppdatera data -> done
ändra teman via settings och spara nångstans -> done
klicka på task för att ändra beskrivning  -> done
drag and drop för att ordna


anpassa rutig bakgrund efter skärmar/färger 
testa komponenter -> nästa vecka 
huvud meny på hemskärm: backup data, settings, send feedback
setting screen : theme sync data ?
*/

export default function TaskDetails({ navigation, task, index, openEditMode, activateDrag})
{
    /* CONTEXTS */

    const db = useContext(DataContext).db;
    const setTasks = useContext(DataContext).setTasks;
    const colors = useContext(ColorThemeContext).colors;
    const theme = useContext(ColorThemeContext).theme;
    const Status = useContext(NotificationContext).Status;
    const notify = useContext(NotificationContext).notify;

    /* STYLE UPDATES/ADJUSTMENTS */

    let contentStyle = [styles.content, {backgroundColor: colors.background}];
    let actionRightStyle = [styles.actionRight];
    const deleteIconStyle = [styles.deleteIcon, {color: colors.text2, backgroundColor: colors.background2, borderColor: colors.borderLayer3}];
    const checkBoxColors = {true: colors.check, false: colors.uncheck};
    const iconStyle = [styles.icon, {color: colors.text2}];
    const inputStyle = [styles.input, {color: colors.text}];
    const transX = useSharedValue(0);
    const transY = useSharedValue(0);
    const height = useSharedValue(100);
    const opacity = useSharedValue(1);
 
    const [offsetX, setOffsetX]= useState([-20, 1000000]);



    const animatedTransX = useAnimatedStyle(()=> {
        return ({

            transform: [{translateX: transX.value}]
        });
    });

    const animatedTransY = useAnimatedStyle(()=>{

      return({
        transform: [{translateY: transY.value}]
      })
    })

    const animatedHeight = useAnimatedStyle(()=> {

        return ({
                height: height.value,
            });
    });

    const animatedOpacity = useAnimatedStyle(()=>{
      return ({

            opacity: opacity.value,
        });
    });

    /* STATE */

   const [taskDone, setTaskDone] = useState(task.done === 1? true : false);
   const [descriptionStyle, setDescriptionStyle] = useState([styles.description, {color: colors.text}]);
   const [activeXoffset, setActiveXoffset] = useState([-20, 100000]);
 

    useEffect(updateDescriptionStyle, [taskDone]);

    /* METHODS */

    function updateDescriptionStyle(){
      if(taskDone){
        setDescriptionStyle([styles.description, {textDecorationLine: "line-through", }, {color: colors.text}]);

      
      }else{
        setDescriptionStyle([styles.description, {color: colors.text}]);
      }

    }

    async function updateDone(value){

      setTaskDone(value);

      try{

        var res = await db.updateTaskDone(task.id, value);

      }catch(error){
        notify("Could not update task", Status.ERROR);
      }
      if(res){
        // setTasks(oldTasks => {
        //   // const idx = oldTasks.indexOf(task);
        //   // oldTasks[idx].done = value;
        //   // return oldTasks;
        // }); 
      }
    }

    async function deleteTask(){
 
      let deleted;
  
      try{
         deleted = await db.deleteTas(task.id);
      }catch(error){
        notify("Failed to delete task", Status.ERROR);
        height.value = 90;
        opacity.value = 1;
        transX.value = 0;

      }
  
      if(deleted){
          setTasks(oldTasks => {
  
              return oldTasks.filter(t => { return t.id != task.id})
          });        
      }
    }


    function resetOffsetX(){
      setOffsetX([-20, 1000000]);
     
    }

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {   
          console.log("start pan")      
          },
          onActive: (event, ctx) => {
        
           if(offsetX[0] === 0){
            
             transY.value = event.translationY;
            
           }else if(event.translationX < 0){
            transX.value = event.translationX;
           }

        
          },
          onEnd: (event, ctx) => {
               transY.value = withSpring(0, {}, runOnJS(resetOffsetX));
  
          
            if(event.translationX < (screen.width * -0.6)){
                    transX.value = withSpring(-screen.width, {damping: 5, overshootClamping: true}, ()=>{

                    opacity.value = withSpring(0, {damping: 5, overshootClamping: true}, ()=>{
                     
                      height.value =  withSpring(0, {damping: 2, overshootClamping: true}, runOnJS(deleteTask));
                    });
                });
              
            }else{
                transX.value = withSpring(0, {damping: 5, overshootClamping: true});
            }
          },

    });



  function onLongPress(){
    console.log("on long press")
  setOffsetX([0, 0]);
  
  }

  const imageUrl = `../../images/background_${theme}_row.png`;

  return (
   
    <Animated.View style={[styles.container, animatedHeight]}>
      <PanGestureHandler activeOffsetX={offsetX} onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedTransX, animatedTransY, {zIndex: 1}]} >

          <View style={contentStyle}>
            <CheckBox  tintColors={checkBoxColors} style={styles.checkbox} value={taskDone} 
                onValueChange={updateDone}/>
                
            <Pressable
              style={styles.list}
              onLongPress={onLongPress}
              onPress={openEditMode}>
               <Text style={descriptionStyle} numberOfLines={3} ellipsizeMode="tail" >{task.description}</Text>  
            </Pressable>
          </View>
        </Animated.View>
      </PanGestureHandler>
    
      <ImageBackground source={theme === "black" ? require("../../images/background_dark_row.png") : require("../../images/background_light_row.png")} imageStyle={{resizeMode: "cover"}} style={actionRightStyle} >
      <Animated.View style={[animatedOpacity]}>
        <Icon style={deleteIconStyle} name="delete" size={28} />
      </Animated.View>
      </ImageBackground>

    </Animated.View>
);
}

