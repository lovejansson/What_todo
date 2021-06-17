import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  Vibration,
  
} from "react-native";
import CheckBox from '@react-native-community/checkbox';

import Animated, {useSharedValue, useAnimatedStyle, useAnimatedGestureHandler,
   withSpring, runOnJS, useAnimatedProps, withTiming, useAnimatedReaction, scrollTo} from "react-native-reanimated";
import { PanGestureHandler, TouchableWithoutFeedback,TouchableOpacity} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import { NotificationContext } from "../../contexts/Notification";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",

    position: "absolute",
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
      backgroundColor: "transparent",

      
  
      position: "absolute",
      top:28,
      bottom: 0,
      alignItems: "center",
    
      right: 0,
      zIndex: 0, 

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


testa komponenter -> nästa vecka 
huvud meny på hemskärm: backup data, settings, send feedback
setting screen : theme sync data ?
*/

export default function TaskDetails({ navigation, task, index, openEditMode, scrollY, scrollView, positions, updatePositions})
{
    /* CONTEXTS */

    const db = useContext(DataContext).db;
    const setTasks = useContext(DataContext).setTasks;
    const colors = useContext(ColorThemeContext).colors;
    const theme = useContext(ColorThemeContext).theme;
    const Status = useContext(NotificationContext).Status;
    const notify = useContext(NotificationContext).notify;

    /* STYLE UPDATES/ADJUSTMENTS */

    let contentStyle = [styles.content];
    let actionRightStyle = [styles.actionRight];
    const deleteIconStyle = [styles.deleteIcon, {color: colors.text2}];
    const checkBoxColors = {true: colors.check, false: colors.uncheck};
    const iconStyle = [styles.icon, {color: colors.text2}];
    const inputStyle = [styles.input, {color: colors.text}];
    const transX = useSharedValue(0);
  
    const height = useSharedValue(90);
    const opacity = useSharedValue(1);

    const transY = useSharedValue(positions.value[task.id] * 90);
    const topPos = useSharedValue(positions.value[task.id] * 90);


 
    const [offsetX, setOffsetX]= useState([-20, 1000000]);


    const animatedTransX = useAnimatedStyle(()=> {
        return ({

            transform: [{translateX: transX.value}]
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
   const [dragging, setDragging] = useState(false);

   
   const animatedOuterContainerStyle = useAnimatedStyle(()=>{

    return({
      top: 0,
      zIndex: dragging ? 4 : 0,
      backgroundColor: dragging ?  colors.backgroundMenu : colors.background ,
      left: 0,
      right: 0,
      transform: [{translateY: transY.value}],
      height: height.value,
    })
  }, [dragging]);


  useAnimatedReaction(()=>{
    return positions.value[task.id];
  }, (curr, prev) => {

     if(curr !== prev && prev !== null && !dragging){
     
        transY.value = withSpring(curr * 90, {overshootClamping: true});
        topPos.value = curr * 90;
    }
});
 
 

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
         deleted = await db.deleteTask(task.id);
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

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {   
          console.log("start pan") 
          ctx.y = transY.value;     
          },
          onActive: (event, ctx) => {

           if(dragging){
            //  console.log(event)

             transY.value = ctx.y + event.translationY;
               console.log(transY.value);
              console.log(scrollY.value)

              let maxScroll = 22 * 90 - 6 * 90;
            

            if(transY.value < scrollY.value){
              console.log("trans y lower than lower bound")
              console.log(transY.value);
              console.log(scrollY.value)
              const diff = Math.min(scrollY.value - transY.value, scrollY.value);
              scrollY.value -= diff;
              scrollTo(scrollView, 0, scrollY.value, false);
              ctx.y -= diff;
              transY.value = ctx.y + event.translationY;

            }else if(transY.value > (scrollY.value + 90 * 5)){
               
              const diff = Math.min(transY.value -(scrollY.value + 90 * 5), maxScroll);
              scrollY.value += diff;
              scrollTo(scrollView, 0, scrollY.value, false);
              ctx.y += diff;
              transY.value = ctx.y + event.translationY;

            }

             let prevPosY = (positions.value[task.id] - 1) * 90;
             let nextPosY = (positions.value[task.id] + 1)* 90;

             if(transY.value < prevPosY + 45){
               updatePositions(task, -1);
             }else if(transY.value > nextPosY - 45){
               updatePositions(task, 1);
             }

       
           }else if(event.translationX < 0){
            transX.value = event.translationX;
           }

        
          },
          onEnd: (event, ctx) => {
            console.log("END")

            if(dragging){
              runOnJS(setDragging)(false);
              runOnJS(setOffsetX)([-20, 1000000])
              transY.value = positions.value[task.id] * 90 ;
              topPos.value = positions.value[task.id] * 90;
            
            }else{
                
              if(event.translationX < (screen.width * -0.6)){
                transX.value = withSpring(-screen.width, {damping: 5, overshootClamping: true}, ()=>{

                opacity.value = withSpring(0, {damping: 5, overshootClamping: true}, ()=>{
                
                  height.value =  withSpring(0, {damping: 2, overshootClamping: true}, runOnJS(deleteTask));
                });
              });
        
              }else{
                  transX.value = withSpring(0, {damping: 5, overshootClamping: true});
              }

            }

          },
          onCancel: (event, ctx) =>{

            console.log("CANCEl")
          },

          onFinish: (event, ctx) => {
            console.log("finnish")
          }

    }, [dragging]);



  function onLongPress(){
    console.log("on long press")
    setOffsetX([0, 0]);
    setDragging(true);
    Vibration.vibrate(50);
  
  }

  const imageUrl = `../../images/background_${theme}_row.png`;

  return (
   
    <Animated.View style={[styles.container, animatedOuterContainerStyle]}>

      <PanGestureHandler activeOffsetX={offsetX} onGestureEvent={gestureHandler}>

        <Animated.View style={[animatedTransX, {zIndex: 1}]} >

          <View style={contentStyle}>
            <CheckBox  tintColors={checkBoxColors} style={styles.checkbox} value={taskDone} 
                onValueChange={updateDone}/>   
            <TouchableOpacity
              style={styles.list}
              onLongPress={onLongPress}
              onPress={openEditMode}>
               <Text style={descriptionStyle} numberOfLines={3} ellipsizeMode="tail" >{task.description}</Text>  
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>

      <Animated.View style={[animatedOpacity]}>
        <Icon style={deleteIconStyle} name="delete" size={28} />
      </Animated.View>
     
    </Animated.View>
);
}

