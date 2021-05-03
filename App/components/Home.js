import React, {  useContext } from "react";
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
  // console.log("Home start")
  // console.log(DataContext);
  const lists = useContext(DataContext).lists;

  const db = useContext(DataContext).db;

  // console.log(db)

  const loading = useContext(DataContext).loading;

  // console.log("loading " + loading)
  // console.log(lists);

  function renderItem({item}){
    return (
      <ListItem item={item} onPress={() => {

        navigation.navigate("List", {listName: item.name, listId: item.id});
      }} />
    )
  }

  return (
    
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={lists}
          renderItem={renderItem}
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
