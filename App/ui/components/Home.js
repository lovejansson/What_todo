import React, {  useContext, useEffect, useRef,useState} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  Pressable
} from "react-native";

import {DataContext} from "../../contexts/Data";
import {ColorThemeContext} from "../../contexts/ColorTheme";

import ListItem from "./ListItem";

import FloatingActionButton from "./FloatingActionButton";

import HomeHeader from "./HomeHeader";

import Menu from "./Menu";

import EmptyData from "./EmptyData";

const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flex: 1,
   
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
  },
  overlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent"
},
});


export default function Home({navigation}) {
  const colors = useContext(ColorThemeContext).colors;
  const theme = useContext(ColorThemeContext).theme;
  const lists = useContext(DataContext).lists;
  const loading = useContext(DataContext).loading;
  const setCurrentList = useContext(DataContext).setCurrentList;
  const setTasks = useContext(DataContext).setTasks;
  const scrollOffset = useContext(DataContext).scrollOffset;
  const setScrollOffset = useContext(DataContext).setScrollOffset;
  const flatListRef = useRef(null);
  const containerStyle = [styles.container, {backgroundColor: colors.background}];

  const [showMenu, setShowMenu] = useState(false);

  let scrollOffsetLocal = 0;

  useEffect(scrollToOffset);

  function navigateToList(item){
    console.log(scrollOffsetLocal)
    setScrollOffset(scrollOffsetLocal);
    setTasks(null);
    setCurrentList(null);
    setCurrentList(item);
    navigation.navigate("List")
  }

  function showNewListModal(){
    navigation.navigate("NewList");
  }

  function toggleShowMenu(){
  
    setShowMenu(!showMenu);
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

  function navigateToSettings(){
    navigation.navigate("Settings");
    toggleShowMenu();
  }


  const settingsMenuOption =  {icon: "setting", title: "Settings", action: navigateToSettings};
  const feedbackMenuOption = {icon: "mail", title: "Send feedback", action: ()=>{console.log("Send feedback menu option")}};
  const rateAndReviewMenuOption = {icon: "staro", title: "Rate & review", action: ()=>{console.log("Rate and review")}}

  const menuItems = [settingsMenuOption, feedbackMenuOption, rateAndReviewMenuOption];

  return (
    <View style={containerStyle}>
      <StatusBar backgroundColor={colors.background}  barStyle={theme === "white" ? "dark-content" : "light-content"}/>
      <HomeHeader actionRight={toggleShowMenu}/>
      {lists.length === 0 ? (
        <EmptyData info="No lists yet"/>
      ) : (
        <FlatList
          ref={flatListRef}
          style={styles.flatList}

          data={lists}
          onScroll={onScroll}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{backgroundColor: colors.separator, height: 0.8, width: window.width - 32, 
          alignSelf: "center", marginVertical: 16}}></View>}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      
      <FloatingActionButton action={showNewListModal} icon="plus" style={styles.fab}/>

      {showMenu && 
        <Pressable onPress={toggleShowMenu} style={styles.overlay}>
         
          <Menu items={menuItems}/>
        </Pressable>}
    </View>
  );
}
