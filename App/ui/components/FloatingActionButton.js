
import React, {useContext} from "react";
import {StyleSheet, View, TouchableWithoutFeedback} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import Animated, {useSharedValue, useAnimatedStyle, 
    withTiming, withSequence} from "react-native-reanimated";

import {ColorThemeContext} from "../../contexts/ColorTheme";


  
const styles = StyleSheet.create({

    button: {
        justifyContent: "center",
        padding: 10, 
      },

  
});

export default function FloatingActionButton({action, icon, style}){

    const colors = useContext(ColorThemeContext).colors;    
    const transX = useSharedValue(-5);
    const transY = useSharedValue(-5);
  
    const animatedTrans = useAnimatedStyle(()=> {
      return ({
  
          transform: [{translateX: transX.value}, {translateY: transY.value}]
      })});

  const buttonStyle = [styles.button, {backgroundColor: colors.mainButton}, animatedTrans];
  const buttonContainerstyle  = [{backgroundColor: colors.mainButtonShadow}, style];
  const iconStyle = {color: colors.icon};


    function onPress(){

        action();
        
        transY.value = withSequence(withTiming(0, {duration: 40}), withTiming(-5, {duration:200}));
        
        transX.value = withSequence(withTiming(0, {duration: 40}), withTiming(-5, {duration: 200}));

    }


    return(
        <View style={buttonContainerstyle}>
          <Animated.View
            style={buttonStyle}>
          <TouchableWithoutFeedback  onPress={onPress}>
            <Icon
              style={iconStyle}
              name={icon}
              size={32}
            />
            </TouchableWithoutFeedback>
          </Animated.View>
          
        </View>
    )

}

