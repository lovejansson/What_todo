import React, {  useContext, useEffect, useRef} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";



import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";

import ListItem from "./ListItem";

import FloatingActionButton from "./FloatingActionButton";

import HomeHeader from "./HomeHeader";

const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: "flex-end"
  },
  flatList: 
    {
    marginTop: 16,
    alignSelf: "stretch"
  },
  fab:{
    position: "absolute",
    bottom:24,
    end: 24,
  }
});


export default function Home({navigation}) {
  const colors = useContext(ColorThemeContext).colors;
  const lists = useContext(DataContext).lists;
  const loading = useContext(DataContext).loading;
  const setCurrentList = useContext(DataContext).setCurrentList;
  const setTasks = useContext(DataContext).setTasks;
  const scrollOffset = useContext(DataContext).scrollOffset;
  const setScrollOffset = useContext(DataContext).setScrollOffset;
  const flatListRef = useRef(null);
  const containerStyle = [styles.container, {backgroundColor: colors.background}];

  let scrollOffsetLocal = 0;

  useEffect(scrollToOffset);

  function navigateToList(item){
    console.log(scrollOffsetLocal)
    setScrollOffset(scrollOffsetLocal);
    setTasks([]);
    setCurrentList(null);
    setCurrentList(item);
    navigation.navigate("List")
  }

  function showNewListModal(){
    navigation.navigate("NewList");
  }


  function renderItem({item}){
    return (
      <ListItem item={item} onPress={()=>{navigateToList(item)}} />
    )
  }

  function scrollToOffset(){
    console.log(scrollOffset)

  return navigation.addListener("focus", ()=>{

    console.log("in focus");
    console.log(scrollOffset); 
    console.log(flatListRef.current)

    if( flatListRef.current !== null && scrollOffset){
      flatListRef.current.scrollToOffset(scrollOffset);
    }
   });
  }

  function onScroll(event){
    scrollOffsetLocal = event.nativeEvent.contentOffset.y;
  }

  return (
    <View style={containerStyle}>
      <StatusBar backgroundColor={colors.background}/>
      <HomeHeader actionRight={()=>{console.log("menu")}}/>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          style={styles.flatList}
          data={lists}
          onScroll={onScroll}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{backgroundColor: colors.background3, height: 0.8, width: window.width - 32, 
          alignSelf: "center", marginVertical: 16}}></View>}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      
      <FloatingActionButton action={showNewListModal} icon="plus" style={styles.fab}/>
    </View>
  );
}
