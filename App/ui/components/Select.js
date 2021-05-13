import React, {useState} from "react";
import {View, Text, StyleSheet, Pressable, FlatList, Dimensions} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useContext } from "react/cjs/react.development";
import { ColorThemeContext } from "../../contexts/ColorTheme";

const window = Dimensions.get("window");


const styles = StyleSheet.create({
    container: {
        
        flex: 1,

       
    },
    flatList: {
        borderBottomWidth: 2,
        borderRightWidth: 3,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        
    
        

    },
    overlay: {
        position: "absolute",
        width: window.width,
        height: window.height,

    },
    text: {
        fontSize: 18,
        fontFamily: "Mukta-Regular",
        padding: 16,
        textTransform: "capitalize",
    }
})


export default function Select({items, onChange, initialValue}){
    const colors = useContext(ColorThemeContext).colors;

    const textStyle = [styles.text, {color: colors.text}]
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initialValue);

    const containerStyle = [styles.container, {backgroundColor: colors.background}];
    const flatListStyle = [styles.flatList, {backgroundColor: colors.backgroundMenu, borderColor: colors.borderMenu}];

    const iconStyle = {color: colors.icon}

    function toggleOpen(){
         console.log("toglglopen")
        setOpen(!open);
    }

    return(<View style={containerStyle}>

<Pressable style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 16}} onPress={toggleOpen}>
                <Text style={textStyle}>{initialValue}</Text><Icon style={iconStyle} name="down" size={20}/>
            </Pressable>

            {open && <View style={styles.overlay}/>}

           {open &&
                <FlatList style={flatListStyle} data={items}
                 renderItem={({item})=> 
                 <Pressable onPress={()=>{
                     setValue(item.value);
            
                     onChange(item.value);
                 }}><Text style={textStyle}>{item.label} </Text></Pressable>} keyExtractor={(item) => item.value}/>
                    
                }
    </View>);

}
  