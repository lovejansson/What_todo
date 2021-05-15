import React, { useContext, useEffect } from "react";
import { StyleSheet, FlatList }  from "react-native";
import MenuItem from "./MenuItem";
import { ColorThemeContext } from "../../contexts/ColorTheme";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const styles = StyleSheet.create({

    container: {
        position: "absolute",
        right: 8,
        top: 8,
        elevation: 4
        // borderStyle: "solid",
        // borderBottomWidth: 2,
        // borderEndWidth: 3,
        // borderTopWidth: 0.5,
        // borderStartWidth: 0.5,
    
    }
  });



/**
 * @props items :
 * Array<{icon: AntDesign 'name' attribute, title: description of item, action: Function to execute when selected }>
 */
export default function Menu({items}){

    const colors = useContext(ColorThemeContext).colors;

    const containerStyle = [styles.container, {backgroundColor: colors.backgroundMenu, borderColor: colors.borderMenu}];
    
    const scale = useSharedValue(0);

    useEffect(()=>{

        scale.value = withSpring(1, {damping: 30, stiffness: 500, overshootClamping: false});

    },[]);

    function renderItem({item}){
        return(
            <MenuItem content={item}/>
        );
    }

    const animatedScale = useAnimatedStyle(()=> {
        return ({
                transform: [{scale: scale.value}]
            });
    });

    return (
        <Animated.View  style={[containerStyle, animatedScale]}>
        <FlatList data={items} keyExtractor={(item) => item.title}  
        renderItem={renderItem}/>
        </Animated.View>
        )
}