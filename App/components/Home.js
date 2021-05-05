import React, {  useContext, useLayoutEffect} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {DataContext} from "../data/DataContext";
import Icon from "react-native-vector-icons/AntDesign";

import ListItem from "../components/ListItem";

import HeaderActionRight from "../components/HeaderActionRight";
import Emoji from 'react-native-emoji';



const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flex: 1,
  },
  button: {
    position: "absolute",
    backgroundColor: "#000",
    borderRadius: 50,
    end: 24,
    bottom: 32,
  },
  icon: {
    color: "#fff",

    paddingVertical: 18,
    paddingHorizontal: 18,
  },
});

export default function Home({navigation}) {

  const lists = useContext(DataContext).lists;

  const db = useContext(DataContext).db;
  const loading = useContext(DataContext).loading;

  useLayoutEffect(()=>{
    navigation.setOptions({ title: "¯\\_(ツ)_/¯", headerRight: () => <HeaderActionRight onPress={()=> { console.log("menu")}}/>});
  }, [])

  function renderItem({item}){
    return (
      <ListItem item={item} onPress={() => {
        navigation.navigate("List", {list: item});
      }} />
    )
  }

  return (
    
    <View style={styles.container}>

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
    </View>
  
  );
}
