import React, {  useContext, useLayoutEffect, useEffect} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar
} from "react-native";

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";
import Icon from "react-native-vector-icons/AntDesign";

import ListItem from "./ListItem";

import HomeHeader from "./HomeHeader";

const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  flatList: 
    {
    marginVertical: 16,
    marginStart: 8,
    marginEnd: 8,
  },
  column: {
    justifyContent: "space-between", 
    marginBottom: 16
  },
  button: {
    position: "absolute",
    borderRadius: 50,
    end: 24,
    bottom:0,
    marginBottom: 48,
  },
  icon: {
    color: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
});


export default function Home({navigation}) {

  console.log("ASPECT RATIO ")
  console.log(window.height / window.width);
  console.log(18/9)

  const colors = useContext(ColorThemeContext).colors;
  const lists = useContext(DataContext).lists;
  const loading = useContext(DataContext).loading;

  console.log(colors);

  const containerStyle = [styles.container, {backgroundColor: colors.background}]
  const iconStyle = [styles.icon, {color: colors.icon}];
  const buttonStyle = [styles.button, {backgroundColor: colors.mainButton}];

  function renderItem({item}){
    return (
      <ListItem item={item} onPress={() => {
        navigation.navigate("List", {list: item});
      }} />
    )
  }

  return (
    <View style={containerStyle}>
      <StatusBar backgroundColor={colors.background}/>
      <HomeHeader actionRight={()=>{console.log("menu")}}/>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          data={lists}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.column}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => {
          navigation.navigate("NewList");
        }}
      >
        <Icon name="plus" size={32} style={iconStyle}></Icon>
      </TouchableOpacity>
   
    </View>
  
  );
}
