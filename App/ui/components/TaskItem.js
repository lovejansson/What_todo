import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  View,
  ImageBackground
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
 
    width: screen.width,
  },
  content: {
    width: screen.width,
    height: 90,
    flexDirection: "row",
    alignItems: "center",  
    zIndex: 1,  
   
  },
  description: {
    fontSize: 16,
    width: screen.width * 0.75,
  },
  
  actionRight:{
    height: 90,
    width: screen.width,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  deleteIcon:{
      marginEnd: 16,
      padding: 8,
      borderRightWidth: 1,
      borderBottomWidth: 1,
     
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

custom header, byta teman, -> pågående

göra bättre kod angående uppdatera data -> helgen 

testa komponenter -> nästa vecka 

drag and drop för att ordna

huvud meny på hemskärm: backup data, settings, send feedback

setting screen : theme sync data språk?

klicka på task för att ändra beskrivning/delete task/due date / list

*/

export default function TaskItem({ item, onPress, onDelete, onUpdateDone }) {

  const colors = useContext(ColorThemeContext).colors;

  let contentStyle = [styles.content, {backgroundColor: colors.background}];
  let actionRightStyle = [styles.actionRight, {backgroundColor: colors.background2}];
  const deleteIconStyle = [styles.deleteIcon, {color: "#c8c8c8", backgroundColor: colors.background2, borderColor: "#000"}];
  const checkBoxColors = {true: colors.check, false: colors.uncheck};

 

  const db = useContext(DataContext).db;
   const [taskDone, setTaskDone] = useState(item.done === 1? true : false);
   const [descriptionStyle, setDescriptionStyle] = useState([styles.description, {color: colors.text}]);

    useEffect(()=>{

      if(taskDone){
        setDescriptionStyle([styles.description, {textDecorationLine: "line-through", }, {color: colors.text}]);

      
      }else{
        setDescriptionStyle([styles.description, {color: colors.text}]);
      }


    }, [taskDone])

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

    function adjustHeight(event){


  
      console.log(event.nativeEvent.layout)
      console.log(height.value);

      if(height.value === "100%"){
        height.value = event.nativeEvent.layout.height;

        contentStyle = [contentStyle, {height: event.nativeEvent.layout.height}];
        actionRightStyle = [actionRightStyle, {height: event.nativeEvent.layout.height}];
      }

 
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


    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {         
          },
          onActive: (event, ctx) => {
          
          
           if(event.translationX < 0){
            transX.value = event.translationX;
         
           }
          },
          onEnd: (event, ctx) => {
          
            if(event.translationX < (screen.width * -0.6)){
                    transX.value = withSpring(-screen.width, {damping: 5, overshootClamping: true}, ()=>{

                    opacity.value = withSpring(0, {damping: 5, overshootClamping: true}, ()=>{

                      console.log("before with timing")
                     
                      height.value =  withSpring(0, {damping: 2, overshootClamping: true}, runOnJS(onDelete));
                    });
                   
                   
                });
              
            }else{
                transX.value = withSpring(0, {damping: 5, overshootClamping: true});
            }
          },

    });

    console.log(require("../../images/background_black_row.png"))

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
            <Text style={descriptionStyle} numberOfLines={3} ellipsizeMode="tail" onLayout={adjustHeight}>{item.description}</Text>
          
            </Pressable>
          </View>
        </Animated.View>

      </PanGestureHandler>
      
      <ImageBackground source={require("../../images/background_black_row.png")} imageStyle={{resizeMode: "cover"}} style={actionRightStyle} >
      <Animated.View style={animatedOpacity}>
        <Icon style={deleteIconStyle} name="delete" size={28} />
      </Animated.View>
      </ImageBackground>
  
    </Animated.View>
);}


