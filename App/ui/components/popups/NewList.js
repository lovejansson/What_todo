import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ImageBackground
} from "react-native";

import { DataContext } from "../data/DataContext";

import Icons from "./Icons";
import Icon from "react-native-vector-icons/AntDesign";
import Emoji from 'react-native-emoji';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212"
  },
  inputContainer: {
    backgroundColor: "#242424",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },

  label:{
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  inputName: {
    backgroundColor: "#242424",
    color: "#fff",
    fontSize: 20,
    width: "100%",
    marginBottom: 16,
    padding: 16,

  },

  buttonIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginEnd: 16,
    alignSelf: "flex-end"

  },

  emoji: {
    fontSize: 32,
    marginEnd: 4,
  },

  button: {
    alignSelf: "flex-end",
    margin: 16,
  },
  buttonDismiss: {
    // backgroundColor: "red",
    // position: "absolute",
    // end: 24,
    // top: 32,
    // width: 32,
    // height: 32,
    // borderRadius: 50,
  },
  iconSave: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  iconDismiss: {
    color: "#000",
    transform: [{ rotate: "45 deg" }],

    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  buttonSave: {
    backgroundColor: "red",
    borderRadius: 50,
    marginTop: "auto",
  },
});

export default function NewList({ navigation, route}) {
  const db = useContext(DataContext).db;
  const setLists = useContext(DataContext).setLists;

   const [showIconsPopup, setShowIconsPopup] = useState(false);
  const [chosenIcon, setChosenIcon] = useState("memo");
  const [chosenListName, setChosenListName] = useState("");

  useEffect(()=>{
    if(route.params){

      setChosenIcon(route.params.list.icon);
      setChosenListName(route.params.list.name);
    }

  }, [])

  async function saveList() {

    if(route.params){

      let updated = await db.updateList({id: route.params.list.id, name: chosenListName, icon: chosenIcon})

      if(updated){
        setLists((oldLists) => {
          let idx = oldLists.indexOf(route.params.list);

          oldLists[idx] = {id: route.params.list.id, name: chosenListName, icon: chosenIcon, count: route.params.list.count};

          return oldLists;
          
        }
        );
      }
    }else{
      let newId = await db.insertList(chosenListName, chosenIcon);
      setLists((oldLists) => [
        ...oldLists,
        { name: chosenListName, icon: chosenIcon, id: newId, count: 0 },
      ]);

    }
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showIconsPopup}
        onRequestClose={() => setShowIconsPopup(false)}
      >
        <Icons
          dismiss={(icon) => {
            if(icon){
              setChosenIcon(icon);
            }
         
            setShowIconsPopup(false);
          }}
        />
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon style={styles.iconDismiss} name="plus" size={32} color="black"></Icon>
      </TouchableOpacity>
    <View>
        <TextInput
          style={styles.inputName}
          value = {chosenListName}
          placeholder="Name"
          placeholderTextColor="#fff"
        selectionColor="#fff"
          keyboardType="ascii-capable"
          onChangeText={(value) => {
            setChosenListName(value);
          }}
        />

      <TouchableOpacity
      style={styles.buttonIcon}
          onPress={() => {
            setShowIconsPopup(true);
          }}
        >
          <Emoji name={chosenIcon} style={styles.emoji}/>
          <Icon name="down" size={24} color="#fff"/>
        </TouchableOpacity>
        </View>

      <TouchableOpacity
        style={[styles.button, styles.buttonSave]}
        onPress={() => {
          saveList();
          navigation.goBack();
        }}
      >
        <Icon style={styles.iconSave} name="check" size={32} color="black"></Icon>
      
      </TouchableOpacity>
    </View>
  );
}
