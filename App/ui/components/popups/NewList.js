import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Keyboard,
  Pressable
} from "react-native";

import { DataContext } from "../../../contexts/Data";
import { ColorThemeContext } from "../../../contexts/ColorTheme";

import Icons from "./Icons";
import Icon from "react-native-vector-icons/AntDesign";
import Emoji from 'react-native-emoji';

const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start",
  },

  label: {
    fontSize: 20,
    fontWeight: "bold",
  },

  input: {
    fontSize: 20,
    width: window.width - 32,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },

  icon: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  buttonIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginEnd: 16,
    alignSelf: "flex-end",
  
  },

  emoji: {
    fontSize: 32,
    marginEnd: 4,
  },

  buttonSave: {
    position: "absolute",
    end: 24,
    bottom: 24,
    borderRadius: 50,
  },

  buttonClose: {
    alignSelf: "flex-end",
    marginVertical: 16,
  }


});

export default function NewList({ navigation, route}) {
  const colors = useContext(ColorThemeContext).colors;
  const db = useContext(DataContext).db;
  const setLists = useContext(DataContext).setLists;

  const [showIconsPopup, setShowIconsPopup] = useState(false);
  const [chosenIcon, setChosenIcon] = useState("memo");
  const [chosenListName, setChosenListName] = useState("");

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  const inputStyle= [styles.input, {backgroundColor: colors.background2, color: colors.text}];
  const buttonSaveStyle = [styles.buttonSave, {backgroundColor: colors.mainButton}];
  const buttonCloseStyle = [styles.buttonClose, {color: colors.textButton}];
  const iconStyle = [styles.icon, {color: colors.icon}];
  const labelStyle = [styles.label, {color: colors.text}];

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

  function dismissKeyboard(){
    Keyboard.dismiss();
  }

  return (
    <Pressable style={containerStyle} onPress={dismissKeyboard}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showIconsPopup}
        onRequestClose={() => setShowIconsPopup(false)}>
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
      style={buttonCloseStyle}
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon style={iconStyle} name="close" size={32}></Icon>
      </TouchableOpacity>
      
      <View>
        <TextInput
          style={inputStyle}
          value = {chosenListName}
          placeholder="Name"
          placeholderTextColor={colors.text}
          selectionColor={colors.text}
          keyboardType="ascii-capable"
          onChangeText={(value) => {
            setChosenListName(value);
          }}
        />

      <TouchableOpacity
      style={styles.buttonIcons}
          onPress={() => {
            setShowIconsPopup(true);
          }}
        >
          <Emoji name={chosenIcon} style={styles.emoji}/>
          <Icon name="down" size={24} color={colors.icon}/>
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={buttonSaveStyle}
        onPress={() => {
          saveList();
          navigation.goBack();
        }}
        >
        <Icon style={iconStyle} name="check" size={32}></Icon>
      </TouchableOpacity>
    </Pressable>
  );
}
