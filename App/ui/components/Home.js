import React, {  useContext, useLayoutEffect} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import Icon from "react-native-vector-icons/AntDesign";

import ListItem from "./ListItem";

import HeaderActionRight from "./HeaderActionRight";

const window = Dimensions.get("window");

export default function Home({navigation}) {

  const colors = useContext(ColorThemeContext).colors;

  const styles = StyleSheet.create({

    image: {
    flex: 1,
      resizeMode:"contain", 
    },
    button: {
      position: "absolute",
      backgroundColor: colors.mainButton,
      borderRadius: 50,
      end: 24,
      bottom: 32,
    },
    icon: {
      color: colors.icon,
      paddingVertical: 18,
      paddingHorizontal: 18,
    },
  });

  const lists = useContext(DataContext).lists;

  const db = useContext(DataContext).db;
  const loading = useContext(DataContext).loading;

  useLayoutEffect(()=>{
    navigation.setOptions({ title: "What todo", headerRight: () => <HeaderActionRight onPress={()=> { console.log("menu")}}/>});
  }, [])

  function renderItem({item}){
    return (
      <ListItem item={item} onPress={() => {
        navigation.navigate("List", {list: item});
      }} />
    )
  }

  return (
    <ImageBackground source={require("../images/background_black_even.png")}  style={styles.image}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
        style={{marginVertical: 16, marginStart: 8, marginEnd: 8 }}
          data={lists}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{justifyContent: "space-between", marginBottom: 16}}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("NewList");
        }}
      >
      
      <Icon name="plus" size={32} style={styles.icon} color="white"></Icon>
      </TouchableOpacity>
   
    </ImageBackground>
  
  );
}
